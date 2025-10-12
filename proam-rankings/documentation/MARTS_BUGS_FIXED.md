# Data Marts Bugs Fixed

## Summary
Fixed 5 critical bugs across 5 materialized view files to ensure correct data types and calculations.

---

## Critical Bugs Fixed ✅

### 1. Player Performance Data Mart.sql
**Issue**: Shooting percentages returned as decimals (0.45) instead of percentages (45.0)

**Lines 12-14** - FIXED:
```sql
-- BEFORE (WRONG):
AVG(ps.fgm::float / NULLIF(ps.fga, 0)) AS avg_fg_pct,
AVG(ps.three_points_made::float / NULLIF(ps.three_points_attempted, 0)) AS avg_three_pct,
AVG(ps.ftm::float / NULLIF(ps.fta, 0)) AS avg_ft_pct,

-- AFTER (CORRECT):
ROUND((AVG(ps.fgm::float / NULLIF(ps.fga, 0)) * 100)::numeric, 1) AS avg_fg_pct,
ROUND((AVG(ps.three_points_made::float / NULLIF(ps.three_points_attempted, 0)) * 100)::numeric, 1) AS avg_three_pct,
ROUND((AVG(ps.ftm::float / NULLIF(ps.fta, 0)) * 100)::numeric, 1) AS avg_ft_pct,
```

**Impact**: 
- Now returns `45.5` instead of `0.455`
- Consistent with other marts that already multiply by 100
- UI/API consumers will receive correct percentage values

---

### 2. Team Analytics Data Mart.sql
**Issue**: Team shooting percentages returned as decimals instead of percentages

**Lines 10-11** - FIXED:
```sql
-- BEFORE (WRONG):
AVG(tm.field_goals_made::float / NULLIF(tm.field_goals_attempted, 0)) AS avg_fg_pct,
AVG(tm.three_points_made::float / NULLIF(tm.three_points_attempted, 0)) AS avg_three_pct,

-- AFTER (CORRECT):
ROUND((AVG(tm.field_goals_made::float / NULLIF(tm.field_goals_attempted, 0)) * 100)::numeric, 1) AS avg_fg_pct,
ROUND((AVG(tm.three_points_made::float / NULLIF(tm.three_points_attempted, 0)) * 100)::numeric, 1) AS avg_three_pct,
```

**Impact**: 
- Now returns `48.2` instead of `0.482`
- Matches player stats format
- Consistent across all marts

---

### 3. Player League Season Stats Mart.sql
**Issue**: Using enum type `league_name` without casting to text, inconsistent with other marts

**Line 63** - FIXED:
```sql
-- BEFORE:
ls.league_name,

-- AFTER:
ls.league_name::text AS league_name,
```

**Impact**:
- Explicit type casting to text for consistency
- Prevents potential type coercion issues
- Matches pattern used in `Match Analytics Mart` (`li.league::text`)

---

### 4. Achievement Eligibility Mart.sql
**Issue**: Using enum type `league_name` without casting, inconsistent type handling

**Lines 126, 142** - FIXED:
```sql
-- BEFORE:
ls.league_name,
GROUP BY ps.player_id, m.primary_season_id, ls.league_name, ls.season_number

-- AFTER:
ls.league_name::text AS league_name,
GROUP BY ps.player_id, m.primary_season_id, ls.league_name::text, ls.season_number
```

**Impact**:
- Consistent text type for league names
- Explicit casting in both SELECT and GROUP BY
- Matches other marts

---

### 5. League Season Performance Mart.sql
**Issue**: Using enum type `league_name` without explicit casting

**Line 72** - FIXED:
```sql
-- BEFORE:
ls.league_name,

-- AFTER:
ls.league_name::text AS league_name,
```

**Impact**:
- Consistent with line 78 which already uses `li.league::text`
- All league name fields now explicitly cast to text
- Prevents enum/text type mismatches

---

## Verification

All other marts were verified correct:
- ✅ Player Hot Streak Mart.sql - All percentages multiply by 100
- ✅ Player Statistics Tracking Mart.sql - All percentages multiply by 100  
- ✅ Team Momentum Indicators Mart.sql - All percentages multiply by 100
- ✅ Tournament Performance Mart.sql - All fields exist
- ✅ Match Analytics Mart.sql - All fields exist
- ✅ Head-to-Head Matchup Mart.sql - All fields exist
- ✅ Roster Value Comparison Mart.sql - All fields exist

---

## Testing Recommendations

After deploying these fixes:

1. **Verify percentage values**:
```sql
-- Should return values between 0-100, not 0-1
SELECT avg_fg_pct, avg_three_pct, avg_ft_pct 
FROM player_performance_mart 
WHERE games_played >= 10 
LIMIT 5;

SELECT avg_fg_pct, avg_three_pct 
FROM team_analytics_mart 
WHERE games_played >= 10 
LIMIT 5;
```

2. **Verify league_name type**:
```sql
-- Should return text, not enum
SELECT pg_typeof(league_name) as type
FROM player_league_season_stats_mart
LIMIT 1;
```

3. **Compare before/after**:
- Player FG% should be ~45, not ~0.45
- Team FG% should be ~48, not ~0.48
- All league names should be text type

---

## Deployment Notes

These are **non-breaking changes** if marts are being created fresh.

If marts already exist with data:
- Need to `REFRESH MATERIALIZED VIEW` after applying SQL changes
- UI/API code expecting decimals (0.0-1.0) will need updates to handle percentages (0-100)
- Check any existing queries that might divide by 100 (now would be wrong)

---

## Files Modified

1. `Player Performance Data Mart.sql` - Lines 12-14
2. `Team Analytics Data Mart.sql` - Lines 10-11
3. `Player League Season Stats Mart.sql` - Line 63
4. `Achievement Eligibility Mart.sql` - Lines 126, 142
5. `League Season Performance Mart.sql` - Line 72

All fixes verified against actual database schema in `src/lib/db.types.ts`.

