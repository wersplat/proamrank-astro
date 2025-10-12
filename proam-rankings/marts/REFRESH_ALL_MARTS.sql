-- ============================================================================
-- REFRESH ALL MATERIALIZED VIEWS
-- ============================================================================
-- This script refreshes all materialized views (data marts) in dependency order
-- Run this after significant data changes or on a scheduled basis
-- Estimated execution time: 2-5 minutes depending on data volume
-- ============================================================================

-- Step 1: Refresh base event strength metrics (no dependencies)
REFRESH MATERIALIZED VIEW CONCURRENTLY event_strength_metrics_mv;

-- Step 2: Refresh core analytical marts (depend on base tables only)
REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats_tracking_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY match_analytics_mart;

-- Step 3: Refresh context-specific marts (depend on leagues/tournaments)
REFRESH MATERIALIZED VIEW CONCURRENTLY league_season_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY tournament_performance_mart;

-- Step 4: Refresh specialized analysis marts
REFRESH MATERIALIZED VIEW CONCURRENTLY head_to_head_matchup_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_hot_streak_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_momentum_indicators_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY achievement_eligibility_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY roster_value_comparison_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_league_season_stats_mart;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the refresh completed successfully

-- Check row counts
SELECT 
    'event_strength_metrics_mv' AS view_name,
    COUNT(*) AS row_count
FROM event_strength_metrics_mv
UNION ALL
SELECT 'player_performance_mart', COUNT(*) FROM player_performance_mart
UNION ALL
SELECT 'player_stats_tracking_mart', COUNT(*) FROM player_stats_tracking_mart
UNION ALL
SELECT 'team_analytics_mart', COUNT(*) FROM team_analytics_mart
UNION ALL
SELECT 'match_analytics_mart', COUNT(*) FROM match_analytics_mart
UNION ALL
SELECT 'league_season_performance_mart', COUNT(*) FROM league_season_performance_mart
UNION ALL
SELECT 'tournament_performance_mart', COUNT(*) FROM tournament_performance_mart
UNION ALL
SELECT 'head_to_head_matchup_mart', COUNT(*) FROM head_to_head_matchup_mart
UNION ALL
SELECT 'player_hot_streak_mart', COUNT(*) FROM player_hot_streak_mart
UNION ALL
SELECT 'team_momentum_indicators_mart', COUNT(*) FROM team_momentum_indicators_mart
UNION ALL
SELECT 'achievement_eligibility_mart', COUNT(*) FROM achievement_eligibility_mart
UNION ALL
SELECT 'roster_value_comparison_mart', COUNT(*) FROM roster_value_comparison_mart
UNION ALL
SELECT 'player_league_season_stats_mart', COUNT(*) FROM player_league_season_stats_mart
ORDER BY view_name;

-- ============================================================================
-- MAINTENANCE NOTES
-- ============================================================================
-- 
-- CONCURRENTLY Option:
-- - Uses "REFRESH MATERIALIZED VIEW CONCURRENTLY" to avoid locking reads
-- - Requires a UNIQUE INDEX on each materialized view
-- - If you get an error about missing unique index, run the indexing script first
--
-- Without CONCURRENTLY:
-- - Replace all "REFRESH MATERIALIZED VIEW CONCURRENTLY" with "REFRESH MATERIALIZED VIEW"
-- - Faster but will lock the view during refresh
-- - Acceptable for scheduled maintenance windows
--
-- Recommended Schedule:
-- - Real-time updates: After each match verification (use targeted refresh)
-- - Batch updates: Every 6-12 hours during active seasons
-- - Off-season: Daily or weekly
--
-- Individual Refresh Examples:
-- REFRESH MATERIALIZED VIEW player_performance_mart;
-- REFRESH MATERIALIZED VIEW team_momentum_indicators_mart;
-- ============================================================================

