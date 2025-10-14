# League Divisions Implementation Guide

## Overview

The `lg_divisions` table has been added to support division-based organization within league conferences. This allows leagues to subdivide conferences into competitive divisions (e.g., Eastern/Western divisions) with proper tracking and standings.

## Database Changes

### 1. New Table: `lg_divisions`

Located in: `/migrations/add_lg_divisions_table.sql`

**Schema:**
```sql
CREATE TABLE public.lg_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    abbr TEXT,
    division_logo TEXT,
    conference_id UUID REFERENCES lg_conf(id) ON DELETE SET NULL,
    season_id UUID REFERENCES league_seasons(id) ON DELETE CASCADE,
    league_id UUID REFERENCES leagues_info(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_division_per_season UNIQUE (season_id, name)
);
```

**Key Features:**
- Divisions are scoped to a specific season (prevents duplicate division names per season)
- Optional parent conference relationship
- Display order for proper sorting
- Cascade deletes when season is removed, but preserves history if conference is removed

**Indexes:**
- `idx_lg_divisions_conference_id` - For conference lookups
- `idx_lg_divisions_season_id` - For season-based queries
- `idx_lg_divisions_league_id` - For league-based queries
- `idx_lg_divisions_display_order` - For ordered display

### 2. Modified Table: `team_rosters`

**New Column:**
- `division_id` (UUID, nullable) - References `lg_divisions.id`

**Foreign Key:**
- ON DELETE SET NULL (preserves history when divisions are removed)

**Index:**
- `idx_team_rosters_division_id` - For division-based queries

## Updated Data Marts

### 1. Player League Season Stats Mart

**New Fields:**
- `division_id` - UUID of player's team division
- `division_name` - Full division name
- `division_abbr` - Division abbreviation

**Changes:**
- Added LEFT JOIN to `lg_divisions` through `team_rosters`
- Divisions are optional (null-safe)

### 2. Team Analytics Data Mart

**New Fields:**
- `division_id` - Current division for the team
- `division_name` - Full division name
- `division_abbr` - Division abbreviation
- `division_season_id` - Season the division assignment is for

**Changes:**
- Added `current_division_context` CTE
- Gets most recent division assignment from active rosters
- Uses DISTINCT ON to get one division per team

### 3. League Season Performance Mart

**New Fields:**
- `total_divisions` - Count of divisions in the season
- `division_stats` - JSON aggregate with division-level statistics

**Division Stats Structure:**
```json
[
  {
    "division_id": "uuid",
    "division_name": "Eastern Division",
    "teams_in_division": 8,
    "division_total_games": 120,
    "division_avg_win_pct": 0.500
  }
]
```

**Changes:**
- Added `season_division_stats` CTE
- Tracks division-level aggregations
- Includes team counts, games played, and average win percentage

## New Views

### `league_division_standings`

Located in: `/views/league_division_standings.sql`

Provides comprehensive division standings with:
- Team records (W-L, win %, points for/against)
- Division rank and overall rank
- Point differential per game
- Last 5 game streak (e.g., "WWLWL")
- Conference and league context

**Example Query:**
```sql
-- Get current season standings for a specific division
SELECT 
    team_name,
    wins,
    losses,
    win_percentage,
    division_rank,
    last_5_streak
FROM league_division_standings
WHERE season_id = 'your-season-id'
    AND division_name = 'Eastern Division'
ORDER BY division_rank;
```

**Useful Columns:**
- `division_rank` - Rank within the division
- `overall_rank` - Rank across all divisions in the season
- `last_5_streak` - String like "WWLWL" showing recent performance

## Usage Examples

### 1. Creating a Division

```sql
INSERT INTO lg_divisions (name, abbr, conference_id, season_id, league_id, display_order)
VALUES (
    'Eastern Division',
    'EAST',
    'conference-uuid-here',
    'season-uuid-here',
    'league-uuid-here',
    1
);
```

### 2. Assigning Teams to Divisions

```sql
-- Update existing team_rosters entries
UPDATE team_rosters
SET division_id = 'division-uuid-here'
WHERE team_id = 'team-uuid-here'
    AND season_id = 'season-uuid-here';
```

### 3. Querying Division Standings

```sql
-- Get all teams in a division with their records
SELECT 
    team_name,
    wins,
    losses,
    win_percentage,
    division_rank
FROM league_division_standings
WHERE division_id = 'division-uuid-here'
ORDER BY division_rank;
```

### 4. Querying Player Stats by Division

