import { useState } from "react";

type Player = {
  player_id: string;
  gamertag: string | null;
  position: string | null;
  joined_at: string | null;
  is_captain: boolean | null;
  is_player_coach: boolean | null;
  salary_tier: string | null;
};

type Match = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  winner_id: string | null;
  boxscore_url: string | null;
  status?: string | null;
  verified?: boolean | null;
  stage: string | null;
  team_a?: { name: string | null; logo_url: string | null };
  team_b?: { name: string | null; logo_url: string | null };
  league?: { league_id: string; league_name: string | null; season_number: number | null };
  tournament?: { id: string; name: string | null };
};

type TeamHistoryEntry = {
  player_id: string | null;
  gamertag: string | null;
  position: string | null;
  joined_at: string | null;
  left_at: string | null;
  season_number: number | null;
  league_name: string | null;
  team_logo: string | null;
  team_name: string | null;
  is_captain: boolean | null;
  is_player_coach: boolean | null;
  tournament_id: string | null;
  tournament_name: string | null;
};

type Championship = {
  id: string;
  team_name: string | null;
  year: string | null;
  league_name: string | null;
  season: number | null;
  is_tournament: boolean;
  tournament_date: string | null;
  event_tier: string | null;
  champion_logo: string | null;
};

type YearStats = {
  game_year: string | null;
  team_name: string | null;
  total_matches: number | null;
  matches_won: number | null;
  matches_lost: number | null;
  win_percentage: number | null;
  avg_points_scored: number | null;
  avg_points_allowed: number | null;
  best_placement: number | null;
  current_ranking_points: number | null;
  total_prize_amount: number | null;
};

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

type TeamTabsIslandProps = {
  teamId: string;
  players: Player[];
  matches: Match[];
  teamHistory: TeamHistoryEntry[];
  championships: Championship[];
  yearStats: YearStats[];
};

