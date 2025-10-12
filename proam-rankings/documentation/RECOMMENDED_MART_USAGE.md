# Recommended Mart Usage for ProAm Rankings Application

## Page-by-Page Mart Recommendations

This guide maps your application pages to the optimal data marts to use.

---

## Homepage (`src/pages/index.astro`)

### Current State
Likely querying multiple tables with complex joins

### Recommended Marts
1. **Recent matches widget**: `match_analytics_mart`
2. **Top players**: `player_performance_mart`
3. **Hot teams**: `team_momentum_indicators_mart`
4. **Upcoming events**: `league_season_performance_mart` + `tournament_performance_mart`

### Example Code
```typescript
// Recent matches
const { data: recentMatches } = await supabase
  .from('match_analytics_mart')
  .select('team_a_name, score_a, score_b, team_b_name, winner_name, played_at, tournament_name')
  .order('played_at', { ascending: false })
  .limit(10);

// Featured hot players
const { data: hotPlayers } = await supabase
  .from('player_hot_streak_mart')
  .select('gamertag, current_team, form_trend, last_5_avg_points')
  .in('form_trend', ['Heating Up', 'Hot'])
  .limit(5);

// Active leagues
const { data: activeLeagues } = await supabase
  .from('league_season_performance_mart')
  .select('league_name, season_number, total_matches, last_match_date')
  .eq('is_active', true);
```

---

## Players Page (`src/pages/players/index.astro`)

### Current State
Listing all players with stats

### Recommended Mart
**Primary**: `player_performance_mart`

### Filters to Add
- Position dropdown
- Minimum games filter
- Sort by: Points, Assists, Rebounds, Rating

### Example Code
```typescript
const { data: players } = await supabase
  .from('player_performance_mart')
  .select(`
    player_id,
    gamertag,
    position,
    team_name,
    global_rating,
    rating_tier,
    games_played,
    avg_points,
    avg_assists,
    avg_rebounds
  `)
  .gte('games_played', 10)
  .order('global_rating', { ascending: false })
  .limit(100);
```

---

## Player Profile (`src/pages/players/[id].astro`)

### Current State
Complex joins across player_stats, matches, teams

### Recommended Marts
1. **Overview tab**: `player_performance_mart` + `player_stats_tracking_mart`
2. **Career tab**: `player_stats_tracking_mart`
3. **Games tab**: `match_analytics_mart` (filter by player via player_stats)
4. **Badges tab**: `achievement_eligibility_mart`

### Example Code
```typescript
// Overview data
const { data: playerOverview } = await supabase
  .from('player_performance_mart')
  .select('*')
  .eq('player_id', playerId)
  .single();

// Career milestones
const { data: careerStats } = await supabase
  .from('player_stats_tracking_mart')
  .select(`
    career_points,
    career_high_points,
    count_triple_doubles,
    count_50pt_games,
    first_game_date,
    career_games
  `)
  .eq('player_id', playerId)
  .single();

// Current form
const { data: form } = await supabase
  .from('player_hot_streak_mart')
  .select('form_trend, last_10_avg_points, points_form_vs_career_pct')
  .eq('player_id', playerId)
  .single();

// Achievement progress
const { data: achievements } = await supabase
  .from('achievement_eligibility_mart')
  .select(`
    next_achievement_alert,
    points_to_next_milestone,
    active_streak_type,
    active_streak_length,
    total_achievements_earned
  `)
  .eq('player_id', playerId)
  .single();
```

---

## Teams Page (`src/pages/teams/index.astro`)

### Current State
Team listings with basic stats

### Recommended Mart
**Primary**: `team_analytics_mart`  
**Enhanced**: Join with `team_momentum_indicators_mart`

### Example Code
```typescript
const { data: teams } = await supabase
  .from('team_analytics_mart')
  .select(`
    team_id,
    team_name,
    logo_url,
    wins,
    losses,
    win_percentage,
    current_rp,
    elo_rating,
    rp_tier,
    tournaments_played
  `)
  .gte('games_played', 5)
  .order('win_percentage', { ascending: false });

// Or with momentum
const { data: rankedTeams } = await supabase.rpc('get_team_power_rankings', {
  min_games: 5
});
// Create RPC function that joins team_analytics_mart + team_momentum_indicators_mart
```

---

## Team Profile (`src/pages/teams/[id].astro`)

### Current State
Multiple queries for stats, roster, matches

