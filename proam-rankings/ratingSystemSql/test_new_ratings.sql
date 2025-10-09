-- ============================================================================
-- TEST NEW PLAYER RATING SYSTEM
-- Run this to preview what ratings will look like BEFORE applying changes
-- ============================================================================

-- Compare old vs new ratings for top players
WITH new_ratings AS (
  SELECT 
    player_id,
    gamertag,
    rating_tier as new_tier,
    global_rating as new_rating,
    base_rating,
    game_impact,
    event_bonus,
    consistency_bonus,
    decay_penalty,
    total_games
  FROM v_player_global_rating
),
old_ratings AS (
  SELECT 
    id as player_id,
    gamertag,
    salary_tier as old_tier,
    performance_score as old_rating,
    player_rp
  FROM players
)
SELECT 
  COALESCE(n.gamertag, o.gamertag) as gamertag,
  
  -- Old System
  o.old_tier as current_tier,
  ROUND(COALESCE(o.old_rating, 0)::numeric, 1) as current_rating,
  o.player_rp as current_rp,
  
  -- New System
  n.new_tier as new_tier,
  n.new_rating,
  
  -- Breakdown
  n.base_rating,
  n.game_impact,
  n.event_bonus,
  n.consistency_bonus,
  n.decay_penalty,
  
  -- Change Analysis
  ROUND((n.new_rating - COALESCE(o.old_rating, 0))::numeric, 1) as rating_change,
  CASE 
    WHEN n.new_rating > COALESCE(o.old_rating, 0) THEN '📈'
    WHEN n.new_rating < COALESCE(o.old_rating, 0) THEN '📉'
    ELSE '➡️'
  END as trend,
  
  n.total_games
  
FROM new_ratings n
FULL OUTER JOIN old_ratings o ON o.player_id = n.player_id
WHERE COALESCE(n.total_games, 0) > 0  -- Only players with games
ORDER BY n.new_rating DESC NULLS LAST
LIMIT 100;


-- ============================================================================
-- Rating Distribution Comparison
-- ============================================================================

-- New system distribution
SELECT 
  'NEW SYSTEM' as system,
  rating_tier,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating), 1) as avg_rating,
  ROUND(MIN(global_rating), 1) as min_rating,
  ROUND(MAX(global_rating), 1) as max_rating
FROM v_player_global_rating
WHERE total_games > 0
GROUP BY rating_tier

UNION ALL

-- Current system distribution (rough approximation)
SELECT 
  'CURRENT SYSTEM' as system,
  CASE
    WHEN performance_score >= 95 THEN 'S+'
    WHEN performance_score >= 90 THEN 'S'
    WHEN performance_score >= 85 THEN 'A'
    WHEN performance_score >= 80 THEN 'B'
    WHEN performance_score >= 75 THEN 'C'
    WHEN performance_score >= 70 THEN 'D'
    ELSE 'Unranked'
  END as tier,
  COUNT(*) as player_count,
  ROUND(AVG(performance_score), 1) as avg_rating,
  ROUND(MIN(performance_score), 1) as min_rating,
  ROUND(MAX(performance_score), 1) as max_rating
FROM players
WHERE performance_score IS NOT NULL
GROUP BY tier

ORDER BY system DESC, rating_tier;


-- ============================================================================
-- Event Tier Impact Analysis
-- ============================================================================

SELECT 
  event_tier,
  COUNT(*) as games_played,
  COUNT(DISTINCT player_id) as unique_players,
  ROUND(AVG(raw_score)::numeric, 1) as avg_raw_score,
  ROUND(AVG(weighted_game_impact)::numeric, 1) as avg_weighted_impact,
  MAX(tier_bonus) as tier_bonus_pts
FROM v_player_global_rating_per_game
GROUP BY event_tier
ORDER BY event_tier;


-- ============================================================================
-- Players Most Impacted (Biggest Gainers & Losers)
-- ============================================================================

WITH changes AS (
  SELECT 
    p.gamertag,
    p.position,
    COALESCE(p.performance_score, 0) as old_rating,
    n.global_rating as new_rating,
    (n.global_rating - COALESCE(p.performance_score, 0)) as change,
    n.total_games,
    n.rating_tier
  FROM players p
  JOIN v_player_global_rating n ON n.player_id = p.id
  WHERE n.total_games > 5  -- Only established players
)
SELECT 
  '🚀 TOP 10 GAINERS' as category,
  gamertag,
  position,
  rating_tier,
  old_rating,
  new_rating,
  change,
  total_games
FROM changes
WHERE change > 0
ORDER BY change DESC
LIMIT 10

UNION ALL

SELECT 
  '⚠️ TOP 10 LOSERS' as category,
  gamertag,
  position,
  rating_tier,
  old_rating,
  new_rating,
  change,
  total_games
FROM changes
WHERE change < 0
ORDER BY change ASC
LIMIT 10;


-- ============================================================================
-- Decay Impact Preview
-- ============================================================================

SELECT 
  'ACTIVE (<30 days)' as activity_status,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating)::numeric, 1) as avg_rating
FROM v_player_global_rating
WHERE days_since_last_game <= 30

UNION ALL

SELECT 
  'RECENT (31-60 days)' as activity_status,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating)::numeric, 1) as avg_rating
FROM v_player_global_rating
WHERE days_since_last_game > 30 AND days_since_last_game <= 60

UNION ALL

SELECT 
  'INACTIVE (61-90 days)' as activity_status,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating)::numeric, 1) as avg_rating
FROM v_player_global_rating
WHERE days_since_last_game > 60 AND days_since_last_game <= 90

UNION ALL

SELECT 
  'VERY INACTIVE (90+ days)' as activity_status,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating)::numeric, 1) as avg_rating
FROM v_player_global_rating
WHERE days_since_last_game > 90;


-- ============================================================================
-- Sample Player Rating Breakdown
-- Shows detailed calculation for top 5 players
-- ============================================================================

SELECT 
  gamertag,
  rating_tier,
  global_rating,
  
  -- Formula breakdown
  CONCAT(
    base_rating, ' (base) + ',
    game_impact, ' (impact) + ',
    event_bonus, ' (event) + ',
    consistency_bonus, ' (consistency) - ',
    decay_penalty, ' (decay) = ',
    global_rating
  ) as formula_breakdown,
  
  total_games,
  ROUND(days_since_last_game, 0) as days_inactive
  
FROM v_player_global_rating
ORDER BY global_rating DESC
LIMIT 5;


-- ============================================================================
-- Verify Data Quality
-- ============================================================================

-- Check for any anomalies
SELECT 
  'Players with ratings > 100' as check_name,
  COUNT(*) as count
FROM v_player_global_rating
WHERE global_rating > 100

UNION ALL

SELECT 
  'Players with negative ratings' as check_name,
  COUNT(*) as count
FROM v_player_global_rating
WHERE global_rating < 0

UNION ALL

SELECT 
  'Players with NULL ratings' as check_name,
  COUNT(*) as count
FROM v_player_global_rating
WHERE global_rating IS NULL

UNION ALL

SELECT 
  'Total players rated' as check_name,
  COUNT(*) as count
FROM v_player_global_rating
WHERE total_games > 0;

