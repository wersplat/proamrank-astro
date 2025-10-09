# Player Global Rating System - Installation Instructions

## 🛠️ Step-by-Step Installation

The implementation has been split into separate files to make debugging easier. Run each file in order and verify it works before proceeding to the next.

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard** → SQL Editor

2. **Run Step 1** - Create Weight Table
   ```sql
   -- Copy and paste contents of: player_rating_step_by_step.sql
   ```
   ✅ Verify: Should return 5 rows showing T1-T5 tiers

3. **Run Step 2** - Create Per-Game View
   ```sql
   -- Copy and paste contents of: step_3_per_game_view.sql
   ```
   ✅ Verify: Should return game_count and player_count

4. **Run Step 3** - Create Rating View
   ```sql
   -- Copy and paste contents of: step_4_rating_view.sql
   ```
   ✅ Verify: Should return rating distribution by tier

5. **Run Step 4** - Create Functions & Trigger
   ```sql
   -- Copy and paste contents of: step_5_function_and_trigger.sql
   ```
   ✅ Verify: Should return top 10 players with updated ratings

### Method 2: Using psql Command Line

```bash
# Connect to your database
psql -h [your-db-host] -U postgres -d postgres

# Run each file in order
\i sql/player_rating_step_by_step.sql
\i sql/step_3_per_game_view.sql
\i sql/step_4_rating_view.sql
\i sql/step_5_function_and_trigger.sql
```

### Method 3: All-in-One (If no errors)

If you're confident and want to run everything at once:
```bash
psql -h [your-db-host] -U postgres -d postgres -f sql/player_global_rating_implementation.sql
```

## 🐛 Troubleshooting

### Error: "syntax error at or near..."
- **Solution**: Use the step-by-step files above
- Copy ONE file at a time into Supabase SQL Editor
- This avoids any encoding or special character issues

### Error: "relation does not exist"
- **Solution**: Make sure you ran the previous steps first
- Check that views were created: `\dv v_player_global_rating*`

### Error: "type does not exist"
- **Solution**: Make sure your database has these enums:
  ```sql
  SELECT typname FROM pg_type WHERE typname IN ('event_tier', 'salary_tier');
  ```

### Error: "column does not exist"
- **Solution**: Verify table structure:
  ```sql
  \d players
  \d player_stats
  \d tournaments
  ```

## ✅ Verification Checklist

After installation, verify everything works:

```sql
-- 1. Check weight table
SELECT * FROM player_rating_weights;
-- Should return 5 rows (T1-T5)

-- 2. Check per-game view
SELECT COUNT(*) FROM v_player_global_rating_per_game;
-- Should return number of verified player stats

-- 3. Check rating view
SELECT COUNT(*) FROM v_player_global_rating;
-- Should return number of players with games

-- 4. Check function works
SELECT COUNT(*) FROM update_player_global_ratings();
-- Should return number of updated players

-- 5. Check trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_auto_update_player_rating';
-- Should return 1 row

-- 6. View top players
SELECT gamertag, rating_tier, global_rating, total_games
FROM v_player_global_rating
ORDER BY global_rating DESC
LIMIT 20;
```

## 📊 Expected Results

After successful installation:

- **Weights Table**: 5 tiers configured
- **Per-Game View**: One row per verified player stat
- **Rating View**: One row per player with games
- **Function**: Updates all player ratings
- **Trigger**: Auto-updates on stat verification

### Rating Distribution

You should see players distributed across tiers:
- **S+ (95+)**: Elite performers (few)
- **S (90-94)**: Top tier (small percentage)
- **A (85-89)**: All-stars (5-10%)
- **B (80-84)**: Starters (10-15%)
- **C (75-79)**: Role players (20-30%)
- **D (70-74)**: Bench (20-30%)
- **Unranked (<70)**: New/inactive (remainder)

## 🔄 Next Steps

1. ✅ Verify installation with queries above
2. ✅ Review top players to ensure ratings make sense
3. ✅ Adjust weights if needed (see README)
4. ✅ Update frontend to display new ratings
5. ✅ Set up daily cron job for decay updates

## 📞 Support

If you encounter errors:

1. **Copy the exact error message**
2. **Note which step failed**
3. **Check which file caused the issue**
4. **Verify prerequisites (tables, enums exist)**

The step-by-step files make it much easier to identify where issues occur!

