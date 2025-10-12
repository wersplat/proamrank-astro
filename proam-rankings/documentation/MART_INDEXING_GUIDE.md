# Materialized View Indexing Guide

## Overview

This guide provides index creation statements for all materialized views (data marts) to optimize query performance and enable concurrent refreshes.

## Why Indexes on Materialized Views?

1. **Query Performance**: Fast lookups on commonly filtered columns
2. **Concurrent Refresh**: UNIQUE indexes enable non-blocking `REFRESH MATERIALIZED VIEW CONCURRENTLY`
3. **Join Optimization**: Speed up joins when marts are used in other queries

---

## Index Creation Scripts

### Event Strength Metrics MV

```sql
-- Note: event_strength_metrics_mv already exists with its own indexes
-- Verify existing indexes with: \d event_strength_metrics_mv
-- Only create if missing:
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_event_strength_event_key ON event_strength_metrics_mv(event_key);
-- CREATE INDEX IF NOT EXISTS idx_event_strength_type_year ON event_strength_metrics_mv(event_type, game_year);
-- CREATE INDEX IF NOT EXISTS idx_event_strength_tier ON event_strength_metrics_mv(tier_label);
```

### Player Performance Mart

```sql
-- Primary lookup by player
CREATE UNIQUE INDEX idx_player_perf_player_id 
ON player_performance_mart(player_id);

-- Filter by team
CREATE INDEX idx_player_perf_team 
ON player_performance_mart(current_team_id) 
WHERE current_team_id IS NOT NULL;

-- Filter by position and rating
CREATE INDEX idx_player_perf_position_rating 
ON player_performance_mart(position, global_rating DESC);

-- Top performers query optimization
CREATE INDEX idx_player_perf_avg_points 
ON player_performance_mart(avg_points DESC) 
WHERE games_played >= 10;
```

### Player Statistics Tracking Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_player_stats_tracking_player_id 
ON player_stats_tracking_mart(player_id);

-- Career milestones
CREATE INDEX idx_player_stats_career_points 
ON player_stats_tracking_mart(career_points DESC);

-- Active players
CREATE INDEX idx_player_stats_recent_activity 
ON player_stats_tracking_mart(last_game_date DESC NULLS LAST);
```

### Team Analytics Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_team_analytics_team_id 
ON team_analytics_mart(team_id);

-- Leaderboard queries
CREATE INDEX idx_team_analytics_win_pct 
ON team_analytics_mart(win_percentage DESC) 
WHERE games_played >= 5;

-- RP tier filtering
CREATE INDEX idx_team_analytics_rp_tier 
ON team_analytics_mart(rp_tier, current_rp DESC);
```

### Match Analytics Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_match_analytics_match_id 
ON match_analytics_mart(match_id);

-- Date-based queries
CREATE INDEX idx_match_analytics_played_at 
ON match_analytics_mart(played_at DESC);

-- Team matchup queries
CREATE INDEX idx_match_analytics_teams 
ON match_analytics_mart(team_a_id, team_b_id);

-- Tournament/League filtering
CREATE INDEX idx_match_analytics_tournament 
ON match_analytics_mart(tournament_name) 
WHERE tournament_name IS NOT NULL;

CREATE INDEX idx_match_analytics_league 
ON match_analytics_mart(league_name) 
WHERE league_name IS NOT NULL;

-- Game type analysis
CREATE INDEX idx_match_analytics_game_type 
ON match_analytics_mart(game_type);
```

### League Season Performance Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_league_season_perf_season_id 
ON league_season_performance_mart(season_id);

-- Filter by league
CREATE INDEX idx_league_season_perf_league 
ON league_season_performance_mart(league_name, season_number DESC);

-- Active seasons
CREATE INDEX idx_league_season_perf_active 
ON league_season_performance_mart(is_active, start_date DESC) 
WHERE is_active = TRUE;
```

### Tournament Performance Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_tournament_perf_tournament_id 
ON tournament_performance_mart(tournament_id);

-- Filter by organizer and tier
CREATE INDEX idx_tournament_perf_org_tier 
ON tournament_performance_mart(organizer, tournament_tier);

-- Date-based queries
CREATE INDEX idx_tournament_perf_dates 
ON tournament_performance_mart(start_date DESC, end_date DESC);

