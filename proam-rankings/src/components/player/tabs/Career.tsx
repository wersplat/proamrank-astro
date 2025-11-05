import { useState, useEffect } from 'react';

type CareerProps = {
  player: any;
  playerId: string;
};

type CareerStats = {
  totalGames: number;
  totalPoints: number;
  totalAssists: number;
  totalRebounds: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  avgPoints: number;
  avgAssists: number;
  avgRebounds: number;
  avgSteals: number;
  avgBlocks: number;
  avgTurnovers: number;
  careerHighPoints: number;
  careerHighAssists: number;
  careerHighRebounds: number;
  careerHighSteals: number;
  careerHighBlocks: number;
};

export default function Career({ player, playerId }: CareerProps) {
  const [careerStats, setCareerStats] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareerStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch career stats from optimized view endpoint
        const response = await fetch(`/api/player-stats?player_id=${playerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch career stats');
        }
        
        const data = await response.json();
        
        if (data && data.games_played > 0) {
          // Data is already aggregated from the view - just map it
          const stats: CareerStats = {
            totalGames: data.games_played,
            // Calculate totals from averages * games
            totalPoints: Math.round(data.avg_points * data.games_played),
            totalAssists: Math.round(data.avg_assists * data.games_played),
            totalRebounds: Math.round(data.avg_rebounds * data.games_played),
            totalSteals: Math.round(data.avg_steals * data.games_played),
            totalBlocks: Math.round(data.avg_blocks * data.games_played),
            totalTurnovers: 0, // Not available in view yet
            // Averages from view
            avgPoints: Number(data.avg_points) || 0,
            avgAssists: Number(data.avg_assists) || 0,
            avgRebounds: Number(data.avg_rebounds) || 0,
            avgSteals: Number(data.avg_steals) || 0,
            avgBlocks: Number(data.avg_blocks) || 0,
            avgTurnovers: 0, // Not available in view yet
            // Career highs
            careerHighPoints: data.high_points || 0,
            careerHighAssists: data.high_assists || 0,
            careerHighRebounds: data.high_rebounds || 0,
            careerHighSteals: data.high_steals || 0,
            careerHighBlocks: data.high_blocks || 0,
          };
          
          setCareerStats(stats);
        } else {
          setCareerStats(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load career stats');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchCareerStats();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Career Statistics</h2>
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-red-600 dark:text-red-400">Error loading career statistics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Career Statistics</h2>
      
      {loading ? (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-400">Loading career statistics...</p>
        </div>
      ) : careerStats && careerStats.totalGames > 0 ? (
        <div className="space-y-6">
          {/* Career Totals */}
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-gray-50 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Career Totals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Games Played</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {careerStats.totalGames}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Total Points</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {careerStats.totalPoints.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Total Assists</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {careerStats.totalAssists.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Total Rebounds</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {careerStats.totalRebounds.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Career Averages */}
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-gray-50 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Career Averages</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Points</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgPoints.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Assists</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgAssists.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Rebounds</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgRebounds.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Steals</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgSteals.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Blocks</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgBlocks.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Turnovers</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {careerStats.avgTurnovers.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Career Highs */}
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-gray-50 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Career Highs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Points</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {careerStats.careerHighPoints}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Assists</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {careerStats.careerHighAssists}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Rebounds</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {careerStats.careerHighRebounds}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Steals</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {careerStats.careerHighSteals}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Blocks</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {careerStats.careerHighBlocks}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            No career statistics available
          </p>
        </div>
      )}
    </div>
  );
}
