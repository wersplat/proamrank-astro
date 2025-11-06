type SeasonStat = {
  season_id: string;
  league_name: string | null;
  season_number: number | null;
  game_year: string | null;
  season_team_name: string | null;
  division_name: string | null;
  division_abbr: string | null;
  games_played: number;
  total_points: number;
  total_assists: number;
  total_rebounds: number;
  total_steals: number;
  total_blocks: number;
  total_turnovers: number;
  ppg: number | null;
  apg: number | null;
  rpg: number | null;
  spg: number | null;
  bpg: number | null;
  tpg: number | null;
  fg_pct: number | null;
  three_pt_pct: number | null;
  ft_pct: number | null;
  avg_performance_score: number | null;
  season_high_points: number | null;
  season_high_assists: number | null;
  season_high_rebounds: number | null;
  season_points_rank: number | null;
  season_assists_rank: number | null;
  season_rebounds_rank: number | null;
  season_performance_rank: number | null;
  potential_season_award: string | null;
  season_start_date: string | null;
  season_last_game: string | null;
};

type StatsBySeasonProps = {
  player: any;
  seasonStats: SeasonStat[] | null | undefined;
  loading?: boolean;
};

export default function StatsBySeason({ player, seasonStats, loading }: StatsBySeasonProps) {
  if (!player) return <div>Player not found</div>;

  // Sort seasons by game_year descending, then season_number descending
  const sortedStats = seasonStats
    ? [...seasonStats].sort((a, b) => {
        // Sort by year first (descending)
        if (a.game_year && b.game_year) {
          const yearDiff = parseInt(b.game_year) - parseInt(a.game_year);
          if (yearDiff !== 0) return yearDiff;
        }
        // Then by season number (descending)
        if (a.season_number !== null && b.season_number !== null) {
          return b.season_number - a.season_number;
        }
        // If no season number, prioritize league name
        if (a.league_name && b.league_name) {
          return a.league_name.localeCompare(b.league_name);
        }
        return 0;
      })
    : [];

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Stats by Season</h2>
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-400 text-sm sm:text-base">Loading season statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Stats by Season</h2>
      
      {sortedStats.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 text-center bg-gray-50 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-400 text-base sm:text-lg">
            No season statistics available
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {sortedStats.map((stat, index) => (
            <div
              key={stat.season_id || index}
              className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-4 sm:p-6"
            >
              {/* Season Header */}
              <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-neutral-800">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
                    {stat.league_name || 'Unknown League'}
                    {stat.season_number !== null && (
                      <span className="block sm:inline"> • Season {stat.season_number}</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stat.game_year && (
                      <span className="px-2 py-0.5 sm:py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium whitespace-nowrap">
                        {stat.game_year}
                      </span>
                    )}
                    {stat.potential_season_award && (
                      <span className="px-2 py-0.5 sm:py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm font-medium whitespace-nowrap">
                        🏆 {stat.potential_season_award}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
                  {stat.season_team_name && (
                    <span className="break-words">
                      <span className="font-medium">Team:</span> {stat.season_team_name}
                    </span>
                  )}
                  {stat.division_name && (
                    <span className="break-words">
                      <span className="font-medium">Division:</span> {stat.division_name}
                      {stat.division_abbr && ` (${stat.division_abbr})`}
                    </span>
                  )}
                  <span>
                    <span className="font-medium">Games:</span> {stat.games_played}
                  </span>
                  {(stat.season_start_date || stat.season_last_game) && (
                    <span className="break-words sm:break-normal">
                      <span className="font-medium">Season:</span>{' '}
                      {formatDate(stat.season_start_date)} - {formatDate(stat.season_last_game)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Per Game Averages */}
                <div>
                  <h4 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Per Game Averages</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">PPG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.ppg !== null ? stat.ppg.toFixed(1) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">APG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.apg !== null ? stat.apg.toFixed(1) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">RPG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.rpg !== null ? stat.rpg.toFixed(1) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">SPG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.spg !== null ? stat.spg.toFixed(1) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">BPG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.bpg !== null ? stat.bpg.toFixed(1) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">TPG</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {stat.tpg !== null ? stat.tpg.toFixed(1) : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shooting Percentages & Rankings */}
                <div>
                  <h4 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Shooting & Rankings</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">FG%</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatPercentage(stat.fg_pct)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">3PT%</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatPercentage(stat.three_pt_pct)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400">FT%</div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatPercentage(stat.ft_pct)}
                      </div>
                    </div>
                    {stat.season_points_rank && (
                      <div>
                        <div className="text-xs text-gray-600 dark:text-neutral-400">Points Rank</div>
                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                          #{stat.season_points_rank}
                        </div>
                      </div>
                    )}
                    {stat.season_assists_rank && (
                      <div>
                        <div className="text-xs text-gray-600 dark:text-neutral-400">Assists Rank</div>
                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                          #{stat.season_assists_rank}
                        </div>
                      </div>
                    )}
                    {stat.season_rebounds_rank && (
                      <div>
                        <div className="text-xs text-gray-600 dark:text-neutral-400">Rebounds Rank</div>
                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                          #{stat.season_rebounds_rank}
                        </div>
                      </div>
                    )}
                    {stat.season_performance_rank && (
                      <div>
                        <div className="text-xs text-gray-600 dark:text-neutral-400">Performance Rank</div>
                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                          #{stat.season_performance_rank}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Season Totals & Highs */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Total Points</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.total_points.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Total Assists</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.total_assists.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Total Rebounds</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.total_rebounds.toLocaleString()}
                    </div>
                  </div>
                  {stat.avg_performance_score !== null && (
                    <div>
                      <div className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Avg Performance</div>
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.avg_performance_score.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Season Highs */}
                {(stat.season_high_points || stat.season_high_assists || stat.season_high_rebounds) && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-neutral-700">
                    <div className="text-xs text-gray-600 dark:text-neutral-400 mb-2">Season Highs</div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {stat.season_high_points !== null && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-neutral-400">Points</div>
                          <div className="text-sm sm:text-md font-semibold text-purple-600 dark:text-purple-400">
                            {stat.season_high_points}
                          </div>
                        </div>
                      )}
                      {stat.season_high_assists !== null && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-neutral-400">Assists</div>
                          <div className="text-sm sm:text-md font-semibold text-purple-600 dark:text-purple-400">
                            {stat.season_high_assists}
                          </div>
                        </div>
                      )}
                      {stat.season_high_rebounds !== null && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-neutral-400">Rebounds</div>
                          <div className="text-sm sm:text-md font-semibold text-purple-600 dark:text-purple-400">
                            {stat.season_high_rebounds}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

