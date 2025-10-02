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

        // This would typically be an API call to get all career stats
        // For now, we'll simulate with mock data
        const response = await fetch(`/api/player-stats?player_id=${playerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch career stats');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const stats = data.reduce((acc: any, game: any) => {
            acc.totalGames += 1;
            acc.totalPoints += game.points || 0;
            acc.totalAssists += game.assists || 0;
            acc.totalRebounds += game.rebounds || 0;
            acc.totalSteals += game.steals || 0;
            acc.totalBlocks += game.blocks || 0;
            acc.totalTurnovers += game.turnovers || 0;
            
            acc.careerHighPoints = Math.max(acc.careerHighPoints, game.points || 0);
            acc.careerHighAssists = Math.max(acc.careerHighAssists, game.assists || 0);
            acc.careerHighRebounds = Math.max(acc.careerHighRebounds, game.rebounds || 0);
            acc.careerHighSteals = Math.max(acc.careerHighSteals, game.steals || 0);
            acc.careerHighBlocks = Math.max(acc.careerHighBlocks, game.blocks || 0);
            
            return acc;
          }, {
            totalGames: 0,
            totalPoints: 0,
            totalAssists: 0,
            totalRebounds: 0,
            totalSteals: 0,
            totalBlocks: 0,
            totalTurnovers: 0,
            avgPoints: 0,
            avgAssists: 0,
            avgRebounds: 0,
            avgSteals: 0,
            avgBlocks: 0,
            avgTurnovers: 0,
            careerHighPoints: 0,
            careerHighAssists: 0,
            careerHighRebounds: 0,
            careerHighSteals: 0,
            careerHighBlocks: 0
          });

          // Calculate averages
          if (stats.totalGames > 0) {
            stats.avgPoints = stats.totalPoints / stats.totalGames;
            stats.avgAssists = stats.totalAssists / stats.totalGames;
            stats.avgRebounds = stats.totalRebounds / stats.totalGames;
            stats.avgSteals = stats.totalSteals / stats.totalGames;
            stats.avgBlocks = stats.totalBlocks / stats.totalGames;
            stats.avgTurnovers = stats.totalTurnovers / stats.totalGames;
          }

          setCareerStats(stats);
        } else {
          setCareerStats({
            totalGames: 0,
            totalPoints: 0,
            totalAssists: 0,
            totalRebounds: 0,
            totalSteals: 0,
            totalBlocks: 0,
            totalTurnovers: 0,
            avgPoints: 0,
            avgAssists: 0,
            avgRebounds: 0,
            avgSteals: 0,
            avgBlocks: 0,
            avgTurnovers: 0,
            careerHighPoints: 0,
            careerHighAssists: 0,
            careerHighRebounds: 0,
            careerHighSteals: 0,
            careerHighBlocks: 0
          });
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

  if (loading) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Career Statistics</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400">Loading career statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Career Statistics</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-red-400">Error loading career statistics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 class="text-xl font-bold mb-6 text-white">Career Statistics</h2>
      
      {careerStats && careerStats.totalGames > 0 ? (
        <div class="space-y-6">
          {/* Career Totals */}
          <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 class="text-lg font-semibold mb-4 text-white">Career Totals</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Games Played</div>
                <div class="text-2xl font-bold text-blue-400">
                  {careerStats.totalGames}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Total Points</div>
                <div class="text-2xl font-bold text-blue-400">
                  {careerStats.totalPoints.toLocaleString()}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Total Assists</div>
                <div class="text-2xl font-bold text-blue-400">
                  {careerStats.totalAssists.toLocaleString()}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Total Rebounds</div>
                <div class="text-2xl font-bold text-blue-400">
                  {careerStats.totalRebounds.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Career Averages */}
          <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 class="text-lg font-semibold mb-4 text-white">Career Averages</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Points</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgPoints.toFixed(1)}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Assists</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgAssists.toFixed(1)}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Rebounds</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgRebounds.toFixed(1)}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Steals</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgSteals.toFixed(1)}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Blocks</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgBlocks.toFixed(1)}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Turnovers</div>
                <div class="text-xl font-bold text-green-400">
                  {careerStats.avgTurnovers.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Career Highs */}
          <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 class="text-lg font-semibold mb-4 text-white">Career Highs</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Points</div>
                <div class="text-xl font-bold text-purple-400">
                  {careerStats.careerHighPoints}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Assists</div>
                <div class="text-xl font-bold text-purple-400">
                  {careerStats.careerHighAssists}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Rebounds</div>
                <div class="text-xl font-bold text-purple-400">
                  {careerStats.careerHighRebounds}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Steals</div>
                <div class="text-xl font-bold text-purple-400">
                  {careerStats.careerHighSteals}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Blocks</div>
                <div class="text-xl font-bold text-purple-400">
                  {careerStats.careerHighBlocks}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400 text-lg">
            No career statistics available
          </p>
        </div>
      )}
    </div>
  );
}
