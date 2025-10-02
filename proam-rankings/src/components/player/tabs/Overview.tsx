type OverviewProps = {
  player: any;
  team: any;
  performance: any;
};

export default function Overview({ player, team, performance }: OverviewProps) {
  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">Player Overview</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
          <h3 className="text-lg font-semibold mb-4 text-white">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-400">Gamertag:</span>
              <span className="font-semibold text-white">{player.gamertag}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Position:</span>
              <span className="font-semibold text-white">{player.position || 'Unknown'}</span>
            </div>
            {player.salary_tier && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Salary Tier:</span>
                <span className="font-semibold text-yellow-400">Tier {player.salary_tier}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Info */}
        {team && (
          <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-white">Current Team</h3>
            <div className="flex items-center gap-4 mb-4">
              {team.logo_url && (
                <img 
                  src={team.logo_url} 
                  alt={team.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <div className="font-semibold text-lg text-white mb-1">
                  {team.name}
                </div>
                <div className="text-neutral-400 text-sm">
                  Rank #{team.global_rank || 'N/A'} • {team.current_rp || 0} RP
                </div>
              </div>
            </div>
            <a 
              href={`/teams/${team.id}`}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View Team Details →
            </a>
          </div>
        )}

        {/* Key Stats */}
        <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
          <h3 className="text-lg font-semibold mb-4 text-white">Key Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {player.player_rp !== null && (
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Ranking Points</div>
                <div className="text-2xl font-bold text-blue-400">
                  {player.player_rp}
                </div>
              </div>
            )}
            {player.performance_score !== null && player.performance_score > 0 && (
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Performance</div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(player.performance_score)}
                </div>
              </div>
            )}
            {performance?.games_played && (
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Games Played</div>
                <div className="text-2xl font-bold text-blue-400">
                  {performance.games_played}
                </div>
              </div>
            )}
            {performance?.avg_points && (
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">PPG</div>
                <div className="text-2xl font-bold text-green-400">
                  {performance.avg_points.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Season Averages */}
        {performance && (
          <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-white">Season Averages</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Points</div>
                <div className="text-xl font-bold text-white">
                  {performance.avg_points?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Assists</div>
                <div className="text-xl font-bold text-white">
                  {performance.avg_assists?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Rebounds</div>
                <div className="text-xl font-bold text-white">
                  {performance.avg_rebounds?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Steals</div>
                <div className="text-xl font-bold text-white">
                  {performance.avg_steals?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Blocks</div>
                <div className="text-xl font-bold text-white">
                  {performance.avg_blocks?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400 text-sm mb-1">Turnovers</div>
                <div className="text-xl font-bold text-white">
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
