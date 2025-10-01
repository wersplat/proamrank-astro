import { useState } from "react";

type Game = {
  id: string;
  match_id: string;
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
  ftm?: number;
  fta?: number;
  matches?: {
    id: string;
    played_at: string;
    team_a_id: string;
    team_b_id: string;
    score_a: number | null;
    score_b: number | null;
    boxscore_url?: string | null;
    stage?: string | null;
    league_id?: string | null;
    season_id?: string | null;
    tournament_id?: string | null;
    team_a?: { name: string | null };
    team_b?: { name: string | null };
    league?: { league_id: string; league_name: string | null; season_number: number | null };
    tournament?: { id: string; name: string | null };
  } | null;
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

export default function PlayerGamesIsland({ games }: { games: Game[] }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeTab, setActiveTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGameClick = async (game: Game) => {
    if (!game.matches?.boxscore_url) return;
    
    setSelectedGame(game);
    setActiveTab('screenshot');
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching stats for match:', game.match_id);
      
      const [playerRes, teamRes] = await Promise.all([
        fetch(`/api/player-stats?match_id=${game.match_id}`),
        fetch(`/api/team-stats?match_id=${game.match_id}`)
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
    setSelectedGame(null);
    setPlayerStats([]);
    setTeamStats([]);
  };

  return (
    <>
      <div className="rounded-lg border border-neutral-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-300">
            <tr>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Opponent</th>
              <th className="text-right py-2 px-4">PTS</th>
              <th className="text-right py-2 px-4">REB</th>
              <th className="text-right py-2 px-4">AST</th>
              <th className="text-right py-2 px-4">STL</th>
              <th className="text-right py-2 px-4">BLK</th>
              <th className="text-right py-2 px-4">FG%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {games.map((game) => {
              const match = game.matches;
              const fgPct = game.fga > 0 ? ((game.fgm / game.fga) * 100).toFixed(1) : '-';
              const hasBoxscore = match?.boxscore_url;

              return (
                <tr
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className={hasBoxscore ? 'hover:bg-neutral-900 cursor-pointer' : 'hover:bg-neutral-900'}
                >
                  <td className="py-2 px-4">
                    <div className="text-neutral-400">
                      {match?.played_at ? new Date(match.played_at).toLocaleDateString() : '-'}
                    </div>
                    <div className="flex items-center flex-wrap gap-1 mt-1">
                      {match?.league && (
                        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs">
                          {match.league.league_name} {match.league.season_number && `S${match.league.season_number}`}
                        </span>
                      )}
                      {match?.tournament && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs">
                          {match.tournament.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {match?.team_a?.name || match?.team_b?.name || 'Unknown'}
                    {hasBoxscore && <span className="ml-2 text-xs text-blue-400">📊</span>}
                  </td>
                  <td className="py-2 px-4 text-right font-semibold">{game.points ?? 0}</td>
                  <td className="py-2 px-4 text-right">{game.rebounds ?? 0}</td>
                  <td className="py-2 px-4 text-right">{game.assists ?? 0}</td>
                  <td className="py-2 px-4 text-right">{game.steals ?? 0}</td>
                  <td className="py-2 px-4 text-right">{game.blocks ?? 0}</td>
                  <td className="py-2 px-4 text-right">{fgPct}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedGame?.matches && (
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
                  {selectedGame.matches.team_a?.name} vs {selectedGame.matches.team_b?.name}
                  <span className="ml-3 text-sm text-neutral-400">
                    {selectedGame.matches.score_a}-{selectedGame.matches.score_b}
                  </span>
                </h2>
                <button onClick={closeModal} className="text-neutral-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{new Date(selectedGame.matches.played_at).toLocaleDateString()}</span>
                {selectedGame.matches.league && (
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {selectedGame.matches.league.league_name} {selectedGame.matches.league.season_number && `S${selectedGame.matches.league.season_number}`}
                  </span>
                )}
                {selectedGame.matches.tournament && (
                  <span className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300">
                    {selectedGame.matches.tournament.name}
                  </span>
                )}
                {selectedGame.matches.stage && <span>• {selectedGame.matches.stage}</span>}
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
              {activeTab === 'screenshot' && selectedGame.matches.boxscore_url && (
                <div className="flex justify-center">
                  <img src={selectedGame.matches.boxscore_url} alt="Box Score" className="max-w-full h-auto rounded" />
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

              {activeTab === 'team-stats' && (
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
    </>
  );
}