export default function TeamTabsIsland({
  teamId,
  players,
  matches,
  teamHistory,
  championships,
  yearStats,
}: TeamTabsIslandProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [matchesPage, setMatchesPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalTab, setModalTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 0, label: "Roster" },
    { id: 1, label: "Match History" },
    { id: 2, label: "Team History" },
    { id: 3, label: "Past Players" },
  ];

  // Pagination for matches
  const MATCHES_PER_PAGE = 25;
  const totalMatchPages = Math.ceil(matches.length / MATCHES_PER_PAGE);
  const matchesStartIndex = (matchesPage - 1) * MATCHES_PER_PAGE;
  const matchesEndIndex = matchesStartIndex + MATCHES_PER_PAGE;
  const paginatedMatches = matches.slice(matchesStartIndex, matchesEndIndex);

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

  // Format percentage
  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return '0.0%';
    if (value > 1) {
      return `${value.toFixed(1)}%`;
    } else {
      return `${(value * 100).toFixed(1)}%`;
    }
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50">
      {/* Tabs Header */}
      <div className="flex border-b border-neutral-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
        {/* Roster Tab */}
        {activeTab === 0 && (
          <div>
            {(() => {
              // Get current players from team history
              const currentPlayers = teamHistory.filter((entry) => !entry.left_at);
              
              if (currentPlayers.length === 0) {
                return (
                  <>
                    <h3 className="text-lg font-bold mb-4">Current Roster (0)</h3>
                    <div className="text-center py-8 text-neutral-400">
                      No roster information available.
                    </div>
                  </>
                );
              }

              // Group by tournament or league/season
              const grouped = currentPlayers.reduce((acc, entry) => {
                let key: string;
                let groupName: string;
                let groupType: 'tournament' | 'season';
                
                if (entry.tournament_id && entry.tournament_name) {
                  // Group by tournament
                  key = `tournament_${entry.tournament_id}`;
                  groupName = entry.tournament_name;
                  groupType = 'tournament';
                } else {
                  // Group by league and season
                  key = `season_${entry.league_name || 'Unknown League'}_${entry.season_number || 0}`;
                  groupName = `${entry.league_name || 'Unknown League'}${entry.season_number ? ` • Season ${entry.season_number}` : ''}`;
                  groupType = 'season';
                }
                
                if (!acc[key]) {
                  acc[key] = {
                    groupName,
                    groupType,
                    league_name: entry.league_name || 'Unknown League',
                    season_number: entry.season_number || 0,
                    tournament_name: entry.tournament_name,
                    entries: []
                  };
                }
                acc[key].entries.push(entry);
                return acc;
              }, {} as Record<string, { 
                groupName: string; 
                groupType: 'tournament' | 'season';
                league_name: string; 
                season_number: number; 
                tournament_name: string | null;
                entries: TeamHistoryEntry[] 
              }>);

              // Sort groups: tournaments first, then by season (most recent)
              const sortedGroups = Object.values(grouped).sort((a, b) => {
                if (a.groupType !== b.groupType) {
                  return a.groupType === 'tournament' ? -1 : 1;
                }
                if (a.groupType === 'season' && b.groupType === 'season') {
                  if (b.season_number !== a.season_number) {
                    return b.season_number - a.season_number;
                  }
                  return a.league_name.localeCompare(b.league_name);
                }
                return a.groupName.localeCompare(b.groupName);
              });

              return (
                <>
                  <h3 className="text-lg font-bold mb-4">Current Roster ({currentPlayers.length})</h3>
                  <div className="space-y-6">
                    {sortedGroups.map((group, groupIdx) => (
                      <div key={groupIdx} className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
                        <h4 className="font-bold mb-3 text-neutral-300 flex items-center gap-2">
                          {group.groupType === 'tournament' ? (
                            <>
                              <span>🏆 {group.tournament_name}</span>
                              <span className="text-xs text-neutral-500">(Tournament)</span>
                            </>
                          ) : (
                            <span>{group.groupName}</span>
                          )}
                          <span className="ml-auto text-xs text-neutral-500">
                            ({group.entries.length} player{group.entries.length !== 1 ? 's' : ''})
                          </span>
                        </h4>
                        <div className="space-y-2">
                          {group.entries
                            .sort((a, b) => {
                              // Sort by captain first, then by joined date
                              if (a.is_captain && !b.is_captain) return -1;
                              if (!a.is_captain && b.is_captain) return 1;
                              if (a.joined_at && b.joined_at) {
                                return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
                              }
                              return 0;
                            })
                            .map((entry, i) => (
                              <div key={i} className="rounded border border-neutral-700 bg-neutral-900/50 p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">
                                      {entry.player_id ? (
                                        <a 
                                          href={`/players/${entry.player_id}`}
                                          className="hover:text-blue-400 transition"
                                        >
                                          {entry.gamertag || 'Unknown Player'}
                                        </a>
                                      ) : (
                                        <span>{entry.gamertag || 'Unknown Player'}</span>
                                      )}
                                      {entry.is_captain && <span className="ml-2 text-xs text-lime-400">(C)</span>}
                                      {entry.is_player_coach && <span className="ml-2 text-xs text-cyan-400">(PC)</span>}
                                    </div>
                                    <div className="text-xs text-neutral-400 mt-1">
                                      {entry.position || 'No position'}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1">
                                      Joined: {entry.joined_at ? new Date(entry.joined_at).toLocaleDateString() : 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Match History Tab */}
        {activeTab === 1 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Match History</h3>
              {matches.length > 0 && (
                <div className="text-sm text-neutral-400">
                  Showing {matchesStartIndex + 1}-{Math.min(matchesEndIndex, matches.length)} of {matches.length}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  No matches found.
                </div>
              ) : (
                paginatedMatches.map((match) => {
                  const isTeamA = match.team_a_id === teamId;
                  const teamScore = isTeamA ? match.score_a : match.score_b;
                  const opponentScore = isTeamA ? match.score_b : match.score_a;
                  const opponent = isTeamA ? match.team_b : match.team_a;
                  const result = (teamScore || 0) > (opponentScore || 0) ? 'W' : 'L';

                  return (
                    <div
                      key={match.id}
                      onClick={() => handleMatchClick(match)}
                      className={`rounded-lg border border-neutral-800 p-4 transition ${
                        match.boxscore_url ? 'cursor-pointer hover:border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {opponent?.logo_url && (
                            <img src={opponent.logo_url} alt="" className="h-8 w-8 rounded" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-semibold">vs {opponent?.name || "Unknown"}</div>
                            <div className="text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
                              <span>{new Date(match.played_at).toLocaleDateString()}</span>
                              {match.league?.league_name && match.season_id && (
                                <>
                                  <span>•</span>
                                  <a
                                    href={`/leagues/${match.season_id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-blue-400 transition"
                                  >
                                    {match.league.league_name}
                                  </a>
                                </>
                              )}
                              {match.tournament?.name && match.tournament_id && (
                                <>
                                  <span>•</span>
                                  <a
                                    href={`/tournaments/${match.tournament_id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-purple-400 transition"
                                  >
                                    {match.tournament.name}
                                  </a>
                                </>
                              )}
                              {getVerificationBadge(match)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-bold ${result === 'W' ? 'text-green-400' : 'text-red-400'}`}>
                            {result} {teamScore}-{opponentScore}
                          </div>
                          {match.boxscore_url && (
                            <span className="text-xs text-blue-400">📊 View</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
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

        {/* Team History Tab */}
        {activeTab === 2 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Team History</h3>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Championships */}
              <div className="rounded-lg border border-neutral-800 p-4">
                <h4 className="font-bold mb-3 text-sm text-neutral-400">
                  Championships ({championships.length})
                </h4>
                {championships.length === 0 ? (
                  <div className="text-center py-4 text-neutral-400 text-sm">
                    No championships yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {championships.map((champ) => (
                      <div key={champ.id} className="rounded border border-neutral-700 p-3">
                        <div className="font-semibold text-sm">{champ.league_name || 'Unknown League'}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {champ.year || 'Unknown Year'}
                          {champ.season && ` • Season ${champ.season}`}
                          {champ.tournament_date && ` • ${new Date(champ.tournament_date).toLocaleDateString()}`}
                        </div>
                        {champ.event_tier && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-yellow-900 text-yellow-300">
                            {champ.event_tier}
                          </span>
                        )}
                        <div className="text-xs text-neutral-500 mt-1">
                          {champ.is_tournament ? '🏆 Tournament' : '👑 League'} Champion
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Year-by-Year Stats */}
              <div className="rounded-lg border border-neutral-800 p-4">
                <h4 className="font-bold mb-3 text-sm text-neutral-400">
                  Year-by-Year Performance
                </h4>
                {yearStats.length === 0 ? (
                  <div className="text-center py-4 text-neutral-400 text-sm">
                    No performance data available.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-neutral-950 text-neutral-300">
                        <tr>
                          <th className="text-left py-2 px-2">Year</th>
                          <th className="text-right py-2 px-2">W-L</th>
                          <th className="text-right py-2 px-2">Win%</th>
                          <th className="text-right py-2 px-2">PPG</th>
                          <th className="text-right py-2 px-2">RP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {yearStats.map((stat, i) => (
                          <tr key={i} className="hover:bg-neutral-900">
                            <td className="py-2 px-2">{stat.game_year || 'N/A'}</td>
                            <td className="text-right py-2 px-2">
                              {stat.matches_won || 0}-{stat.matches_lost || 0}
                            </td>
                            <td className="text-right py-2 px-2">
                              {formatPercentage(stat.win_percentage)}
                            </td>
                            <td className="text-right py-2 px-2">
                              {stat.avg_points_scored ? stat.avg_points_scored.toFixed(1) : '0.0'}
                            </td>
                            <td className="text-right py-2 px-2">
                              {stat.current_ranking_points ? Math.round(stat.current_ranking_points) : '0'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Past Players Tab */}
        {activeTab === 3 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Roster History</h3>
            {teamHistory.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No team history available.
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  // Group by tournament or league/season
                  const grouped = teamHistory.reduce((acc, entry) => {
                    let key: string;
                    let groupName: string;
                    let groupType: 'tournament' | 'season';
                    
                    if (entry.tournament_id && entry.tournament_name) {
                      // Group by tournament
                      key = `tournament_${entry.tournament_id}`;
                      groupName = entry.tournament_name;
                      groupType = 'tournament';
                    } else {
                      // Group by league and season
                      key = `season_${entry.league_name || 'Unknown League'}_${entry.season_number || 0}`;
                      groupName = `${entry.league_name || 'Unknown League'}${entry.season_number ? ` • Season ${entry.season_number}` : ''}`;
                      groupType = 'season';
                    }
                    
                    if (!acc[key]) {
                      acc[key] = {
                        groupName,
                        groupType,
                        league_name: entry.league_name || 'Unknown League',
                        season_number: entry.season_number || 0,
                        tournament_name: entry.tournament_name,
                        entries: []
                      };
                    }
                    acc[key].entries.push(entry);
                    return acc;
                  }, {} as Record<string, { 
                    groupName: string; 
                    groupType: 'tournament' | 'season';
                    league_name: string; 
                    season_number: number; 
                    tournament_name: string | null;
                    entries: TeamHistoryEntry[] 
                  }>);

                  // Sort groups: tournaments first, then by season (most recent)
                  const sortedGroups = Object.values(grouped).sort((a, b) => {
                    if (a.groupType !== b.groupType) {
                      return a.groupType === 'tournament' ? -1 : 1;
                    }
                    if (a.groupType === 'season' && b.groupType === 'season') {
                      if (b.season_number !== a.season_number) {
                        return b.season_number - a.season_number;
                      }
                      return a.league_name.localeCompare(b.league_name);
                    }
                    return a.groupName.localeCompare(b.groupName);
                  });

                  return sortedGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
                      <h4 className="font-bold mb-3 text-neutral-300 flex items-center gap-2">
                        {group.groupType === 'tournament' ? (
                          <>
                            <span>🏆 {group.tournament_name}</span>
                            <span className="text-xs text-neutral-500">(Tournament)</span>
                          </>
                        ) : (
                          <span>{group.groupName}</span>
                        )}
                        <span className="ml-auto text-xs text-neutral-500">
                          ({group.entries.length} player{group.entries.length !== 1 ? 's' : ''})
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {group.entries
                          .sort((a, b) => {
                            // Sort by captain first, then by joined date
                            if (a.is_captain && !b.is_captain) return -1;
                            if (!a.is_captain && b.is_captain) return 1;
                            if (a.joined_at && b.joined_at) {
                              return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
                            }
                            return 0;
                          })
                          .map((entry, i) => (
                            <div key={i} className="rounded border border-neutral-700 bg-neutral-900/50 p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">
                                    {entry.gamertag || 'Unknown Player'}
                                    {entry.is_captain && <span className="ml-2 text-xs text-lime-400">(C)</span>}
                                    {entry.is_player_coach && <span className="ml-2 text-xs text-cyan-400">(PC)</span>}
                                  </div>
                                  <div className="text-xs text-neutral-400 mt-1">
                                    {entry.position || 'No position'}
                                  </div>
                                  <div className="text-xs text-neutral-500 mt-1">
                                    {entry.joined_at ? new Date(entry.joined_at).toLocaleDateString() : 'Unknown'} - {entry.left_at ? new Date(entry.left_at).toLocaleDateString() : 'Present'}
                                  </div>
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {entry.left_at ? 'Former' : 'Current'}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ));
                })()}
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

