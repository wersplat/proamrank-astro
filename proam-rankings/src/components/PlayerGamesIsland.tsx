import { useState } from 'react';

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

export default function PlayerGamesIsland({ games }: { games: Game[] }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMatchData = (game: Game) => {
    return Array.isArray(game.matches) ? game.matches[0] : game.matches;
  };

  const calculateAverages = () => {
    if (!games || games.length === 0) return null;
    
    return {
      points: games.reduce((sum, game) => sum + (game.points || 0), 0) / games.length,
      assists: games.reduce((sum, game) => sum + (game.assists || 0), 0) / games.length,
      rebounds: games.reduce((sum, game) => sum + (game.rebounds || 0), 0) / games.length,
      steals: games.reduce((sum, game) => sum + (game.steals || 0), 0) / games.length,
      blocks: games.reduce((sum, game) => sum + (game.blocks || 0), 0) / games.length,
      turnovers: games.reduce((sum, game) => sum + (game.turnovers || 0), 0) / games.length,
    };
  };

  const averages = calculateAverages();

  return (
    <div>
      {games && games.length > 0 ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600 dark:text-neutral-400">
              Showing {games.length} recent games
            </p>
            <div className="text-sm text-gray-500 dark:text-neutral-500">
              Click any row for details
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300">
                <tr>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">PTS</th>
                  <th className="text-center py-3 px-4">AST</th>
                  <th className="text-center py-3 px-4">REB</th>
                  <th className="text-center py-3 px-4">STL</th>
                  <th className="text-center py-3 px-4">BLK</th>
                  <th className="text-center py-3 px-4">TOV</th>
                  <th className="text-center py-3 px-4">FG%</th>
                  <th className="text-center py-3 px-4">3PT%</th>
                  <th className="text-center py-3 px-4">📊</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {games.map((game, idx) => {
                  const matchData = getMatchData(game);
                  const hasBoxscore = matchData?.boxscore_url;
                  const fgPercentage = game.fga && game.fga > 0 ? ((game.fgm || 0) / game.fga * 100).toFixed(1) : '0.0';
                  const threePtPercentage = game.three_points_attempted && game.three_points_attempted > 0 
                    ? ((game.three_points_made || 0) / game.three_points_attempted * 100).toFixed(1) 
                    : '0.0';
                  
                  return (
                    <tr 
                      key={game.id}
                      className={`hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50 dark:bg-transparent'}`}
                      onClick={() => setSelectedGame(game)}
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {matchData?.played_at ? formatDate(matchData.played_at) : 'N/A'}
                      </td>
                      <td className={`py-3 px-4 text-center font-semibold ${
                        game.points >= 20 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {game.points || 0}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{game.assists || 0}</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{game.rebounds || 0}</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{game.steals || 0}</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{game.blocks || 0}</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{game.turnovers || 0}</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{fgPercentage}%</td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{threePtPercentage}%</td>
                      <td className="py-3 px-4 text-center">
                        {hasBoxscore && (
                          <span className="text-lg">📊</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Game Averages */}
          {averages && (
            <div className="mt-6 rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-gray-50 dark:bg-neutral-900">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Averages (Last {games.length} games)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Points</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.points.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Assists</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.assists.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Rebounds</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.rebounds.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Steals</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.steals.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Blocks</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.blocks.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Turnovers</div>
                  <div className="text-xl font-bold text-patriot-blue-600 dark:text-blue-400">
                    {averages.turnovers.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            No games found for this player
          </p>
        </div>
      )}

      {/* Game Detail Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Game Details</h3>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 dark:text-neutral-400 text-sm">Date</div>
                    <div className="text-gray-900 dark:text-white">
                      {getMatchData(selectedGame)?.played_at 
                        ? new Date(getMatchData(selectedGame).played_at).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-neutral-400 text-sm">Match ID</div>
                    <div className="text-gray-900 dark:text-white">{selectedGame.match_id}</div>
                  </div>
                </div>

                {/* Match Context Links */}
                {getMatchData(selectedGame) && (
                  <div className="space-y-2">
                    {(getMatchData(selectedGame).team_a?.name || getMatchData(selectedGame).team_b?.name) && (
                      <div>
                        <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Teams</div>
                        <div className="flex flex-wrap gap-2">
                          {getMatchData(selectedGame).team_a?.name && (
                            <a
                              href={`/teams/${getMatchData(selectedGame).team_a_id}`}
                              className="text-patriot-blue-600 dark:text-blue-400 hover:text-patriot-blue-700 dark:hover:text-blue-300 transition"
                            >
                              {getMatchData(selectedGame).team_a.name}
                            </a>
                          )}
                          {getMatchData(selectedGame).team_a?.name && getMatchData(selectedGame).team_b?.name && (
                            <span className="text-gray-500 dark:text-neutral-500">vs</span>
                          )}
                          {getMatchData(selectedGame).team_b?.name && (
                            <a
                              href={`/teams/${getMatchData(selectedGame).team_b_id}`}
                              className="text-patriot-blue-600 dark:text-blue-400 hover:text-patriot-blue-700 dark:hover:text-blue-300 transition"
                            >
                              {getMatchData(selectedGame).team_b.name}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {(getMatchData(selectedGame).league || getMatchData(selectedGame).tournament) && (
                      <div>
                        <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Context</div>
                        <div className="flex flex-wrap gap-2">
                          {getMatchData(selectedGame).league && getMatchData(selectedGame).season_id && (
                            <a
                              href={`/leagues/${getMatchData(selectedGame).season_id}`}
                              className="px-2 py-1 rounded bg-patriot-blue-100 dark:bg-patriot-blue-800 text-patriot-blue-700 dark:text-neutral-200 text-xs hover:bg-patriot-blue-200 dark:hover:bg-patriot-blue-700 transition"
                            >
                              {getMatchData(selectedGame).league.league_name} {getMatchData(selectedGame).league.season_number && `S${getMatchData(selectedGame).league.season_number}`}
                            </a>
                          )}
                          {getMatchData(selectedGame).tournament && getMatchData(selectedGame).tournament_id && (
                            <a
                              href={`/tournaments/${getMatchData(selectedGame).tournament_id}`}
                              className="px-2 py-1 rounded bg-red-100 dark:bg-patriot-red-900/30 text-red-700 dark:text-patriot-red-300 text-xs hover:bg-red-200 dark:hover:bg-patriot-red-900/50 transition"
                            >
                              {getMatchData(selectedGame).tournament.name}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Points</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.points || 0}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Assists</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.assists || 0}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Rebounds</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.rebounds || 0}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Steals</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.steals || 0}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Blocks</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.blocks || 0}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Turnovers</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGame.turnovers || 0}</div>
                  </div>
                </div>

                {getMatchData(selectedGame)?.boxscore_url && (
                  <div className="text-center">
                    <a
                      href={getMatchData(selectedGame).boxscore_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      View Full Boxscore
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}