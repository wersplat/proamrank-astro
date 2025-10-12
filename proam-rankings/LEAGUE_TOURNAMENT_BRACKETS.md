# Tournament Brackets Implementation

## Overview

This document describes the implementation of tournament bracket tracking and display for both standalone tournaments and league-specific tournaments (open and playoff).

## Database Structure

### Tables

#### `league_open`
Tracks open tournament information for each league season:
- `id`: UUID primary key
- `season_id`: Foreign key to `league_seasons.id` (unique)
- `open_champion`: Foreign key to team name
- `open_prize`: Prize pool for open tournament
- `status`: Tournament status (scheduled, in progress, completed, etc.)
- `start_date`: Tournament start date
- `finals_date`: Finals date
- `tier`: Event tier (T1-T5)
- `team_count`: Number of participating teams
- `hr_per_rd`: Hours per round
- `rp_value`: Ranking points value

#### `league_open_matches`
Links matches to the open tournament:
- `id`: UUID primary key
- `match_id`: Foreign key to `matches.id` (unique)
- `season_id`: Foreign key to `league_seasons.id`
- `stage`: Match stage (Finals, Semi Finals, Round 1, etc.)
- `series_number`: Order within the stage

#### `league_playoff` and `league_playoff_matches`
Same structure as league_open tables, but for playoff tournaments:
- Uses `playoff_champion` and `playoff_prize` field names

### Match Contexts Integration

Tournament matches should have corresponding entries in the `match_contexts` table:

```sql
-- Example: Adding an open tournament match to match_contexts
INSERT INTO match_contexts (match_id, league_id, season_id, is_primary)
VALUES ('match-uuid', 'league-uuid', 'season-uuid', true);

-- Link the match to the tournament
INSERT INTO league_open_matches (match_id, season_id, stage, series_number)
VALUES ('match-uuid', 'season-uuid', 'Finals', 1);
```

**Important Notes:**
- Regular season matches go to `matches` table with `season_id`
- Tournament matches (open/playoff) go to `matches` table AND get linked via `league_open_matches` or `league_playoff_matches`
- All matches should have a `match_contexts` entry with the appropriate `season_id` and `league_id`
- The `is_primary` flag in `match_contexts` determines which context is used for the primary display

### Context Types

For league matches, there are two tournament contexts (plus regular season):
1. **Regular Season**: Matches with `stage = "Regular Season"` - shown in Matches tab only
2. **Open Tournament**: Matches linked via `league_open_matches` table
3. **Playoff Tournament**: Matches linked via `league_playoff_matches` table

**Important:** Each season has exactly two tournaments:
- **Open Tournament**: Tracked in `league_open` and `league_open_matches` tables
- **Playoff Tournament**: Tracked in `league_playoff` and `league_playoff_matches` tables
- Matches are associated with tournaments via the `league_open_matches` or `league_playoff_matches` tables
- The `stage` field determines bracket structure within each tournament

## Component Architecture

### BracketDisplay Component

Location: `src/components/BracketDisplay.tsx`

A flexible, reusable bracket visualization component that automatically detects and renders different tournament formats. Used by both `TournamentTabsIsland` and `LeagueTabsIsland`.

**Supported Formats:**
- **Single Elimination**: Standard bracket tree (Finals, Semi Finals, Round 1-4)
- **Double Elimination**: Winners and Losers brackets (W1-W4, WF, L1-L5, LF, Grand Finals)
- **Swiss System**: Round-by-round listings (Round 1-4)
- **Round Robin**: Grid display of all matches

**Format Detection:**
The component analyzes the `stage` field of matches to determine format:
- Presence of "L1", "L2", etc. → Double elimination
- "Group Play" → Round robin
- "Round 1", "Round 2" pattern with many matches → Swiss
- Standard playoff stages → Single elimination

**Props:**
```typescript
{
  matches: BracketMatch[];        // Array of tournament matches
  tournamentName: string;         // Display name
  champion?: string | null;       // Champion team name
  prizePool?: number | null;      // Prize money
  status?: string | null;         // Tournament status
  startDate?: string | null;      // Start date
  finalsDate?: string | null;     // Finals date
}
```

