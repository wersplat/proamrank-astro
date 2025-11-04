import { useState, useEffect, useMemo } from "react";
import BracketDisplay from "./BracketDisplay";

type PlayerStat = {
  player_name: string;
  team_id: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgm: number;
  fga: number;
  three_points_made: number;
  three_points_attempted: number;
  ftm: number;
  fta: number;
  plus_minus: number | null;
  grd: string | null;
  slot_index: number | null;
};

type TeamStat = {
  team_id: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  field_goals_made: number;
  field_goals_attempted: number;
  three_points_made: number;
  three_points_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  plus_minus: number | null;
  grd: string | null;
  teams?: { name: string; logo_url: string | null };
};

type Conference = {
  id: string;
  name: string | null;
  abbr: string | null;
  conf_logo: string | null;
};

type Division = {
  id: string;
  name: string;
  abbr: string | null;
  division_logo: string | null;
  display_order: number | null;
};

type DivisionConference = {
  id: string;
  division_id: string;
  conference_id: string;
};

type Team = {
  team_id: string;
  team_name: string;
  logo_url?: string | null;
  wins?: number;
  losses?: number;
  win_percentage?: number;
  points_for?: number;
  points_against?: number;
  current_rp?: number;
  elo_rating?: number;
  teams?: {
    global_rank?: number;
    hybrid_score?: number;
    leaderboard_tier?: string;
  };
  conference?: {
    id: string;
    name: string | null;
    abbr: string | null;
    conf_logo: string | null;
  } | null;
  division?: {
    id: string;
    name: string;
    abbr: string | null;
    division_logo: string | null;
    display_order: number | null;
  } | null;
};

type Match = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  stage: string | null;
  boxscore_url?: string | null;
  status?: string | null;
  verified?: boolean | null;
  team_a?: { name: string | null; logo_url: string | null };
  team_b?: { name: string | null; logo_url: string | null };
  league?: { league_id: string; league_name: string | null; season_number: number | null };
};

type TopPlayerStat = {
  player_name: string;
  points_per_game?: number;
  assists_per_game?: number;
  rebounds_per_game?: number;
  steals_per_game?: number;
  blocks_per_game?: number;
  games_played?: number;
};

type LeagueInfo = {
  league_name?: string;
  season_number?: number;
  game_year?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  entry_fee?: number;
  prize_pool?: number;
  tier?: string;
  lg_url?: string;
  lg_discord?: string;
  twitch_url?: string;
  twitter_id?: string;
};

type BracketMatch = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  stage: string | null;
  series_number: number | null;
  series_format?: string | null;
  winner_id: string | null;
  team_a?: { name: string | null; logo_url: string | null };
  team_b?: { name: string | null; logo_url: string | null };
};

type TournamentData = {
  champion?: string | null;
  prize?: number | null;
  status?: string | null;
  start_date?: string | null;
  finals_date?: string | null;
  tournament_type?: string | null;
  series_format?: string | null;
  matches: BracketMatch[];
};

type PlayerStatFull = {
  player_id: string;
  player_gamertag: string;
  games_played: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
  three_points_made: number;
  three_points_attempted: number;
  plus_minus: number;
  performance_score: number;
  avg_points: number;
  avg_rebounds: number;
  avg_assists: number;
  avg_steals: number;
  avg_blocks: number;
  avg_turnovers: number;
  avg_fouls: number;
  fg_pct: number | null;
  three_pt_pct: number | null;
  ft_pct: number | null;
};

type LeagueTabsProps = {
  standings: Team[];
  matches: Match[];
  topScorers: TopPlayerStat[];
  topAssists: TopPlayerStat[];
  topRebounders: TopPlayerStat[];
  topSteals: TopPlayerStat[];
  topBlocks: TopPlayerStat[];
  leagueInfo?: LeagueInfo;
  playerStats?: PlayerStatFull[];
  regularSeasonPlayerStats?: PlayerStatFull[];
  openPlayerStats?: PlayerStatFull[];
  playoffPlayerStats?: PlayerStatFull[];
  openTournament?: TournamentData | null;
  playoffTournament?: TournamentData | null;
  conferences?: Conference[];
  divisions?: Division[];
  divisionConferences?: DivisionConference[];
};

