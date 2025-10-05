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
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
};

export default function Badges({ player, playerId }: BadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch badges from API
        const response = await fetch(`/api/player-badges?playerId=${playerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }

        const badges: Badge[] = await response.json();
        setBadges(badges);
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
        <h2 className="text-xl font-bold text-white">Badges & Achievements</h2>
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

      {/* Progress Summary */}
      {badges.length > 0 && (
      <div className="rounded-lg border border-neutral-800 p-6 bg-neutral-900 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Progress Summary</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-neutral-400">Badges Unlocked</span>
              <span className="font-semibold text-white">{unlockedCount} / {totalCount}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-2xl font-bold text-blue-400">
              {Math.round((unlockedCount / totalCount) * 100)}%
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
