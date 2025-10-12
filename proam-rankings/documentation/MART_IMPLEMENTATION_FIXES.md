# Mart Implementation Fixes

## Issues Reported and Fixed

### 1. Home Global Ranking Table Empty ✅ FIXED
**Issue**: The homepage ranking table was showing no teams.

**Root Cause**: The `team_analytics_mart` might not have been populated yet, or the query was filtering out all teams.

**Solution**: 
- Added fallback logic to use the `teams` table if the mart is empty or has errors
- Updated field mapping to handle both mart and teams table data structures
- File: `src/pages/index.astro`

```typescript
// Now tries mart first, falls back to teams table if needed
if (!martData || martData.length === 0 || martError) {
  // Fall back to teams table
}
```

---

### 2. Team Page Shows No Global Rank ✅ FIXED
**Issue**: Team profile pages were not displaying the global rank.

**Root Cause**: The `team_analytics_mart` doesn't include `global_rank` field, which is only in the `teams` table.

**Solution**:
- Added a separate query to fetch `global_rank` and `hybrid_score` from the `teams` table
- Merged this data with the mart data for display
- File: `src/pages/teams/[id].astro`

```typescript
// Fetch global_rank from teams table since it's not in the mart
const { data: rankData } = await supa()
  .from("teams")
  .select("global_rank, hybrid_score")
  .eq("id", id)
  .maybeSingle();
```

---

### 3. Leagues Page Not Showing League Logos ✅ FIXED
**Issue**: League listing page was not displaying league logos.

**Root Cause**: The `league_season_performance_mart` doesn't include league logos, which are stored in the `leagues_info` table.

**Solution**:
- After fetching mart data, extract all league IDs
- Query `leagues_info` table for logos
- Map logos back to league data
- File: `src/pages/leagues/index.astro`

```typescript
// Get league logos from leagues_info table
const leagueIds = Array.from(new Set(data.map(l => l.league_id).filter(Boolean)));
const { data: leagueLogos } = await supa()
  .from("leagues_info")
  .select("id, lg_logo_url")
  .in("id", leagueIds);

const logoMap = new Map(leagueLogos.map(l => [l.id, l.lg_logo_url]));
```

---

### 4. Matches Page Not Showing Verified/Under Review Badge ✅ FIXED
**Issue**: Match listings were not displaying verification status badges.

**Root Cause**: The `match_analytics_mart` only has `is_verified` (boolean) but doesn't have the `status` field that distinguishes between:
- "Under Review" (status='processed', verified=false) 
- "Unverified" (status=null, verified=null/false)

The component needs both fields to show the correct badges.

**Solution**:
- After fetching from the mart, query the original `matches` table to get `status` and `verified` fields
- Create a mapping and merge this data with the mart results
- Also added handling for the 'review' filter option
- File: `src/pages/matches/index.astro`

```typescript
// Fetch status and verified fields from original matches table
const matchIds = (matchesData ?? []).map((m: any) => m.match_id).filter(Boolean);
const { data: matchStatusData } = await supa()
  .from("matches")
  .select("id, status, verified")
  .in("id", matchIds);

const statusMap = new Map(matchStatusData.map(m => [m.id, { status: m.status, verified: m.verified }]));

// Merge with mart data
const matches = matchesData.map(m => {
  const statusInfo = statusMap.get(m.match_id);
  return {
    ...m,
    status: statusInfo?.status || null,
    verified: statusInfo?.verified || false,
    // ... other fields
  };
});
```

---

### 5. Player Stats Table Shows No Names or Stats ✅ FIXED
**Issue**: League player statistics tab was showing empty data.

**Root Cause**: Field name mismatch between `player_league_season_stats_mart` and the `LeagueTabsIsland` component:
- Mart uses: `gamertag`, `ppg`, `apg`, `rpg`, etc.
- Component expects: `player_gamertag`, `avg_points`, `avg_assists`, `avg_rebounds`, etc.

**Solution**:
- Added field mapping layer to transform mart field names to component-expected field names
- File: `src/pages/leagues/[id].astro`

```typescript
// Map mart fields to expected component fields
const fullPlayerStats = (fullPlayerStatsRaw ?? []).map((p: any) => ({
  player_id: p.player_id,
  player_gamertag: p.gamertag,  // Map gamertag -> player_gamertag
  games_played: p.games_played,
  avg_points: p.ppg,              // Map ppg -> avg_points
  avg_rebounds: p.rpg,            // Map rpg -> avg_rebounds
  avg_assists: p.apg,             // Map apg -> avg_assists
  avg_steals: p.spg,              // Map spg -> avg_steals
  avg_blocks: p.bpg,              // Map bpg -> avg_blocks
  // ... additional mappings
}));
```

