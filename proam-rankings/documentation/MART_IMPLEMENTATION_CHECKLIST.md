# Data Marts Implementation Checklist

## Pre-Deployment Checklist

### Prerequisites
- [ ] PostgreSQL 13+ or Supabase project configured
- [ ] All base tables exist and contain verified data
- [x] `v_matches_with_primary_context` view exists ✅ (already in database)
- [x] `v_player_global_rating` view exists ✅ (already in database)
- [x] `event_strength_metrics_mv` exists ✅ (already in database)
- [ ] Database has sufficient storage (estimate 2-5% of base table size per mart)

### Backup
- [ ] Create database backup before deployment
- [ ] Document current schema state
- [ ] Export existing mart data if replacing

---

## Deployment Steps

### Phase 1: Verify Existing Dependencies

#### 1.1 Verify Event Strength Metrics (Already Exists)
```sql
-- Run in Supabase SQL Editor or psql
SELECT COUNT(*) as row_count FROM event_strength_metrics_mv;
```
- [x] Already exists ✅
- [ ] Row count > 0
- [ ] No NULL event_keys

#### 1.2 Create Player Performance Mart
```bash
psql -d your_database -f "Player Performance Data Mart.sql"
```
- [ ] Created successfully
- [ ] Row count matches player count
- [ ] All active players have data

#### 1.3 Create Player Stats Tracking Mart
```bash
psql -d your_database -f "Player Statistics Tracking Mart.sql"
```
- [ ] Created successfully
- [ ] Career stats look accurate
- [ ] No negative values in totals

#### 1.4 Create Team Analytics Mart
```bash
psql -d your_database -f "Team Analytics Data Mart.sql"
```
- [ ] Created successfully
- [ ] Row count matches team count
- [ ] Win percentages calculate correctly

#### 1.5 Create Match Analytics Mart
```bash
psql -d your_database -f "Match Analytics Mart.sql"
```
- [ ] Created successfully
- [ ] Row count matches verified match count
- [ ] All matches have team names

#### 1.6 Create League Season Performance Mart
```bash
psql -d your_database -f "League Season Performance Mart.sql"
```
- [ ] Created successfully
- [ ] Row count matches season count
- [ ] Active seasons flagged correctly

#### 1.7 Create Tournament Performance Mart
```bash
psql -d your_database -f "Tournament Performance Mart.sql"
```
- [ ] Created successfully
- [ ] Row count matches tournament count
- [ ] Tier scores populated from event_strength_metrics_mv

---

### Phase 2: Deploy Specialized Marts (Optional but Recommended)

#### 2.1 Create Head-to-Head Matchup Mart
```bash
psql -d your_database -f "Head-to-Head Matchup Mart.sql"
```
- [ ] Created successfully
- [ ] Only unique team pairs exist
- [ ] Win/loss totals match match_analytics_mart

#### 2.2 Create Player Hot Streak Mart
```bash
psql -d your_database -f "Player Hot Streak Mart.sql"
```
- [ ] Created successfully
- [ ] Form trends populated
- [ ] Rolling averages calculated

#### 2.3 Create Team Momentum Indicators Mart
```bash
psql -d your_database -f "Team Momentum Indicators Mart.sql"
```
- [ ] Created successfully
- [ ] Momentum statuses assigned
- [ ] Streak counts accurate

#### 2.4 Create Achievement Eligibility Mart
```bash
psql -d your_database -f "Achievement Eligibility Mart.sql"
```
- [ ] Created successfully
- [ ] Milestone progress calculated
- [ ] Active streaks detected

#### 2.5 Create Roster Value Comparison Mart
```bash
psql -d your_database -f "Roster Value Comparison Mart.sql"
```
- [ ] Created successfully
- [ ] Roster sizes match team_rosters
- [ ] Position distributions correct

#### 2.6 Create Player League Season Stats Mart
```bash
psql -d your_database -f "Player League Season Stats Mart.sql"
```
- [ ] Created successfully
- [ ] Player-season combinations unique
- [ ] Rankings populated

---

### Phase 3: Create Indexes

#### 3.1 Run Index Creation Script
```bash
# Extract index creation SQL from MART_INDEXING_GUIDE.md
psql -d your_database -f create_all_mart_indexes.sql
```

