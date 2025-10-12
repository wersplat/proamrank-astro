import { useState, useEffect } from 'react';

type PlayerBadgesProps = {
  player: any;
  playerId: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
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
  countTripleDoubles: number;
  countDoubleDoubles: number;
  count20AssistGames: number;
  count20ReboundGames: number;
  careerPoints: number;
  careerAssists: number;
  careerRebounds: number;
  careerGames: number;
};

export default function PlayerBadgesIsland({ player, playerId }: PlayerBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

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
        setBadges(data.badges || []);
        setAchievementProgress(data.achievementProgress);
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
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unlocked' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'locked' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
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
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{achievementProgress.count50PtGames}</div>
                <div className="text-xs text-neutral-400">50-Point Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{achievementProgress.count40PtGames}</div>
                <div className="text-xs text-neutral-400">40-Point Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{achievementProgress.countTripleDoubles}</div>
                <div className="text-xs text-neutral-400">Triple-Doubles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{achievementProgress.countDoubleDoubles}</div>
                <div className="text-xs text-neutral-400">Double-Doubles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{achievementProgress.count20AssistGames}</div>
                <div className="text-xs text-neutral-400">20-Assist Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{achievementProgress.count20ReboundGames}</div>
                <div className="text-xs text-neutral-400">20-Rebound Games</div>
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
        {filteredBadges.map((badge) => (
          <div 
            key={badge.id}
            className={`rounded-lg border p-6 transition-all duration-200 ${
              badge.unlocked 
                ? 'border-neutral-700 bg-neutral-800' 
                : 'border-neutral-800 bg-neutral-900 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-3xl ${badge.unlocked ? '' : 'opacity-50'}`}>
                {badge.icon}
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
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <span>✓</span>
                <span>Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : ''}</span>
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
        ))}
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
    </div>
  );
}
