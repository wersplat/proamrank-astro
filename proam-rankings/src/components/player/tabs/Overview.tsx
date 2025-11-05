import { 
  getRatingTierColor, 
  getRatingTierLabel, 
  getRatingTierRange,
  formatDaysInactive,
  getActivityStatusColor
} from '../../../lib/ratingUtils';

type OverviewProps = {
  player: any;
  team: any;
  performance: any;
  globalRating?: any;
};

export default function Overview({ player, team, performance, globalRating }: OverviewProps) {
  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Player Overview</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Gamertag:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{player.gamertag}</span>
            </div>
            {player.alternate_gamertag && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-neutral-400">Alternate Gamertag:</span>
                <span className="font-semibold text-gray-700 dark:text-neutral-300">{player.alternate_gamertag}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-neutral-400">Position:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{player.position || 'Unknown'}</span>
            </div>
            {player.salary_tier && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-neutral-400">Salary Tier:</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">Tier {player.salary_tier}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Info */}
        {team && (
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Current Team</h3>
            <div className="flex items-center gap-4 mb-4">
              {team.logo_url && (
                <img 
                  src={team.logo_url} 
                  alt={team.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <div className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {team.name}
                </div>
                <div className="text-gray-600 dark:text-neutral-400 text-sm">
                  Rank #{team.global_rank || 'N/A'} • {team.current_rp || 0} RP
                </div>
              </div>
            </div>
            <a 
              href={`/teams/${team.id}`}
              className="text-patriot-blue-600 dark:text-blue-400 hover:text-patriot-blue-700 dark:hover:text-blue-300 text-sm transition-colors"
            >
              View Team Details →
            </a>
          </div>
        )}

        {/* Global Rating - New comprehensive rating card */}
        {globalRating && (
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Global Rating</h3>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Main Rating Display */}
              <div className="text-center sm:text-left">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-2">Overall Rating</div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                  {globalRating.global_rating?.toFixed(1) || '-'}
                </div>
                <div className={`inline-flex px-4 py-2 rounded-lg border font-bold text-sm ${getRatingTierColor(globalRating.rating_tier)}`}>
                  {globalRating.rating_tier || 'Unranked'} - {getRatingTierLabel(globalRating.rating_tier)}
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-500 mt-2">
                  Range: {getRatingTierRange(globalRating.rating_tier)}
                </div>
              </div>

              {/* Rating Components Breakdown */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Base</div>
                  <div className="text-lg font-bold text-patriot-blue-600 dark:text-blue-400">
                    +{globalRating.base_rating?.toFixed(1) || 0}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Game Impact</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{globalRating.game_impact?.toFixed(1) || 0}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Event Bonus</div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    +{globalRating.event_bonus?.toFixed(1) || 0}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Consistency</div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    +{globalRating.consistency_bonus?.toFixed(1) || 0}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Decay</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{globalRating.decay_penalty?.toFixed(1) || 0}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-950 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-neutral-400 text-xs mb-1">Games</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {globalRating.total_games || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Last Activity:</span>
              <span className={getActivityStatusColor(globalRating.days_since_last_game)}>
                {formatDaysInactive(globalRating.days_since_last_game)}
              </span>
            </div>
          </div>
        )}

        {/* Key Stats */}
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Key Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {player.player_rp !== null && player.player_rp !== undefined && (
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Ranking Points</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {player.player_rp}
                </div>
              </div>
            )}
            {performance?.games_played && (
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Games Played</div>
                <div className="text-2xl font-bold text-patriot-blue-600 dark:text-blue-400">
                  {performance.games_played}
                </div>
              </div>
            )}
            {performance?.avg_points && (
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">PPG</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {performance.avg_points.toFixed(1)}
                </div>
              </div>
            )}
            {globalRating?.peak_performance && (
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Peak Impact</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {globalRating.peak_performance.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Season Averages */}
        {performance && (
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Season Averages</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Points</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_points?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Assists</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_assists?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Rebounds</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_rebounds?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Steals</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_steals?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Blocks</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_blocks?.toFixed(1) || '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Turnovers</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performance.avg_turnovers?.toFixed(1) || '-'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media & Contact */}
        {(player.twitter_id || player.discord_id || player.twitch) && (
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Social Media & Contact</h3>
            <div className="flex flex-wrap gap-6">
              {player.twitter_id && (
                <a
                  href={`https://twitter.com/${player.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg 
                    className="w-5 h-5" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm font-medium">@{player.twitter_id}</span>
                </a>
              )}
              {player.discord_id && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                  <svg 
                    className="w-5 h-5 text-[#5865F2]" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="text-sm font-medium">{player.discord_id}</span>
                </div>
              )}
              {player.twitch && (
                <a
                  href={`https://twitch.tv/${player.twitch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:text-[#9146FF] transition-colors"
                >
                  <svg 
                    className="w-5 h-5" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                  <span className="text-sm font-medium">{player.twitch}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