### Recommended Marts
1. **Overview**: `team_analytics_mart`
2. **Form**: `team_momentum_indicators_mart`
3. **Roster**: `roster_value_comparison_mart`
4. **Matches**: `match_analytics_mart`
5. **Head-to-Head**: `head_to_head_matchup_mart`

### Example Code
```typescript
// Team overview
const { data: team } = await supabase
  .from('team_analytics_mart')
  .select('*')
  .eq('team_id', teamId)
  .single();

// Recent form
const { data: momentum } = await supabase
  .from('team_momentum_indicators_mart')
  .select(`
    last_10_wins,
    last_10_games,
    last_10_win_pct,
    current_win_streak,
    momentum_status
  `)
  .eq('team_id', teamId)
  .single();

// Roster analysis
const { data: roster } = await supabase
  .from('roster_value_comparison_mart')
  .select(`
    roster_size,
    elite_players,
    avg_roster_rating,
    total_guards,
    total_locks,
    total_bigs,
    roster_tier_assessment
  `)
  .eq('team_id', teamId)
  .single();

// Recent matches
const { data: matches } = await supabase
  .from('match_analytics_mart')
  .select('*')
  .or(`team_a_id.eq.${teamId},team_b_id.eq.${teamId}`)
  .order('played_at', { ascending: false })
  .limit(20);
```

---

## Matches Page (`src/pages/matches/index.astro`)

### Current State
Match listings

### Recommended Mart
**Primary**: `match_analytics_mart`

### Example Code
```typescript
const { data: matches } = await supabase
  .from('match_analytics_mart')
  .select(`
    match_id,
    played_at,
    team_a_name,
    team_a_logo,
    score_a,
    score_b,
    team_b_name,
    team_b_logo,
    winner_name,
    game_type,
    league_name,
    tournament_name,
    mvp_name
  `)
  .order('played_at', { ascending: false })
  .limit(50);
```

---

## Leagues Page (`src/pages/leagues/index.astro`)

### Current State
League listings with seasons

### Recommended Mart
**Primary**: `league_season_performance_mart`

### Example Code
```typescript
// Active seasons
const { data: activeSeasons } = await supabase
  .from('league_season_performance_mart')
  .select(`
    season_id,
    league_name,
    season_number,
    game_year,
    total_matches,
    total_unique_teams,
    last_match_date,
    best_record_team
  `)
  .eq('is_active', true)
  .order('league_name');
```

---

## League Detail (`src/pages/leagues/[id].astro`)

### Current State
League season info, standings, stats

### Recommended Marts
1. **Season info**: `league_season_performance_mart`
2. **Standings**: `player_league_season_stats_mart` (aggregate by team)
3. **Player leaders**: `player_league_season_stats_mart`

### Example Code
```typescript
// Season overview
const { data: season } = await supabase
  .from('league_season_performance_mart')
  .select('*')
  .eq('season_id', seasonId)
  .single();

// Scoring leaders
const { data: scoringLeaders } = await supabase
  .from('player_league_season_stats_mart')
  .select('gamertag, season_team_name, ppg, games_played, season_points_rank')
  .eq('season_id', seasonId)
  .gte('games_played', 5)
  .order('ppg', { ascending: false })
  .limit(10);

// Team standings (aggregate from player stats)
const { data: standings } = await supabase.rpc('get_season_standings', {
  p_season_id: seasonId
});
```

---

## Tournaments Page (`src/pages/tournaments/index.astro`)

### Current State
Tournament calendar

### Recommended Mart
**Primary**: `tournament_performance_mart`

### Example Code
```typescript
// Upcoming and recent tournaments
const { data: tournaments } = await supabase
  .from('tournament_performance_mart')
  .select(`
    tournament_id,
    tournament_name,
    organizer,
    tier_score,
    tournament_tier,
    start_date,
    end_date,
    prize_pool,
    champion_team,
    status,
    unique_teams
  `)
  .order('start_date', { ascending: false })
  .limit(20);
```

---

## Tournament Detail (`src/pages/tournaments/[id].astro`)

### Current State
Bracket, results, stats

### Recommended Marts
1. **Overview**: `tournament_performance_mart`
2. **Team results**: `match_analytics_mart` (filter by tournament)
3. **Player stats**: `player_league_season_stats_mart` or direct player_stats queries