**Features:**
- Interactive match cards with hover effects
- Color-coded winners (green) and losers (strikethrough)
- Modal for match details on click
- Responsive design with horizontal scrolling for wide brackets
- Automatic format badge display
- Champion highlighting when tournament is complete

### TournamentTabsIsland Integration

Location: `src/components/TournamentTabsIsland.tsx`

**Bracket Data Preparation:**
- Filters matches to exclude "Regular Season" (keeps only bracket matches)
- Derives `winner_id` from match scores automatically
- Assigns `series_number` based on match order
- Gets champion from standings (team with `final_placement === 1`)

**New Tab:**
- Tab ID 5: "Brackets" (inserted before Information)
- Tab ID 6: "Information" (moved from 5)
- Automatically displays bracket when playoff matches with stage data exist
- Shows helpful empty state when no bracket matches available

**Features:**
- No additional props needed - uses existing matches and standings data
- Seamless integration with existing tournament data structure
- Automatic bracket format detection based on stage values

### LeagueTabsIsland Integration

Location: `src/components/LeagueTabsIsland.tsx`

**New Props:**
```typescript
{
  openTournament?: TournamentData | null;
  playoffTournament?: TournamentData | null;
}
```

**New Tab:**
- Tab ID 5: "Brackets" (moved Information from 5 to 6)
- Toggle between "Open Tournament" and "Playoff Tournament"
- Only shows toggle buttons for tournaments that have data
- Defaults to Open Tournament if available
- Renders BracketDisplay component for selected tournament
- Each league season has exactly two possible tournaments

### League Page Data Fetching

Location: `src/pages/leagues/[id].astro`

**Data Flow:**

1. Query `league_open` table for open tournament metadata
2. Query `league_open_matches` to get match IDs and stages
3. Fetch full match details from `v_matches_with_primary_context`
4. Repeat for `league_playoff` and `league_playoff_matches`
5. Derive winner_id from scores for bracket matches
6. Combine match data with team information (logos, names)
7. Pass both tournament objects to `LeagueTabsIsland`

**Example Query Structure:**
```typescript
// 1. Get tournament metadata
const { data: openTournamentData } = await supa()
  .from("league_open")
  .select("open_champion, open_prize, status, start_date, finals_date")
  .eq("season_id", seasonId)
  .maybeSingle();

// 2. Get match associations
const { data: openMatchesData } = await supa()
  .from("league_open_matches")
  .select("match_id, stage, series_number")
  .eq("season_id", seasonId);

// 3. Get full match details
const openMatchIds = openMatchesData.map(m => m.match_id);
const { data: openMatchDetails } = await supa()
  .from("v_matches_with_primary_context")
  .select("id, played_at, team_a_id, team_b_id, score_a, score_b, winner_id")
  .in("id", openMatchIds);

// 4. Combine and enrich
const matches = openMatchDetails.map(match => ({
  ...match,
  stage: openMatchesData.find(m => m.match_id === match.id)?.stage,
  series_number: openMatchesData.find(m => m.match_id === match.id)?.series_number,
  team_a: teamMap.get(match.team_a_id),
  team_b: teamMap.get(match.team_b_id),
}));
```

## Stage Enum Values

From `db.types.ts`, the following stage values are available:

**Single Elimination:**
- "Round 1", "Round 2", "Round 3", "Round 4"
- "Semi Finals"
- "Finals"
- "Grand Finals"

**Double Elimination:**
- Winners: "W1", "W2", "W3", "W4", "WF"
- Losers: "L1", "L2", "L3", "L4", "L5", "LF"
- "Grand Finals"

**Other:**
- "Regular Season"
- "Group Play"
- "Playoffs"
- "Open"

## Usage Examples

### Creating a Tournament

