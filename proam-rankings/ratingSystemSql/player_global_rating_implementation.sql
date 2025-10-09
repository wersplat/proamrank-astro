-- ============================================================================
-- GLOBAL PLAYER RATING SYSTEM IMPLEMENTATION
-- Based on: Global Rating = Base + (Game Impact × Weight) + Event Bonus − Decay
-- Target Scale: 0-100+ (S+ Tier = 95+, S = 90-94, A = 85-89, etc.)
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Event Tier Weight Table
-- Different event tiers have different impact on player rating
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_rating_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_tier event_tier NOT NULL,
  weight_multiplier NUMERIC(4,2) NOT NULL,
  bonus_points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert weight values for each tier
INSERT INTO player_rating_weights (event_tier, weight_multiplier, bonus_points, description)
VALUES 
  ('T1', 1.50, 8, 'Major LANs - Highest impact on rating'),
  ('T2', 1.30, 5, 'Monthly Franchise Events - High impact'),
  ('T3', 1.10, 3, 'Franchise Qualifiers - Moderate impact'),
  ('T4', 0.90, 2, 'Invitationals - Lower impact'),
  ('T5', 0.70, 1, 'Community Events - Minimal impact')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- STEP 2: Create Enhanced Player Game Performance View
-- Includes event tier weighting and normalized scores
-- ============================================================================

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
    
    -- Get event tier from tournament or default to T5
    COALESCE(t.tier, 'T5'::event_tier) as event_tier,
    
    -- Raw stats
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
    
    -- True Shooting %
    CASE
      WHEN (ps.fga::numeric + 0.44 * ps.fta::numeric) > 0 
      THEN ps.points::numeric / (2.0 * (ps.fga::numeric + 0.44 * ps.fta::numeric))
      ELSE 0.0
    END AS ts_pct
    
  FROM player_stats ps
  JOIN matches m ON m.id = ps.match_id
  LEFT JOIN tournaments t ON t.id = m.tournament_id
  WHERE ps.verified = TRUE -- Only count verified stats
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
    
    -- TS Plus (efficiency relative to league)
    LEAST(1.15, GREATEST(0.85,
      CASE
        WHEN lc.avg_ts_pct IS NULL OR lc.avg_ts_pct = 0 THEN 1.0
        ELSE bs.ts_pct / lc.avg_ts_pct
      END
    )) as ts_plus,
    
    -- Raw Performance Score (same as current system)
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
    
    -- Get event tier weights
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
  
  -- Stats
  points,
  assists,
  rebounds,
  steals,
  blocks,
  turnovers,
  
  -- Context
  ts_pct,
  ts_plus,
  league_avg_ts,
  league_avg_points,
  
  -- Performance Metrics
  raw_score,
  weight_multiplier,
  tier_bonus,
  
  -- NORMALIZED GAME IMPACT (0-30 scale, weighted by tier)
  -- This scales raw performance to 0-30 and applies event tier weight
  GREATEST(0, LEAST(30, 
    (raw_score / 3.0) * COALESCE(weight_multiplier, 1.0)
  )) as weighted_game_impact,
  
  -- Days since this game
  EXTRACT(EPOCH FROM (NOW() - game_date)) / 86400 as days_ago

FROM game_performance;


-- ============================================================================
-- STEP 3: Create Player Global Rating Calculation View
-- Implements: Base + (Game Impact × Weight) + Event Bonus − Decay
-- ============================================================================

CREATE OR REPLACE VIEW v_player_global_rating AS
WITH recent_games AS (
  -- Get last 20 games for each player (weighted more towards recent)
  SELECT 
    player_id,
    game_date,
    weighted_game_impact,
    tier_bonus,
    days_ago,
    event_tier,
    ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY game_date DESC) as game_recency_rank
  FROM v_player_global_rating_per_game
),