### Example Code
```typescript
// Tournament info
const { data: tournament } = await supabase
  .from('tournament_performance_mart')
  .select('*')
  .eq('tournament_id', tournamentId)
  .single();

// Tournament matches
const { data: matches } = await supabase
  .from('match_analytics_mart')
  .select('*')
  .contains('tournament_ids', [tournamentId])
  .order('played_at');
```

---

## Rankings/Leaderboards

### Recommended Marts by Category

#### Overall Player Rankings
```typescript
const { data } = await supabase
  .from('player_performance_mart')
  .select('gamertag, team_name, global_rating, rating_tier, games_played')
  .gte('games_played', 10)
  .order('global_rating', { ascending: false })
  .limit(100);
```

#### Position-Specific Rankings
```typescript
const { data } = await supabase
  .from('player_performance_mart')
  .select('gamertag, team_name, avg_points, avg_assists, global_rating')
  .eq('position', 'Point Guard')
  .gte('games_played', 10)
  .order('global_rating', { ascending: false });
```

#### Team Power Rankings
```typescript
// Combine multiple marts for comprehensive rankings
const { data } = await supabase.rpc('get_power_rankings');
// RPC joins team_analytics_mart + team_momentum_indicators_mart + roster_value_comparison_mart
```

#### Hot Players This Week
```typescript
const { data } = await supabase
  .from('player_hot_streak_mart')
  .select('gamertag, current_team, form_trend, last_5_avg_points, last_5_avg_performance')
  .in('form_trend', ['Heating Up', 'Hot'])
  .gte('games_last_5', 3)
  .order('last_5_avg_performance', { ascending: false })
  .limit(20);
```

---

## Achievements Page (`src/pages/achievements/index.astro`)

### Recommended Mart
**Primary**: `achievement_eligibility_mart`

### Features to Build
1. Players near milestones
2. Active streak leaderboard
3. Recent achievement unlocks
4. Season award candidates

### Example Code
```typescript
// Players close to next milestone
const { data: nearMilestones } = await supabase
  .from('achievement_eligibility_mart')
  .select('gamertag, next_achievement_alert, points_to_next_milestone')
  .not('next_achievement_alert', 'is', null)
  .order('points_to_next_milestone')
  .limit(20);

// Active streaks
const { data: streaks } = await supabase
  .from('achievement_eligibility_mart')
  .select('gamertag, active_streak_type, active_streak_length, streak_last_game')
  .not('active_streak_type', 'is', null)
  .gte('active_streak_length', 5)
  .order('active_streak_length', { ascending: false });
```

---

## Widgets & Components

### LeagueTabsIsland Component
**Data Source**: `league_season_performance_mart`
```typescript
const { data } = await supabase
  .from('league_season_performance_mart')
  .select('season_id, league_name, season_number, is_active')
  .order('is_active', { ascending: false })
  .order('start_date', { ascending: false });
```

### RankTableIsland Component
**Data Source**: `player_performance_mart` or `team_analytics_mart`
```typescript
// Player rankings
const { data } = await supabase
  .from('player_performance_mart')
  .select('gamertag, team_name, avg_points, global_rating, rating_tier')
  .gte('games_played', 10)
  .order('global_rating', { ascending: false });
```

### MatchesListIsland Component
**Data Source**: `match_analytics_mart`
```typescript
const { data } = await supabase
  .from('match_analytics_mart')
  .select('*')
  .order('played_at', { ascending: false })
  .limit(props.limit || 20);
```

### TeamTabsIsland Component
**Data Source**: `team_analytics_mart` + `team_momentum_indicators_mart`
```typescript
const { data: team } = await supabase
  .from('team_analytics_mart')
  .select('*')
  .eq('team_id', teamId)
  .single();

const { data: form } = await supabase
  .from('team_momentum_indicators_mart')
  .select('last_10_wins, last_10_games, momentum_status')
  .eq('team_id', teamId)
  .single();
```

### PlayerStatsIsland Component
**Data Source**: `player_hot_streak_mart` + `player_performance_mart`
```typescript
const { data } = await supabase
  .from('player_hot_streak_mart')
  .select(`
    player_id,
    gamertag,
    current_team,
    last_5_avg_points,
    last_10_avg_points,
    form_trend,
    games_last_10
  `)
  .eq('player_id', playerId)
  .single();
```

### AchievementsIsland Component
**Data Source**: `achievement_eligibility_mart`
```typescript
const { data } = await supabase
  .from('achievement_eligibility_mart')
  .select(`
    total_achievements_earned,
    next_achievement_alert,
    active_streak_type,
    active_streak_length,
    points_to_next_milestone
  `)
  .eq('player_id', playerId)
  .single();
```

