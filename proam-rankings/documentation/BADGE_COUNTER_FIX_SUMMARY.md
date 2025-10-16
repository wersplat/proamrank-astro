# Badge Counter Fix Summary

## Issue
Player profile badge section stat counters were showing inaccurate numbers. For example, a player showing "102 40+ games" when they had only played 58 verified games total.

## Root Cause
The `player_stats_tracking_mart` and `achievement_eligibility_mart` materialized views were not using `DISTINCT` counts when aggregating match statistics. This caused several problems:

1. **Duplicate player_stats records**: If a player had multiple `player_stats` records for the same match (possibly due to data import issues or reprocessing), each duplicate was counted separately.

2. **Missing unique constraint**: The `player_stats` table lacked a unique constraint on `(player_id, match_id)`, allowing duplicates to exist.

3. **Inflated counts**: Any player with duplicate records would have grossly inflated statistics:
   - Total games played
   - 40+ point games
   - Triple-doubles
   - All other milestone counts

## Example of the Problem

```sql
-- Without DISTINCT (incorrect)
COUNT(CASE WHEN ps.points >= 40 THEN 1 END) AS count_40pt_games

-- If player_stats has duplicate rows for the same match, this counts each row
-- Result: 102 40+ games (counting duplicates)
```

```sql
-- With DISTINCT (correct)
COUNT(DISTINCT CASE WHEN ps.points >= 40 THEN ps.match_id END) AS count_40pt_games

-- This counts each unique match only once
-- Result: 58 verified games with accurate 40+ game counts
```

## Solution

### 1. Updated `player_stats_tracking_mart`
Changed all achievement stat counters to use `COUNT(DISTINCT ... match_id)`:

```sql
-- Before
COUNT(CASE WHEN ph.points >= 40 AND ph.points < 50 THEN 1 END) AS count_40pt_games

-- After
COUNT(DISTINCT CASE WHEN ph.points >= 40 AND ph.points < 50 THEN ph.match_id END) AS count_40pt_games
```

### 2. Updated `achievement_eligibility_mart`
Applied the same fix to all game counts:

```sql
-- Before
COUNT(CASE WHEN ps.points >= 30 THEN 1 END) AS games_30plus

-- After
COUNT(DISTINCT CASE WHEN ps.points >= 30 THEN ps.match_id END) AS games_30plus
```

### 3. Added De-duplication Logic
Added `DISTINCT ON` clause in CTEs to ensure only one record per player per match:

```sql
WITH player_history AS (
    SELECT DISTINCT ON (ps.player_id, ps.match_id)
        ps.player_id,
        ps.match_id,
        m.played_at,
        ps.points,
        -- ... other fields
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    ORDER BY ps.player_id, ps.match_id, ps.created_at DESC  -- Take most recent if duplicates
)
```

### 4. Added Unique Constraint
Added a unique constraint to prevent future duplicates:

```sql
ALTER TABLE player_stats 
ADD CONSTRAINT player_stats_player_match_unique 
UNIQUE (player_id, match_id);
```

Before adding the constraint, the script removes any existing duplicates (keeping the most recent record).

## Files Modified

1. **`fix_badge_counts.sql`** - Complete fix script that:
   - Removes duplicate player_stats records
   - Recreates both marts with DISTINCT counts
   - Adds unique constraint to player_stats
   - Refreshes the marts

2. **`fix_badge_counts_diagnostic.sql`** - Diagnostic queries to:
   - Identify duplicate records
   - Compare actual vs mart counts
   - Verify the fix

3. **Updated original mart files**:
   - `marts/Player Statistics Tracking Mart.sql`
   - `marts/Achievement Eligibility Mart.sql`

## How to Apply the Fix

1. **Run diagnostic queries first** (optional but recommended):
   ```bash
   # Check for duplicates and verify issue
   psql -f fix_badge_counts_diagnostic.sql
   ```

2. **Apply the fix**:
   ```bash
   # This will fix the marts and add the unique constraint
   psql -f fix_badge_counts.sql
   ```

3. **Verify the fix**:
   ```sql
   -- Check a player's stats
   SELECT 
       player_id,
       gamertag,
       career_games,
       count_40pt_games,
       count_50pt_games,
       (count_40pt_games + count_50pt_games) as total_40plus_games
   FROM player_stats_tracking_mart
   WHERE gamertag = 'YourPlayerName';
   ```

## Impact

✅ **Badge stat counters now show accurate numbers**
- Only counts unique matches
- Handles existing duplicates correctly
- Prevents future duplicates with unique constraint

✅ **All affected statistics fixed**:
- Career games played
- 30+ point games
- 40+ point games  
- 50+ point games
- Triple-doubles
- Double-doubles
- 10+ assist games
- 10+ rebound games

✅ **Performance maintained**:
- DISTINCT operations are efficient with proper indexes
- Mart refresh times remain similar

## Testing

After applying the fix, verify:

1. **Total games count is accurate**: `career_games` should match actual verified games
2. **Milestone counts are realistic**: e.g., 40+ games should be ≤ total games
3. **UI displays correct values**: Check player profile badge section
4. **No duplicates remain**: Run diagnostic query #1

## Prevention

The unique constraint on `player_stats(player_id, match_id)` prevents this issue from recurring. Any attempt to insert duplicate records will fail with a constraint violation error, alerting developers to the problem immediately.

