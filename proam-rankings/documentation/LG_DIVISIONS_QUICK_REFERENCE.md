# League Divisions Quick Reference

## Common Queries

### 1. Create a Division

```sql
INSERT INTO lg_divisions (
    name, 
    abbr, 
    conference_id, 
    season_id, 
    league_id, 
    display_order
)
VALUES (
    'Eastern Division',
    'EAST',
    '12345678-1234-1234-1234-123456789abc',  -- conference_id (optional)
    '87654321-4321-4321-4321-cba987654321',  -- season_id (required)
    'abcdef12-3456-7890-abcd-ef1234567890',  -- league_id (required)
    1                                         -- display_order
)
RETURNING id;
```

### 2. List All Divisions for a Season

```sql
SELECT 
    ld.id,
    ld.name,
    ld.abbr,
    ld.display_order,
    lgc.name AS conference_name,
    COUNT(tr.id) AS team_count
FROM lg_divisions ld
LEFT JOIN lg_conf lgc ON ld.conference_id = lgc.id
LEFT JOIN team_rosters tr ON ld.id = tr.division_id
WHERE ld.season_id = 'your-season-id'
GROUP BY ld.id, ld.name, ld.abbr, ld.display_order, lgc.name
ORDER BY ld.display_order;
```

### 3. Assign Teams to a Division

```sql
-- Assign specific teams
UPDATE team_rosters
SET division_id = 'division-uuid-here'
WHERE team_id IN (
    'team-1-uuid',
    'team-2-uuid',
    'team-3-uuid'
)
AND season_id = 'season-uuid-here';
```

```sql
-- Assign teams based on conference (if needed)
UPDATE team_rosters tr
SET division_id = (
    SELECT ld.id 
    FROM lg_divisions ld
    WHERE ld.name = 'Eastern Division'
    AND ld.season_id = tr.season_id
)
WHERE tr.season_id = 'season-uuid-here'
AND EXISTS (
    SELECT 1 FROM teams t 
    WHERE t.id = tr.team_id 
    AND t.lg_conf = 'some-conference-id'
);
```

### 4. Get Division Standings

```sql
-- Simple standings
SELECT 
    division_rank,
    team_name,
    wins,
    losses,
    win_percentage,
    last_5_streak
FROM league_division_standings
WHERE season_id = 'season-uuid'
    AND division_name = 'Eastern Division'
ORDER BY division_rank;
```

```sql
-- Detailed standings with point differential
SELECT 
    division_rank,
    team_name,
    wins || '-' || losses AS record,
    ROUND((win_percentage * 100)::numeric, 1) || '%' AS win_pct,
    points_for,
    points_against,
    point_differential_per_game AS diff_per_game,
    last_5_streak
FROM league_division_standings
WHERE season_id = 'season-uuid'
ORDER BY division_display_order, division_rank;
```

### 5. Division Leaders (Top Teams per Division)

```sql
-- Get top team from each division
SELECT DISTINCT ON (division_id)
    division_name,
    team_name,
    wins,
    losses,
    win_percentage
FROM league_division_standings
WHERE season_id = 'season-uuid'
ORDER BY division_id, division_rank;
```

### 6. Player Stats by Division

```sql
-- Top scorers in a division
SELECT 
    gamertag,
    season_team_name,
    ppg,
    apg,
    rpg,
    games_played
FROM player_league_season_stats_mart
WHERE season_id = 'season-uuid'
    AND division_name = 'Eastern Division'
    AND games_played >= 5
ORDER BY ppg DESC
LIMIT 10;
```

### 7. Compare Division Strengths

```sql
-- Average team performance by division
SELECT 
    division_name,
    COUNT(*) AS team_count,
    ROUND(AVG(win_percentage)::numeric, 3) AS avg_win_pct,
    ROUND(AVG(points_for)::numeric, 1) AS avg_points_for,
    ROUND(AVG(points_against)::numeric, 1) AS avg_points_against
FROM league_division_standings
WHERE season_id = 'season-uuid'
GROUP BY division_name, division_display_order
ORDER BY division_display_order;
```

### 8. Teams Without Division Assignment

```sql
-- Find teams in a season that haven't been assigned to a division
SELECT 
    t.name AS team_name,
    tr.season_id,
    ls.league_name,
    ls.season_number
FROM team_rosters tr
JOIN teams t ON tr.team_id = t.id
JOIN league_seasons ls ON tr.season_id = ls.id
WHERE tr.division_id IS NULL
    AND tr.season_id IS NOT NULL
    AND tr.left_at IS NULL
ORDER BY ls.league_name, t.name;
```

### 9. Division History for a Team

```sql
-- See all division assignments for a team across seasons
SELECT 
    ls.league_name,
    ls.season_number,
    ls.year,
    ld.name AS division_name,
    tr.joined_at,
    tr.left_at
FROM team_rosters tr
JOIN league_seasons ls ON tr.season_id = ls.id
LEFT JOIN lg_divisions ld ON tr.division_id = ld.id
WHERE tr.team_id = 'team-uuid'
    AND tr.season_id IS NOT NULL
ORDER BY ls.year DESC, ls.season_number DESC, tr.joined_at DESC;
```

### 10. Season Overview with Division Stats

```sql
-- Get complete season overview including division info
SELECT 
    ls.league_name,
    ls.season_number,
    ls.year,
    lspm.total_matches,
    lspm.total_unique_teams,
    lspm.total_divisions,
    lspm.division_stats
FROM league_seasons ls
JOIN league_season_performance_mart lspm ON ls.id = lspm.season_id
WHERE ls.id = 'season-uuid';
```