---

## API Endpoints

### `/api/player-stats.ts`
**Before**: Complex aggregation query  
**After**: Simple mart lookup

```typescript
// Replace complex query with:
export async function GET({ params }) {
  const { playerId } = params;
  
  const { data, error } = await supabase
    .from('player_performance_mart')
    .select('*')
    .eq('player_id', playerId)
    .single();
    
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### `/api/team-stats.ts`
```typescript
export async function GET({ params }) {
  const { teamId } = params;
  
  // Get comprehensive team data
  const [team, momentum, roster] = await Promise.all([
    supabase.from('team_analytics_mart').select('*').eq('team_id', teamId).single(),
    supabase.from('team_momentum_indicators_mart').select('*').eq('team_id', teamId).single(),
    supabase.from('roster_value_comparison_mart').select('*').eq('team_id', teamId).single()
  ]);
  
  return new Response(JSON.stringify({ 
    ...team.data, 
    momentum: momentum.data,
    roster: roster.data
  }));
}
```

### New Endpoint: `/api/matchup-preview.ts` 🆕
```typescript
export async function GET({ url }) {
  const teamAId = url.searchParams.get('teamA');
  const teamBId = url.searchParams.get('teamB');
  
  const { data } = await supabase
    .from('head_to_head_matchup_mart')
    .select('*')
    .or(`and(team_1_id.eq.${teamAId},team_2_id.eq.${teamBId}),and(team_1_id.eq.${teamBId},team_2_id.eq.${teamAId})`)
    .single();
    
  return new Response(JSON.stringify(data));
}
```

---

## Scheduled Jobs

### `/functions/scheduled/update-player-ratings.ts`

After updating ratings, refresh relevant marts:

```typescript
export async function scheduled(event: ScheduledEvent) {
  // ... existing rating update logic ...
  
  // Refresh marts that depend on ratings
  await supabase.rpc('execute_sql', {
    query: `
      REFRESH MATERIALIZED VIEW CONCURRENTLY player_performance_mart;
      REFRESH MATERIALIZED VIEW CONCURRENTLY player_hot_streak_mart;
      REFRESH MATERIALIZED VIEW CONCURRENTLY roster_value_comparison_mart;
    `
  });
}
```

---

## New Features You Can Build

### 1. "Hot Players" Widget
```typescript
// Homepage feature highlighting trending players
const { data: trending } = await supabase
  .from('player_hot_streak_mart')
  .select('gamertag, current_team, form_trend, last_5_avg_points')
  .in('form_trend', ['Heating Up', 'Hot'])
  .gte('games_last_5', 3)
  .order('last_5_avg_performance', { ascending: false })
  .limit(5);
```

### 2. "Rivalry Tracker"
```typescript
// Show biggest rivalries
const { data: rivalries } = await supabase
  .from('head_to_head_matchup_mart')
  .select('team_1_name, team_2_name, total_meetings, team_1_wins, team_2_wins')
  .gte('total_meetings', 10)
  .order('total_meetings', { ascending: false });
```

### 3. "Achievement Notifications"
```typescript
// Alert players nearing milestones
const { data: alerts } = await supabase
  .from('achievement_eligibility_mart')
  .select('gamertag, next_achievement_alert, points_to_next_milestone')
  .not('next_achievement_alert', 'is', null)
  .order('points_to_next_milestone');
```

### 4. "Team Form Guide"
```typescript
// Show teams trending up/down
const { data: formGuide } = await supabase
  .from('team_momentum_indicators_mart')
  .select('team_name, momentum_status, last_10_win_pct, current_win_streak')
  .in('momentum_status', ['Hot', 'Cold'])
  .order('last_10_win_pct', { ascending: false });