```sql
-- Get top scorers in a specific division
SELECT 
    gamertag,
    season_team_name,
    division_name,
    ppg,
    games_played
FROM player_league_season_stats_mart
WHERE season_id = 'season-uuid-here'
    AND division_id = 'division-uuid-here'
ORDER BY ppg DESC
LIMIT 10;
```

### 5. Team Division Info

```sql
-- Get team's current division assignment
SELECT 
    team_name,
    division_name,
    division_abbr,
    division_season_id
FROM team_analytics_mart
WHERE team_id = 'team-uuid-here';
```

## Backward Compatibility

All changes maintain backward compatibility:

1. **Nullable Fields** - `division_id` is nullable everywhere
2. **LEFT JOINs** - All division joins use LEFT JOIN
3. **Existing Queries** - Queries without division filters continue working
4. **Data Preservation** - ON DELETE SET NULL preserves historical data

Teams without division assignments will have NULL values for division fields.

## Migration Steps

### Step 1: Run the Migration

```bash
# Apply the migration to your database
psql -d your_database -f migrations/add_lg_divisions_table.sql
```

### Step 2: Create the Division Standings View

```bash
# Create the new view
psql -d your_database -f views/league_division_standings.sql
```

### Step 3: Refresh Materialized Views

```bash
# Refresh all affected marts
psql -d your_database -c "REFRESH MATERIALIZED VIEW player_league_season_stats_mart;"
psql -d your_database -c "REFRESH MATERIALIZED VIEW team_analytics_mart;"
psql -d your_database -c "REFRESH MATERIALIZED VIEW league_season_performance_mart;"
```

Or use the refresh all script:
```bash
psql -d your_database -f marts/REFRESH_ALL_MARTS.sql
```

### Step 4: Regenerate TypeScript Types

```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts
```

Or if using local Supabase:
```bash
npx supabase gen types typescript --local > src/lib/db.types.ts
```

### Step 5: Populate Division Data (Optional)

```sql
-- Example: Create divisions for a season
INSERT INTO lg_divisions (name, abbr, season_id, league_id, display_order)
VALUES 
    ('Eastern Division', 'EAST', 'season-id', 'league-id', 1),
    ('Western Division', 'WEST', 'season-id', 'league-id', 2);

-- Assign teams to divisions
UPDATE team_rosters tr
SET division_id = (
    SELECT id FROM lg_divisions 
    WHERE name = 'Eastern Division' 
    AND season_id = tr.season_id
)
WHERE team_id IN ('team-1-id', 'team-2-id', ...)
    AND season_id = 'season-id';
```

## Performance Considerations

1. **Indexes** - All foreign keys are properly indexed
2. **Materialized Views** - Use REFRESH to update division stats
3. **Query Optimization** - Division filters benefit from indexes
4. **View Performance** - `league_division_standings` is a regular view (not materialized)

## Security Considerations

Row Level Security (RLS) policies are not defined in the migration. Add appropriate policies based on your security requirements:

```sql
-- Example RLS policy (adjust as needed)
ALTER TABLE lg_divisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for lg_divisions" 
ON lg_divisions FOR SELECT 
USING (true);

CREATE POLICY "Admin write access for lg_divisions"
ON lg_divisions FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

## Troubleshooting

### Issue: Materialized views fail to refresh

**Solution:** Ensure all base tables have data and foreign keys are valid:
```sql
-- Check for orphaned division_id references
SELECT COUNT(*) FROM team_rosters 
WHERE division_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM lg_divisions WHERE id = team_rosters.division_id);
```

### Issue: Division stats showing NULL

**Solution:** Ensure divisions are created and teams are assigned:
```sql
-- Verify division assignments
SELECT d.name, COUNT(tr.id) as team_count
FROM lg_divisions d
LEFT JOIN team_rosters tr ON d.id = tr.division_id
GROUP BY d.id, d.name;
```

### Issue: TypeScript type errors after migration

**Solution:** Regenerate types and restart TypeScript server:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts
# In VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

## Future Enhancements

Potential additions for future iterations:

1. **Division Playoffs** - Track division winners and playoff seeding
2. **Inter-Division Records** - Stats for games between divisions
3. **Division Strength Metrics** - Power rankings by division
4. **Historical Division Changes** - Track team movement between divisions
5. **Division Badges** - Display division champions on team pages

## Related Documentation

- [Mart Architecture](./MART_ARCHITECTURE.md)
- [Mart Implementation Guide](./MART_IMPLEMENTATION_CHECKLIST.md)
- [Type Generation Guide](./TYPE_GENERATION_GUIDE.md)
- [Quick Start: Marts](./QUICK_START_MARTS.md)

