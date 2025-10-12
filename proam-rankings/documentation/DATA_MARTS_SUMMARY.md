# Data Marts & Materialized Views Summary

## Overview

This document describes all materialized views (data marts) in the ProAm Rankings database, their purpose, key fields, and recommended use cases.

---

## Core Analytics Marts (Fixed & Optimized)

### 1. Player Performance Mart
**File**: `Player Performance Data Mart.sql`  
**View Name**: `player_performance_mart`  
**Purpose**: Comprehensive player statistics aggregated across all verified matches

#### Key Fields
- Player identification: `player_id`, `gamertag`, `position`, `team_name`
- Rating metrics: `global_rating`, `rating_tier`
- Career stats: `games_played`, averages for all stat categories
- Shooting efficiency: `avg_fg_pct`, `avg_three_pct`, `avg_ft_pct`
- Recent form: `recent_games`, `recent_avg_points`, `days_since_last_game`
- Context: `league_ids`, `tournament_ids`, `season_ids` (arrays)

#### Use Cases
- Player leaderboards and rankings
- Player profile pages
- Free agent/draft evaluations
- Season award calculations
- Quick player stat lookups

#### Example Query
```sql
-- Top 20 scorers with at least 10 games
SELECT gamertag, team_name, avg_points, games_played, global_rating
FROM player_performance_mart
WHERE games_played >= 10
ORDER BY avg_points DESC
LIMIT 20;
```

---

### 2. Player Statistics Tracking Mart
**File**: `Player Statistics Tracking Mart.sql`  
**View Name**: `player_stats_tracking_mart`  
**Purpose**: Detailed player career tracking with milestones and achievement metrics

#### Key Fields
- Career totals: All major statistical categories
- Career highs: `career_high_points`, `career_high_assists`, etc.
- Achievement counts: `count_30pt_games`, `count_triple_doubles`, etc.
- Timeline: `first_game_date`, `last_game_date`, `days_since_last_game`
- Participation: `leagues_played`, `tournaments_played`, `seasons_played`
- Last 10 game averages: `last_10_avg_points`, etc.

#### Use Cases
- Achievement system (badge eligibility)
- Player career retrospectives
- All-time records tracking
- Historical player comparisons
- Longevity metrics

#### Example Query
```sql
-- Players close to triple-double milestones
SELECT gamertag, count_triple_doubles, career_games
FROM player_stats_tracking_mart
WHERE career_games >= 50
ORDER BY count_triple_doubles DESC
LIMIT 10;
```

---

### 3. Team Analytics Mart
**File**: `Team Analytics Data Mart.sql`  
**View Name**: `team_analytics_mart`  
**Purpose**: Complete team performance metrics and roster analytics

#### Key Fields
- Team identity: `team_id`, `team_name`, `logo_url`
- Performance: `wins`, `losses`, `win_percentage`, `games_played`
- Team stats: Averages for scoring, defense, shooting percentages
- Roster info: `roster_size`, `player_ids`, `avg_player_rating`
- Talent distribution: `elite_players`, `starter_players`, `role_players`
- RP classification: `rp_tier` (Elite/Premier/Contender/Challenger/Prospect)
- Success: `tournament_wins`, `total_prize_money`

#### Use Cases
- Team standings and rankings
- Team profile pages
- Roster strength comparisons
- Draft/free agency planning
- Power rankings generation

#### Example Query
```sql
-- Top teams by win percentage (min 10 games)
SELECT team_name, wins, losses, win_percentage, avg_roster_rating, rp_tier
FROM team_analytics_mart
WHERE games_played >= 10
ORDER BY win_percentage DESC, wins DESC
LIMIT 25;
```

---

### 4. Match Analytics Mart
**File**: `Match Analytics Mart.sql`  
**View Name**: `match_analytics_mart`  
**Purpose**: Detailed match results with context and statistical breakdowns

