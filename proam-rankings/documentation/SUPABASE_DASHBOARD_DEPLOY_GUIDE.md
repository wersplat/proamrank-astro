# Supabase Dashboard Deployment Guide

## ⚠️ Important Note
The `DEPLOY_ALL_MARTS.sql` file uses psql-specific commands (`\ir`, `\echo`) that **won't work** in Supabase SQL Editor.

Instead, deploy each mart individually using the SQL Editor.

---

## 📋 Deployment Checklist

Copy and paste each file's contents into Supabase SQL Editor in this order:

### Prerequisites ✅
- ✅ `event_strength_metrics_mv` exists (already deployed)
- ✅ `v_matches_with_primary_context` exists (already deployed)

### Step 1: Verify Prerequisites

Run this to confirm both prerequisites exist:

```sql
-- Check event_strength_metrics_mv
SELECT COUNT(*) as event_strength_rows 
FROM event_strength_metrics_mv;

-- Check v_matches_with_primary_context
SELECT COUNT(*) as matches_with_context 
FROM v_matches_with_primary_context;

-- Both should return row counts > 0
```

If either fails, you need to create them first before proceeding.

### Step 2: Deploy Core Marts (in order)

1. **Player Performance Data Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM player_performance_mart;`

2. **Player Statistics Tracking Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM player_stats_tracking_mart;`

3. **Team Analytics Data Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM team_analytics_mart;`

4. **Match Analytics Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM match_analytics_mart;`

### Step 3: Deploy Context Marts

5. **League Season Performance Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM league_season_performance_mart;`

6. **Tournament Performance Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM tournament_performance_mart;`

### Step 4: Deploy Specialized Marts

7. **Head-to-Head Matchup Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM head_to_head_matchup_mart;`

8. **Player Hot Streak Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM player_hot_streak_mart;`

9. **Team Momentum Indicators Mart.sql**
   - [ ] Copy entire file contents
   - [ ] Paste into Supabase SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: `SELECT COUNT(*) FROM team_momentum_indicators_mart;`

10. **Achievement Eligibility Mart.sql**
    - [ ] Copy entire file contents
    - [ ] Paste into Supabase SQL Editor
    - [ ] Click "Run"
    - [ ] Verify: `SELECT COUNT(*) FROM achievement_eligibility_mart;`

11. **Roster Value Comparison Mart.sql**
    - [ ] Copy entire file contents
    - [ ] Paste into Supabase SQL Editor
    - [ ] Click "Run"
    - [ ] Verify: `SELECT COUNT(*) FROM roster_value_comparison_mart;`

12. **Player League Season Stats Mart.sql**
    - [ ] Copy entire file contents
    - [ ] Paste into Supabase SQL Editor
    - [ ] Click "Run"
    - [ ] Verify: `SELECT COUNT(*) FROM player_league_season_stats_mart;`

---

## 🎯 Quick Verification

After deploying all marts, run this in SQL Editor:

```sql
SELECT 
    matviewname AS view_name,
    (SELECT COUNT(*) FROM pg_class WHERE oid = (schemaname || '.' || matviewname)::regclass::oid) > 0 AS has_data
FROM pg_matviews 
WHERE schemaname = 'public' 
AND (matviewname LIKE '%mart%' OR matviewname = 'event_strength_metrics_mv')
ORDER BY matviewname;
```

Should show 13 rows (12 new + event_strength_metrics_mv).

---

## 🔧 Create Indexes

After all marts are created, run this for each mart:

```sql
-- Player Performance Mart
CREATE UNIQUE INDEX idx_player_perf_player_id ON player_performance_mart(player_id);
CREATE INDEX idx_player_perf_team ON player_performance_mart(current_team_id) WHERE current_team_id IS NOT NULL;
CREATE INDEX idx_player_perf_position_rating ON player_performance_mart(position, global_rating DESC);
CREATE INDEX idx_player_perf_avg_points ON player_performance_mart(avg_points DESC) WHERE games_played >= 10;

-- Player Stats Tracking
CREATE UNIQUE INDEX idx_player_stats_tracking_player_id ON player_stats_tracking_mart(player_id);
CREATE INDEX idx_player_stats_career_points ON player_stats_tracking_mart(career_points DESC);
CREATE INDEX idx_player_stats_recent_activity ON player_stats_tracking_mart(last_game_date DESC NULLS LAST);

-- Team Analytics
CREATE UNIQUE INDEX idx_team_analytics_team_id ON team_analytics_mart(team_id);
CREATE INDEX idx_team_analytics_win_pct ON team_analytics_mart(win_percentage DESC) WHERE games_played >= 5;
CREATE INDEX idx_team_analytics_rp_tier ON team_analytics_mart(rp_tier, current_rp DESC);

-- Match Analytics
CREATE UNIQUE INDEX idx_match_analytics_match_id ON match_analytics_mart(match_id);
CREATE INDEX idx_match_analytics_played_at ON match_analytics_mart(played_at DESC);
CREATE INDEX idx_match_analytics_teams ON match_analytics_mart(team_a_id, team_b_id);
CREATE INDEX idx_match_analytics_game_type ON match_analytics_mart(game_type);

-- League Season Performance
CREATE UNIQUE INDEX idx_league_season_perf_season_id ON league_season_performance_mart(season_id);
CREATE INDEX idx_league_season_perf_league ON league_season_performance_mart(league_name, season_number DESC);
CREATE INDEX idx_league_season_perf_active ON league_season_performance_mart(is_active, start_date DESC) WHERE is_active = TRUE;

-- Tournament Performance
CREATE UNIQUE INDEX idx_tournament_perf_tournament_id ON tournament_performance_mart(tournament_id);
CREATE INDEX idx_tournament_perf_org_tier ON tournament_performance_mart(organizer, tournament_tier);
CREATE INDEX idx_tournament_perf_dates ON tournament_performance_mart(start_date DESC, end_date DESC);
CREATE INDEX idx_tournament_perf_status ON tournament_performance_mart(status);

-- Head-to-Head Matchup
CREATE UNIQUE INDEX idx_h2h_teams ON head_to_head_matchup_mart(team_1_id, team_2_id);
CREATE INDEX idx_h2h_teams_reverse ON head_to_head_matchup_mart(team_2_id, team_1_id);
CREATE INDEX idx_h2h_last_meeting ON head_to_head_matchup_mart(last_meeting DESC);

-- Player Hot Streak  
CREATE UNIQUE INDEX idx_player_streak_player_id ON player_hot_streak_mart(player_id);
CREATE INDEX idx_player_streak_form ON player_hot_streak_mart(form_trend) WHERE form_trend IN ('Heating Up', 'Hot');
CREATE INDEX idx_player_streak_position ON player_hot_streak_mart(position, last_10_avg_points DESC);

-- Team Momentum
CREATE UNIQUE INDEX idx_team_momentum_team_id ON team_momentum_indicators_mart(team_id);
CREATE INDEX idx_team_momentum_status ON team_momentum_indicators_mart(momentum_status, last_5_wins DESC);
CREATE INDEX idx_team_momentum_streak ON team_momentum_indicators_mart(current_win_streak DESC) WHERE current_win_streak >= 3;

-- Achievement Eligibility
CREATE UNIQUE INDEX idx_achievement_elig_player_id ON achievement_eligibility_mart(player_id);
CREATE INDEX idx_achievement_elig_50pt ON achievement_eligibility_mart(fifty_point_eligible) WHERE fifty_point_eligible IS NOT NULL;
CREATE INDEX idx_achievement_elig_triple_double ON achievement_eligibility_mart(triple_double_eligible) WHERE triple_double_eligible IS NOT NULL;

-- Roster Value
CREATE UNIQUE INDEX idx_roster_value_team_id ON roster_value_comparison_mart(team_id);
CREATE INDEX idx_roster_value_rating ON roster_value_comparison_mart(avg_roster_rating DESC);
CREATE INDEX idx_roster_value_total ON roster_value_comparison_mart(total_roster_value DESC);

-- Player League Season Stats
CREATE UNIQUE INDEX idx_player_season_stats_composite ON player_league_season_stats_mart(player_id, league_id, season_id);
CREATE INDEX idx_player_season_stats_ppg ON player_league_season_stats_mart(season_id, ppg DESC) WHERE games_played >= 5;
CREATE INDEX idx_player_season_stats_season ON player_league_season_stats_mart(season_id, player_id);
```

---

## 📊 Run ANALYZE

After creating indexes, optimize query planning:

```sql
ANALYZE player_performance_mart;
ANALYZE player_stats_tracking_mart;
ANALYZE team_analytics_mart;
ANALYZE match_analytics_mart;
ANALYZE league_season_performance_mart;
ANALYZE tournament_performance_mart;
ANALYZE head_to_head_matchup_mart;
ANALYZE player_hot_streak_mart;
ANALYZE team_momentum_indicators_mart;
ANALYZE achievement_eligibility_mart;
ANALYZE roster_value_comparison_mart;
ANALYZE player_league_season_stats_mart;
```

---

## ⏰ Set Up Auto-Refresh

Create this as a Supabase Edge Function or scheduled task:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats_tracking_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY match_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY league_season_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY tournament_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY head_to_head_matchup_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_hot_streak_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_momentum_indicators_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY achievement_eligibility_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY roster_value_comparison_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_league_season_stats_mart;
```

---

## ✅ Done!

You now have 12 optimized materialized views ready to use in your ProAm Rankings application!

