# Global Player Rating System Implementation

This SQL implements the **documented** player rating system from `ranking-system.astro`:

```
Global Rating = Base + (Game Impact × Weight) + Event Bonus − Decay
```

## 🎯 Target Scale

- **S+ Tier (Legendary)**: 95+ 
- **S Tier (Elite)**: 90-94
- **A Tier (All-Star)**: 85-89
- **B Tier (Starter)**: 80-84
- **C Tier (Role Player)**: 75-79
- **D Tier (Bench)**: 70-74
- **Unranked**: < 70

## 📊 Rating Components

### 1. Base Rating (50-70 points)
Starting point that increases with experience:
- **No games**: 50 (below average)
- **< 5 games**: 65 (new player)
- **< 10 games**: 68 (getting established)
- **10+ games**: 70 (established baseline)

### 2. Game Impact (0-30 points)
Performance-based score using:
- Points × TS Plus (True Shooting efficiency vs league average)
- Assists × 1.5
- Rebounds × 1.25
- Steals × 2.5
- Blocks × 2.0
- Missed FGs × -1.0
- Missed FTs × -0.7
- Turnovers × -2.0

**Weighted by Event Tier:**
- T1 (Major LANs): 1.5x multiplier + 8 bonus
- T2 (Franchise Events): 1.3x multiplier + 5 bonus
- T3 (Qualifiers): 1.1x multiplier + 3 bonus
- T4 (Invitationals): 0.9x multiplier + 2 bonus
- T5 (Community): 0.7x multiplier + 1 bonus

### 3. Event Bonus (0-15 points)
Rewards participation in high-tier competitions
- Sum of tier bonuses from recent games (capped at 15)

### 4. Consistency Bonus (0-3 points)
Rewards reliable performers:
- **Very consistent** (peak within 5pts of average): +3
- **Consistent** (peak within 10pts): +2
- **Somewhat consistent** (peak within 15pts): +1
- **Inconsistent**: 0

### 5. Decay Penalty (0-15 points)
Encourages active participation:
- **≤ 30 days**: No decay
- **31-60 days**: -2 points
- **61-90 days**: -5 points
- **91-180 days**: -10 points
- **180+ days**: -15 points

## 🚀 Installation

### Step 1: Run the Migration
```bash
# Connect to your Supabase database and run:
psql -h [your-db-host] -U postgres -d postgres -f player_global_rating_implementation.sql
```

Or use Supabase SQL Editor to paste and run the entire file.

### Step 2: Initial Population
After creating all views and functions, populate all player ratings:

```sql
SELECT * FROM update_player_global_ratings();
```

This will:
- Calculate ratings for all players
- Update `performance_score` to the new global rating
- Update `salary_tier` based on rating
- Return a summary of changes

## 📋 Database Objects Created

### Tables
1. **`player_rating_weights`** - Event tier multipliers and bonuses

### Views
1. **`v_player_global_rating_per_game`** - Individual game performance with event weighting
2. **`v_player_global_rating`** - Final calculated ratings for all players

### Functions
1. **`update_player_global_ratings()`** - Batch update all player ratings
2. **`trigger_update_player_ratings()`** - Auto-update when stats verified

### Triggers
1. **`trigger_auto_update_player_rating`** - Fires on player_stats insert/update

## 🔍 Useful Queries

### View a Specific Player's Rating Breakdown
```sql
SELECT 
  gamertag,
  rating_tier,
  global_rating,
  base_rating,
  game_impact,
  event_bonus,
  consistency_bonus,
  decay_penalty,
  total_games,
  days_since_last_game
FROM v_player_global_rating 
WHERE gamertag = 'YOUR_PLAYER_NAME';
```

### Top 50 Players
```sql
SELECT 
  gamertag,
  rating_tier,
  global_rating,
  position,
  total_games
FROM v_player_global_rating 
ORDER BY global_rating DESC 
LIMIT 50;
```

### Rating Distribution
```sql
SELECT 
  rating_tier,
  COUNT(*) as player_count,
  ROUND(AVG(global_rating), 1) as avg_rating,
  ROUND(MIN(global_rating), 1) as min_rating,
  ROUND(MAX(global_rating), 1) as max_rating
FROM v_player_global_rating
GROUP BY rating_tier
ORDER BY rating_tier;
```

### Players by Tier
```sql
SELECT 
  gamertag,
  position,
  global_rating,
  total_games
FROM v_player_global_rating
WHERE rating_tier = 'S+'  -- Change to desired tier
ORDER BY global_rating DESC;
```

### Recent Rating Changes
```sql
-- Run the update and see who changed
SELECT 
  gamertag,
  old_rating,
  new_rating,
  rating_change,
  CASE 
    WHEN rating_change > 0 THEN '📈 UP'
    WHEN rating_change < 0 THEN '📉 DOWN'
    ELSE '➡️ SAME'
  END as trend
FROM update_player_global_ratings()
ORDER BY ABS(rating_change) DESC
LIMIT 50;
```