#### Key Fields
- Match basics: `match_id`, `played_at`, `status`, `verified`
- Teams: `team_a_name`, `team_b_name`, `winner_name`
- Scores: `score_a`, `score_b`, `score_differential`
- Team stats: Points, assists, rebounds, etc. for both teams
- Context: `league_name`, `tournament_name`, `stage`, `game_year`
- Classification: `game_type` (Blowout/Decisive/Comfortable/Close)
- MVP: `mvp_player_id`, `mvp_name`
- Time periods: `quarter`, `month`, `year`, `fiscal_quarter`

#### Use Cases
- Match history displays
- Game recap pages
- Schedule and results lists
- Tournament brackets
- Statistical game analysis
- Trend analysis by time period

#### Example Query
```sql
-- Recent close games in tournaments
SELECT team_a_name, score_a, score_b, team_b_name, tournament_name, played_at
FROM match_analytics_mart
WHERE game_type = 'Close'
AND tournament_name IS NOT NULL
ORDER BY played_at DESC
LIMIT 20;
```

---

### 5. League Season Performance Mart
**File**: `League Season Performance Mart.sql`  
**View Name**: `league_season_performance_mart`  
**Purpose**: Aggregated statistics and context for each league season

#### Key Fields
- Season info: `season_id`, `league_name`, `season_number`, `game_year`
- Dates: `start_date`, `end_date`, `first_match_date`, `last_match_date`
- Participation: `total_matches`, `total_unique_teams`, `total_players`
- Aggregates: Total points, assists, rebounds, etc. across season
- Playoff info: `playoff_champion`, `playoff_prize`, `playoff_status`
- Open info: `open_champion`, `open_prize`, `open_status`
- Leaders: `top_scorers` (array), `best_record_team`

#### Use Cases
- Season landing pages
- Season standings
- Historical season comparisons
- Season award voting
- League analytics dashboards

#### Example Query
```sql
-- Most competitive seasons by participation
SELECT league_name, season_number, game_year, total_unique_teams, total_matches
FROM league_season_performance_mart
ORDER BY total_unique_teams DESC, total_matches DESC
LIMIT 10;
```

---

### 6. Tournament Performance Mart
**File**: `Tournament Performance Mart.sql`  
**View Name**: `tournament_performance_mart`  
**Purpose**: Tournament details with calculated event strength and results

#### Key Fields
- Tournament info: `tournament_id`, `tournament_name`, `game_year`, `tier`
- Organizer: `organizer`, `organizer_logo`
- Results: `champion_team`, `runner_up_team`, `top_3_teams`
- Stats: `total_matches`, `unique_teams`, `total_players`
- Strength: `tier_score`, `event_strength`, `calculated_tier` (from event_strength_metrics_mv)
- Groups: `group_count`, `group_names`
- Status: `status`, `is_completed`, `is_past_event`

#### Use Cases
- Tournament pages
- Event calendar
- Tournament history
- Strength of schedule calculations
- RP award validation

#### Example Query
```sql
-- Strongest T1 tournaments
SELECT tournament_name, organizer, champion_team, tier_score, unique_teams
FROM tournament_performance_mart
WHERE calculated_tier = 'T1'
ORDER BY event_strength DESC;
```

---

## New Specialized Marts

### 7. Head-to-Head Matchup Mart
**File**: `Head-to-Head Matchup Mart.sql`  
**View Name**: `head_to_head_matchup_mart`  
**Purpose**: Historical performance between specific team pairs

#### Key Fields
- Teams: `team_1_id`, `team_1_name`, `team_2_id`, `team_2_name`
- Record: `total_meetings`, `team_1_wins`, `team_2_wins`
- Scoring: `team_1_avg_score`, `team_2_avg_score`, `avg_score_differential`
- Context: `league_meetings`, `tournament_meetings`
- Recent form: `team_1_last_5_wins`, `team_2_last_5_wins`
- Timeline: `first_meeting`, `last_meeting`, `days_since_last_meeting`
- Current state: `current_winner`