```sql
-- 1. Create the open tournament
INSERT INTO league_open (season_id, status, start_date, team_count, tier)
VALUES ('season-uuid', 'scheduled', '2025-01-15', 16, 'T2');

-- 2. Add matches (assuming matches already exist in matches table)
INSERT INTO league_open_matches (match_id, season_id, stage, series_number)
VALUES 
  ('match1-uuid', 'season-uuid', 'Round 1', 1),
  ('match2-uuid', 'season-uuid', 'Round 1', 2),
  -- ... more matches
  ('finals-uuid', 'season-uuid', 'Finals', 1);

-- 3. Ensure match contexts exist
INSERT INTO match_contexts (match_id, league_id, season_id, is_primary)
SELECT id, league_id, season_id, true
FROM matches
WHERE id IN ('match1-uuid', 'match2-uuid', 'finals-uuid');
```

### Updating Tournament Status

```sql
-- Mark tournament as in progress
UPDATE league_open
SET status = 'in progress'
WHERE season_id = 'season-uuid';

-- Set champion when complete
UPDATE league_open
SET 
  status = 'completed',
  open_champion = 'Winning Team Name',
  finals_date = '2025-01-20'
WHERE season_id = 'season-uuid';
```

## User Experience

### League Page Flow

1. User navigates to a league season page
2. Regular season standings and matches display in default tabs
3. "Brackets" tab appears if open or playoff tournaments exist
4. User clicks "Brackets" tab
5. Toggle buttons appear if both tournaments exist
6. Selected tournament bracket displays automatically
7. Bracket format is detected and rendered appropriately
8. User can click matches to see detailed information
9. Champion is highlighted if tournament is complete

### Visual Indicators

- **Format Badge**: Color-coded badge showing tournament type
- **Status Badge**: Shows if tournament is scheduled/in progress/completed
- **Winner Highlighting**: Green text/checkmark for winning teams
- **Loser Indication**: Strikethrough text for eliminated teams
- **TBD Display**: Shows "TBD" for unscheduled matchups
- **Champion Display**: Trophy icon and highlight for tournament winner

## Maintenance

### Adding New Stage Types

If new stage types are added to the database:

1. Update the `stage` enum in Supabase
2. Regenerate `db.types.ts` using Supabase CLI
3. Update stage arrays in `BracketDisplay.tsx`:
   - `SINGLE_ELIM_STAGES`
   - `WINNERS_STAGES`
   - `LOSERS_STAGES`
   - `SWISS_STAGES`
4. Update `detectFormat()` logic if needed

### Common Issues

**Bracket not showing:**
- Verify `league_open` or `league_playoff` entry exists for the season
- Check that `league_open_matches`/`league_playoff_matches` have entries
- Ensure `match_id` values are valid UUIDs that exist in `matches` table
- Confirm team data (names, logos) is available

**Wrong format detected:**
- Review the `stage` values in `league_open_matches`
- Ensure stages follow standard naming (e.g., "Semi Finals" not "Semifinals")
- Check that series_number is set correctly for ordering

**Matches not displaying correctly:**
- Verify `winner_id` is set on completed matches
- Check that `score_a` and `score_b` are populated
- Ensure `played_at` dates are accurate
- Confirm team_a_id and team_b_id reference valid teams

## Future Enhancements

Potential improvements to consider:

1. **Real-time Updates**: WebSocket integration for live bracket updates
2. **Bracket Generation**: Admin tool to automatically create bracket matches
3. **Seeding Display**: Show team seeds in bracket
4. **Bracket Prediction**: Allow users to fill out brackets before tournament
5. **Historical Brackets**: Archive and display past tournament brackets
6. **Mobile Optimization**: Enhanced mobile bracket navigation
7. **SVG Connectors**: Draw bracket lines between rounds
8. **Bracket Export**: Download bracket as image or PDF
9. **Match Streaming**: Embed live streams for active matches
10. **Statistics Overlay**: Show team stats when hovering over matchups

## Related Documentation

- [Match Contexts Migration](./MATCH_CONTEXTS_MIGRATION.md)
- [Type Generation Guide](./TYPE_GENERATION_GUIDE.md)
- [Database Schema](./supabase/)