Or manually create critical indexes:
- [ ] `event_strength_metrics_mv`: UNIQUE on event_key
- [ ] `player_performance_mart`: UNIQUE on player_id
- [ ] `player_stats_tracking_mart`: UNIQUE on player_id
- [ ] `team_analytics_mart`: UNIQUE on team_id
- [ ] `match_analytics_mart`: UNIQUE on match_id
- [ ] `league_season_performance_mart`: UNIQUE on season_id
- [ ] `tournament_performance_mart`: UNIQUE on tournament_id
- [ ] `head_to_head_matchup_mart`: UNIQUE on (team_1_id, team_2_id)
- [ ] `player_hot_streak_mart`: UNIQUE on player_id
- [ ] `team_momentum_indicators_mart`: UNIQUE on team_id
- [ ] `achievement_eligibility_mart`: UNIQUE on player_id
- [ ] `roster_value_comparison_mart`: UNIQUE on team_id
- [ ] `player_league_season_stats_mart`: UNIQUE on (player_id, season_id)

#### 3.2 Verify Index Creation
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename LIKE '%mart%'
ORDER BY tablename, indexname;
```
- [ ] All unique indexes created
- [ ] No index creation errors

---

### Phase 4: Optimization

#### 4.1 Run ANALYZE
```bash
psql -d your_database -c "
ANALYZE event_strength_metrics_mv;
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
"
```
- [ ] ANALYZE completed for all marts
- [ ] Query planner statistics updated

#### 4.2 Test Query Performance
Run sample queries from `MART_QUERY_EXAMPLES.sql`:
- [ ] Simple player lookup < 10ms
- [ ] Leaderboard query < 50ms
- [ ] Complex joins < 100ms

---

### Phase 5: Integration

#### 5.1 Update TypeScript Types (if using Supabase)
```bash
cd /Volumes/870SSD/Active\ GH\ Projects/proamrank-astro/proam-rankings
npx supabase gen types typescript --local > src/lib/db.types.ts
```
- [ ] Types generated successfully
- [ ] All marts appear in Database interface
- [ ] No TypeScript compilation errors

#### 5.2 Create Application Helpers
Example helper functions in `src/lib/marts.ts`:
```typescript
export const getPlayerPerformance = async (playerId: string) => {
  const { data } = await supabase
    .from('player_performance_mart')
    .select('*')
    .eq('player_id', playerId)
    .single();
  return data;
};
```
- [ ] Helper functions created
- [ ] Type safety verified
- [ ] Error handling added

---

## Post-Deployment Validation

### Data Quality Checks

#### Test 1: Row Count Validation
```sql
-- Run from REFRESH_ALL_MARTS.sql verification section
SELECT view_name, row_count FROM (
    SELECT 'player_performance_mart' AS view_name, COUNT(*) AS row_count FROM player_performance_mart
    -- ... etc
) ORDER BY view_name;
```
Expected results:
- [ ] player_performance_mart: ~total players
- [ ] team_analytics_mart: ~total teams
- [ ] match_analytics_mart: ~verified matches
- [ ] head_to_head_matchup_mart: ~(unique team pairs)

#### Test 2: Referential Integrity
```sql
-- Check for orphaned references
SELECT COUNT(*) FROM player_performance_mart 
WHERE current_team_id IS NOT NULL 
AND current_team_id NOT IN (SELECT id FROM teams);
```
- [ ] 0 orphaned team references
- [ ] All foreign key-like fields valid

#### Test 3: Calculation Accuracy
```sql
-- Verify win percentage calculation
SELECT team_name, wins, losses, games_played, win_percentage,
       ROUND((wins::float / NULLIF(games_played, 0) * 100)::numeric, 1) AS manual_calc
FROM team_analytics_mart
WHERE games_played > 0
LIMIT 5;
```
- [ ] win_percentage matches manual calculation
- [ ] No division by zero errors
- [ ] Percentages between 0-100

#### Test 4: Aggregation Consistency
```sql
-- Check if player totals match team totals
SELECT 
    t.team_id,
    t.avg_points_scored,
    (SELECT AVG(avg_points) FROM player_performance_mart p WHERE p.current_team_id = t.team_id) AS player_avg