#### Use Cases
- Pre-match analysis and predictions
- Rivalry tracking
- Scheduling considerations
- Historical matchup pages
- Fantasy/betting insights

#### Example Query
```sql
-- Get all rivalries (teams that have played 10+ times)
SELECT team_1_name, team_2_name, total_meetings, team_1_wins, team_2_wins
FROM head_to_head_matchup_mart
WHERE total_meetings >= 10
ORDER BY total_meetings DESC;
```

---

### 8. Player Hot Streak Mart
**File**: `Player Hot Streak Mart.sql`  
**View Name**: `player_hot_streak_mart`  
**Purpose**: Player form trends and streak detection

#### Key Fields
- Rolling windows: `last_5_avg_points`, `last_10_avg_points`, `last_20_avg_points` (all stats)
- Consistency: `points_consistency_stddev`, `performance_consistency_stddev`
- Form indicators: `points_form_vs_career_pct`, `performance_form_vs_career_pct`
- Trend: `form_trend` (Heating Up/Cooling Down/Improving/Declining/Stable)
- Position comparison: `pts_vs_position_avg_pct`, `perf_vs_position_avg_pct`
- Baselines: `career_avg_points`, `career_avg_performance`

#### Use Cases
- "Hot players" widgets
- Waiver wire recommendations
- Starting lineup decisions
- Player of the week selections
- Fantasy sports projections
- Trade value assessments

#### Example Query
```sql
-- Find players heating up (recent form > career average)
SELECT gamertag, current_team, form_trend, 
       last_10_avg_points, career_avg_points,
       points_form_vs_career_pct
FROM player_hot_streak_mart
WHERE form_trend IN ('Heating Up', 'Improving')
AND games_last_10 >= 5
ORDER BY points_form_vs_career_pct DESC;
```

---

### 9. Team Momentum Indicators Mart
**File**: `Team Momentum Indicators Mart.sql`  
**View Name**: `team_momentum_indicators_mart`  
**Purpose**: Team form, streaks, and momentum tracking

#### Key Fields
- Records: `last_5_wins/games`, `last_10_wins/games`, `last_20_wins/games`
- Win percentages: `last_5_win_pct`, `last_10_win_pct`, `last_20_win_pct`
- Scoring: Averages scored/allowed for each window
- Point differentials: `last_5_point_diff`, etc.
- Streaks: `current_win_streak`, `current_loss_streak`
- Momentum: `momentum_status` (Hot/Cold/Steady)
- Context-specific: `league_win_rate_last_10`, `tournament_win_rate_last_10`
- Rest: `avg_rest_days_last_10`

#### Use Cases
- Power rankings
- Playoff predictions
- Hot/cold team detection
- Match preview analysis
- Momentum-based predictions
- Schedule strength analysis

#### Example Query
```sql
-- Teams riding win streaks
SELECT team_name, current_win_streak, last_10_win_pct, 
       last_10_avg_scored, momentum_status
FROM team_momentum_indicators_mart
WHERE current_win_streak >= 3
ORDER BY current_win_streak DESC, last_10_win_pct DESC;
```

---

### 10. Achievement Eligibility Mart
**File**: `Achievement Eligibility Mart.sql`  
**View Name**: `achievement_eligibility_mart`  
**Purpose**: Track player progress toward achievements and milestones

#### Key Fields
- Career totals: All major stat categories
- Milestone tracking: `points_milestone_achieved`, `points_to_next_milestone`
- Eligibility flags: `fifty_point_eligible`, `triple_double_eligible`, etc.
- Active streaks: `active_streak_type`, `active_streak_length`
- Season awards: `season_award_eligible`, `active_season_avg_points`
- Alerts: `next_achievement_alert` (pre-calculated notification triggers)
- Earned: `total_achievements_earned`

#### Use Cases
- Achievement notification system
- Player profile achievement displays
- Progress tracking UI
- Gamification features
- Award eligibility checking
- Milestone celebration triggers