export default function LeagueTabsIsland({
  standings,
  matches,
  topScorers,
  topAssists,
  topRebounders,
  topSteals,
  topBlocks,
  leagueInfo,
  playerStats: leaguePlayerStats = [],
  regularSeasonPlayerStats = [],
  openPlayerStats = [],
  playoffPlayerStats = [],
  openTournament = null,
  playoffTournament = null,
  conferences = [],
  divisions = [],
  divisionConferences = [],
}: LeagueTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [matchesPage, setMatchesPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalTab, setModalTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof PlayerStatFull>('avg_points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTournamentType, setSelectedTournamentType] = useState<'open' | 'playoff'>('open');
  const [statsFilter, setStatsFilter] = useState<'regular' | 'open' | 'playoff'>('regular');
  const [statsView, setStatsView] = useState<'perGame' | 'totals'>('perGame');
  const [playerSearchFilter, setPlayerSearchFilter] = useState<string>('');
  
  // Matches filter states
  const [dateStartFilter, setDateStartFilter] = useState<string | null>(null);
  const [dateEndFilter, setDateEndFilter] = useState<string | null>(null);
  const [teamSearchFilter, setTeamSearchFilter] = useState<string>('');
  const [teamSearchOpen, setTeamSearchOpen] = useState(false);

  const tabs = [
    { id: 0, label: "Standings" },
    { id: 1, label: "Teams" },
    { id: 2, label: "Matches" },
    { id: 3, label: "Player Statistics" },
    { id: 4, label: "Top Performers" },
    { id: 5, label: "Brackets" },
    { id: 6, label: "Information" },
  ];

  // Extract unique team names from matches
  const uniqueTeamNames = useMemo(() => {
    const teamNames = new Set<string>();
    matches.forEach((match) => {
      if (match.team_a?.name) teamNames.add(match.team_a.name);
      if (match.team_b?.name) teamNames.add(match.team_b.name);
    });
    return Array.from(teamNames).sort();
  }, [matches]);

  // Filter matches based on date range and team search
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Filter by date range
    if (dateStartFilter || dateEndFilter) {
      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.played_at);
        matchDate.setHours(0, 0, 0, 0);

        if (dateStartFilter) {
          const startDate = new Date(dateStartFilter);
          startDate.setHours(0, 0, 0, 0);
          if (matchDate < startDate) return false;
        }

        if (dateEndFilter) {
          const endDate = new Date(dateEndFilter);
          endDate.setHours(23, 59, 59, 999);
          if (matchDate > endDate) return false;
        }

        return true;
      });
    }

    // Filter by team name
    if (teamSearchFilter.trim()) {
      const searchLower = teamSearchFilter.toLowerCase().trim();
      filtered = filtered.filter((match) => {
        const teamAName = match.team_a?.name?.toLowerCase() || '';
        const teamBName = match.team_b?.name?.toLowerCase() || '';
        return teamAName.includes(searchLower) || teamBName.includes(searchLower);
      });
    }

    return filtered;
  }, [matches, dateStartFilter, dateEndFilter, teamSearchFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setMatchesPage(1);
  }, [dateStartFilter, dateEndFilter, teamSearchFilter]);

  // Filtered team names for autocomplete dropdown
  const filteredTeamNames = useMemo(() => {
    if (!teamSearchFilter.trim()) return uniqueTeamNames;
    const searchLower = teamSearchFilter.toLowerCase().trim();
    return uniqueTeamNames.filter((name) =>
      name.toLowerCase().includes(searchLower)
    );
  }, [uniqueTeamNames, teamSearchFilter]);

  // Pagination for matches
  const MATCHES_PER_PAGE = 25;
  const totalMatchPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE);
  const matchesStartIndex = (matchesPage - 1) * MATCHES_PER_PAGE;
  const matchesEndIndex = matchesStartIndex + MATCHES_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(matchesStartIndex, matchesEndIndex);

  // Generate page numbers for pagination
  const getPageNumbers = (current: number, total: number): number[] => {
    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 4) {
      for (let i = 1; i <= 7; i++) pages.push(i);
    } else if (current >= total - 3) {
      for (let i = total - 6; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 3; i <= current + 3; i++) pages.push(i);
    }
    return pages;
  };

  const matchPageNumbers = getPageNumbers(matchesPage, totalMatchPages);

  const getVerificationBadge = (match: Match) => {
    if (match.verified === true) {
      return (
        <span className="px-2 py-0.5 rounded bg-green-900/30 border border-green-500/30 text-green-300 text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    } else if (match.status === 'processed' && match.verified === false) {
      return (
        <span className="px-2 py-0.5 rounded bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Under Review
        </span>
      );
    }
    return null;
  };

  // Sort player statistics
  const handleSort = (column: keyof PlayerStatFull) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Get the stats array based on the current filter
  const getFilteredStats = () => {
    switch (statsFilter) {
      case 'regular':
        return regularSeasonPlayerStats.length > 0 ? regularSeasonPlayerStats : leaguePlayerStats;
      case 'open':
        return openPlayerStats;
      case 'playoff':
        return playoffPlayerStats;
      default:
        return leaguePlayerStats;
    }
  };

  // Filter and sort player stats
  const filteredPlayerStats = useMemo(() => {
    let filtered = getFilteredStats();
    
    // Apply player name search filter
    if (playerSearchFilter.trim()) {
      const searchLower = playerSearchFilter.toLowerCase().trim();
      filtered = filtered.filter((player) =>
        player.player_gamertag?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [statsFilter, playerSearchFilter, regularSeasonPlayerStats, openPlayerStats, playoffPlayerStats, leaguePlayerStats]);

  const sortedPlayerStats = [...filteredPlayerStats].sort((a, b) => {
    const aVal = a[sortBy] ?? 0;
    const bVal = b[sortBy] ?? 0;
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Reset to page 1 when switching tabs
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    if (tabId === 2) {
      setMatchesPage(1);
    }
  };

  // Update sortBy when switching between totals and per-game views
  useEffect(() => {
    // Map between totals and per-game sort fields
    const fieldMap: Record<string, { totals: keyof PlayerStatFull; perGame: keyof PlayerStatFull }> = {
      points: { totals: 'points', perGame: 'avg_points' },
      rebounds: { totals: 'rebounds', perGame: 'avg_rebounds' },
      assists: { totals: 'assists', perGame: 'avg_assists' },
      steals: { totals: 'steals', perGame: 'avg_steals' },
      blocks: { totals: 'blocks', perGame: 'avg_blocks' },
      turnovers: { totals: 'turnovers', perGame: 'avg_turnovers' },
      avg_points: { totals: 'points', perGame: 'avg_points' },
      avg_rebounds: { totals: 'rebounds', perGame: 'avg_rebounds' },
      avg_assists: { totals: 'assists', perGame: 'avg_assists' },
      avg_steals: { totals: 'steals', perGame: 'avg_steals' },
      avg_blocks: { totals: 'blocks', perGame: 'avg_blocks' },
      avg_turnovers: { totals: 'turnovers', perGame: 'avg_turnovers' },
    };

    const mapping = fieldMap[sortBy];
    if (mapping) {
      const newField = statsView === 'totals' ? mapping.totals : mapping.perGame;
      if (newField !== sortBy) {
        setSortBy(newField);
      }
    }
  }, [statsView]);

  // Handle match click to open modal
  const handleMatchClick = async (match: Match) => {
    if (!match.boxscore_url) return;
    
    setSelectedMatch(match);
    setModalTab('screenshot');
    setLoading(true);
    setError(null);

    try {
      const [playerRes, teamRes] = await Promise.all([
        fetch(`/api/player-stats?match_id=${match.id}`),
        fetch(`/api/team-stats?match_id=${match.id}`)
      ]);

      if (playerRes.ok) {
        const playerData = await playerRes.json();
        setPlayerStats(playerData.playerStats || []);
      } else {
        const errorData = await playerRes.json().catch(() => ({ error: 'Failed to parse error' }));
        setError(errorData.error || 'Failed to load player stats');
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamStats(teamData.teamStats || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedMatch(null);
    setPlayerStats([]);
    setTeamStats([]);
    setError(null);
  };

  // Helper function to resolve team ID to team name
  const getTeamName = (teamId: string | null | undefined): string | null => {
    if (!teamId) return null;
    const team = standings.find(t => t.team_id === teamId);
    return team?.team_name || null;
  };

  // Get regular season champion (first place team)
  const regularSeasonChampion = useMemo(() => {
    if (standings.length === 0) return null;
    // Sort by wins, then win percentage
    const sorted = [...standings].sort((a, b) => {
      if ((b.wins ?? 0) !== (a.wins ?? 0)) {
        return (b.wins ?? 0) - (a.wins ?? 0);
      }
      return (b.win_percentage ?? 0) - (a.win_percentage ?? 0);
    });
    return sorted[0]?.team_id || null;
  }, [standings]);

  // Resolve champion names
  const openChampionName = openTournament?.champion ? getTeamName(openTournament.champion) : null;
  const playoffChampionName = playoffTournament?.champion ? getTeamName(playoffTournament.champion) : null;
  const regularSeasonChampionName = regularSeasonChampion ? getTeamName(regularSeasonChampion) : null;

  // Calculate triple crown achievements
  const tripleCrownData = useMemo(() => {
    const teamsWithChampionships = new Map<string, {
      teamId: string;
      teamName: string;
      championships: string[];
      count: number;
    }>();

    // Regular Season Champion
    if (regularSeasonChampion) {
      const teamName = getTeamName(regularSeasonChampion);
      if (teamName) {
        if (!teamsWithChampionships.has(regularSeasonChampion)) {
          teamsWithChampionships.set(regularSeasonChampion, {
            teamId: regularSeasonChampion,
            teamName,
            championships: [],
            count: 0,
          });
        }
        const data = teamsWithChampionships.get(regularSeasonChampion)!;
        data.championships.push('Regular Season');
        data.count = data.championships.length;
      }
    }

    // Open Champion
    if (openTournament?.champion) {
      const teamName = getTeamName(openTournament.champion);
      if (teamName) {
        if (!teamsWithChampionships.has(openTournament.champion)) {
          teamsWithChampionships.set(openTournament.champion, {
            teamId: openTournament.champion,
            teamName,
            championships: [],
            count: 0,
          });
        }
        const data = teamsWithChampionships.get(openTournament.champion)!;
        data.championships.push('Open Tournament');
        data.count = data.championships.length;
      }
    }

    // Playoff Champion
    if (playoffTournament?.champion) {
      const teamName = getTeamName(playoffTournament.champion);
      if (teamName) {
        if (!teamsWithChampionships.has(playoffTournament.champion)) {
          teamsWithChampionships.set(playoffTournament.champion, {
            teamId: playoffTournament.champion,
            teamName,
            championships: [],
            count: 0,
          });
        }
        const data = teamsWithChampionships.get(playoffTournament.champion)!;
        data.championships.push('Playoff Tournament');
        data.count = data.championships.length;
      }
    }

    return Array.from(teamsWithChampionships.values());
  }, [regularSeasonChampion, openTournament?.champion, playoffTournament?.champion, standings]);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50">
      {/* Tabs Header */}
      <div className="flex border-b border-neutral-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Standings Tab */}
        {activeTab === 0 && (
          <div className="space-y-8">
            {standings.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No standings available.
              </div>
            ) : (
              <>
                {/* Division Standings with Overall and Conference Breakdowns */}
                {divisions && divisions.length > 0 ? (
                  <div className="space-y-8">
                    {divisions.map((division) => {
                      // Get all conferences in this division via junction table
                      const divisionConfIds = divisionConferences
                        ?.filter(dc => dc.division_id === division.id)
                        .map(dc => dc.conference_id) || [];
                      
                      const conferencesInDivision = conferences?.filter(
                        conf => divisionConfIds.includes(conf.id)
                      ) || [];
                      
                      // Get all teams whose conference belongs to this division
                      const divisionTeams = standings
                        .filter(team => team.division?.id === division.id)
                        .sort((a, b) => {
                          if ((b.wins ?? 0) !== (a.wins ?? 0)) {
                            return (b.wins ?? 0) - (a.wins ?? 0);
                          }
                          return (b.win_percentage ?? 0) - (a.win_percentage ?? 0);
                        });

                      if (divisionTeams.length === 0) return null;

                      return (
                        <div key={division.id} className="mb-8">
                          {/* Division Header */}
                          <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-neutral-700">
                            {division.division_logo && (
                              <img
                                src={division.division_logo}
                                alt={division.name}
                                className="h-8 w-8 rounded object-contain"
                              />
                            )}
                            <h3 className="text-xl font-bold text-neutral-200">
                              {division.name} Standings
                              {division.abbr && (
                                <span className="ml-2 text-sm text-neutral-400">({division.abbr})</span>
                              )}
                            </h3>
                          </div>

                          {/* Overall Division Standings */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-blue-300 mb-2">
                              {division.name} Overall
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-neutral-950 text-neutral-300">
                                  <tr>
                                    <th className="text-left py-2 px-4">Rank</th>
                                    <th className="text-left py-2 px-4">Team</th>
                                    <th className="text-right py-2 px-4">W</th>
                                    <th className="text-right py-2 px-4">L</th>
                                    <th className="text-right py-2 px-4">Win %</th>
                                    <th className="text-right py-2 px-4">PF</th>
                                    <th className="text-right py-2 px-4">PA</th>
                                    <th className="text-right py-2 px-4">ELO</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                  {divisionTeams.map((team, idx) => (
                                    <tr key={team.team_id} className="hover:bg-neutral-900">
                                      <td className="py-2 px-4 text-neutral-400">{idx + 1}</td>
                                      <td className="py-2 px-4">
                                        <a
                                          href={`/teams/${team.team_id}`}
                                          className="hover:text-blue-400 flex items-center gap-2"
                                        >
                                          {team.logo_url ? (
                                            <img
                                              src={team.logo_url}
                                              alt=""
                                              className="h-6 w-6 rounded object-cover"
                                            />
                                          ) : (
                                            <div className="h-6 w-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                                              {team.team_name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                          )}
                                          {team.team_name}
                                        </a>
                                      </td>
                                      <td className="py-2 px-4 text-right font-semibold">
                                        {team.wins ?? 0}
                                      </td>
                                      <td className="py-2 px-4 text-right">{team.losses ?? 0}</td>
                                      <td className="py-2 px-4 text-right">
                                        {team.win_percentage?.toFixed(1) ?? "-"}%
                                      </td>
                                      <td className="py-2 px-4 text-right">
                                        {team.points_for ?? 0}
                                      </td>
                                      <td className="py-2 px-4 text-right">
                                        {team.points_against ?? 0}
                                      </td>
                                      <td className="py-2 px-4 text-right text-neutral-400">
                                        {team.elo_rating ? Math.round(team.elo_rating) : "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Conference Standings within this Division */}
                          {conferencesInDivision.length > 0 && (
                            <div className="space-y-4 ml-4">
                              {conferencesInDivision.map((conference) => {
                                const conferenceTeams = divisionTeams
                                  .filter(team => team.conference?.id === conference.id)
                                  .sort((a, b) => {
                                    if ((b.wins ?? 0) !== (a.wins ?? 0)) {
                                      return (b.wins ?? 0) - (a.wins ?? 0);
                                    }
                                    return (b.win_percentage ?? 0) - (a.win_percentage ?? 0);
                                  });

                                if (conferenceTeams.length === 0) return null;

                                return (
                                  <div key={conference.id}>
                                    <div className="flex items-center gap-2 mb-2">
                                      {conference.conf_logo && (
                                        <img
                                          src={conference.conf_logo}
                                          alt={conference.name || "Conference"}
                                          className="h-6 w-6 rounded object-contain"
                                        />
                                      )}
                                      <h5 className="text-sm font-semibold text-green-300">
                                        {conference.name || "Conference"}
                                        {conference.abbr && (
                                          <span className="ml-2 text-xs text-neutral-500">({conference.abbr})</span>
                                        )}
                                      </h5>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead className="bg-neutral-950 text-neutral-300">
                                          <tr>
                                            <th className="text-left py-2 px-4">Rank</th>
                                            <th className="text-left py-2 px-4">Team</th>
                                            <th className="text-right py-2 px-4">W</th>
                                            <th className="text-right py-2 px-4">L</th>
                                            <th className="text-right py-2 px-4">Win %</th>
                                            <th className="text-right py-2 px-4">PF</th>
                                            <th className="text-right py-2 px-4">PA</th>
                                            <th className="text-right py-2 px-4">ELO</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800">
                                          {conferenceTeams.map((team, idx) => (
                                            <tr key={team.team_id} className="hover:bg-neutral-900">
                                              <td className="py-2 px-4 text-neutral-400">{idx + 1}</td>
                                              <td className="py-2 px-4">
                                                <a
                                                  href={`/teams/${team.team_id}`}
                                                  className="hover:text-blue-400 flex items-center gap-2"
                                                >
                                                  {team.logo_url ? (
                                                    <img
                                                      src={team.logo_url}
                                                      alt=""
                                                      className="h-6 w-6 rounded object-cover"
                                                    />
                                                  ) : (
                                                    <div className="h-6 w-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                                                      {team.team_name?.substring(0, 2).toUpperCase() || '??'}
                                                    </div>
                                                  )}
                                                  {team.team_name}
                                                </a>
                                              </td>
                                              <td className="py-2 px-4 text-right font-semibold">
                                                {team.wins ?? 0}
                                              </td>
                                              <td className="py-2 px-4 text-right">{team.losses ?? 0}</td>
                                              <td className="py-2 px-4 text-right">
                                                {team.win_percentage?.toFixed(1) ?? "-"}%
                                              </td>
                                              <td className="py-2 px-4 text-right">
                                                {team.points_for ?? 0}
                                              </td>
                                              <td className="py-2 px-4 text-right">
                                                {team.points_against ?? 0}
                                              </td>
                                              <td className="py-2 px-4 text-right text-neutral-400">
                                                {team.elo_rating ? Math.round(team.elo_rating) : "-"}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // No divisions - show all teams in single table
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-950 text-neutral-300">
                        <tr>
                          <th className="text-left py-2 px-4">Rank</th>
                          <th className="text-left py-2 px-4">Team</th>
                          <th className="text-right py-2 px-4">W</th>
                          <th className="text-right py-2 px-4">L</th>
                          <th className="text-right py-2 px-4">Win %</th>
                          <th className="text-right py-2 px-4">PF</th>
                          <th className="text-right py-2 px-4">PA</th>
                          <th className="text-right py-2 px-4">ELO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {standings.map((team, idx) => (
                          <tr key={team.team_id} className="hover:bg-neutral-900">
                            <td className="py-2 px-4 text-neutral-400">{idx + 1}</td>
                            <td className="py-2 px-4">
                              <a
                                href={`/teams/${team.team_id}`}
                                className="hover:text-blue-400 flex items-center gap-2"
                              >
                                {team.logo_url ? (
                                  <img
                                    src={team.logo_url}
                                    alt=""
                                    className="h-6 w-6 rounded object-cover"
                                  />
                                ) : (
                                  <div className="h-6 w-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                                    {team.team_name?.substring(0, 2).toUpperCase() || '??'}
                                  </div>
                                )}
                                {team.team_name}
                              </a>
                            </td>
                            <td className="py-2 px-4 text-right font-semibold">
                              {team.wins ?? 0}
                            </td>
                            <td className="py-2 px-4 text-right">{team.losses ?? 0}</td>
                            <td className="py-2 px-4 text-right">
                              {team.win_percentage?.toFixed(1) ?? "-"}%
                            </td>
                            <td className="py-2 px-4 text-right">
                              {team.points_for ?? 0}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {team.points_against ?? 0}
                            </td>
                            <td className="py-2 px-4 text-right text-neutral-400">
                              {team.elo_rating ? Math.round(team.elo_rating) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 1 && (
          <div className="overflow-x-auto">
            {standings.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No teams available.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-neutral-950 text-neutral-300">
                  <tr>
                    <th className="text-left py-2 px-4">Team</th>
                    <th className="text-right py-2 px-4">Global Rank</th>
                    <th className="text-right py-2 px-4">Rating</th>
                    <th className="text-right py-2 px-4">Tier</th>
                    <th className="text-right py-2 px-4">ELO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {standings.map((team) => (
                    <tr key={team.team_id} className="hover:bg-neutral-900">
                      <td className="py-2 px-4">
                        <a
                          href={`/teams/${team.team_id}`}
                          className="hover:text-blue-400 flex items-center gap-2"
                        >
                          {team.logo_url ? (
                            <img
                              src={team.logo_url}
                              alt=""
                              className="h-6 w-6 rounded object-cover"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                              {team.team_name?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                          )}
                          {team.team_name}
                        </a>
                      </td>
                      <td className="py-2 px-4 text-right text-neutral-400">
                        #{team.teams?.global_rank ?? "-"}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {team.teams?.hybrid_score ? (
                          <span className="font-semibold text-blue-400">
                            {team.teams.hybrid_score.toFixed(0)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {team.teams?.leaderboard_tier ? (
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              team.teams.leaderboard_tier === "S"
                                ? "bg-red-900 text-red-300"
                                : team.teams.leaderboard_tier === "A"
                                ? "bg-orange-900 text-orange-300"
                                : team.teams.leaderboard_tier === "B"
                                ? "bg-green-900 text-green-300"
                                : team.teams.leaderboard_tier === "C"
                                ? "bg-blue-900 text-blue-300"
                                : "bg-neutral-800 text-neutral-300"
                            }`}
                          >
                            {team.teams.leaderboard_tier}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2 px-4 text-right text-neutral-400">
                        {team.elo_rating ? Math.round(team.elo_rating) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 2 && (
          <div>
            {/* Filter Controls */}
            <div className="mb-6 space-y-4">
              {/* Date Range Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-neutral-400">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateStartFilter || ''}
                      onChange={(e) => setDateStartFilter(e.target.value || null)}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    {dateStartFilter && (
                      <button
                        onClick={() => setDateStartFilter(null)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        aria-label="Clear start date"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-neutral-400">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateEndFilter || ''}
                      onChange={(e) => setDateEndFilter(e.target.value || null)}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    {dateEndFilter && (
                      <button
                        onClick={() => setDateEndFilter(null)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        aria-label="Clear end date"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Search Filter */}
              <div className="space-y-1">
                <label className="text-sm text-neutral-400">Search by Team</label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={teamSearchFilter}
                      onChange={(e) => {
                        setTeamSearchFilter(e.target.value);
                        setTeamSearchOpen(true);
                      }}
                      onFocus={() => setTeamSearchOpen(true)}
                      onBlur={() => {
                        // Delay closing to allow clicks on dropdown items
                        setTimeout(() => setTeamSearchOpen(false), 200);
                      }}
                      placeholder="Search by team name..."
                      className="w-full px-4 py-2 pl-10 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {teamSearchFilter && (
                      <button
                        onClick={() => {
                          setTeamSearchFilter('');
                          setTeamSearchOpen(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        aria-label="Clear team search"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* Autocomplete Dropdown */}
                  {teamSearchOpen && filteredTeamNames.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg max-h-60 overflow-y-auto">
                      {filteredTeamNames.map((teamName) => {
                        const lowerSearch = teamSearchFilter.toLowerCase().trim();
                        const lowerName = teamName.toLowerCase();
                        const index = lowerSearch ? lowerName.indexOf(lowerSearch) : -1;
                        
                        return (
                          <button
                            key={teamName}
                            type="button"
                            onClick={() => {
                              setTeamSearchFilter(teamName);
                              setTeamSearchOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-700 text-white transition"
                          >
                            {index !== -1 && lowerSearch ? (
                              <>
                                {teamName.substring(0, index)}
                                <span className="bg-blue-500/30 font-semibold">
                                  {teamName.substring(index, index + teamSearchFilter.trim().length)}
                                </span>
                                {teamName.substring(index + teamSearchFilter.trim().length)}
                              </>
                            ) : (
                              teamName
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Matches count and page info */}
            {filteredMatches.length > 0 && (
              <div className="mb-4 text-sm text-neutral-400">
                Showing {matchesStartIndex + 1}-{Math.min(matchesEndIndex, filteredMatches.length)} of {filteredMatches.length} matches
                {(dateStartFilter || dateEndFilter || teamSearchFilter.trim()) && (
                  <span className="ml-2 text-neutral-500">
                    (filtered from {matches.length} total)
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  No matches found.
                </div>
              ) : (
                paginatedMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className={`rounded-lg border border-neutral-800 p-4 transition ${
                      match.boxscore_url ? 'cursor-pointer hover:border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {match.team_a?.logo_url ? (
                          <img
                            src={match.team_a.logo_url}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                            {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                          </div>
                        )}
                        <div className="text-sm">{match.team_a?.name || "Team A"}</div>
                        <div className="text-lg font-bold">{match.score_a ?? 0}</div>
                      </div>
                      <div className="px-4 text-neutral-500">vs</div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="text-lg font-bold">{match.score_b ?? 0}</div>
                        <div className="text-sm">{match.team_b?.name || "Team B"}</div>
                        {match.team_b?.logo_url ? (
                          <img
                            src={match.team_b.logo_url}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px] font-bold">
                            {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-500 mt-2">
                      <span>{new Date(match.played_at).toLocaleDateString()}</span>
                      {match.stage && <span>• {match.stage}</span>}
                      {getVerificationBadge(match)}
                      {match.boxscore_url && (
                        <span className="ml-auto text-blue-400">
                          📊 View boxscore
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalMatchPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setMatchesPage(matchesPage - 1)}
                  disabled={matchesPage === 1}
                  className={`px-4 py-2 rounded transition ${
                    matchesPage === 1
                      ? "bg-neutral-900 text-neutral-600 cursor-not-allowed"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-1">
                  {matchPageNumbers.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setMatchesPage(pageNum)}
                      className={`px-3 py-2 rounded transition ${
                        pageNum === matchesPage
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-neutral-800 hover:bg-neutral-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setMatchesPage(matchesPage + 1)}
                  disabled={matchesPage === totalMatchPages}
                  className={`px-4 py-2 rounded transition ${
                    matchesPage === totalMatchPages
                      ? "bg-neutral-900 text-neutral-600 cursor-not-allowed"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Player Statistics Tab */}
        {activeTab === 3 && (
          <div>
            {sortedPlayerStats.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No player statistics available.
              </div>
            ) : (
              <>
                {/* Player Search Filter */}
                <div className="mb-4">
                  <label className="text-sm text-neutral-400 mb-2 block">Search by Player Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={playerSearchFilter}
                      onChange={(e) => setPlayerSearchFilter(e.target.value)}
                      placeholder="Search by player name..."
                      className="w-full px-4 py-2 pl-10 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {playerSearchFilter && (
                      <button
                        onClick={() => setPlayerSearchFilter('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        aria-label="Clear player search"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats Filter Toggle */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {(regularSeasonPlayerStats.length > 0 || leaguePlayerStats.length > 0) && (
                    <button
                      onClick={() => setStatsFilter('regular')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        statsFilter === 'regular'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Regular Season
                    </button>
                  )}
                  {openPlayerStats.length > 0 && (
                    <button
                      onClick={() => setStatsFilter('open')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        statsFilter === 'open'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Open Tournament
                    </button>
                  )}
                  {playoffPlayerStats.length > 0 && (
                    <button
                      onClick={() => setStatsFilter('playoff')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        statsFilter === 'playoff'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Playoff Tournament
                    </button>
                  )}
                </div>

                {/* View Toggle (Per Game vs Totals) */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatsView('perGame')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      statsView === 'perGame'
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    Per Game
                  </button>
                  <button
                    onClick={() => setStatsView('totals')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      statsView === 'totals'
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    Totals
                  </button>
                </div>
                
                <div className="mb-4 text-sm text-neutral-400">
                  {sortedPlayerStats.length} player{sortedPlayerStats.length !== 1 ? 's' : ''} • Click column headers to sort
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-950 text-neutral-300">
                      <tr>
                        <th className="text-left py-2 px-4 sticky left-0 bg-neutral-950 z-10">Player</th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('games_played')}
                        >
                          GP {sortBy === 'games_played' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'points' : 'avg_points')}
                        >
                          {statsView === 'totals' ? 'PTS' : 'PPG'} {sortBy === (statsView === 'totals' ? 'points' : 'avg_points') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'rebounds' : 'avg_rebounds')}
                        >
                          {statsView === 'totals' ? 'REB' : 'RPG'} {sortBy === (statsView === 'totals' ? 'rebounds' : 'avg_rebounds') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'assists' : 'avg_assists')}
                        >
                          {statsView === 'totals' ? 'AST' : 'APG'} {sortBy === (statsView === 'totals' ? 'assists' : 'avg_assists') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'steals' : 'avg_steals')}
                        >
                          {statsView === 'totals' ? 'STL' : 'SPG'} {sortBy === (statsView === 'totals' ? 'steals' : 'avg_steals') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'blocks' : 'avg_blocks')}
                        >
                          {statsView === 'totals' ? 'BLK' : 'BPG'} {sortBy === (statsView === 'totals' ? 'blocks' : 'avg_blocks') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort(statsView === 'totals' ? 'turnovers' : 'avg_turnovers')}
                        >
                          {statsView === 'totals' ? 'TOV' : 'TOV'} {sortBy === (statsView === 'totals' ? 'turnovers' : 'avg_turnovers') && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('fga')}
                        >
                          FG% {sortBy === 'fga' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('three_points_attempted')}
                        >
                          3P% {sortBy === 'three_points_attempted' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('fta')}
                        >
                          FT% {sortBy === 'fta' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('plus_minus')}
                        >
                          +/- {sortBy === 'plus_minus' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="text-right py-2 px-4 cursor-pointer hover:text-white"
                          onClick={() => handleSort('performance_score')}
                        >
                          PS {sortBy === 'performance_score' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {sortedPlayerStats.map((player) => {
                        // Use pre-calculated percentages from the mart (now numbers)
                        const fgPercentage = player.fg_pct !== null ? player.fg_pct.toFixed(1) : '-';
                        const threePtPercentage = player.three_pt_pct !== null ? player.three_pt_pct.toFixed(1) : '-';
                        const ftPercentage = player.ft_pct !== null ? player.ft_pct.toFixed(1) : '-';
                        
                        return (
                          <tr key={player.player_id} className="hover:bg-neutral-900">
                            <td className="py-2 px-4 sticky left-0 bg-neutral-900 hover:bg-neutral-900">
                              <a
                                href={`/players/${player.player_id}`}
                                className="hover:text-blue-400 font-medium"
                              >
                                {player.player_gamertag}
                              </a>
                            </td>
                            <td className="py-2 px-4 text-right">{player.games_played}</td>
                            <td className="py-2 px-4 text-right font-semibold text-blue-400">
                              {statsView === 'totals' 
                                ? (player.points ?? 0).toLocaleString()
                                : (player.avg_points?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right">
                              {statsView === 'totals' 
                                ? (player.rebounds ?? 0).toLocaleString()
                                : (player.avg_rebounds?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right text-green-400">
                              {statsView === 'totals' 
                                ? (player.assists ?? 0).toLocaleString()
                                : (player.avg_assists?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right text-yellow-400">
                              {statsView === 'totals' 
                                ? (player.steals ?? 0).toLocaleString()
                                : (player.avg_steals?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right text-red-400">
                              {statsView === 'totals' 
                                ? (player.blocks ?? 0).toLocaleString()
                                : (player.avg_blocks?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right text-neutral-400">
                              {statsView === 'totals' 
                                ? (player.turnovers ?? 0).toLocaleString()
                                : (player.avg_turnovers?.toFixed(1) ?? '-')
                              }
                            </td>
                            <td className="py-2 px-4 text-right">
                              {fgPercentage}{fgPercentage !== '-' ? '%' : ''}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {threePtPercentage}{threePtPercentage !== '-' ? '%' : ''}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {ftPercentage}{ftPercentage !== '-' ? '%' : ''}
                            </td>
                            <td className="py-2 px-4 text-right">
                              <span className={player.plus_minus > 0 ? 'text-green-400' : player.plus_minus < 0 ? 'text-red-400' : ''}>
                                {player.plus_minus > 0 ? '+' : ''}{player.plus_minus ?? 0}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-right font-semibold text-purple-400">
                              {player.performance_score?.toFixed(1) ?? '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Top Performers Tab */}
        {activeTab === 4 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topScorers.length > 0 && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-bold mb-3 text-sm text-neutral-400">
                  Points Per Game
                </h3>
                <div className="space-y-2">
                  {topScorers.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        <span>{player.player_name}</span>
                      </div>
                      <span className="font-bold text-blue-400">
                        {player.points_per_game?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topAssists.length > 0 && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-bold mb-3 text-sm text-neutral-400">
                  Assists Per Game
                </h3>
                <div className="space-y-2">
                  {topAssists.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        <span>{player.player_name}</span>
                      </div>
                      <span className="font-bold text-green-400">
                        {player.assists_per_game?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topRebounders.length > 0 && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-bold mb-3 text-sm text-neutral-400">
                  Rebounds Per Game
                </h3>
                <div className="space-y-2">
                  {topRebounders.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        <span>{player.player_name}</span>
                      </div>
                      <span className="font-bold text-purple-400">
                        {player.rebounds_per_game?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topSteals.length > 0 && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-bold mb-3 text-sm text-neutral-400">
                  Steals Per Game
                </h3>
                <div className="space-y-2">
                  {topSteals.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        <span>{player.player_name}</span>
                      </div>
                      <span className="font-bold text-yellow-400">
                        {player.steals_per_game?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topBlocks.length > 0 && (
              <div className="rounded-lg border border-neutral-800 p-4">
                <h3 className="font-bold mb-3 text-sm text-neutral-400">
                  Blocks Per Game
                </h3>
                <div className="space-y-2">
                  {topBlocks.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        <span>{player.player_name}</span>
                      </div>
                      <span className="font-bold text-red-400">
                        {player.blocks_per_game?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topScorers.length === 0 &&
              topAssists.length === 0 &&
              topRebounders.length === 0 &&
              topSteals.length === 0 &&
              topBlocks.length === 0 && (
                <div className="col-span-full text-center py-8 text-neutral-400">
                  No player statistics available.
                </div>
              )}
          </div>
        )}

        {/* Brackets Tab */}
        {activeTab === 5 && (
          <div>
            {/* Show toggle only if both tournaments exist */}
            {(openTournament || playoffTournament) && (
              <div className="mb-6 flex gap-2">
                {openTournament && (
                  <button
                    onClick={() => setSelectedTournamentType('open')}
                    className={`px-4 py-2 rounded transition ${
                      selectedTournamentType === 'open'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    Open Tournament
                  </button>
                )}
                {playoffTournament && (
                  <button
                    onClick={() => setSelectedTournamentType('playoff')}
                    className={`px-4 py-2 rounded transition ${
                      selectedTournamentType === 'playoff'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    Playoff Tournament
                  </button>
                )}
              </div>
            )}

            {/* Display selected tournament bracket */}
            {selectedTournamentType === 'open' && openTournament ? (
              <BracketDisplay
                matches={openTournament.matches}
                tournamentName={`${leagueInfo?.league_name || 'League'} - Open Tournament`}
                champion={openTournament.champion}
                prizePool={openTournament.prize}
                status={openTournament.status}
                startDate={openTournament.start_date}
                finalsDate={openTournament.finals_date}
                tournamentType={openTournament.tournament_type}
                seriesFormat={openTournament.series_format}
              />
            ) : selectedTournamentType === 'playoff' && playoffTournament ? (
              <BracketDisplay
                matches={playoffTournament.matches}
                tournamentName={`${leagueInfo?.league_name || 'League'} - Playoffs`}
                champion={playoffTournament.champion}
                prizePool={playoffTournament.prize}
                status={playoffTournament.status}
                startDate={playoffTournament.start_date}
                finalsDate={playoffTournament.finals_date}
                tournamentType={playoffTournament.tournament_type}
                seriesFormat={playoffTournament.series_format}
              />
            ) : (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-lg mb-2">No tournament brackets available yet.</p>
                <p className="text-sm">
                  {selectedTournamentType === 'open' 
                    ? 'The open tournament bracket will appear here once matches are scheduled.'
                    : 'The playoff bracket will appear here once matches are scheduled.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Information Tab */}
        {activeTab === 6 && (
          <div className="space-y-4">
            {leagueInfo ? (
              <>
                {leagueInfo.tier && (
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Tier</div>
                    {/* Match tournament styling */}
                    <span
                      className={`px-3 py-1 rounded text-sm font-bold border ${
                        leagueInfo.tier === 'T1'
                          ? 'bg-purple-900 text-purple-300 border-purple-500'
                          : leagueInfo.tier === 'T2'
                          ? 'bg-blue-900 text-blue-300 border-blue-500'
                          : leagueInfo.tier === 'T3'
                          ? 'bg-green-900 text-green-300 border-green-500'
                          : leagueInfo.tier === 'T4'
                          ? 'bg-yellow-900 text-yellow-300 border-yellow-500'
                          : 'bg-gray-900 text-gray-300 border-gray-500'
                      }`}
                    >
                      {leagueInfo.tier}
                    </span>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {leagueInfo.season_number && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Season</div>
                      <div className="text-lg font-semibold">
                        {leagueInfo.season_number}
                      </div>
                    </div>
                  )}
                  {leagueInfo.game_year && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Year</div>
                      <div className="text-lg font-semibold">
                        {leagueInfo.game_year}
                      </div>
                    </div>
                  )}
                  {leagueInfo.entry_fee && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Entry Fee</div>
                      <div className="text-lg font-semibold">
                        ${leagueInfo.entry_fee}
                      </div>
                    </div>
                  )}
                  {leagueInfo.prize_pool && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">
                        Prize Pool
                      </div>
                      <div className="text-lg font-semibold text-green-400">
                        ${leagueInfo.prize_pool}
                      </div>
                    </div>
                  )}
                  {leagueInfo.start_date && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Start Date</div>
                      <div className="text-lg font-semibold">
                        {new Date(leagueInfo.start_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {leagueInfo.end_date && (
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">End Date</div>
                      <div className="text-lg font-semibold">
                        {new Date(leagueInfo.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Champions Section */}
                {(regularSeasonChampionName || openChampionName || playoffChampionName) && (
                  <div className="pt-4 border-t border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-3">Season Champions</div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Regular Season</div>
                        <div className="text-lg font-semibold">
                          {regularSeasonChampionName || 'TBD'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Open Tournament</div>
                        <div className="text-lg font-semibold">
                          {openChampionName || 'TBD'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Playoff Tournament</div>
                        <div className="text-lg font-semibold">
                          {playoffChampionName || 'TBD'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Triple Crown Progress */}
                {tripleCrownData.length > 0 && (
                  <div className="pt-4 border-t border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-3">Triple Crown Progress</div>
                    <div className="space-y-4">
                      {tripleCrownData.map((team) => {
                        const progress = (team.count / 3) * 100;
                        const isTripleCrown = team.count === 3;
                        
                        return (
                          <div key={team.teamId} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{team.teamName}</span>
                              <span className={`text-xs font-semibold ${
                                isTripleCrown ? 'text-yellow-400' : 'text-neutral-400'
                              }`}>
                                {team.count}/3
                                {isTripleCrown && ' 🏆 Triple Crown Achieved!'}
                              </span>
                            </div>
                            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isTripleCrown
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                    : progress >= 67
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-r from-neutral-600 to-neutral-700'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-neutral-500">
                              {team.championships.join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(leagueInfo.lg_url ||
                  leagueInfo.lg_discord ||
                  leagueInfo.twitch_url ||
                  leagueInfo.twitter_id) && (
                  <div className="pt-4 border-t border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-3">Links</div>
                    <div className="flex flex-wrap gap-2">
                      {leagueInfo.lg_url && (
                        <a
                          href={leagueInfo.lg_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 transition text-sm"
                        >
                          🌐 Website
                        </a>
                      )}
                      {leagueInfo.lg_discord && (
                        <a
                          href={leagueInfo.lg_discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded bg-indigo-900 hover:bg-indigo-800 transition text-sm"
                        >
                          💬 Discord
                        </a>
                      )}
                      {leagueInfo.twitch_url && (
                        <a
                          href={leagueInfo.twitch_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded bg-purple-900 hover:bg-purple-800 transition text-sm"
                        >
                          📺 Twitch
                        </a>
                      )}
                      {leagueInfo.twitter_id && (
                        <a
                          href={`https://twitter.com/${leagueInfo.twitter_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded bg-sky-900 hover:bg-sky-800 transition text-sm"
                        >
                          🐦 Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-neutral-400">
                No league information available.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 rounded-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-neutral-800">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold break-words">
                    {selectedMatch.team_a?.name} vs {selectedMatch.team_b?.name}
                  </h2>
                  <span className="text-sm text-neutral-400">
                    {selectedMatch.score_a}-{selectedMatch.score_b}
                  </span>
                </div>
                <button onClick={closeModal} className="text-neutral-400 hover:text-white flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{new Date(selectedMatch.played_at).toLocaleDateString()}</span>
                {selectedMatch.stage && <span>• {selectedMatch.stage}</span>}
                {getVerificationBadge(selectedMatch)}
              </div>
            </div>

            <div className="flex border-b border-neutral-800 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setModalTab('screenshot')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  modalTab === 'screenshot' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Screenshot
              </button>
              <button
                onClick={() => setModalTab('player-stats')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  modalTab === 'player-stats' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Player Stats
              </button>
              <button
                onClick={() => setModalTab('team-stats')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  modalTab === 'team-stats' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Team Stats
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-140px)]">
              {modalTab === 'screenshot' && selectedMatch.boxscore_url && (
                <div className="flex justify-center">
                  <img src={selectedMatch.boxscore_url} alt="Box Score" className="max-w-full h-auto rounded" />
                </div>
              )}

              {modalTab === 'player-stats' && (
                <div className="overflow-x-auto">
                  {selectedMatch?.verified !== true && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-200 text-sm flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Stats were derived from OCR and may contain errors. Only verified stats are entered into statistics tables.</span>
                    </div>
                  )}
                  {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center py-8 text-neutral-400">Loading stats...</div>
                  ) : playerStats.length > 0 ? (
                    (() => {
                      // Sort by team_a_id first, then by slot_index
                      const sortedStats = [...playerStats].sort((a, b) => {
                        // Team A players first
                        if (a.team_id === selectedMatch?.team_a_id && b.team_id !== selectedMatch?.team_a_id) return -1;
                        if (a.team_id !== selectedMatch?.team_a_id && b.team_id === selectedMatch?.team_a_id) return 1;
                        // Then by slot_index within each team
                        return (a.slot_index ?? 999) - (b.slot_index ?? 999);
                      });

                      return (
                        <table className="w-full text-sm">
                          <thead className="bg-neutral-950 text-neutral-300">
                            <tr>
                              <th className="text-left py-2 px-4">Player</th>
                              <th className="text-center py-2 px-4">GRD</th>
                              <th className="text-right py-2 px-4">PTS</th>
                              <th className="text-right py-2 px-4">REB</th>
                              <th className="text-right py-2 px-4">AST</th>
                              <th className="text-right py-2 px-4">STL</th>
                              <th className="text-right py-2 px-4">BLK</th>
                              <th className="text-right py-2 px-4">TO</th>
                              <th className="text-right py-2 px-4">PF</th>
                              <th className="text-right py-2 px-4">FG</th>
                              <th className="text-right py-2 px-4">3PT</th>
                              <th className="text-right py-2 px-4">FT</th>
                              <th className="text-right py-2 px-4">+/-</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800">
                            {sortedStats.map((stat, idx) => {
                              const isTeamA = stat.team_id === selectedMatch?.team_a_id;
                              return (
                                <tr key={idx} className={`hover:bg-neutral-950 ${isTeamA ? 'bg-blue-950/20' : 'bg-red-950/20'}`}>
                                  <td className="py-2 px-4">{stat.player_name}</td>
                                  <td className="text-center py-2 px-4">
                                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-xs font-bold">
                                      {stat.grd || '-'}
                                    </span>
                                  </td>
                                  <td className="text-right py-2 px-4 font-semibold">{stat.points}</td>
                                  <td className="text-right py-2 px-4">{stat.rebounds}</td>
                                  <td className="text-right py-2 px-4">{stat.assists}</td>
                                  <td className="text-right py-2 px-4">{stat.steals}</td>
                                  <td className="text-right py-2 px-4">{stat.blocks}</td>
                                  <td className="text-right py-2 px-4">{stat.turnovers}</td>
                                  <td className="text-right py-2 px-4">{stat.fouls}</td>
                                  <td className="text-right py-2 px-4">{stat.fgm}/{stat.fga}</td>
                                  <td className="text-right py-2 px-4">{stat.three_points_made}/{stat.three_points_attempted}</td>
                                  <td className="text-right py-2 px-4">{stat.ftm}/{stat.fta}</td>
                                  <td className={`text-right py-2 px-4 font-semibold ${
                                    (stat.plus_minus ?? 0) > 0 ? 'text-green-400' : 
                                    (stat.plus_minus ?? 0) < 0 ? 'text-red-400' : 
                                    'text-neutral-400'
                                  }`}>
                                    {stat.plus_minus !== null ? (stat.plus_minus > 0 ? `+${stat.plus_minus}` : stat.plus_minus) : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      );
                    })()
                  ) : (
                    <div className="text-center py-8 text-neutral-400">No player stats available.</div>
                  )}
                </div>
              )}

              {modalTab === 'team-stats' && (
                <div className="overflow-x-auto">
                  {selectedMatch?.verified !== true && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-200 text-sm flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Stats were derived from OCR and may contain errors. Only verified stats are entered into statistics tables.</span>
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center py-8 text-neutral-400">Loading stats...</div>
                  ) : teamStats.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-950 text-neutral-300">
                        <tr>
                          <th className="text-left py-2 px-4">Team</th>
                          <th className="text-center py-2 px-4">GRD</th>
                          <th className="text-right py-2 px-4">PTS</th>
                          <th className="text-right py-2 px-4">REB</th>
                          <th className="text-right py-2 px-4">AST</th>
                          <th className="text-right py-2 px-4">STL</th>
                          <th className="text-right py-2 px-4">BLK</th>
                          <th className="text-right py-2 px-4">TO</th>
                          <th className="text-right py-2 px-4">PF</th>
                          <th className="text-right py-2 px-4">FG%</th>
                          <th className="text-right py-2 px-4">3PT%</th>
                          <th className="text-right py-2 px-4">FT%</th>
                          <th className="text-right py-2 px-4">+/-</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {teamStats.map((stat, idx) => {
                          const fgPct = stat.field_goals_attempted > 0
                            ? ((stat.field_goals_made / stat.field_goals_attempted) * 100).toFixed(1)
                            : '-';
                          const threePct = stat.three_points_attempted > 0
                            ? ((stat.three_points_made / stat.three_points_attempted) * 100).toFixed(1)
                            : '-';
                          const ftPct = stat.free_throws_attempted > 0
                            ? ((stat.free_throws_made / stat.free_throws_attempted) * 100).toFixed(1)
                            : '0.0';

                          return (
                            <tr key={idx} className="hover:bg-neutral-950">
                              <td className="py-2 px-4 font-semibold">{stat.teams?.name || 'Team'}</td>
                              <td className="text-center py-2 px-4">
                                <span className="px-2 py-0.5 rounded bg-neutral-800 text-xs font-bold">
                                  {stat.grd || '-'}
                                </span>
                              </td>
                              <td className="text-right py-2 px-4 font-semibold">{stat.points}</td>
                              <td className="text-right py-2 px-4">{stat.rebounds}</td>
                              <td className="text-right py-2 px-4">{stat.assists}</td>
                              <td className="text-right py-2 px-4">{stat.steals}</td>
                              <td className="text-right py-2 px-4">{stat.blocks}</td>
                              <td className="text-right py-2 px-4">{stat.turnovers}</td>
                              <td className="text-right py-2 px-4">{stat.fouls}</td>
                              <td className="text-right py-2 px-4">{fgPct}%</td>
                              <td className="text-right py-2 px-4">{threePct}%</td>
                              <td className="text-right py-2 px-4">{ftPct}%</td>
                              <td className={`text-right py-2 px-4 font-semibold ${
                                (stat.plus_minus ?? 0) > 0 ? 'text-green-400' : 
                                (stat.plus_minus ?? 0) < 0 ? 'text-red-400' : 
                                'text-neutral-400'
                              }`}>
                                {stat.plus_minus !== null ? (stat.plus_minus > 0 ? `+${stat.plus_minus}` : stat.plus_minus) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-neutral-400">No team stats available.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