player_aggregates AS (
  SELECT 
    player_id,
    
    -- Count games played
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE game_recency_rank <= 20) as recent_games,
    
    -- Average game impact (weighted towards recent 20 games)
    AVG(weighted_game_impact) FILTER (WHERE game_recency_rank <= 20) as avg_game_impact,
    
    -- Event bonus (sum of unique tier bonuses, capped at 15)
    LEAST(15, SUM(DISTINCT tier_bonus) FILTER (WHERE game_recency_rank <= 20)) as total_event_bonus,
    
    -- Days since last game (for decay calculation)
    MIN(days_ago) as days_since_last_game,
    
    -- Peak performance (best 5 games average)
    (
      SELECT AVG(weighted_game_impact)
      FROM (
        SELECT weighted_game_impact
        FROM recent_games rg2
        WHERE rg2.player_id = recent_games.player_id
        ORDER BY weighted_game_impact DESC
        LIMIT 5
      ) top_games
    ) as peak_performance
    
  FROM recent_games
  GROUP BY player_id
),

rating_calculation AS (
  SELECT 
    pa.player_id,
    pa.total_games,
    pa.recent_games,
    pa.days_since_last_game,
    
    -- COMPONENT 1: BASE RATING (starts at 70, scales with games played)
    CASE
      WHEN pa.total_games = 0 THEN 50.0  -- No games = below average
      WHEN pa.total_games < 5 THEN 65.0   -- New player = slightly below average
      WHEN pa.total_games < 10 THEN 68.0  -- Getting established
      ELSE 70.0                            -- Established player baseline
    END as base_rating,
    
    -- COMPONENT 2: GAME IMPACT (0-30 points based on performance)
    COALESCE(pa.avg_game_impact, 0) as game_impact,
    
    -- COMPONENT 3: EVENT BONUS (0-15 points for competing in high tier events)
    COALESCE(pa.total_event_bonus, 0) as event_bonus,
    
    -- COMPONENT 4: DECAY (penalty for inactivity)
    CASE
      WHEN pa.days_since_last_game IS NULL THEN 0
      WHEN pa.days_since_last_game <= 30 THEN 0                    -- No decay
      WHEN pa.days_since_last_game <= 60 THEN 2                    -- Small decay
      WHEN pa.days_since_last_game <= 90 THEN 5                    -- Moderate decay
      WHEN pa.days_since_last_game <= 180 THEN 10                  -- Heavy decay
      ELSE 15                                                       -- Severe decay
    END as decay_penalty,
    
    -- COMPONENT 5: CONSISTENCY BONUS (reward consistent performers)
    CASE
      WHEN pa.peak_performance - pa.avg_game_impact < 5 THEN 3     -- Very consistent
      WHEN pa.peak_performance - pa.avg_game_impact < 10 THEN 2    -- Consistent
      WHEN pa.peak_performance - pa.avg_game_impact < 15 THEN 1    -- Somewhat consistent
      ELSE 0                                                        -- Inconsistent
    END as consistency_bonus,
    
    pa.peak_performance
    
  FROM player_aggregates pa
)

SELECT 
  rc.player_id,
  p.gamertag,
  p.position,
  
  -- Components
  ROUND(rc.base_rating::numeric, 1) as base_rating,
  ROUND(rc.game_impact::numeric, 1) as game_impact,
  ROUND(rc.event_bonus::numeric, 1) as event_bonus,
  ROUND(rc.decay_penalty::numeric, 1) as decay_penalty,
  ROUND(rc.consistency_bonus::numeric, 1) as consistency_bonus,
  
  -- FINAL GLOBAL RATING CALCULATION
  -- Formula: Base + Game Impact + Event Bonus + Consistency - Decay
  ROUND(
    GREATEST(0, LEAST(105,  -- Cap at 105, floor at 0
      rc.base_rating + 
      rc.game_impact + 
      rc.event_bonus + 
      rc.consistency_bonus - 
      rc.decay_penalty
    ))::numeric, 
    1
  ) as global_rating,
  
  -- Determine tier based on rating
  CASE
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 95 THEN 'S+'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 90 THEN 'S'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 85 THEN 'A'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 80 THEN 'B'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 75 THEN 'C'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 70 THEN 'D'
    ELSE 'Unranked'
  END as rating_tier,
  
  -- Metadata
  rc.total_games,
  rc.recent_games,
  ROUND(rc.days_since_last_game::numeric, 0) as days_since_last_game,
  ROUND(rc.peak_performance::numeric, 1) as peak_performance

