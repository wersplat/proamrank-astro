# Fix Badge Counter Issue

## Quick Summary
Player badge stat counters were showing inflated numbers (e.g., 102 40+ games when player only has 58 verified games) due to duplicate player_stats records being counted multiple times.

## What Was Fixed

1. **Updated `player_stats_tracking_mart`** - Now uses `DISTINCT` counts on `match_id` to avoid counting duplicates
2. **Updated `achievement_eligibility_mart`** - Same fix applied to all game counts
3. **Added unique constraint** - Prevents future duplicate records in `player_stats` table
4. **Updated source mart files** - Both original mart SQL files now have the fix permanently

## How to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `fix_badge_counts.sql`
4. Run the script
5. Wait for the materialized views to refresh (may take a few minutes)

### Option 2: Using Local psql
```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the fix script
\i fix_badge_counts.sql
```

### Option 3: Manual Steps (if you want to understand what's happening)

1. **Check for duplicates first** (optional):
   ```bash
   # Run diagnostic queries
   \i fix_badge_counts_diagnostic.sql
   ```

2. **Apply the fix**:
   - Removes duplicate player_stats records (keeping most recent)
   - Recreates both marts with DISTINCT counts
   - Adds unique constraint
   - Refreshes the marts

## Files Included

- **`fix_badge_counts.sql`** - Complete fix script (run this)
- **`fix_badge_counts_diagnostic.sql`** - Diagnostic queries to investigate the issue
- **`documentation/BADGE_COUNTER_FIX_SUMMARY.md`** - Detailed technical explanation

## Verification

After running the fix, verify the results:

```sql
-- Check a player's stats look reasonable now
SELECT 
    player_id,
    gamertag,
    career_games,
    count_40pt_games,
    count_50pt_games,
    (count_40pt_games + count_50pt_games) as total_40plus_games
FROM player_stats_tracking_mart
WHERE gamertag ILIKE '%YourPlayerName%';

-- Ensure 40+ games is less than or equal to total games
SELECT 
    gamertag,
    career_games,
    (count_40pt_games + count_50pt_games) as total_40plus_games,
    CASE 
        WHEN (count_40pt_games + count_50pt_games) > career_games 
        THEN '❌ INVALID' 
        ELSE '✅ VALID' 
    END as status
FROM player_stats_tracking_mart
WHERE career_games > 0
ORDER BY (count_40pt_games + count_50pt_games) DESC
LIMIT 20;
```

## Expected Results

✅ Badge stat counters now show accurate numbers  
✅ Total 40+ games ≤ total verified games  
✅ All milestone counts are realistic  
✅ No duplicate player_stats records remain  
✅ Future duplicates are prevented by unique constraint  

## Time to Complete

- Script execution: ~2-5 minutes (depending on database size)
- Materialized view refresh: ~1-3 minutes
- Total: ~5-10 minutes

## Rollback (if needed)

If something goes wrong, you can recreate the marts from the original files:

```bash
# Recreate using the original (now fixed) mart files
\i "marts/Player Statistics Tracking Mart.sql"
\i "marts/Achievement Eligibility Mart.sql"
```

The original files have been updated with the fix, so they're safe to use.

## Questions?

See the detailed technical explanation in:
`documentation/BADGE_COUNTER_FIX_SUMMARY.md`

