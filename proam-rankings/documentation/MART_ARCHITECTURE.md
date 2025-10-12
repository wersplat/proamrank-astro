# Data Mart Architecture Overview

## Mart Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                      BASE DATABASE TABLES                        │
│  players │ teams │ matches │ player_stats │ team_match_stats   │
│  match_contexts │ league_seasons │ tournaments │ team_rosters   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BASE VIEWS (EXISTING)                       │
│         v_matches_with_primary_context (CRITICAL)               │
│              v_player_global_rating                             │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 1: BASE METRICS                        │
│              event_strength_metrics_mv                          │
│       (Calculates tournament/season tier strength)              │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LEVEL 2: CORE ANALYTICAL MARTS                 │
├─────────────────────────────────────────────────────────────────┤
│  player_performance_mart      │  team_analytics_mart           │
│  (General player stats)       │  (General team stats)          │
├─────────────────────────────────────────────────────────────────┤
│  player_stats_tracking_mart   │  match_analytics_mart          │
│  (Career tracking)            │  (Match details)               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LEVEL 3: CONTEXT-SPECIFIC MARTS                 │
├─────────────────────────────────────────────────────────────────┤
│  league_season_performance_mart  │  tournament_performance_mart │
│  (Season aggregates)             │  (Tournament results)        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               LEVEL 4: SPECIALIZED ANALYSIS MARTS               │
├──────────────────────┬──────────────────────┬──────────────────┤
│  player_hot_streak   │  team_momentum       │  h2h_matchup     │
│  (Form tracking)     │  (Recent form)       │  (Rivalries)     │
├──────────────────────┼──────────────────────┼──────────────────┤
│  achievement_elig    │  roster_value        │  player_season   │
│  (Badges/milestones) │  (Team building)     │  (Season stats)  │
└──────────────────────┴──────────────────────┴──────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│    Pages │ Components │ API Endpoints │ Widgets                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mart Classification Matrix

### By Update Frequency

| Frequency | Marts | Trigger |
|-----------|-------|---------|
| **Real-time** | match_analytics_mart | Match verification |
| **Hourly** | player_performance_mart, team_analytics_mart, player_hot_streak_mart, team_momentum_indicators_mart | Match completion |
| **Daily** | player_stats_tracking_mart, achievement_eligibility_mart, roster_value_comparison_mart, event_strength_metrics_mv | Roster changes |
| **On-demand** | league_season_performance_mart, tournament_performance_mart, player_league_season_stats_mart | Season/tournament updates |

### By Use Case

| Use Case | Primary Mart | Supporting Marts |
|----------|-------------|------------------|
| **Player Profile** | player_performance_mart | player_stats_tracking_mart, player_hot_streak_mart, achievement_eligibility_mart |
| **Team Profile** | team_analytics_mart | team_momentum_indicators_mart, roster_value_comparison_mart |
| **Match Preview** | head_to_head_matchup_mart | team_momentum_indicators_mart, match_analytics_mart |
| **Leaderboards** | player_performance_mart | player_hot_streak_mart |
| **Team Rankings** | team_analytics_mart | team_momentum_indicators_mart |
| **Season Page** | league_season_performance_mart | player_league_season_stats_mart |
| **Tournament Page** | tournament_performance_mart | match_analytics_mart |
| **Achievements** | achievement_eligibility_mart | player_stats_tracking_mart |
| **Draft/Trades** | roster_value_comparison_mart | player_performance_mart, player_hot_streak_mart |

### By Data Volume

| Size | Marts | Estimated Rows |
|------|-------|----------------|
| **Small** (<100 rows) | event_strength_metrics_mv, league_season_performance_mart, tournament_performance_mart | ~20-50 |
| **Medium** (100-1000 rows) | team_analytics_mart, team_momentum_indicators_mart, roster_value_comparison_mart | ~200-500 |
| **Large** (1000+ rows) | player_performance_mart, player_stats_tracking_mart, player_hot_streak_mart, achievement_eligibility_mart, player_league_season_stats_mart | ~800-2000 |
| **X-Large** (5000+ rows) | match_analytics_mart, head_to_head_matchup_mart | ~1000-10000 |

