-- ============================================================================
-- ADJUST SCALING TO GET ELITE PLAYERS INTO 90+ RANGE
-- Choose ONE of these options based on your preference
-- ============================================================================

-- OPTION 1: Increase game impact scaling (MORE AGGRESSIVE - RECOMMENDED)
-- This gives more weight to performance, elite players will reach 95+
CREATE OR REPLACE VIEW v_player_global_rating_per_game AS
WITH base_stats AS (
  SELECT 
    ps.player_id,
    ps.match_id,
    ps.id as stat_id,
    m.played_at::date AS game_date,
    m.league_id,
    m.season_id,
    m.tournament_id,
    m.game_year,
    COALESCE(t.tier, 'T5'::event_tier) as event_tier,
    ps.points,
    ps.assists,
    ps.rebounds,
    ps.steals,
    ps.blocks,
    ps.turnovers,
    ps.fgm,
    ps.fga,
    ps.ftm,
    ps.fta,
    CASE
      WHEN (ps.fga::numeric + 0.44 * ps.fta::numeric) > 0 
      THEN ps.points::numeric / (2.0 * (ps.fga::numeric + 0.44 * ps.fta::numeric))
      ELSE 0.0
    END AS ts_pct
  FROM player_stats ps
  JOIN matches m ON m.id = ps.match_id
  LEFT JOIN tournaments t ON t.id = m.tournament_id
  WHERE ps.verified = TRUE
),
league_context AS (
  SELECT 
    date_trunc('month', game_date) as month,
    league_id,
    season_id,
    tournament_id,
    event_tier,
    AVG(ts_pct) FILTER (WHERE ts_pct > 0) as avg_ts_pct,
    AVG(points) as avg_points,
    AVG(assists) as avg_assists,
    AVG(rebounds) as avg_rebounds
  FROM base_stats
  GROUP BY date_trunc('month', game_date), league_id, season_id, tournament_id, event_tier
),
game_performance AS (
  SELECT 
    bs.*,
    lc.avg_ts_pct as league_avg_ts,
    lc.avg_points as league_avg_points,
    LEAST(1.15, GREATEST(0.85,
      CASE
        WHEN lc.avg_ts_pct IS NULL OR lc.avg_ts_pct = 0 THEN 1.0
        ELSE bs.ts_pct / lc.avg_ts_pct
      END
    )) as ts_plus,
    (
      bs.points::numeric * LEAST(1.15, GREATEST(0.85,
        CASE
          WHEN lc.avg_ts_pct IS NULL OR lc.avg_ts_pct = 0 THEN 1.0
          ELSE bs.ts_pct / lc.avg_ts_pct
        END
      )) +
      bs.assists::numeric * 1.5 +
      bs.rebounds::numeric * 1.25 +
      bs.steals::numeric * 2.5 +
      bs.blocks::numeric * 2.0 -
      (bs.fga - bs.fgm)::numeric * 1.0 -
      (bs.fta - bs.ftm)::numeric * 0.7 -
      bs.turnovers::numeric * 2.0
    ) as raw_score,
    prw.weight_multiplier,
    prw.bonus_points as tier_bonus
  FROM base_stats bs
  LEFT JOIN league_context lc ON 
    date_trunc('month', bs.game_date) = lc.month
    AND NOT bs.league_id IS DISTINCT FROM lc.league_id
    AND NOT bs.season_id IS DISTINCT FROM lc.season_id
    AND NOT bs.tournament_id IS DISTINCT FROM lc.tournament_id
    AND bs.event_tier = lc.event_tier
  LEFT JOIN player_rating_weights prw ON prw.event_tier = bs.event_tier
)
SELECT 
  player_id,
  match_id,
  stat_id,
  game_date,
  league_id,
  season_id,
  tournament_id,
  event_tier,
  game_year,
  points,
  assists,
  rebounds,
  steals,
  blocks,
  turnovers,
  ts_pct,
  ts_plus,
  league_avg_ts,
  league_avg_points,
  raw_score,
  weight_multiplier,
  tier_bonus,
  -- CHANGED: Divide by 2.5 instead of 3.0, and cap at 35 instead of 30
  -- This allows elite performers to reach higher game impact scores
  GREATEST(0, LEAST(35, 
    (raw_score / 2.5) * COALESCE(weight_multiplier, 1.0)
  )) as weighted_game_impact,
  EXTRACT(EPOCH FROM (NOW() - game_date)) / 86400 as days_ago
FROM game_performance;


-- After running this, update all ratings
SELECT * FROM update_player_global_ratings();

-- Check results
SELECT 
  gamertag,
  rating_tier,
  global_rating,
  game_impact,
  total_games
FROM v_player_global_rating
ORDER BY global_rating DESC
LIMIT 20;