```

### 5. "Match Preview Generator"
```typescript
async function generateMatchPreview(teamAId: string, teamBId: string) {
  const [h2h, teamAForm, teamBForm] = await Promise.all([
    supabase.from('head_to_head_matchup_mart')
      .select('*')
      .or(`and(team_1_id.eq.${teamAId},team_2_id.eq.${teamBId}),and(team_1_id.eq.${teamBId},team_2_id.eq.${teamAId})`)
      .single(),
    supabase.from('team_momentum_indicators_mart')
      .select('*')
      .eq('team_id', teamAId)
      .single(),
    supabase.from('team_momentum_indicators_mart')
      .select('*')
      .eq('team_id', teamBId)
      .single()
  ]);
  
  return {
    history: h2h.data,
    teamA: teamAForm.data,
    teamB: teamBForm.data
  };
}
```

---

## Performance Monitoring

### Track Mart Query Performance

```typescript
// Add this wrapper to track mart queries
async function queryMart<T>(
  mart: string,
  query: any
): Promise<T> {
  const start = performance.now();
  const result = await query;
  const duration = performance.now() - start;
  
  console.log(`[Mart Query] ${mart}: ${duration.toFixed(2)}ms`);
  
  // Track in analytics
  if (duration > 100) {
    console.warn(`Slow mart query: ${mart} took ${duration}ms`);
  }
  
  return result;
}