---

## Data Flow Diagram

```
USER ACTION                    DATABASE OPERATION           MARTS AFFECTED
───────────                    ──────────────────           ──────────────

Match Submitted        →       INSERT into matches          (none yet)
                                                             
Match Verified         →       UPDATE matches               → REFRESH:
                               INSERT player_stats            - match_analytics_mart
                               INSERT team_match_stats        - player_performance_mart
                                                             - team_analytics_mart
                                                             - player_hot_streak_mart
                                                             - team_momentum_indicators_mart
                                                             
Player Joins Team      →       INSERT team_rosters          → REFRESH:
                                                             - roster_value_comparison_mart
                                                             - event_strength_metrics_mv
                                                             
Season Starts          →       INSERT league_seasons        → REFRESH:
                                                             - league_season_performance_mart
                                                             
Tournament Created     →       INSERT tournaments           → REFRESH:
                                                             - tournament_performance_mart
                                                             - event_strength_metrics_mv
                                                             
Achievement Earned     →       INSERT player_awards         → REFRESH:
                                                             - achievement_eligibility_mart
                                                             - player_stats_tracking_mart
```

---

## Mart Selection Decision Tree

```
START: What data do you need?
│
├─ Single player stats?
│  ├─ General/overview? → player_performance_mart
│  ├─ Career milestones? → player_stats_tracking_mart
│  ├─ Recent form? → player_hot_streak_mart
│  ├─ Season-specific? → player_league_season_stats_mart
│  └─ Achievement progress? → achievement_eligibility_mart
│
├─ Single team stats?
│  ├─ General/overview? → team_analytics_mart
│  ├─ Recent form? → team_momentum_indicators_mart
│  └─ Roster analysis? → roster_value_comparison_mart
│
├─ Matchup between two teams?
│  └─ Head-to-head record? → head_to_head_matchup_mart
│
├─ Match details?
│  └─ Match results/stats? → match_analytics_mart
│
├─ League season info?
│  └─ Season overview? → league_season_performance_mart
│
└─ Tournament info?
   └─ Tournament results? → tournament_performance_mart
```

---

## Join Patterns

### Player Complete Profile
```sql
player_performance_mart (base)
├─ JOIN player_stats_tracking_mart (career totals)
├─ JOIN player_hot_streak_mart (current form)
└─ JOIN achievement_eligibility_mart (badge progress)
```

### Team Complete Profile
```sql
team_analytics_mart (base)
├─ JOIN team_momentum_indicators_mart (recent form)
├─ JOIN roster_value_comparison_mart (roster analysis)
└─ JOIN head_to_head_matchup_mart (rivalry data)
```

### Match Preview
```sql
head_to_head_matchup_mart (base)
├─ JOIN team_momentum_indicators_mart (team A form)
├─ JOIN team_momentum_indicators_mart (team B form)
└─ JOIN roster_value_comparison_mart (roster comparison)
```

---

## Query Complexity Guide

### Simple (< 10ms) ✅
```sql
-- Single row lookup by ID
SELECT * FROM player_performance_mart WHERE player_id = $1;
SELECT * FROM team_analytics_mart WHERE team_id = $1;
```

### Medium (10-50ms) ✅
```sql
-- Filtered list with sort
SELECT * FROM player_performance_mart 
WHERE games_played >= 10 
ORDER BY avg_points DESC 
LIMIT 20;
```

### Complex (50-100ms) ⚠️
```sql
-- Join 2-3 marts
SELECT p.*, h.form_trend, a.next_achievement_alert
FROM player_performance_mart p
JOIN player_hot_streak_mart h ON p.player_id = h.player_id
JOIN achievement_eligibility_mart a ON p.player_id = a.player_id
WHERE p.games_played >= 10;
```

