import { useState } from "react";

type PlayerStat = {
  player_name: string;
  team_id: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgm: number;
  fga: number;
  three_points_made: number;
  three_points_attempted: number;
  ftm: number;
  fta: number;
};

type TeamStat = {
  team_id: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  field_goals_made: number;
  field_goals_attempted: number;
  three_points_made: number;
  three_points_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  teams?: { name: string; logo_url: string | null };
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
  lg_url?: string;
  lg_discord?: string;
  twitch_url?: string;
  twitter_id?: string;
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
}: LeagueTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [matchesPage, setMatchesPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalTab, setModalTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 0, label: "Standings" },
    { id: 1, label: "Teams" },
    { id: 2, label: "Matches" },
    { id: 3, label: "Top Performers" },
    { id: 4, label: "Information" },
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

  // Reset to page 1 when switching tabs
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    if (tabId === 2) {
      setMatchesPage(1);
    }
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
          <div className="overflow-x-auto">
            {standings.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                No standings available.
              </div>
            ) : (
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
                          {team.logo_url && (
                            <img
                              src={team.logo_url}
                              alt=""
                              className="h-6 w-6 rounded"
                            />
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
                          {team.logo_url && (
                            <img
                              src={team.logo_url}
                              alt=""
                              className="h-6 w-6 rounded"
                            />
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
            {/* Matches count and page info */}
            {matches.length > 0 && (
              <div className="mb-4 text-sm text-neutral-400">
                Showing {matchesStartIndex + 1}-{Math.min(matchesEndIndex, matches.length)} of {matches.length} matches
              </div>
            )}

            <div className="space-y-2">
              {matches.length === 0 ? (
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
                        {match.team_a?.logo_url && (
                          <img
                            src={match.team_a.logo_url}
                            alt=""
                            className="h-8 w-8 rounded"
                          />
                        )}
                        <div className="text-sm">{match.team_a?.name || "Team A"}</div>
                        <div className="text-lg font-bold">{match.score_a ?? 0}</div>
                      </div>
                      <div className="px-4 text-neutral-500">vs</div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="text-lg font-bold">{match.score_b ?? 0}</div>
                        <div className="text-sm">{match.team_b?.name || "Team B"}</div>
                        {match.team_b?.logo_url && (
                          <img
                            src={match.team_b.logo_url}
                            alt=""
                            className="h-8 w-8 rounded"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-500 mt-2">
                      <span>{new Date(match.played_at).toLocaleDateString()}</span>
                      {match.stage && <span>• {match.stage}</span>}
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

        {/* Top Performers Tab */}
        {activeTab === 3 && (
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

        {/* Information Tab */}
        {activeTab === 4 && (
          <div className="space-y-4">
            {leagueInfo ? (
              <>
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
                  {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center py-8 text-neutral-400">Loading stats...</div>
                  ) : playerStats.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-950 text-neutral-300">
                        <tr>
                          <th className="text-left py-2 px-4">Player</th>
                          <th className="text-right py-2 px-4">PTS</th>
                          <th className="text-right py-2 px-4">REB</th>
                          <th className="text-right py-2 px-4">AST</th>
                          <th className="text-right py-2 px-4">STL</th>
                          <th className="text-right py-2 px-4">BLK</th>
                          <th className="text-right py-2 px-4">TO</th>
                          <th className="text-right py-2 px-4">FG</th>
                          <th className="text-right py-2 px-4">3PT</th>
                          <th className="text-right py-2 px-4">FT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {playerStats.map((stat, idx) => (
                          <tr key={idx} className="hover:bg-neutral-950">
                            <td className="py-2 px-4">{stat.player_name}</td>
                            <td className="text-right py-2 px-4 font-semibold">{stat.points}</td>
                            <td className="text-right py-2 px-4">{stat.rebounds}</td>
                            <td className="text-right py-2 px-4">{stat.assists}</td>
                            <td className="text-right py-2 px-4">{stat.steals}</td>
                            <td className="text-right py-2 px-4">{stat.blocks}</td>
                            <td className="text-right py-2 px-4">{stat.turnovers}</td>
                            <td className="text-right py-2 px-4">{stat.fgm}/{stat.fga}</td>
                            <td className="text-right py-2 px-4">{stat.three_points_made}/{stat.three_points_attempted}</td>
                            <td className="text-right py-2 px-4">{stat.ftm}/{stat.fta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-neutral-400">No player stats available.</div>
                  )}
                </div>
              )}

              {modalTab === 'team-stats' && (
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-8 text-neutral-400">Loading stats...</div>
                  ) : teamStats.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-950 text-neutral-300">
                        <tr>
                          <th className="text-left py-2 px-4">Team</th>
                          <th className="text-right py-2 px-4">PTS</th>
                          <th className="text-right py-2 px-4">REB</th>
                          <th className="text-right py-2 px-4">AST</th>
                          <th className="text-right py-2 px-4">STL</th>
                          <th className="text-right py-2 px-4">BLK</th>
                          <th className="text-right py-2 px-4">TO</th>
                          <th className="text-right py-2 px-4">FG%</th>
                          <th className="text-right py-2 px-4">3PT%</th>
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

                          return (
                            <tr key={idx} className="hover:bg-neutral-950">
                              <td className="py-2 px-4 font-semibold">{stat.teams?.name || 'Team'}</td>
                              <td className="text-right py-2 px-4 font-semibold">{stat.points}</td>
                              <td className="text-right py-2 px-4">{stat.rebounds}</td>
                              <td className="text-right py-2 px-4">{stat.assists}</td>
                              <td className="text-right py-2 px-4">{stat.steals}</td>
                              <td className="text-right py-2 px-4">{stat.blocks}</td>
                              <td className="text-right py-2 px-4">{stat.turnovers}</td>
                              <td className="text-right py-2 px-4">{fgPct}%</td>
                              <td className="text-right py-2 px-4">{threePct}%</td>
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