// Usage
const players = await queryMart(
  'player_performance_mart',
  supabase.from('player_performance_mart').select('*').gte('games_played', 10)
);
```

---

## Recommended Database Functions

Create these helper functions for common operations:

### 1. Get Power Rankings
```sql
CREATE OR REPLACE FUNCTION get_power_rankings(min_games INT DEFAULT 5)
RETURNS TABLE (
    team_name TEXT,
    wins INT,
    losses INT,
    win_pct NUMERIC,
    last_10_form NUMERIC,
    momentum TEXT,
    roster_rating NUMERIC,
    power_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ta.team_name,
        ta.wins,
        ta.losses,
        ta.win_percentage,
        tm.last_10_win_pct,
        tm.momentum_status,
        rv.avg_roster_rating,
        (ta.win_percentage * 0.4 + tm.last_10_win_pct * 0.3 + rv.avg_roster_rating * 0.3) AS power_score
    FROM team_analytics_mart ta
    JOIN team_momentum_indicators_mart tm ON ta.team_id = tm.team_id
    JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
    WHERE ta.games_played >= min_games
    ORDER BY power_score DESC;
END;
$$ LANGUAGE plpgsql;
```

### 2. Get Season Standings
```sql
CREATE OR REPLACE FUNCTION get_season_standings(p_season_id UUID)
RETURNS TABLE (
    team_name TEXT,
    games_played BIGINT,
    team_avg_ppg NUMERIC,
    total_players BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pls.season_team_name,
        COUNT(DISTINCT pls.player_id)::BIGINT,
        ROUND(AVG(pls.ppg)::numeric, 1),
        COUNT(DISTINCT pls.player_id)::BIGINT
    FROM player_league_season_stats_mart pls
    WHERE pls.season_id = p_season_id
    GROUP BY pls.season_team_name
    ORDER BY AVG(pls.ppg) DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## Migration Strategy

### Week 1: Deploy and Test
- Deploy all marts to staging/development
- Run test queries
- Verify data accuracy
- Check performance benchmarks

### Week 2: Integrate Core Pages
- Update Players page
- Update Teams page
- Update Matches page
- Test user experience

### Week 3: Add Enhanced Features
- Add hot players widget
- Add team momentum indicators
- Add achievement progress bars
- Add match preview feature

### Week 4: Optimize and Monitor
- Review slow queries
- Add additional indexes if needed
- Set up refresh schedule
- Monitor database size

---

## Code Examples for Common Tasks

### Dashboard Stats Card
```typescript
interface DashboardStats {
  activePlayers: number;
  activeTeams: number;
  totalMatches: number;
  activeLeagues: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [players, teams, matches, leagues] = await Promise.all([
    supabase.from('player_performance_mart').select('player_id', { count: 'exact', head: true }).gte('games_played', 1),
    supabase.from('team_analytics_mart').select('team_id', { count: 'exact', head: true }).gte('games_played', 1),
    supabase.from('match_analytics_mart').select('match_id', { count: 'exact', head: true }),
    supabase.from('league_season_performance_mart').select('season_id', { count: 'exact', head: true }).eq('is_active', true)
  ]);
  
  return {
    activePlayers: players.count || 0,
    activeTeams: teams.count || 0,
    totalMatches: matches.count || 0,
    activeLeagues: leagues.count || 0
  };
}
```

### Leaderboard Component
```typescript
interface LeaderboardEntry {
  rank: number;
  player: string;
  team: string;
  value: number;
}

async function getLeaderboard(
  category: 'points' | 'assists' | 'rebounds',
  limit: number = 20
): Promise<LeaderboardEntry[]> {
  const orderBy = {
    points: 'avg_points',
    assists: 'avg_assists',
    rebounds: 'avg_rebounds'
  }[category];
  
  const { data } = await supabase
    .from('player_performance_mart')
    .select('gamertag, team_name, ' + orderBy)
    .gte('games_played', 10)
    .order(orderBy, { ascending: false })
    .limit(limit);
    
  return data.map((row, idx) => ({
    rank: idx + 1,
    player: row.gamertag,
    team: row.team_name,
    value: row[orderBy]
  }));
}
```

---

## Tips for Maximum Performance

### 1. Always Filter Early
```typescript
// Good: Filter before selecting many columns
const { data } = await supabase
  .from('player_performance_mart')
  .select('*')
  .gte('games_played', 10)  // Filter first
  .order('avg_points', { ascending: false })
  .limit(20);

// Avoid: Selecting all then filtering in JS
const { data: all } = await supabase.from('player_performance_mart').select('*');
const filtered = all.filter(p => p.games_played >= 10); // Don't do this
```

### 2. Use Specific Marts for Specific Tasks
```typescript
// For player overview: use player_performance_mart
// For player career stats: use player_stats_tracking_mart
// For player current form: use player_hot_streak_mart
// Don't join all three if you only need one
```

### 3. Leverage Pre-Calculated Fields
```typescript
// Use win_percentage from mart (already calculated)
const { data } = await supabase
  .from('team_analytics_mart')
  .select('team_name, win_percentage')  // Pre-calculated!
  .order('win_percentage', { ascending: false });

// Don't recalculate: wins / games_played
```

### 4. Cache Mart Results Client-Side
```typescript
// Cache leaderboard data for 5 minutes
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedLeaderboard: any = null;
let cacheTime: number = 0;

async function getLeaderboard() {
  if (Date.now() - cacheTime < CACHE_TTL && cachedLeaderboard) {
    return cachedLeaderboard;
  }
  
  const { data } = await supabase
    .from('player_performance_mart')
    .select('*')
    .gte('games_played', 10)
    .order('avg_points', { ascending: false })
    .limit(100);
    
  cachedLeaderboard = data;
  cacheTime = Date.now();
  return data;
}
```

---

## Debugging Tips

### Check if Marts are Up-to-Date
```typescript
async function checkMartFreshness() {
  const { data: latestMatch } = await supabase
    .from('matches')
    .select('played_at')
    .eq('verified', true)
    .order('played_at', { ascending: false })
    .limit(1)
    .single();
    
  const { data: martMatch } = await supabase
    .from('match_analytics_mart')
    .select('played_at')
    .order('played_at', { ascending: false })
    .limit(1)
    .single();
    
  const hoursBehind = (
    new Date(latestMatch.played_at).getTime() - 
    new Date(martMatch.played_at).getTime()
  ) / (1000 * 60 * 60);
  
  if (hoursBehind > 6) {
    console.warn(`Marts are ${hoursBehind.toFixed(1)} hours behind!`);
  }
}
```

### Verify Data Consistency
```typescript
async function verifyPlayerData(playerId: string) {
  // Get from mart
  const { data: martData } = await supabase
    .from('player_performance_mart')
    .select('games_played, avg_points')
    .eq('player_id', playerId)
    .single();
    
  // Calculate from source
  const { data: rawData } = await supabase
    .from('player_stats')
    .select('points')
    .eq('player_id', playerId)
    .eq('verified', true);
    
  const calculatedAvg = rawData.reduce((sum, r) => sum + r.points, 0) / rawData.length;
  
  console.log('Mart avg:', martData.avg_points);
  console.log('Calculated avg:', calculatedAvg);
  console.log('Match:', Math.abs(martData.avg_points - calculatedAvg) < 0.1);
}
```

---

## Summary

By using these marts correctly, you'll achieve:
- ✅ **20-50x faster queries**
- ✅ **Simplified application code**
- ✅ **Consistent business logic**
- ✅ **Better user experience**
- ✅ **Easier to add new features**

Start with the core pages (Players, Teams, Matches) and gradually integrate marts throughout your application.

**Questions?** Check the comprehensive docs:
- `DATA_MARTS_SUMMARY.md` - Detailed mart reference
- `MART_QUERY_EXAMPLES.sql` - 200+ example queries
- `QUICK_START_MARTS.md` - Deployment guide