### Very Complex (100-200ms) ⚠️⚠️
```sql
-- Aggregations across marts
SELECT 
    h.team_1_name,
    h.team_2_name,
    h.total_meetings,
    AVG(m.score_differential) AS avg_margin
FROM head_to_head_matchup_mart h
JOIN match_analytics_mart m ON (m.team_a_id = h.team_1_id AND m.team_b_id = h.team_2_id)
GROUP BY h.team_1_name, h.team_2_name, h.total_meetings;
```

**Tip**: If query takes > 200ms, consider creating a new specialized mart.

---

## Field Naming Conventions

### Prefixes
- `avg_*`: Average value
- `total_*`: Sum/count aggregate
- `last_N_*`: Rolling window (last N games)
- `career_*`: All-time stats
- `season_*`: Season-scoped stats
- `current_*`: Active/latest value

### Suffixes
- `*_id`: Foreign key reference
- `*_ids`: Array of IDs
- `*_pct`: Percentage (0-100)
- `*_rank`: Ranking position
- `*_count`: Count of items
- `*_date`: Timestamp

### Examples
- `avg_points`: Average points per game (career)
- `last_10_avg_points`: Average points over last 10 games
- `season_high_points`: Highest points in a season
- `career_high_points`: Highest points ever
- `points_form_vs_career_pct`: Recent form vs career average (%)

---

## Storage & Size Management

### Current Size Estimates (your data)
- **Total Base Tables**: ~50-100 MB
- **Total Marts**: ~6-7 MB (6-10% of base tables)
- **Total Indexes**: ~2-3 MB
- **Overall Overhead**: ~10-15% storage increase

### Growth Projections
- Per 100 new players: +500 KB in marts
- Per 100 new teams: +200 KB in marts
- Per 1000 new matches: +2 MB in marts

### Size Monitoring Query
```sql
SELECT 
    schemaname || '.' || tablename AS object_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%_mart'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Refresh Strategy by Scenario

### Scenario 1: Active Season (Multiple Matches Per Day)
```sql
-- Every 4-6 hours
REFRESH MATERIALIZED VIEW CONCURRENTLY match_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_hot_streak_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_momentum_indicators_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY player_league_season_stats_mart;

-- Daily
REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats_tracking_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY achievement_eligibility_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY roster_value_comparison_mart;
```

### Scenario 2: Off-Season (Few Changes)
```sql
-- Daily or when data changes
REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;

-- Weekly
-- (All other marts)
```

### Scenario 3: Tournament Week (High Activity)
```sql
-- Every 2 hours during tournament
REFRESH MATERIALIZED VIEW CONCURRENTLY match_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY tournament_performance_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_momentum_indicators_mart;