#### Example Query
```sql
-- Players close to their next achievement
SELECT gamertag, next_achievement_alert, 
       points_to_next_milestone, active_streak_type, active_streak_length
FROM achievement_eligibility_mart
WHERE next_achievement_alert IS NOT NULL
ORDER BY 
    CASE next_achievement_alert
        WHEN 'Active Long Streak' THEN 1
        WHEN 'Points Milestone Close' THEN 2
        WHEN 'Near Century Club' THEN 3
        ELSE 4
    END;
```

---

### 11. Roster Value Comparison Mart
**File**: `Roster Value Comparison Mart.sql`  
**View Name**: `roster_value_comparison_mart`  
**Purpose**: Team roster construction and salary cap analysis

#### Key Fields
- Overview: `roster_size`, `total_roster_value`, `avg_player_value`, `avg_roster_rating`
- Talent tiers: `elite_players`, `role_players`, `bench_players`
- Salary distribution: `s_tier_players`, `a_tier_players`, etc.
- Position groups: Guards, locks, bigs (count, rating, value)
- Rankings: `pg_rank`, `sg_rank`, `lock_rank`, `pf_rank`, `center_rank`
- Assessments: `roster_depth_status`, `roster_tier_assessment`
- Balance: `positional_balance_score` (evenness of talent distribution)
- Leadership: `captain_id`, `captain_name`, `player_coaches`

#### Use Cases
- Team building strategy
- Salary cap management
- Roster balance analysis
- Position strength comparisons
- Trade evaluation
- Draft planning
- Free agency targeting

#### Example Query
```sql
-- Teams with best roster balance (championship contenders)
SELECT team_name, roster_tier_assessment, avg_roster_rating,
       elite_players, role_players, positional_balance_score
FROM roster_value_comparison_mart
WHERE roster_tier_assessment IN ('Championship Contender', 'Playoff Contender')
ORDER BY positional_balance_score DESC, avg_roster_rating DESC;
```

---

### 12. Player League Season Stats Mart
**File**: `Player League Season Stats Mart.sql`  
**View Name**: `player_league_season_stats_mart`  
**Purpose**: Player performance scoped to specific league seasons

#### Key Fields
- Context: `season_id`, `league_name`, `season_number`, `game_year`
- Team: `season_team_id`, `season_team_name`, `is_captain`
- Per-game averages: `ppg`, `apg`, `rpg`, `spg`, `bpg`, `tpg`
- Shooting: `fg_pct`, `three_pt_pct`, `ft_pct`
- Season highs: `season_high_points`, `season_high_assists`, etc.
- Rankings: `season_points_rank`, `season_assists_rank`, etc.
- Awards: `potential_season_award`

#### Use Cases
- Season leaderboards
- End-of-season awards
- Player season retrospectives
- Season-to-season comparisons
- Team season pages (roster stats)
- Season MVP voting

#### Example Query
```sql
-- Current season scoring leaders
SELECT gamertag, season_team_name, ppg, games_played, season_points_rank
FROM player_league_season_stats_mart
WHERE season_id IN (
    SELECT id FROM league_seasons WHERE is_active = TRUE
)
AND games_played >= 5
ORDER BY ppg DESC
LIMIT 20;
```

---

## Event/Context Marts

### 13. Event Strength Metrics MV
**File**: `event_strength_metrics_mv.sql` (already exists)  
**View Name**: `event_strength_metrics_mv`  
**Purpose**: Calculate competitive strength of tournaments and league seasons

#### Key Fields
- Event ID: `event_key`, `tournament_id`, `season_id`
- Classification: `tier_label` (T1-T5), `tier_score`, `event_strength`
- Metadata: `event_name`, `organizer_name`, `team_count`, `prize_pool`
- Components: Individual strength factors (hybrid, field, bracket, etc.)
- RP assignment: `rp_cap` (calculated max RP based on strength)

#### Use Cases
- Automatic tier assignment
- RP award calculations
- Strength of schedule
- Event prestige ranking
- Historical event comparisons

---

## Refresh Strategy

### Recommended Refresh Schedule

