import { useState, useEffect } from 'react';

type BadgesProps = {
  player: any;
  playerId: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeImage?: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  match_id?: string;
  gameData?: {
    played_at: string;
    team_a_name: string;
    team_b_name: string;
    score_a: number;
    score_b: number;
    player_stats?: any;
  };
};

type AchievementProgress = {
  totalAchievementsEarned: number;
  nextAchievementAlert?: string | null;
  pointsToNextMilestone?: number | null;
  reboundsToNextMilestone?: number | null;
  assistsToNextMilestone?: number | null;
  activeStreakType?: string | null;
  activeStreakLength?: number | null;
  streakLastGame?: string | null;
  count50PtGames: number;
  count40PtGames: number;
  count30PtGames: number;
  countTripleDoubles: number;
  countDoubleDoubles: number;
  count10AssistGames: number;
  count10ReboundGames: number;
  careerPoints: number;
  careerAssists: number;
  careerRebounds: number;
  careerGames: number;
};

export default function Badges({ player, playerId }: BadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch badges and achievement progress from API
        const response = await fetch(`/api/player-badges?playerId=${playerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }

        const data = await response.json();
        
        // Handle both old format (array) and new format (object with badges & achievementProgress)
        if (Array.isArray(data)) {
          // Old format: just array of badges
          setBadges(data);
          setAchievementProgress(null);
        } else {
          // New format: object with badges and achievementProgress
          setBadges(data.badges || []);
          setAchievementProgress(data.achievementProgress || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchBadges();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-neutral-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-neutral-400';
    }
  };

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-neutral-800';
      case 'rare': return 'bg-blue-900';
      case 'epic': return 'bg-purple-900';
      case 'legendary': return 'bg-yellow-900';
      default: return 'bg-neutral-800';
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6 text-white">Badges & Achievements</h2>
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-red-400">Error loading badges: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Badges & Achievements</h2>
          {achievementProgress && (
            <p className="text-sm text-neutral-400 mt-1">
              🏆 {achievementProgress.totalAchievementsEarned} Total Achievements Earned
            </p>
          )}
        </div>
        {badges.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-patriot-red-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unlocked' 
                ? 'bg-patriot-red-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'locked' 
                ? 'bg-patriot-red-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>
        )}
      </div>

      {/* Achievement Progress from achievement_eligibility_mart */}
      {achievementProgress && (
        <div className="space-y-4 mb-6">
          {/* Active Streak */}
          {achievementProgress.activeStreakType && (
            <div className="rounded-lg border border-orange-800/50 p-4 bg-orange-900/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-300">Active Streak</h3>
                  <p className="text-white font-bold">
                    {achievementProgress.activeStreakLength} {achievementProgress.activeStreakType}
                  </p>
                  {achievementProgress.streakLastGame && (
                    <p className="text-xs text-neutral-400 mt-1">
                      Last: {new Date(achievementProgress.streakLastGame).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Next Milestone Alert */}
          {achievementProgress.nextAchievementAlert && (
            <div className="rounded-lg border border-yellow-800/50 p-4 bg-yellow-900/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-300">Close to Milestone!</h3>
                  <p className="text-white font-medium">{achievementProgress.nextAchievementAlert}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    {achievementProgress.pointsToNextMilestone !== null && achievementProgress.pointsToNextMilestone !== undefined && (
                      <span className="text-neutral-300">
                        <span className="text-yellow-400 font-semibold">{achievementProgress.pointsToNextMilestone}</span> points away
                      </span>
                    )}
                    {achievementProgress.assistsToNextMilestone !== null && achievementProgress.assistsToNextMilestone !== undefined && (
                      <span className="text-neutral-300">
                        <span className="text-yellow-400 font-semibold">{achievementProgress.assistsToNextMilestone}</span> assists away
                      </span>
                    )}
                    {achievementProgress.reboundsToNextMilestone !== null && achievementProgress.reboundsToNextMilestone !== undefined && (
                      <span className="text-neutral-300">
                        <span className="text-yellow-400 font-semibold">{achievementProgress.reboundsToNextMilestone}</span> rebounds away
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Milestone Achievements */}
          <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
            <h3 className="text-sm font-semibold mb-3 text-neutral-300">Career Milestones</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-purple-400">{achievementProgress.count50PtGames}</div>
                <div className="text-xs text-neutral-400">50+ Point Games</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-blue-400">{achievementProgress.count40PtGames}</div>
                <div className="text-xs text-neutral-400">40+ Point Games</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-indigo-400">{achievementProgress.count30PtGames}</div>
                <div className="text-xs text-neutral-400">30+ Point Games</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-green-400">{achievementProgress.countTripleDoubles}</div>
                <div className="text-xs text-neutral-400">Triple-Doubles</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-cyan-400">{achievementProgress.countDoubleDoubles}</div>
                <div className="text-xs text-neutral-400">Double-Doubles</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-yellow-400">{achievementProgress.count10AssistGames}</div>
                <div className="text-xs text-neutral-400">10+ Assist Games</div>
              </div>
              <div className="text-center p-2 rounded bg-neutral-800/50">
                <div className="text-2xl font-bold text-orange-400">{achievementProgress.count10ReboundGames}</div>
                <div className="text-xs text-neutral-400">10+ Rebound Games</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      {badges.length > 0 && (
      <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Badges Progress</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-neutral-400">Badges Unlocked</span>
              <span className="font-semibold text-white">{unlockedCount} / {totalCount}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-2xl font-bold text-blue-400">
              {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-neutral-400 text-sm">Complete</div>
          </div>
        </div>
      </div>
      )}

      {/* Badges Grid */}
      {badges.length > 0 && (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBadges.map((badge) => {
          const isClickable = badge.unlocked && badge.match_id && badge.gameData;
          return (
          <div 
            key={badge.id}
            onClick={() => isClickable && setSelectedBadge(badge)}
            className={`rounded-lg border p-6 transition-all duration-200 ${
              badge.unlocked 
                ? 'border-neutral-700 bg-neutral-800' 
                : 'border-neutral-800 bg-neutral-900 opacity-60'
            } ${isClickable ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg' : ''}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`${badge.unlocked ? '' : 'opacity-50'} flex items-center justify-center`}>
                {badge.badgeImage ? (
                  <img 
                    src={badge.badgeImage} 
                    alt={badge.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-3xl';
                      fallback.textContent = badge.icon;
                      target.parentElement?.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="text-3xl">{badge.icon}</div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {badge.name}
                </h4>
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${getRarityBgColor(badge.rarity)} ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              {badge.description}
            </p>

            {badge.unlocked ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <span>✓</span>
                  <span>Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : ''}</span>
                </div>
                {isClickable && (
                  <div className="text-blue-400 text-xs">
                    🎮 View Game
                  </div>
                )}
              </div>
            ) : (
              <div>
                {badge.progress !== undefined && badge.maxProgress !== undefined ? (
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-neutral-400">Progress</span>
                      <span className="font-semibold text-white">{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-500 text-sm">
                    Not started
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
      )}

      {filteredBadges.length === 0 && !loading && (
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-neutral-400 text-lg">
            {badges.length === 0 ? 'No badges unlocked yet' : 'No badges found for the selected filter'}
          </p>
        </div>
      )}
      
      {loading && (
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-neutral-400">Loading badges...</p>
        </div>
      )}

      {/* Game Details Modal */}
      {selectedBadge && selectedBadge.gameData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-neutral-900 rounded-lg border border-neutral-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Achievement Unlocked</h3>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-neutral-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Achievement Info */}
              <div className="mb-6 text-center p-4 bg-neutral-800 rounded-lg">
                <div className="mb-2 flex items-center justify-center">
                  {selectedBadge.badgeImage ? (
                    <img 
                      src={selectedBadge.badgeImage} 
                      alt={selectedBadge.name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-4xl';
                        fallback.textContent = selectedBadge.icon;
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="text-4xl">{selectedBadge.icon}</div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{selectedBadge.name}</h4>
                <p className="text-sm text-neutral-400 mb-2">{selectedBadge.description}</p>
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <span>✓</span>
                  <span>Unlocked {selectedBadge.unlockedAt ? new Date(selectedBadge.unlockedAt).toLocaleDateString() : ''}</span>
                </div>
              </div>

              {/* Game Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-neutral-800 pb-2">Game Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-neutral-400 text-sm">Date</div>
                    <div className="text-white">
                      {new Date(selectedBadge.gameData.played_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-sm">Match ID</div>
                    <div className="text-white text-sm font-mono">{selectedBadge.match_id}</div>
                  </div>
                </div>

                {/* Teams and Score */}
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <div className="text-white font-semibold mb-1">{selectedBadge.gameData.team_a_name}</div>
                      <div className="text-2xl font-bold text-blue-400">{selectedBadge.gameData.score_a}</div>
                    </div>
                    <div className="text-neutral-500 px-4">vs</div>
                    <div className="flex-1 text-center">
                      <div className="text-white font-semibold mb-1">{selectedBadge.gameData.team_b_name}</div>
                      <div className="text-2xl font-bold text-blue-400">{selectedBadge.gameData.score_b}</div>
                    </div>
                  </div>
                </div>

                {/* Player Stats */}
                {selectedBadge.gameData.player_stats && (
                  <div>
                    <h5 className="text-sm font-semibold text-neutral-300 mb-2">Your Performance</h5>
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {selectedBadge.gameData.player_stats.per_game?.points !== undefined && (
                          <div>
                            <div className="text-2xl font-bold text-white">{selectedBadge.gameData.player_stats.per_game.points}</div>
                            <div className="text-xs text-neutral-400">Points</div>
                          </div>
                        )}
                        {selectedBadge.gameData.player_stats.per_game?.assists !== undefined && (
                          <div>
                            <div className="text-2xl font-bold text-white">{selectedBadge.gameData.player_stats.per_game.assists}</div>
                            <div className="text-xs text-neutral-400">Assists</div>
                          </div>
                        )}
                        {selectedBadge.gameData.player_stats.per_game?.rebounds !== undefined && (
                          <div>
                            <div className="text-2xl font-bold text-white">{selectedBadge.gameData.player_stats.per_game.rebounds}</div>
                            <div className="text-xs text-neutral-400">Rebounds</div>
                          </div>
                        )}
                      </div>
                    </div>
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