FROM team_analytics_mart t
WHERE t.games_played >= 5
LIMIT 5;
```
- [ ] Team and player aggregates are reasonable
- [ ] No massive discrepancies

---

## Monitoring & Maintenance

### Set Up Automated Refresh

#### Option A: Cron Job (Linux/Mac)
```bash
# Add to crontab: Refresh every 6 hours
0 */6 * * * psql -d proam_rankings -f /path/to/REFRESH_ALL_MARTS.sql >> /var/log/mart_refresh.log 2>&1
```
- [ ] Cron job configured
- [ ] Log rotation set up
- [ ] Alerts configured for failures

#### Option B: Supabase Edge Function
Create a scheduled function that calls the refresh script:
- [ ] Edge function deployed
- [ ] Schedule configured (hourly/daily)
- [ ] Error notifications configured

#### Option C: Application Trigger
Refresh specific marts after data changes:
```typescript
// After match verification
await supabase.rpc('refresh_match_marts');
```
- [ ] Trigger functions created
- [ ] Called at appropriate times
- [ ] Performance impact acceptable

### Monitoring Queries

#### Check Last Refresh Time
```sql
-- PostgreSQL system catalog
SELECT 
    schemaname,
    matviewname,
    last_refresh
FROM pg_stat_user_tables
WHERE schemaname = 'public'
AND relname LIKE '%_mart';
```

#### Monitor Size Growth
```sql
SELECT 
    schemaname,
    tablename AS mart_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS data_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%_mart'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
- [ ] Size growth monitored
- [ ] Alerts set for unusual growth

---

## Rollback Plan

If deployment fails or causes issues:

### Quick Rollback
```sql
-- Drop all new marts
DROP MATERIALIZED VIEW IF EXISTS player_league_season_stats_mart CASCADE;
DROP MATERIALIZED VIEW IF EXISTS roster_value_comparison_mart CASCADE;
DROP MATERIALIZED VIEW IF EXISTS achievement_eligibility_mart CASCADE;
DROP MATERIALIZED VIEW IF EXISTS team_momentum_indicators_mart CASCADE;
DROP MATERIALIZED VIEW IF EXISTS player_hot_streak_mart CASCADE;
DROP MATERIALIZED VIEW IF EXISTS head_to_head_matchup_mart CASCADE;

-- Restore from backup if needed
-- pg_restore -d your_database your_backup.dump
```
- [ ] Rollback script tested
- [ ] Backup restore verified

---

## Success Criteria

Deployment is successful when:

- [x] All 13 materialized views created
- [x] All unique indexes created
- [ ] All marts contain data
- [ ] Sample queries return expected results
- [ ] Query performance meets benchmarks (see DATA_MARTS_SUMMARY.md)
- [ ] No errors in application when querying marts
- [ ] TypeScript types generated and match schema

---

## Common Issues & Solutions

### Issue: "relation does not exist"
**Cause**: Dependent view/table missing  
**Solution**: Check that `v_matches_with_primary_context` and `v_player_global_rating` exist

### Issue: "column does not exist"
**Cause**: Schema drift between SQL and actual tables  
**Solution**: Regenerate types, check recent migrations

### Issue: "UNIQUE index required for CONCURRENTLY"
**Cause**: Trying concurrent refresh without unique index  
**Solution**: Create unique index first, or remove CONCURRENTLY from refresh

### Issue: Slow refresh times
**Cause**: Large data volume, missing indexes on source tables  
**Solution**: Create indexes on frequently joined columns (match_id, player_id, team_id)

### Issue: Out of memory during creation
**Cause**: Too much data for available RAM  
**Solution**: Increase work_mem temporarily: `SET work_mem = '512MB';`

---

## Next Steps After Deployment

1. **Test in Application**
   - Update pages to use new marts
   - Verify data displays correctly
   - Check performance improvements

2. **Set Up Refresh Schedule**
   - Implement automated refresh
   - Monitor refresh duration
   - Set up failure alerts

3. **Document Custom Queries**
   - Add team-specific queries to MART_QUERY_EXAMPLES.sql
   - Document any custom business logic
   - Share with team

4. **Performance Tuning**
   - Monitor slow queries
   - Add indexes as needed
   - Optimize CTE queries if necessary

5. **Feature Development**
   - Use marts for new dashboard widgets
   - Build leaderboards
   - Create achievement notifications
   - Add matchup previews

---

## Support & Resources

- **Main Documentation**: `DATA_MARTS_SUMMARY.md`
- **Query Examples**: `MART_QUERY_EXAMPLES.sql`
- **Indexing Guide**: `MART_INDEXING_GUIDE.md`
- **Refresh Script**: `REFRESH_ALL_MARTS.sql`
- **Deployment Script**: `DEPLOY_ALL_MARTS.sql`

---

## Sign-Off

Deployed by: ________________  
Date: ________________  
Database Version: ________________  
Total Marts Deployed: _____ / 13  
Issues Encountered: ________________  
Resolution Notes: ________________  

