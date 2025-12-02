import { useState, useEffect } from 'react';

type ScoutingReportProps = {
  player: any;
  performance: any;
  recentGames: any[];
};

interface ScoutingReport {
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
  nbaComparison: string;
}

export default function ScoutingReport({ player, performance, recentGames }: ScoutingReportProps) {
  const [scoutingReport, setScoutingReport] = useState<ScoutingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScoutingReport = async () => {
    if (!performance || performance.games_played === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scouting-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: {
            gamertag: player.gamertag,
            position: player.position,
            performance: {
              games_played: performance.games_played || 0,
              avg_points: performance.avg_points,
              avg_assists: performance.avg_assists,
              avg_rebounds: performance.avg_rebounds,
              avg_steals: performance.avg_steals,
              avg_blocks: performance.avg_blocks,
              avg_turnovers: performance.avg_turnovers,
              avg_fg_pct: performance.avg_fg_pct,
              avg_three_pct: performance.avg_three_pct,
              avg_ft_pct: performance.avg_ft_pct,
            },
            recentGames: recentGames?.slice(0, 10).map((game: any) => ({
              points: game.points,
              assists: game.assists,
              rebounds: game.rebounds,
              steals: game.steals,
              blocks: game.blocks,
              turnovers: game.turnovers,
              fgm: game.fgm,
              fga: game.fga,
              three_points_made: game.three_points_made,
              three_points_attempted: game.three_points_attempted,
            })) || [],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate scouting report');
      }

      const data = await response.json();
      setScoutingReport(data);
    } catch (err) {
      console.error('Error fetching scouting report:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scouting report';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if player has games played
    if (performance && performance.games_played > 0) {
      fetchScoutingReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.id]);

  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Scouting Report</h2>
      
      <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Generated Analysis</h3>
          {performance && performance.games_played > 0 && !scoutingReport && !loading && (
            <button
              onClick={fetchScoutingReport}
              className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
            >
              Generate Report
            </button>
          )}
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-neutral-400">Generating scouting report...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={fetchScoutingReport}
              className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {scoutingReport && !loading && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-neutral-300 space-y-1">
                {scoutingReport.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Areas for Improvement</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-neutral-300 space-y-1">
                {scoutingReport.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
            {scoutingReport.nbaComparison && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">NBA Comparison</h4>
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  {scoutingReport.nbaComparison}
                </p>
              </div>
            )}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              <p className="text-sm italic text-gray-700 dark:text-neutral-300">
                "{scoutingReport.summary}"
              </p>
            </div>
          </div>
        )}
        
        {!scoutingReport && !loading && !error && (!performance || performance.games_played === 0) && (
          <p className="text-gray-600 dark:text-neutral-400 text-center py-8">No game statistics available for scouting analysis</p>
        )}
      </div>
    </div>
  );
}