| Mart | Refresh Frequency | Trigger Event | Priority |
|------|------------------|---------------|----------|
| event_strength_metrics_mv | Daily | Roster changes | High |
| player_performance_mart | Every 6 hours | Match verification | High |
| team_analytics_mart | Every 6 hours | Match verification | High |
| match_analytics_mart | Real-time | Match submission | Critical |
| player_hot_streak_mart | Every 4 hours | Match verification | Medium |
| team_momentum_indicators_mart | Every 4 hours | Match verification | Medium |
| achievement_eligibility_mart | Every 12 hours | Match verification | Low |
| roster_value_comparison_mart | Daily | Roster changes | Low |
| player_stats_tracking_mart | Daily | Match verification | Medium |
| league_season_performance_mart | Daily | Season updates | Medium |
| tournament_performance_mart | Daily | Tournament updates | Medium |
| player_league_season_stats_mart | Every 6 hours | Match verification | High |

### Quick Refresh Script

```bash
# Full refresh (all marts)
psql -d proam_rankings -f REFRESH_ALL_MARTS.sql

# Critical marts only (after match verification)
psql -d proam_rankings -c "
REFRESH MATERIALIZED VIEW CONCURRENTLY match_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;
"
```

---

## Query Performance Tips

### 1. Always Use Indexes
Ensure all indexes from `MART_INDEXING_GUIDE.md` are created before querying.

### 2. Filter Early
```sql
-- Good: Filter before joining
SELECT * FROM player_performance_mart 
WHERE games_played >= 10  -- Filtered early
LIMIT 20;

-- Bad: No filtering
SELECT * FROM player_performance_mart LIMIT 20;
```

### 3. Use Array Fields Efficiently
```sql
-- Check if player participated in specific league
SELECT gamertag 
FROM player_performance_mart
WHERE 'league-uuid-here' = ANY(league_ids);
```

### 4. Leverage Pre-calculated Fields
```sql
-- Use pre-calculated win_percentage instead of calculating
SELECT team_name, win_percentage  -- Already calculated!
FROM team_analytics_mart
ORDER BY win_percentage DESC;
```

---

## Common Query Patterns

### Player Leaderboards
```sql
-- Overall points per game leaders
SELECT gamertag, team_name, avg_points, games_played
FROM player_performance_mart
WHERE games_played >= 10
ORDER BY avg_points DESC
LIMIT 50;
```

### Team Power Rankings
```sql
-- Combined rankings
SELECT 
    t.team_name,
    t.win_percentage,
    t.avg_roster_rating,
    tm.last_10_win_pct,
    tm.momentum_status,
    rv.roster_tier_assessment
FROM team_analytics_mart t
JOIN team_momentum_indicators_mart tm ON t.team_id = tm.team_id
JOIN roster_value_comparison_mart rv ON t.team_id = rv.team_id
WHERE t.games_played >= 5
ORDER BY t.win_percentage DESC, tm.last_10_win_pct DESC;
```

### Hot Players Dashboard
```sql
-- Players on fire right now
SELECT 
    p.gamertag,
    p.team_name,
    h.form_trend,
    h.last_5_avg_points,
    h.last_10_avg_points,
    p.global_rating
FROM player_performance_mart p
JOIN player_hot_streak_mart h ON p.player_id = h.player_id
WHERE h.form_trend IN ('Heating Up', 'Hot')
AND h.games_last_5 >= 3
ORDER BY h.last_5_avg_performance DESC;
```

### Upcoming Match Preview
```sql
-- Get head-to-head stats for an upcoming match
SELECT 
    h.team_1_name,
    h.team_2_name,
    h.total_meetings,
    h.team_1_wins,
    h.team_2_wins,
    h.team_1_last_5_wins AS t1_recent_wins,
    h.team_2_last_5_wins AS t2_recent_wins,
    tm1.momentum_status AS t1_momentum,
    tm2.momentum_status AS t2_momentum,
    tm1.last_5_win_pct AS t1_recent_form,
    tm2.last_5_win_pct AS t2_recent_form
FROM head_to_head_matchup_mart h
JOIN team_momentum_indicators_mart tm1 ON h.team_1_id = tm1.team_id
JOIN team_momentum_indicators_mart tm2 ON h.team_2_id = tm2.team_id
WHERE h.team_1_id = 'team-uuid-1' 
AND h.team_2_id = 'team-uuid-2';
```