-- Every 6 hours
-- (All player marts)
```

---

## Access Patterns

### Read-Heavy Operations (Use Marts)
✅ Leaderboards  
✅ Rankings  
✅ Profile pages  
✅ Dashboards  
✅ Historical analysis  
✅ Reports & exports  
✅ Public API endpoints  

### Write Operations (Use Base Tables)
❌ Match submission  
❌ Player creation  
❌ Team roster updates  
❌ Score verification  
❌ Admin operations  

**Rule**: Writes go to base tables, reads come from marts (after refresh)

---

## Mart Characteristics

| Mart | Rows | Columns | Join Complexity | Refresh Time | Query Time |
|------|------|---------|-----------------|--------------|------------|
| event_strength_metrics_mv | ~50 | 25 | High | 30-60s | < 5ms |
| player_performance_mart | ~800 | 25 | Medium | 10-20s | < 5ms |
| player_stats_tracking_mart | ~800 | 35 | High | 20-40s | < 5ms |
| team_analytics_mart | ~300 | 30 | Medium | 10-20s | < 5ms |
| match_analytics_mart | ~1000 | 30 | Medium | 15-30s | < 10ms |
| league_season_performance_mart | ~20 | 25 | High | 10-20s | < 5ms |
| tournament_performance_mart | ~20 | 25 | High | 10-20s | < 5ms |
| head_to_head_matchup_mart | ~5000 | 20 | Medium | 30-60s | < 10ms |
| player_hot_streak_mart | ~800 | 30 | High | 20-40s | < 5ms |
| team_momentum_indicators_mart | ~300 | 25 | High | 15-30s | < 5ms |
| achievement_eligibility_mart | ~800 | 30 | High | 20-40s | < 5ms |
| roster_value_comparison_mart | ~300 | 35 | Medium | 10-20s | < 5ms |
| player_league_season_stats_mart | ~2000 | 30 | Medium | 20-40s | < 5ms |

**Total Refresh Time**: ~4-8 minutes for all marts

---

## Optimization Checklist

### Before Going to Production

- [ ] All marts created successfully
- [ ] All unique indexes created (required for CONCURRENTLY)
- [ ] All supporting indexes created (performance)
- [ ] ANALYZE run on all marts
- [ ] Sample queries tested and performant
- [ ] Refresh script tested
- [ ] Refresh schedule configured
- [ ] Application code updated to use marts
- [ ] TypeScript types regenerated
- [ ] Monitoring alerts configured

### Performance Validation

```sql
-- Test query performance
EXPLAIN ANALYZE
SELECT * FROM player_performance_mart 
WHERE games_played >= 10 
ORDER BY avg_points DESC 
LIMIT 20;

-- Should show:
-- - Index Scan (not Seq Scan)
-- - Execution Time < 20ms
-- - Rows returned = 20
```

---

## Advanced Patterns

### 1. Composite Leaderboard (Multiple Stats)
```sql
WITH ranked_players AS (
    SELECT 
        player_id,
        gamertag,
        team_name,
        avg_points,
        avg_assists,
        avg_rebounds,
        ROW_NUMBER() OVER (ORDER BY avg_points DESC) AS pts_rank,
        ROW_NUMBER() OVER (ORDER BY avg_assists DESC) AS ast_rank,
        ROW_NUMBER() OVER (ORDER BY avg_rebounds DESC) AS reb_rank
    FROM player_performance_mart
    WHERE games_played >= 10
)
SELECT * FROM ranked_players
WHERE pts_rank <= 10 OR ast_rank <= 10 OR reb_rank <= 10
ORDER BY pts_rank;
```

### 2. Dynamic Power Rankings
```sql
SELECT 
    ta.team_name,
    -- Weighted power score
    (ta.win_percentage * 0.35 +           -- Historical success
     tm.last_10_win_pct * 0.30 +          -- Recent form
     rv.avg_roster_rating * 0.25 +        -- Roster strength
     ta.current_rp::float / 10) AS power_score
FROM team_analytics_mart ta
JOIN team_momentum_indicators_mart tm ON ta.team_id = tm.team_id
JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
WHERE ta.games_played >= 5
ORDER BY power_score DESC;
```

### 3. Matchup Prediction Features
```sql
-- Get all features for ML prediction model
SELECT 
    h.total_meetings,
    h.team_1_wins::float / NULLIF(h.total_meetings, 0) AS h2h_win_pct,
    tm1.last_10_win_pct AS team_a_form,
    tm2.last_10_win_pct AS team_b_form,
    rv1.avg_roster_rating AS team_a_roster,
    rv2.avg_roster_rating AS team_b_roster,
    ta1.elo_rating AS team_a_elo,
    ta2.elo_rating AS team_b_elo
