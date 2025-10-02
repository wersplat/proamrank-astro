import { useState } from 'react';

type GamesProps = {
  player: any;
  recentGames: any[];
};

export default function Games({ player, recentGames }: GamesProps) {
  const [selectedGame, setSelectedGame] = useState<any>(null);

  if (!player) return <div>Player not found</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMatchData = (game: any) => {
    return Array.isArray(game.matches) ? game.matches[0] : game.matches;
  };

  const calculateAverages = () => {
    if (!recentGames || recentGames.length === 0) return null;
    
    return {
      points: recentGames.reduce((sum, game) => sum + (game.points || 0), 0) / recentGames.length,
      assists: recentGames.reduce((sum, game) => sum + (game.assists || 0), 0) / recentGames.length,
      rebounds: recentGames.reduce((sum, game) => sum + (game.rebounds || 0), 0) / recentGames.length,
      steals: recentGames.reduce((sum, game) => sum + (game.steals || 0), 0) / recentGames.length,
      blocks: recentGames.reduce((sum, game) => sum + (game.blocks || 0), 0) / recentGames.length,
      turnovers: recentGames.reduce((sum, game) => sum + (game.turnovers || 0), 0) / recentGames.length,
    };
  };

  const averages = calculateAverages();

  return (
    <div>
      <h2 class="text-xl font-bold mb-6 text-white">Game History</h2>
      
      {recentGames && recentGames.length > 0 ? (
        <div>
          <div class="mb-4 flex justify-between items-center">
            <p class="text-neutral-400">
              Showing {recentGames.length} recent games
            </p>
            <div class="text-sm text-neutral-500">
              Click any row for details
            </div>
          </div>

          <div class="rounded-lg border border-neutral-800 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-neutral-800 text-neutral-300">
                <tr>
                  <th class="text-left py-3 px-4">Date</th>
                  <th class="text-center py-3 px-4">PTS</th>
                  <th class="text-center py-3 px-4">AST</th>
                  <th class="text-center py-3 px-4">REB</th>
                  <th class="text-center py-3 px-4">STL</th>
                  <th class="text-center py-3 px-4">BLK</th>
                  <th class="text-center py-3 px-4">TOV</th>
                  <th class="text-center py-3 px-4">FG%</th>
                  <th class="text-center py-3 px-4">3PT%</th>
                  <th class="text-center py-3 px-4">📊</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => {
                  const matchData = getMatchData(game);
                  const hasBoxscore = matchData?.boxscore_url;
                  const fgPercentage = game.fga && game.fga > 0 ? ((game.fgm || 0) / game.fga * 100).toFixed(1) : '0.0';
                  const threePtPercentage = game.three_points_attempted && game.three_points_attempted > 0 
                    ? ((game.three_points_made || 0) / game.three_points_attempted * 100).toFixed(1) 
                    : '0.0';
                  
                  return (
                    <tr 
                      key={game.id}
                      class="hover:bg-neutral-800 cursor-pointer transition-colors"
                      onClick={() => setSelectedGame(game)}
                    >
                      <td class="py-3 px-4 text-white">
                        {matchData?.played_at ? formatDate(matchData.played_at) : 'N/A'}
                      </td>
                      <td class={`py-3 px-4 text-center font-semibold ${
                        game.points >= 20 ? 'text-green-400' : 'text-white'
                      }`}>
                        {game.points || 0}
                      </td>
                      <td class="py-3 px-4 text-center text-white">{game.assists || 0}</td>
                      <td class="py-3 px-4 text-center text-white">{game.rebounds || 0}</td>
                      <td class="py-3 px-4 text-center text-white">{game.steals || 0}</td>
                      <td class="py-3 px-4 text-center text-white">{game.blocks || 0}</td>
                      <td class="py-3 px-4 text-center text-white">{game.turnovers || 0}</td>
                      <td class="py-3 px-4 text-center text-white">{fgPercentage}%</td>
                      <td class="py-3 px-4 text-center text-white">{threePtPercentage}%</td>
                      <td class="py-3 px-4 text-center">
                        {hasBoxscore && (
                          <span class="text-lg">📊</span>
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
            <div class="mt-6 rounded-lg border border-neutral-800 p-6 bg-neutral-900">
              <h3 class="text-lg font-semibold mb-4 text-white">Recent Averages (Last {recentGames.length} games)</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Points</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.points.toFixed(1)}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Assists</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.assists.toFixed(1)}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Rebounds</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.rebounds.toFixed(1)}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Steals</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.steals.toFixed(1)}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Blocks</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.blocks.toFixed(1)}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-neutral-400 text-sm mb-1">Turnovers</div>
                  <div class="text-xl font-bold text-blue-400">
                    {averages.turnovers.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400 text-lg">
            No games found for this player
          </p>
        </div>
      )}

      {/* Game Detail Modal */}
      {selectedGame && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-neutral-900 rounded-lg border border-neutral-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-white">Game Details</h3>
                <button
                  onClick={() => setSelectedGame(null)}
                  class="text-neutral-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-neutral-400 text-sm">Date</div>
                    <div class="text-white">
                      {getMatchData(selectedGame)?.played_at 
                        ? new Date(getMatchData(selectedGame).played_at).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div class="text-neutral-400 text-sm">Match ID</div>
                    <div class="text-white">{selectedGame.match_id}</div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Points</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.points || 0}</div>
                  </div>
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Assists</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.assists || 0}</div>
                  </div>
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Rebounds</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.rebounds || 0}</div>
                  </div>
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Steals</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.steals || 0}</div>
                  </div>
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Blocks</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.blocks || 0}</div>
                  </div>
                  <div class="text-center p-4 rounded-lg bg-neutral-800">
                    <div class="text-neutral-400 text-sm mb-1">Turnovers</div>
                    <div class="text-2xl font-bold text-white">{selectedGame.turnovers || 0}</div>
                  </div>
                </div>

                {getMatchData(selectedGame)?.boxscore_url && (
                  <div class="text-center">
                    <a
                      href={getMatchData(selectedGame).boxscore_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
