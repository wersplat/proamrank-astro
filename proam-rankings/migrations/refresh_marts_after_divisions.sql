-- Refresh Materialized Views After lg_divisions Migration
-- Run this after applying the add_lg_divisions_table.sql migration
-- and creating the league_division_standings view

-- Refresh order is important: refresh dependent views last

\echo 'Refreshing Player League Season Stats Mart...'
REFRESH MATERIALIZED VIEW player_league_season_stats_mart;

\echo 'Refreshing Team Analytics Mart...'
REFRESH MATERIALIZED VIEW team_analytics_mart;

\echo 'Refreshing League Season Performance Mart...'
REFRESH MATERIALIZED VIEW league_season_performance_mart;

\echo 'All division-related marts refreshed successfully!'
\echo ''
\echo 'Next steps:'
\echo '1. Verify the league_division_standings view exists'
\echo '2. Regenerate TypeScript types'
\echo '3. Populate division data as needed'

