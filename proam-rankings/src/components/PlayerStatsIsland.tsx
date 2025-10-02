type PlayerStatsProps = {
  player: any;
  team: any;
  performance: any;
};

export default function PlayerStatsIsland({ player, team, performance }: PlayerStatsProps) {
  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 class="text-xl font-bold mb-6 text-white">Player Overview</h2>
      
      <div class="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
          <h3 class="text-lg font-semibold mb-4 text-white">Basic Information</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-neutral-400">Gamertag:</span>
              <span class="font-semibold text-white">{player.gamertag}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400">Position:</span>
              <span class="font-semibold text-white">{player.position || 'Unknown'}</span>
            </div>
            {player.salary_tier && (
              <div class="flex justify-between">
                <span class="text-neutral-400">Salary Tier:</span>
                <span class="font-semibold text-yellow-400">Tier {player.salary_tier}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Info */}
        {team && (
          <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 class="text-lg font-semibold mb-4 text-white">Current Team</h3>
            <div class="flex items-center gap-4 mb-4">
              {team.logo_url && (
                <img 
                  src={team.logo_url} 
                  alt={team.name}
                  class="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <div class="font-semibold text-lg text-white mb-1">
                  {team.name}
                </div>
                <div class="text-neutral-400 text-sm">
                  Rank #{team.global_rank || 'N/A'} • {team.current_rp || 0} RP
                </div>
              </div>
            </div>
            <a 
              href={`/teams/${team.id}`}
              class="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View Team Details →
            </a>
          </div>
        )}

        {/* Key Stats */}
        <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
          <h3 class="text-lg font-semibold mb-4 text-white">Key Stats</h3>
          <div class="grid grid-cols-2 gap-4">
            {player.player_rp !== null && (
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Ranking Points</div>
                <div class="text-2xl font-bold text-blue-400">
                  {player.player_rp}
                </div>
              </div>
            )}
            {player.performance_score !== null && player.performance_score > 0 && (
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Performance</div>
                <div class="text-2xl font-bold text-green-400">
                  {Math.round(player.performance_score)}
                </div>
              </div>
            )}
            {performance?.games_played && (
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Games Played</div>
                <div class="text-2xl font-bold text-blue-400">
                  {performance.games_played}
                </div>
              </div>
            )}
            {performance?.avg_points && (
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">PPG</div>
                <div class="text-2xl font-bold text-green-400">
                  {performance.avg_points.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Season Averages */}
        {performance && (
          <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 class="text-lg font-semibold mb-4 text-white">Season Averages</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Points</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_points?.toFixed(1) || '-'}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Assists</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_assists?.toFixed(1) || '-'}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Rebounds</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_rebounds?.toFixed(1) || '-'}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Steals</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_steals?.toFixed(1) || '-'}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Blocks</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_blocks?.toFixed(1) || '-'}
                </div>
              </div>
              <div class="text-center">
                <div class="text-neutral-400 text-sm mb-1">Turnovers</div>
                <div class="text-xl font-bold text-white">
                  {performance.avg_turnovers?.toFixed(1) || '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
