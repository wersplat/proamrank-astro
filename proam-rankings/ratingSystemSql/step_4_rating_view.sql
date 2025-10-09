-- STEP 4: Create global rating calculation view
-- This aggregates game performance into final rating

CREATE OR REPLACE VIEW v_player_global_rating AS
WITH recent_games AS (
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
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE game_recency_rank <= 20) as recent_games,
    AVG(weighted_game_impact) FILTER (WHERE game_recency_rank <= 20) as avg_game_impact,
    LEAST(15, SUM(DISTINCT tier_bonus) FILTER (WHERE game_recency_rank <= 20)) as total_event_bonus,
    MIN(days_ago) as days_since_last_game,
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
    CASE
      WHEN pa.total_games = 0 THEN 50.0
      WHEN pa.total_games < 5 THEN 65.0
      WHEN pa.total_games < 10 THEN 68.0
      ELSE 70.0
    END as base_rating,
    COALESCE(pa.avg_game_impact, 0) as game_impact,
    COALESCE(pa.total_event_bonus, 0) as event_bonus,
    CASE
      WHEN pa.days_since_last_game IS NULL THEN 0
      WHEN pa.days_since_last_game <= 30 THEN 0
      WHEN pa.days_since_last_game <= 60 THEN 2
      WHEN pa.days_since_last_game <= 90 THEN 5
      WHEN pa.days_since_last_game <= 180 THEN 10
      ELSE 15
    END as decay_penalty,
    CASE
      WHEN pa.peak_performance - pa.avg_game_impact < 5 THEN 3
      WHEN pa.peak_performance - pa.avg_game_impact < 10 THEN 2
      WHEN pa.peak_performance - pa.avg_game_impact < 15 THEN 1
      ELSE 0
    END as consistency_bonus,
    pa.peak_performance
  FROM player_aggregates pa
)
SELECT 
  rc.player_id,
  p.gamertag,
  p.position,
  ROUND(rc.base_rating::numeric, 1) as base_rating,
  ROUND(rc.game_impact::numeric, 1) as game_impact,
  ROUND(rc.event_bonus::numeric, 1) as event_bonus,
  ROUND(rc.decay_penalty::numeric, 1) as decay_penalty,
  ROUND(rc.consistency_bonus::numeric, 1) as consistency_bonus,
  ROUND(
    GREATEST(0, LEAST(105,
      rc.base_rating + 
      rc.game_impact + 
      rc.event_bonus + 
      rc.consistency_bonus - 
      rc.decay_penalty
    ))::numeric, 
    1
  ) as global_rating,
  CASE
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 95 THEN 'S+'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 90 THEN 'S'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 85 THEN 'A'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 80 THEN 'B'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 75 THEN 'C'
    WHEN (rc.base_rating + rc.game_impact + rc.event_bonus + rc.consistency_bonus - rc.decay_penalty) >= 70 THEN 'D'
    ELSE 'Unranked'
  END as rating_tier,
  rc.total_games,
  rc.recent_games,
  ROUND(rc.days_since_last_game::numeric, 0) as days_since_last_game,
  ROUND(rc.peak_performance::numeric, 1) as peak_performance
FROM rating_calculation rc
JOIN players p ON p.id = rc.player_id;

-- Test query
SELECT 
  rating_tier,
  COUNT(*) as players,
  ROUND(AVG(global_rating), 1) as avg_rating
FROM v_player_global_rating
WHERE total_games > 0
GROUP BY rating_tier
ORDER BY rating_tier;

