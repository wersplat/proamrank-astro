-- Diagnostic queries to identify the badge counter issue
-- Run these queries to identify the root cause

-- 1. Check for duplicate player_stats records (same player + match combination)
SELECT 
    player_id,
    match_id,
    COUNT(*) as duplicate_count
FROM player_stats
WHERE verified = TRUE
GROUP BY player_id, match_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 2. For a specific player, compare actual verified games vs mart counts
-- Replace 'YOUR_PLAYER_ID' with the actual player ID showing 102 40+ games
WITH actual_counts AS (
    SELECT
        ps.player_id,
        COUNT(DISTINCT ps.match_id) as actual_verified_games,
        COUNT(ps.match_id) as total_rows,  -- This will show if there are duplicates
        COUNT(CASE WHEN ps.points >= 40 THEN 1 END) as actual_40plus_count,
        COUNT(CASE WHEN ps.points >= 40 AND ps.points < 50 THEN 1 END) as actual_40_49_count,
        COUNT(CASE WHEN ps.points >= 50 THEN 1 END) as actual_50plus_count
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    AND ps.player_id = 'YOUR_PLAYER_ID'  -- Replace with actual player ID
    GROUP BY ps.player_id
),
mart_counts AS (
    SELECT
        player_id,
        career_games,
        count_40pt_games,
        count_50pt_games
    FROM player_stats_tracking_mart
    WHERE player_id = 'YOUR_PLAYER_ID'  -- Replace with actual player ID
)
SELECT 
    'Actual Counts' as source,
    actual_verified_games as games,
    actual_40plus_count as total_40plus,
    actual_40_49_count as games_40_to_49,
    actual_50plus_count as games_50plus,
    total_rows as raw_rows
FROM actual_counts
UNION ALL
SELECT
    'Mart Counts' as source,
    career_games as games,
    (count_40pt_games + count_50pt_games) as total_40plus,
    count_40pt_games as games_40_to_49,
    count_50pt_games as games_50plus,
    NULL as raw_rows
FROM mart_counts;

-- 3. Check if there's a unique constraint on player_stats
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'player_stats'::regclass
AND contype IN ('u', 'p');  -- unique or primary key constraints

-- 4. Find all duplicate player_stats rows for analysis
SELECT 
    ps.*
FROM player_stats ps
WHERE (player_id, match_id) IN (
    SELECT player_id, match_id
    FROM player_stats
    WHERE verified = TRUE
    GROUP BY player_id, match_id
    HAVING COUNT(*) > 1
)
ORDER BY player_id, match_id, created_at;