-- Status filtering
CREATE INDEX idx_tournament_perf_status 
ON tournament_performance_mart(status);
```

### Head-to-Head Matchup Mart

```sql
-- Primary lookup (composite key)
CREATE UNIQUE INDEX idx_h2h_teams 
ON head_to_head_matchup_mart(team_1_id, team_2_id);

-- Reverse lookup
CREATE INDEX idx_h2h_teams_reverse 
ON head_to_head_matchup_mart(team_2_id, team_1_id);

-- Recent matchups
CREATE INDEX idx_h2h_last_meeting 
ON head_to_head_matchup_mart(last_meeting DESC);

-- Rivalry detection (high meeting count)
CREATE INDEX idx_h2h_total_meetings 
ON head_to_head_matchup_mart(total_meetings DESC) 
WHERE total_meetings >= 5;
```

### Player Hot Streak Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_player_streak_player_id 
ON player_hot_streak_mart(player_id);

-- Hot player detection
CREATE INDEX idx_player_streak_form_trend 
ON player_hot_streak_mart(form_trend) 
WHERE form_trend IN ('Heating Up', 'Hot');

-- Position-based comparisons
CREATE INDEX idx_player_streak_position_perf 
ON player_hot_streak_mart(position, last_10_avg_performance DESC);
```

### Team Momentum Indicators Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_team_momentum_team_id 
ON team_momentum_indicators_mart(team_id);

-- Hot teams
CREATE INDEX idx_team_momentum_status 
ON team_momentum_indicators_mart(momentum_status, last_10_win_pct DESC) 
WHERE momentum_status IN ('Hot', 'Heating Up');

-- Win streak tracking
CREATE INDEX idx_team_momentum_win_streak 
ON team_momentum_indicators_mart(current_win_streak DESC) 
WHERE current_win_streak >= 3;
```

### Achievement Eligibility Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_achievement_elig_player_id 
ON achievement_eligibility_mart(player_id);

-- Near-milestone alerts
CREATE INDEX idx_achievement_elig_alerts 
ON achievement_eligibility_mart(next_achievement_alert) 
WHERE next_achievement_alert IS NOT NULL;

-- Active streaks
CREATE INDEX idx_achievement_elig_streaks 
ON achievement_eligibility_mart(active_streak_type, active_streak_length DESC) 
WHERE active_streak_type IS NOT NULL;

-- Season award tracking
CREATE INDEX idx_achievement_elig_season_awards 
ON achievement_eligibility_mart(season_award_eligible) 
WHERE season_award_eligible IS NOT NULL;
```

### Roster Value Comparison Mart

```sql
-- Primary lookup
CREATE UNIQUE INDEX idx_roster_value_team_id 
ON roster_value_comparison_mart(team_id);

-- Roster value rankings
CREATE INDEX idx_roster_value_total 
ON roster_value_comparison_mart(total_roster_value DESC);

-- Roster strength assessment
CREATE INDEX idx_roster_value_tier 
ON roster_value_comparison_mart(roster_tier_assessment, avg_roster_rating DESC);

-- Depth analysis
CREATE INDEX idx_roster_value_depth 
ON roster_value_comparison_mart(roster_depth_status, roster_size);
```

### Player League Season Stats Mart

```sql
-- Primary lookup (composite key for player per season)
CREATE UNIQUE INDEX idx_player_season_stats_composite 
ON player_league_season_stats_mart(player_id, season_id);

-- Season leaderboards
CREATE INDEX idx_player_season_stats_ppg 
ON player_league_season_stats_mart(season_id, ppg DESC) 
WHERE games_played >= 5;

CREATE INDEX idx_player_season_stats_apg 
ON player_league_season_stats_mart(season_id, apg DESC) 
WHERE games_played >= 5;

-- Award tracking
CREATE INDEX idx_player_season_stats_awards 
ON player_league_season_stats_mart(potential_season_award) 
WHERE potential_season_award IS NOT NULL;
```

---

## Creating All Indexes at Once

Run this complete script to create all indexes:

```sql
-- Event Strength Metrics (Skip - already exists with indexes)

-- Player Performance
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_player_perf_player_id ON player_performance_mart(player_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_perf_team ON player_performance_mart(current_team_id) WHERE current_team_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_perf_position_rating ON player_performance_mart(position, global_rating DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_perf_avg_points ON player_performance_mart(avg_points DESC) WHERE games_played >= 10;

-- Player Stats Tracking
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_player_stats_tracking_player_id ON player_stats_tracking_mart(player_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_stats_career_points ON player_stats_tracking_mart(career_points DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_stats_recent_activity ON player_stats_tracking_mart(last_game_date DESC NULLS LAST);

-- Team Analytics
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_team_analytics_team_id ON team_analytics_mart(team_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_analytics_win_pct ON team_analytics_mart(win_percentage DESC) WHERE games_played >= 5;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_analytics_rp_tier ON team_analytics_mart(rp_tier, current_rp DESC);

-- Match Analytics
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_match_analytics_match_id ON match_analytics_mart(match_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_match_analytics_played_at ON match_analytics_mart(played_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_match_analytics_teams ON match_analytics_mart(team_a_id, team_b_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_match_analytics_game_type ON match_analytics_mart(game_type);

-- League Season Performance
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_league_season_perf_season_id ON league_season_performance_mart(season_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_league_season_perf_league ON league_season_performance_mart(league_name, season_number DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_league_season_perf_active ON league_season_performance_mart(is_active, start_date DESC) WHERE is_active = TRUE;

-- Tournament Performance
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_tournament_perf_tournament_id ON tournament_performance_mart(tournament_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tournament_perf_org_tier ON tournament_performance_mart(organizer, tournament_tier);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tournament_perf_dates ON tournament_performance_mart(start_date DESC, end_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tournament_perf_status ON tournament_performance_mart(status);

-- Head-to-Head Matchup
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_h2h_teams ON head_to_head_matchup_mart(team_1_id, team_2_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_h2h_teams_reverse ON head_to_head_matchup_mart(team_2_id, team_1_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_h2h_last_meeting ON head_to_head_matchup_mart(last_meeting DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_h2h_total_meetings ON head_to_head_matchup_mart(total_meetings DESC) WHERE total_meetings >= 5;

-- Player Hot Streak
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_player_streak_player_id ON player_hot_streak_mart(player_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_streak_form_trend ON player_hot_streak_mart(form_trend) WHERE form_trend IN ('Heating Up', 'Hot');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_streak_position_perf ON player_hot_streak_mart(position, last_10_avg_performance DESC);

-- Team Momentum Indicators
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_team_momentum_team_id ON team_momentum_indicators_mart(team_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_momentum_status ON team_momentum_indicators_mart(momentum_status, last_10_win_pct DESC) WHERE momentum_status IN ('Hot', 'Heating Up');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_momentum_win_streak ON team_momentum_indicators_mart(current_win_streak DESC) WHERE current_win_streak >= 3;

-- Achievement Eligibility
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_achievement_elig_player_id ON achievement_eligibility_mart(player_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievement_elig_alerts ON achievement_eligibility_mart(next_achievement_alert) WHERE next_achievement_alert IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievement_elig_streaks ON achievement_eligibility_mart(active_streak_type, active_streak_length DESC) WHERE active_streak_type IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievement_elig_season_awards ON achievement_eligibility_mart(season_award_eligible) WHERE season_award_eligible IS NOT NULL;

-- Roster Value Comparison
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_roster_value_team_id ON roster_value_comparison_mart(team_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_roster_value_total ON roster_value_comparison_mart(total_roster_value DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_roster_value_tier ON roster_value_comparison_mart(roster_tier_assessment, avg_roster_rating DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_roster_value_depth ON roster_value_comparison_mart(roster_depth_status, roster_size);

-- Player League Season Stats
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_player_season_stats_composite ON player_league_season_stats_mart(player_id, season_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_season_stats_ppg ON player_league_season_stats_mart(season_id, ppg DESC) WHERE games_played >= 5;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_season_stats_apg ON player_league_season_stats_mart(season_id, apg DESC) WHERE games_played >= 5;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_season_stats_awards ON player_league_season_stats_mart(potential_season_award) WHERE potential_season_award IS NOT NULL;
```

---

## Usage Examples

### Query Optimization Examples

#### 1. Get Top Scorers (uses `idx_player_perf_avg_points`)
```sql
SELECT gamertag, team_name, avg_points, games_played
FROM player_performance_mart
WHERE games_played >= 10
ORDER BY avg_points DESC
LIMIT 20;
```