### Achievement Notifications
```sql
-- Players who should get milestone notifications
SELECT 
    gamertag,
    next_achievement_alert,
    points_to_next_milestone,
    active_streak_type,
    active_streak_length
FROM achievement_eligibility_mart
WHERE next_achievement_alert IS NOT NULL
OR active_streak_length >= 5
ORDER BY 
    CASE 
        WHEN active_streak_length >= 10 THEN 1
        WHEN points_to_next_milestone <= 50 THEN 2
        ELSE 3
    END;
```

---

## Maintenance Checklist

### Daily Tasks
- [ ] Refresh all marts (`REFRESH_ALL_MARTS.sql`)
- [ ] Verify row counts are reasonable
- [ ] Check for NULL-heavy results indicating data issues

### Weekly Tasks
- [ ] Review index usage statistics
- [ ] Check for slow-running queries
- [ ] Verify achievement alerts are firing correctly

### Monthly Tasks
- [ ] Run `ANALYZE` on all marts
- [ ] Review and optimize slow CTEs
- [ ] Check for data drift between marts and source tables
- [ ] Reindex if bloat detected

### Seasonal Tasks
- [ ] Archive old season data if needed
- [ ] Review mart schemas for new requirements
- [ ] Update documentation for new features

---

## Troubleshooting

### Issue: Mart is out of date
**Solution**: Run targeted refresh
```sql
REFRESH MATERIALIZED VIEW player_performance_mart;
```

### Issue: Query is slow on a mart
**Solution**: 
1. Check if index exists: `\d+ player_performance_mart`
2. Create missing index from guide
3. Run `ANALYZE player_performance_mart;`

### Issue: Concurrent refresh fails
**Solution**: Unique index might be missing or data has duplicates
```sql
-- Check for duplicates
SELECT player_id, COUNT(*) 
FROM player_performance_mart 
GROUP BY player_id 
HAVING COUNT(*) > 1;
```

### Issue: Mart takes too long to refresh
**Solution**: 
1. Refresh during low-traffic periods
2. Consider incremental refresh strategies
3. Check if source tables need indexing
4. Optimize CTE queries in mart definition

---

## Adding New Marts

When creating new materialized views:

1. Follow naming convention: `{domain}_{purpose}_mart`
2. Always use `v_matches_with_primary_context` for match data
3. Include player/team identification fields
4. Add date fields for temporal analysis
5. Use COALESCE for nullable aggregates
6. Create unique index for CONCURRENTLY refresh
7. Add to `REFRESH_ALL_MARTS.sql`
8. Document in this file
9. Add example queries

---

## Integration with Application

### TypeScript Type Generation

After creating/modifying marts, regenerate TypeScript types:

```bash
npx supabase gen types typescript --local > src/lib/db.types.ts
```

### Example Usage in Code

```typescript
import { createClient } from '@/lib/supabase';

// Get hot players
const { data: hotPlayers } = await supabase
  .from('player_hot_streak_mart')
  .select('gamertag, current_team, form_trend, last_5_avg_points')
  .in('form_trend', ['Heating Up', 'Hot'])
  .gte('games_last_5', 3)
  .order('last_5_avg_performance', { ascending: false })
  .limit(10);
```

---

## Performance Benchmarks

Expected query times on materialized views (with indexes):

- Single player/team lookup: < 5ms
- Leaderboard (top 50): < 20ms
- Complex joins (2-3 marts): < 50ms
- Full table scan: < 200ms

If queries exceed these times, check index usage with `EXPLAIN ANALYZE`.

