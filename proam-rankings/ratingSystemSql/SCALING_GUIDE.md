# Player Rating Scaling Adjustment Guide

## Problem: No Players Reaching 90+

This is common on first implementation. The issue is that the **game impact** component isn't scaled high enough for elite performers.

## Current Formula
```
Game Impact = (raw_score / 3.0) × tier_multiplier, capped at 30
```

With this formula:
- **Max possible rating**: 70 (base) + 30 (game) + 15 (event) + 3 (consistency) = **118**
- **But in practice**: Top players reach ~85-88

## Why This Happens

Your top raw_score is probably around 80-100 per game:
- 100 / 3.0 = 33.3, capped at 30
- Average of 30 game impact × 20 games = 30 game impact
- 70 (base) + 30 (game) + 10 (event) + 2 (consistency) = **~82-88**

## Solution: Adjust Scaling

I've created two adjustment files:

### Option 1: Moderate (RECOMMENDED)
**File**: `adjust_scaling.sql`
```
Game Impact = (raw_score / 2.5) × tier_multiplier, capped at 35
```

**Expected Results:**
- Top players: **90-95** (S/S+ tier)
- Good players: **85-90** (A tier)
- Average players: **75-82** (B/C tier)

**When to use**: If you want a more selective S+ tier (only the absolute best)

### Option 2: Aggressive
**File**: `adjust_scaling_aggressive.sql`
```
Game Impact = (raw_score / 2.0) × tier_multiplier, capped at 40
```

**Expected Results:**
- Top players: **95-100+** (S+ tier)
- Good players: **88-95** (S tier)
- Average players: **78-85** (B/C tier)

**When to use**: If you want multiple players in S+ tier and a wider spread

## How to Apply

### Step 1: Check Current Results
```sql
-- See what the highest rating currently is
SELECT 
  gamertag,
  global_rating,
  base_rating,
  game_impact,
  event_bonus
FROM v_player_global_rating
ORDER BY global_rating DESC
LIMIT 5;
```

### Step 2: Choose Your Option

**If highest rating is 82-86**: Use Option 1 (Moderate)
**If highest rating is 78-82**: Use Option 2 (Aggressive)

### Step 3: Apply the Change

Copy the entire contents of your chosen file and paste into Supabase SQL Editor.

The file will:
1. ✅ Recreate the view with new scaling
2. ✅ Run the update function
3. ✅ Show you the top 20 players with new ratings

### Step 4: Verify Results
```sql
-- Check rating distribution
SELECT 
  rating_tier,
  COUNT(*) as players,
  ROUND(AVG(global_rating), 1) as avg_rating
FROM v_player_global_rating
WHERE total_games > 0
GROUP BY rating_tier
ORDER BY rating_tier;
```

## Ideal Distribution

You want something like:
- **S+ (95+)**: 2-5 players (~1%)
- **S (90-94)**: 5-10 players (~2-3%)
- **A (85-89)**: 15-25 players (~5-8%)
- **B (80-84)**: 30-50 players (~10-15%)
- **C (75-79)**: 50-100 players (~20-30%)
- **D (70-74)**: 50-100 players (~20-30%)
- **Unranked (<70)**: Rest

## Fine-Tuning

If the results still aren't right, you can manually adjust:

```sql
-- Custom scaling - change these numbers:
(raw_score / X) -- Smaller number = higher ratings
LEAST(Y,        -- Larger number = higher ceiling

-- Examples:
-- Very aggressive: / 1.8, LEAST(45
-- Aggressive:      / 2.0, LEAST(40
-- Moderate:        / 2.5, LEAST(35
-- Conservative:    / 3.0, LEAST(30
-- Very conservative: / 3.5, LEAST(28
```

## Alternative: Adjust Base Rating

Instead of changing game impact, you could increase the base:

```sql
-- In v_player_global_rating view, find rating_calculation CTE:
CASE
  WHEN pa.total_games = 0 THEN 50.0
  WHEN pa.total_games < 5 THEN 70.0   -- Was 65.0
  WHEN pa.total_games < 10 THEN 73.0  -- Was 68.0
  ELSE 75.0                            -- Was 70.0
END as base_rating,
```

This gives everyone +5 points, which might be simpler than rescaling.

## Recommendation

🎯 **Start with Option 1 (Moderate)** - It's a good middle ground and will get your top players to 90-95.

If after applying Option 1:
- ✅ Top player is 92-95: Perfect!
- ⚠️ Top player is 88-91: Consider Option 2
- ⚠️ Top player is 96+: Decrease scaling slightly

## Questions?

After you apply the adjustment, check:
1. What's the new highest rating?
2. How many players in S+ tier?
3. Does the distribution look reasonable?

Let me know and we can fine-tune further! 🎯