#### 2. Team Head-to-Head Record (uses `idx_h2h_teams`)
```sql
SELECT team_1_name, team_2_name, team_1_wins, team_2_wins, total_meetings
FROM head_to_head_matchup_mart
WHERE team_1_id = 'some-uuid-here' 
AND team_2_id = 'another-uuid-here';
```

#### 3. Hot Players by Position (uses `idx_player_streak_position_perf`)
```sql
SELECT gamertag, position, form_trend, last_10_avg_points
FROM player_hot_streak_mart
WHERE position = 'Point Guard'
AND form_trend IN ('Heating Up', 'Hot')
ORDER BY last_10_avg_performance DESC;
```

#### 4. Teams on Win Streaks (uses `idx_team_momentum_win_streak`)
```sql
SELECT team_name, current_win_streak, last_5_win_pct, momentum_status
FROM team_momentum_indicators_mart
WHERE current_win_streak >= 3
ORDER BY current_win_streak DESC;
```

#### 5. Players Near Milestones (uses `idx_achievement_elig_alerts`)
```sql
SELECT gamertag, next_achievement_alert, points_to_next_milestone
FROM achievement_eligibility_mart
WHERE next_achievement_alert IS NOT NULL
ORDER BY points_to_next_milestone ASC;
```

---

## Maintenance Recommendations

### Regular Index Maintenance

```sql
-- Reindex all mart indexes (run during off-peak hours)
REINDEX TABLE CONCURRENTLY event_strength_metrics_mv;
REINDEX TABLE CONCURRENTLY player_performance_mart;
REINDEX TABLE CONCURRENTLY player_stats_tracking_mart;
REINDEX TABLE CONCURRENTLY team_analytics_mart;
REINDEX TABLE CONCURRENTLY match_analytics_mart;
REINDEX TABLE CONCURRENTLY league_season_performance_mart;
REINDEX TABLE CONCURRENTLY tournament_performance_mart;
REINDEX TABLE CONCURRENTLY head_to_head_matchup_mart;
REINDEX TABLE CONCURRENTLY player_hot_streak_mart;
REINDEX TABLE CONCURRENTLY team_momentum_indicators_mart;
REINDEX TABLE CONCURRENTLY achievement_eligibility_mart;
REINDEX TABLE CONCURRENTLY roster_value_comparison_mart;
REINDEX TABLE CONCURRENTLY player_league_season_stats_mart;
```

### Check Index Usage Statistics

```sql
-- See which indexes are being used
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND tablename LIKE '%_mart'
ORDER BY idx_scan DESC;
```

### Identify Unused Indexes

```sql
-- Find indexes that are never used (candidates for removal)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND tablename LIKE '%_mart'
AND idx_scan = 0
ORDER BY tablename, indexname;
```

---

## Performance Tips

1. **CONCURRENTLY**: Always use `CONCURRENTLY` for production to avoid blocking queries
2. **Partial Indexes**: Use `WHERE` clauses to create smaller, faster indexes for specific queries
3. **Index Order**: Create indexes after initial data load, not before
4. **Analyze**: Run `ANALYZE` after creating indexes: `ANALYZE player_performance_mart;`
5. **Monitoring**: Check index bloat monthly and reindex if needed

---

## Troubleshooting

### Error: "cannot create index concurrently on materialized view"

Some PostgreSQL versions don't support `CONCURRENTLY` on materialized views. Remove `CONCURRENTLY` from index creation:

```sql
CREATE UNIQUE INDEX idx_player_perf_player_id ON player_performance_mart(player_id);
```

### Error: "could not create unique index - duplicate keys"

Data contains duplicates. Check for duplicate rows:

```sql
-- Example for player_performance_mart
SELECT player_id, COUNT(*) 
FROM player_performance_mart 
GROUP BY player_id 
HAVING COUNT(*) > 1;
```

Fix the materialized view query to ensure uniqueness before creating the index.

---

## Automated Index Creation Script

Save this as `create_all_mart_indexes.sql` and run once:

```bash
psql -d your_database -f create_all_mart_indexes.sql
```

Or via Supabase CLI:
```bash
supabase db execute -f create_all_mart_indexes.sql
```