FROM rating_calculation rc
JOIN players p ON p.id = rc.player_id;


-- ============================================================================
-- STEP 4: Create Function to Update Player Global Ratings
-- This should be run after stats are verified or periodically
-- ============================================================================

CREATE OR REPLACE FUNCTION update_player_global_ratings()
RETURNS TABLE(
  player_id UUID,
  gamertag TEXT,
  old_rating NUMERIC,
  new_rating NUMERIC,
  rating_change NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH old_ratings AS (
    -- Capture old ratings before update
    SELECT 
      p.id,
      p.gamertag,
      p.performance_score::numeric as old_performance_score,
      pgr.global_rating
    FROM players p
    JOIN v_player_global_rating pgr ON p.id = pgr.player_id
  ),
  updates AS (
    UPDATE players p
    SET 
      performance_score = pgr.global_rating,
      player_rank_score = COALESCE(pgr.global_rating, 0) + COALESCE(p.player_rp, 0),
      -- Update salary tier based on new rating
      salary_tier = CASE
        WHEN pgr.global_rating >= 90 THEN 'S'::salary_tier
        WHEN pgr.global_rating >= 85 THEN 'A'::salary_tier
        WHEN pgr.global_rating >= 80 THEN 'B'::salary_tier
        WHEN pgr.global_rating >= 75 THEN 'C'::salary_tier
        ELSE 'D'::salary_tier
      END
    FROM v_player_global_rating pgr
    WHERE p.id = pgr.player_id
    RETURNING p.id
  )
  SELECT 
    o.id,
    o.gamertag,
    o.old_performance_score,
    o.global_rating,
    (o.global_rating - COALESCE(o.old_performance_score, 0)) as change
  FROM old_ratings o
  WHERE o.id IN (SELECT id FROM updates);
END;
$$;


-- ============================================================================
-- STEP 5: Create Trigger to Auto-Update Ratings When Stats Are Verified
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_player_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- When player stats are verified, recalculate affected player's rating
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.verified = TRUE THEN
    -- Update the specific player's rating
    UPDATE players p
    SET 
      performance_score = pgr.global_rating,
      player_rank_score = COALESCE(pgr.global_rating, 0) + COALESCE(p.player_rp, 0),
      salary_tier = CASE
        WHEN pgr.global_rating >= 90 THEN 'S'::salary_tier
        WHEN pgr.global_rating >= 85 THEN 'A'::salary_tier
        WHEN pgr.global_rating >= 80 THEN 'B'::salary_tier
        WHEN pgr.global_rating >= 75 THEN 'C'::salary_tier
        ELSE 'D'::salary_tier
      END
    FROM v_player_global_rating pgr
    WHERE p.id = pgr.player_id 
    AND p.id = NEW.player_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_auto_update_player_rating ON player_stats;

-- Create trigger on player_stats
CREATE TRIGGER trigger_auto_update_player_rating
  AFTER INSERT OR UPDATE OF verified
  ON player_stats
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_player_ratings();


-- ============================================================================
-- STEP 6: Initial Population - Run this once to populate all player ratings
-- ============================================================================

-- This will update all player ratings based on the new system
-- Run this after creating all views and functions
-- SELECT * FROM update_player_global_ratings();


-- ============================================================================
-- STEP 7: Useful Queries for Testing and Monitoring
-- ============================================================================

-- View all players with their new global ratings
COMMENT ON VIEW v_player_global_rating IS 
'Calculates Global Player Rating using formula: Base + (Game Impact × Weight) + Event Bonus + Consistency - Decay. Scale: 0-105.';

-- Query to see rating breakdown for a specific player
-- SELECT * FROM v_player_global_rating WHERE gamertag = 'PLAYER_NAME';

-- Query to see top rated players
-- SELECT * FROM v_player_global_rating ORDER BY global_rating DESC LIMIT 50;

-- Query to see rating distribution
-- SELECT rating_tier, COUNT(*), AVG(global_rating)
-- FROM v_player_global_rating
-- GROUP BY rating_tier
-- ORDER BY rating_tier;

-- Query to see who gained/lost the most rating
-- SELECT * FROM update_player_global_ratings() 
-- ORDER BY rating_change DESC;