## TypeScript/Frontend Usage

### 1. Fetch Division Standings

```typescript
import { supa } from '@/lib/supabase';

// Get division standings
const { data: standings } = await supa(runtime)
  .from('league_division_standings')
  .select('*')
  .eq('season_id', seasonId)
  .eq('division_name', 'Eastern Division')
  .order('division_rank');
```

### 2. Fetch Team with Division Info

```typescript
const { data: team } = await supa(runtime)
  .from('team_analytics_mart')
  .select('team_name, division_name, division_abbr, wins, losses')
  .eq('team_id', teamId)
  .single();
```

### 3. Fetch Player Stats with Division Context

```typescript
const { data: playerStats } = await supa(runtime)
  .from('player_league_season_stats_mart')
  .select('gamertag, season_team_name, division_name, ppg, apg, rpg')
  .eq('season_id', seasonId)
  .not('division_id', 'is', null)
  .order('ppg', { ascending: false })
  .limit(20);
```

### 4. Get Divisions for a Season

```typescript
const { data: divisions } = await supa(runtime)
  .from('lg_divisions')
  .select('id, name, abbr, display_order')
  .eq('season_id', seasonId)
  .order('display_order');
```

### 5. Division Dropdown Component

```typescript
interface Division {
  id: string;
  name: string;
  abbr: string;
}

async function getDivisions(seasonId: string): Promise<Division[]> {
  const { data } = await supa(runtime)
    .from('lg_divisions')
    .select('id, name, abbr')
    .eq('season_id', seasonId)
    .order('display_order');
  
  return data || [];
}
```

## Migration Commands

### Apply Migration

```bash
# Using psql
psql -d your_database -f migrations/add_lg_divisions_table.sql

# Or using Supabase CLI
supabase db push
```

### Create View

```bash
psql -d your_database -f views/league_division_standings.sql
```

### Refresh Marts

```bash
# Refresh all division-related marts
psql -d your_database -f migrations/refresh_marts_after_divisions.sql

# Or manually
psql -d your_database -c "
REFRESH MATERIALIZED VIEW player_league_season_stats_mart;
REFRESH MATERIALIZED VIEW team_analytics_mart;
REFRESH MATERIALIZED VIEW league_season_performance_mart;
"
```

### Regenerate Types

```bash
# Remote database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts

# Local database
npx supabase gen types typescript --local > src/lib/db.types.ts
```

## Common Patterns

### Pattern 1: Two-Division Setup (East/West)

```sql
-- Create both divisions
WITH season_info AS (
    SELECT id as season_id, league_id 
    FROM league_seasons 
    WHERE league_name = 'YourLeague' AND season_number = 1
)
INSERT INTO lg_divisions (name, abbr, season_id, league_id, display_order)
SELECT 'Eastern Division', 'EAST', season_id, league_id, 1 FROM season_info
UNION ALL
SELECT 'Western Division', 'WEST', season_id, league_id, 2 FROM season_info;
```

### Pattern 2: Auto-Assign by Conference

```sql
-- Assign divisions based on existing conference
UPDATE team_rosters tr
SET division_id = (
    SELECT ld.id 
    FROM lg_divisions ld
    JOIN teams t ON t.lg_conf = ld.conference_id
    WHERE t.id = tr.team_id
    AND ld.season_id = tr.season_id
    LIMIT 1
)
WHERE tr.season_id = 'season-uuid'
AND tr.left_at IS NULL;
```

### Pattern 3: Balanced Division Assignment

```sql
-- Assign teams to divisions in a balanced way (alternating)
WITH ranked_teams AS (
    SELECT 
        tr.id,
        tr.team_id,
        ROW_NUMBER() OVER (ORDER BY t.name) as rn
    FROM team_rosters tr
    JOIN teams t ON tr.team_id = t.id
    WHERE tr.season_id = 'season-uuid'
    AND tr.division_id IS NULL
),
divisions AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) as div_num
    FROM lg_divisions
    WHERE season_id = 'season-uuid'
)
UPDATE team_rosters tr
SET division_id = d.id
FROM ranked_teams rt
JOIN divisions d ON (rt.rn % 2) + 1 = d.div_num
WHERE tr.id = rt.id;
```

## Validation Queries

### Check Division Setup

```sql
-- Verify divisions are properly configured
SELECT 
    ls.league_name,
    ls.season_number,
    ld.name AS division_name,
    ld.abbr,
    COUNT(tr.id) AS teams_assigned
FROM lg_divisions ld
JOIN league_seasons ls ON ld.season_id = ls.id
LEFT JOIN team_rosters tr ON ld.id = tr.division_id AND tr.left_at IS NULL
GROUP BY ls.league_name, ls.season_number, ld.name, ld.abbr, ld.display_order
ORDER BY ls.league_name, ls.season_number, ld.display_order;
```

### Check for Unassigned Teams

```sql
-- Teams that should have divisions but don't
SELECT COUNT(*)
FROM team_rosters tr
JOIN league_seasons ls ON tr.season_id = ls.id
WHERE tr.division_id IS NULL
AND tr.left_at IS NULL
AND EXISTS (
    SELECT 1 FROM lg_divisions 
    WHERE season_id = tr.season_id
);
```

## Notes

- All division references are **nullable** and use **LEFT JOINs** for backward compatibility
- Division names must be **unique per season** (enforced by constraint)
- Use **display_order** to control how divisions are sorted in UI
- The **division_stats** field in `league_season_performance_mart` is a JSON array
- Deleting a division sets `division_id` to NULL in `team_rosters` (preserves history)