FROM head_to_head_matchup_mart h
JOIN team_momentum_indicators_mart tm1 ON h.team_1_id = tm1.team_id
JOIN team_momentum_indicators_mart tm2 ON h.team_2_id = tm2.team_id
JOIN roster_value_comparison_mart rv1 ON h.team_1_id = rv1.team_id
JOIN roster_value_comparison_mart rv2 ON h.team_2_id = rv2.team_id
JOIN team_analytics_mart ta1 ON h.team_1_id = ta1.team_id
JOIN team_analytics_mart ta2 ON h.team_2_id = ta2.team_id
WHERE h.team_1_id = $1 AND h.team_2_id = $2;
```

---

## Comparison: Before vs After

### Before (Direct Table Queries)
```typescript
// Get top scorers - SLOW (300-500ms)
const { data } = await supabase.rpc('get_top_scorers', { min_games: 10 });
// Behind the scenes: 5-table join with aggregations
```

### After (Mart Query)
```typescript
// Get top scorers - FAST (5-15ms)
const { data } = await supabase
  .from('player_performance_mart')
  .select('gamertag, team_name, avg_points')
  .gte('games_played', 10)
  .order('avg_points', { ascending: false })
  .limit(20);
// Single table lookup with index
```

**Result**: 20-50x performance improvement! 🚀

---

## Migration Checklist for Existing Code

### Step 1: Identify Current Slow Queries
```typescript
// Add logging to find slow queries
console.time('query');
const result = await supabase.from('players').select('...');
console.timeEnd('query');
// Look for queries > 100ms
```

### Step 2: Map to Appropriate Mart
- Player aggregations → `player_performance_mart`
- Team aggregations → `team_analytics_mart`
- Match listings → `match_analytics_mart`

### Step 3: Rewrite Query
```typescript
// Before
const { data } = await supabase
  .from('players')
  .select(`
    *,
    current_team:teams(name),
    stats:player_stats(count, avg)
  `);

// After
const { data } = await supabase
  .from('player_performance_mart')
  .select('*');
```

### Step 4: Test & Validate
- Verify data matches
- Check performance improvement
- Update TypeScript types

---

## Best Practices Summary

### DO ✅
- Use marts for all analytical/reporting queries
- Filter early (WHERE clauses)
- Use specific marts for specific needs
- Leverage pre-calculated fields
- Join marts only when necessary
- Refresh marts on schedule
- Monitor query performance

### DON'T ❌
- Query marts for transactional operations
- Join too many marts (keep to 2-3 max)
- Select * when you only need specific columns
- Forget to refresh marts after data changes
- Skip creating indexes
- Recalculate fields that are already in marts

---

## Quick Reference Card

| Need | Use This Mart | Key Fields |
|------|---------------|------------|
| Player overall stats | player_performance_mart | avg_points, games_played, global_rating |
| Player career milestones | player_stats_tracking_mart | career_points, count_triple_doubles |
| Player current form | player_hot_streak_mart | form_trend, last_10_avg_points |
| Player season stats | player_league_season_stats_mart | ppg, season_points_rank |
| Player achievements | achievement_eligibility_mart | next_achievement_alert, total_achievements_earned |
| Team overall stats | team_analytics_mart | wins, losses, win_percentage |
| Team recent form | team_momentum_indicators_mart | momentum_status, last_10_win_pct |
| Team roster | roster_value_comparison_mart | roster_size, avg_roster_rating |
| Match details | match_analytics_mart | teams, scores, mvp, context |
| Head-to-head | head_to_head_matchup_mart | total_meetings, win records |
| League season | league_season_performance_mart | total_matches, best_record_team |
| Tournament | tournament_performance_mart | champion_team, tier_score |
| Event strength | event_strength_metrics_mv | tier_label, rp_cap |

---

## Support

For implementation help:
- **Getting Started**: `QUICK_START_MARTS.md`
- **Query Examples**: `MART_QUERY_EXAMPLES.sql`
- **Full Reference**: `DATA_MARTS_SUMMARY.md`
- **Performance**: `MART_INDEXING_GUIDE.md`

Happy coding! 🏀

