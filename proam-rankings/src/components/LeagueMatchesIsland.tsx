import { useState } from "react";

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
  league_id?: string | null;
  season_id?: string | null;
  tournament_id?: string | null;
  team_a?: { name: string | null; logo_url: string | null };
  team_b?: { name: string | null; logo_url: string | null };
  league?: { league_id: string; league_name: string | null; season_number: number | null };
  tournament?: { id: string; name: string | null };
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

export default function LeagueMatchesIsland({ matches }: { matches: Match[] }) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleMatchClick = async (match: Match) => {
    if (!match.boxscore_url) return;
    
    setSelectedMatch(match);
    setActiveTab('screenshot');
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching stats for match:', match.id);
      
      const [playerRes, teamRes] = await Promise.all([
        fetch(`/api/player-stats?match_id=${match.id}`),
        fetch(`/api/team-stats?match_id=${match.id}`)
      ]);

      if (playerRes.ok) {
        const playerData = await playerRes.json();
        console.log('Player stats loaded:', playerData.playerStats?.length || 0);
        setPlayerStats(playerData.playerStats || []);
      } else {
        const errorData = await playerRes.json().catch(() => ({ error: 'Failed to parse error' }));
        setError(errorData.error || 'Failed to load player stats');
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        console.log('Team stats loaded:', teamData.teamStats?.length || 0);
        setTeamStats(teamData.teamStats || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setPlayerStats([]);
    setTeamStats([]);
  };

  return (
    <>
      <div className="space-y-2">
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => handleMatchClick(match)}
            className={`rounded-lg border border-neutral-800 p-4 transition ${
              match.boxscore_url ? 'cursor-pointer hover:border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-sm">{match.team_a?.name || 'Team A'}</div>
                <div className="text-lg font-bold">{match.score_a ?? 0}</div>
              </div>
              <div className="px-4 text-neutral-500">vs</div>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-lg font-bold">{match.score_b ?? 0}</div>
                <div className="text-sm">{match.team_b?.name || 'Team B'}</div>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-500 mt-2">
              <span>{new Date(match.played_at).toLocaleDateString()}</span>
              {match.league && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {match.league.league_name} {match.league.season_number && `S${match.league.season_number}`}
                </span>
              )}
              {match.tournament && (
                <span className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300">
                  {match.tournament.name}
                </span>
              )}
              {match.stage && <span>• {match.stage}</span>}
              {getVerificationBadge(match)}
              {match.boxscore_url && (
                <span className="ml-auto text-blue-400">📊 View boxscore</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal (same as MatchesListIsland) */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">
                  {selectedMatch.team_a?.name} vs {selectedMatch.team_b?.name}
                  <span className="ml-3 text-sm text-neutral-400">
                    {selectedMatch.score_a}-{selectedMatch.score_b}
                  </span>
                </h2>
                <button onClick={closeModal} className="text-neutral-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{new Date(selectedMatch.played_at).toLocaleDateString()}</span>
                {selectedMatch.league && (
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {selectedMatch.league.league_name} {selectedMatch.league.season_number && `S${selectedMatch.league.season_number}`}
                  </span>
                )}
                {selectedMatch.tournament && (
                  <span className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300">
                    {selectedMatch.tournament.name}
                  </span>
                )}
                {selectedMatch.stage && <span>• {selectedMatch.stage}</span>}
                {getVerificationBadge(selectedMatch)}
              </div>
            </div>

            <div className="flex border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('screenshot')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'screenshot' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Screenshot
              </button>
              <button
                onClick={() => setActiveTab('player-stats')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'player-stats' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Player Stats
              </button>
              <button
                onClick={() => setActiveTab('team-stats')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'team-stats' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Team Stats
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {activeTab === 'screenshot' && selectedMatch.boxscore_url && (
                <div className="flex justify-center">
                  <img src={selectedMatch.boxscore_url} alt="Box Score" className="max-w-full h-auto rounded" />
                </div>
              )}

              {activeTab === 'player-stats' && (
                <div className="overflow-x-auto">
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

              {activeTab === 'team-stats' && (
                <div className="overflow-x-auto">
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
                            : '-';

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
    </>
  );
}