---

## Key Learnings

### 1. Mart Data Availability
- Marts need to be refreshed to have data
- Always consider fallback strategies when marts might be empty
- Use `.gte("games_played", 1)` or similar filters carefully

### 2. Field Name Mapping
When using marts, you often need to map field names because:
- Marts use optimized/abbreviated field names (e.g., `ppg` instead of `avg_points`)
- Components/templates expect specific field names for backward compatibility
- Always check component TypeScript types to see what fields are expected

### 3. Missing Fields
Some fields aren't in marts because they're either:
- Computed differently (like `global_rank`, `hybrid_score`)
- Not frequently needed (like `league_logo`)
- Solution: Fetch these separately and merge with mart data

### 4. Status/Enum Fields
Pay careful attention to status/enum field values:
- Component logic may depend on specific string values
- Example: `status: 'processed'` vs `status: 'unverified'` has different UI implications

---

## Mart Field Reference

### team_analytics_mart
**Has**: `team_id`, `team_name`, `logo_url`, `elo_rating`, `current_rp`, `rp_tier`, `wins`, `losses`, `win_percentage`, `games_played`  
**Missing**: `global_rank`, `hybrid_score`  
**Fetch Missing From**: `teams` table

### league_season_performance_mart  
**Has**: `season_id`, `league_id`, `league_name`, `season_number`, `game_year`, `is_active`, `league_tier`  
**Missing**: `league_logo`, `start_date`, `end_date`  
**Fetch Missing From**: `leagues_info` table (for logos)

### player_league_season_stats_mart
**Has**: `player_id`, `gamertag`, `ppg`, `apg`, `rpg`, `spg`, `bpg`, etc.  
**Component Expects**: `player_gamertag`, `avg_points`, `avg_assists`, `avg_rebounds`, etc.  
**Solution**: Map field names in query results

### match_analytics_mart
**Has**: `match_id`, `team_a_id`, `team_b_id`, `team_a_name`, `team_b_name`, `team_a_logo`, `team_b_logo`, `is_verified`, etc.  
**Note**: Status field needs careful mapping for badge display

---

## Testing Checklist

After deploying, verify:
- ✅ Homepage shows team rankings
- ✅ Team profile pages show global rank
- ✅ Leagues page shows league logos  
- ✅ Matches page shows verified/under review badges
- ✅ League detail page shows player statistics with names

---

## Future Improvements

1. **Refresh Marts Regularly**: Set up a cron job to refresh marts every few hours
2. **Add Error Boundaries**: Handle mart query failures more gracefully
3. **Cache Supplementary Data**: Cache league logos, team ranks to reduce extra queries
4. **Consider Adding to Marts**: Frequently fetched supplementary fields could be added to marts
5. **Type Safety**: Create TypeScript types for mart responses to catch field mismatches early

---

---

### 6. Player Badges Page Now Shows Achievement Progress ✅ ENHANCED
**Previous State**: Only showed unlocked badges from `player_awards` table.

**Enhancement**: Now uses `achievement_eligibility_mart` to show:
- 🔥 **Active streaks** (win streaks, scoring streaks, etc.)
- 🎯 **Next milestone alerts** (e.g., "5 points away from 1000 career points")
- 📊 **Career milestone counts** (50-point games, triple-doubles, etc.)
- 🏆 **Total achievements earned**

**Solution**:
- Updated `/api/player-badges` to query `achievement_eligibility_mart`
- Enhanced `PlayerBadgesIsland` component to display progress data
- Added visual cards for streaks and milestone alerts
- Files: `src/pages/api/player-badges.ts`, `src/components/PlayerBadgesIsland.tsx`

```typescript
// API now returns both badges and achievement progress
const response = {
  badges: [...unlocked badges...],
  achievementProgress: {
    totalAchievementsEarned: 15,
    nextAchievementAlert: "Close to 1000 career points!",
    pointsToNextMilestone: 5,
    activeStreakType: "Game Streak",
    activeStreakLength: 10,
    count50PtGames: 3,
    countTripleDoubles: 5,
    // ... more milestone data
  }
};
```

---

## Files Modified

1. `src/pages/index.astro` - Added fallback to teams table
2. `src/pages/teams/[id].astro` - Added global_rank fetch
3. `src/pages/leagues/index.astro` - Added league logo fetch
4. `src/pages/matches/index.astro` - Fixed status field mapping
5. `src/pages/leagues/[id].astro` - Added player stats field mapping
6. `src/pages/api/player-badges.ts` - Added achievement_eligibility_mart integration
7. `src/components/PlayerBadgesIsland.tsx` - Enhanced to display achievement progress