### Players Near Tier Boundaries
```sql
SELECT 
  gamertag,
  rating_tier,
  global_rating,
  CASE
    WHEN global_rating BETWEEN 93 AND 95 THEN 'Close to S+'
    WHEN global_rating BETWEEN 88 AND 90 THEN 'Close to S'
    WHEN global_rating BETWEEN 83 AND 85 THEN 'Close to A'
    WHEN global_rating BETWEEN 78 AND 80 THEN 'Close to B'
    WHEN global_rating BETWEEN 73 AND 75 THEN 'Close to C'
  END as boundary_status
FROM v_player_global_rating
WHERE global_rating BETWEEN 73 AND 95
  AND (global_rating % 5 BETWEEN 3 AND 5 OR global_rating % 5 BETWEEN 0 AND 2)
ORDER BY global_rating DESC;
```

### Inactive Players (Decay Applied)
```sql
SELECT 
  gamertag,
  global_rating,
  rating_tier,
  days_since_last_game,
  decay_penalty,
  total_games
FROM v_player_global_rating
WHERE decay_penalty > 0
ORDER BY decay_penalty DESC, global_rating DESC;
```

### Per-Game Performance History
```sql
SELECT 
  p.gamertag,
  pg.game_date,
  pg.event_tier,
  pg.points,
  pg.assists,
  pg.rebounds,
  ROUND(pg.raw_score::numeric, 1) as raw_score,
  ROUND(pg.weighted_game_impact::numeric, 1) as game_impact,
  pg.tier_bonus
FROM v_player_global_rating_per_game pg
JOIN players p ON p.id = pg.player_id
WHERE p.gamertag = 'YOUR_PLAYER_NAME'
ORDER BY pg.game_date DESC
LIMIT 20;
```

## 🔄 Maintenance

### Manual Rating Update
If you need to recalculate all ratings manually:
```sql
SELECT * FROM update_player_global_ratings();
```

### Schedule Periodic Updates
Create a cron job to update ratings daily (handles decay):
```sql
-- Using pg_cron extension
SELECT cron.schedule(
  'update-player-ratings',
  '0 2 * * *',  -- 2 AM daily
  'SELECT update_player_global_ratings();'
);
```

### Check Trigger Status
```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_update_player_rating';
```

## 🔧 Configuration

### Adjust Event Tier Weights
```sql
UPDATE player_rating_weights
SET weight_multiplier = 1.60, bonus_points = 10
WHERE event_tier = 'T1';
```

### Change Decay Settings
Edit the `rating_calculation` CTE in `v_player_global_rating` view to adjust decay thresholds.

## 📈 Impact Analysis

### Before vs After Comparison
```sql
-- Save current ratings before migration
CREATE TABLE player_ratings_backup AS
SELECT id, gamertag, performance_score as old_rating, salary_tier as old_tier
FROM players;

-- After migration, compare
SELECT 
  b.gamertag,
  b.old_rating,
  b.old_tier,
  p.performance_score as new_rating,
  p.salary_tier as new_tier,
  (p.performance_score - b.old_rating) as rating_change
FROM player_ratings_backup b
JOIN players p ON p.id = b.id
ORDER BY ABS(p.performance_score - b.old_rating) DESC
LIMIT 50;
```

## 🐛 Troubleshooting

### View Returns No Data
```sql
-- Check if player_stats exist
SELECT COUNT(*) FROM player_stats WHERE verified = TRUE;

-- Check if tournaments have tier set
SELECT COUNT(*), tier FROM tournaments GROUP BY tier;
```

### Ratings Seem Too High/Low
- Adjust the base_rating in the `rating_calculation` CTE
- Modify event tier weights in `player_rating_weights` table
- Check the scaling factor (currently dividing raw_score by 3.0)

### Trigger Not Firing
```sql
-- Test manually
INSERT INTO player_stats (player_id, match_id, points, verified)
VALUES ('some-uuid', 'some-match-uuid', 20, TRUE);

-- Check logs
SELECT * FROM pg_stat_activity WHERE query LIKE '%trigger_update_player_ratings%';
```

## 📝 Notes

1. **Only verified stats count** - Unverified player_stats are excluded
2. **Recent games matter more** - Last 20 games weighted in calculation
3. **Automatic updates** - Ratings update when stats are verified
4. **Performance optimized** - Views use CTEs and indexes for efficiency
5. **Scale consistency** - Matches documentation (0-100+ range)

## 🎯 Next Steps

After implementation:

1. ✅ Run initial population
2. ✅ Verify rating distribution makes sense
3. ✅ Update frontend to display new ratings
4. ✅ Update `ranking-system.astro` if needed
5. ✅ Set up daily cron job for decay updates
6. ✅ Monitor and tune weights/bonuses as needed

