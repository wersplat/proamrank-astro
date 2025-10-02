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

export default function PlayerBadgesIsland({ player, playerId }: PlayerBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for now - this would typically be an API call
        const mockBadges: Badge[] = [
          {
            id: '1',
            name: 'First Game',
            description: 'Play your first game',
            icon: '🎮',
            category: 'Milestone',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Point Scorer',
            description: 'Score 20+ points in a single game',
            icon: '🏀',
            category: 'Scoring',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-20'
          },
          {
            id: '3',
            name: 'Triple Double',
            description: 'Record a triple double (10+ points, assists, rebounds)',
            icon: '⭐',
            category: 'Performance',
            rarity: 'rare',
            unlocked: false,
            progress: 7,
            maxProgress: 10
          },
          {
            id: '4',
            name: 'Sharpshooter',
            description: 'Make 5+ three-pointers in a game',
            icon: '🎯',
            category: 'Shooting',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-02-01'
          },
          {
            id: '5',
            name: 'Defensive Anchor',
            description: 'Record 5+ steals and blocks combined in a game',
            icon: '🛡️',
            category: 'Defense',
            rarity: 'rare',
            unlocked: false,
            progress: 3,
            maxProgress: 5
          },
          {
            id: '6',
            name: 'Legendary Performance',
            description: 'Score 50+ points in a single game',
            icon: '👑',
            category: 'Legendary',
            rarity: 'legendary',
            unlocked: false,
            progress: 0,
            maxProgress: 50
          },
          {
            id: '7',
            name: 'Team Player',
            description: 'Record 10+ assists in a game',
            icon: '🤝',
            category: 'Assists',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-25'
          },
          {
            id: '8',
            name: 'Glass Cleaner',
            description: 'Grab 15+ rebounds in a game',
            icon: '🏆',
            category: 'Rebounding',
            rarity: 'epic',
            unlocked: false,
            progress: 12,
            maxProgress: 15
          }
        ];

        setBadges(mockBadges);
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

  if (loading) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Badges & Achievements</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400">Loading badges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Badges & Achievements</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-red-400">Error loading badges: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Badges & Achievements</h2>
        <div class="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unlocked' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'locked' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div class="rounded-lg border border-neutral-800 p-6 bg-neutral-900 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-white">Progress Summary</h3>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="flex justify-between mb-2">
              <span class="text-neutral-400">Badges Unlocked</span>
              <span class="font-semibold text-white">{unlockedCount} / {totalCount}</span>
            </div>
            <div class="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          <div class="text-center min-w-[80px]">
            <div class="text-2xl font-bold text-blue-400">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div class="text-neutral-400 text-sm">Complete</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBadges.map((badge) => (
          <div 
            key={badge.id}
            class={`rounded-lg border p-6 transition-all duration-200 ${
              badge.unlocked 
                ? 'border-neutral-700 bg-neutral-800' 
                : 'border-neutral-800 bg-neutral-900 opacity-60'
            }`}
          >
            <div class="flex items-center gap-4 mb-4">
              <div class={`text-3xl ${badge.unlocked ? '' : 'opacity-50'}`}>
                {badge.icon}
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-white mb-1">
                  {badge.name}
                </h4>
                <div class={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${getRarityBgColor(badge.rarity)} ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </div>
              </div>
            </div>

            <p class="text-neutral-400 text-sm mb-4 leading-relaxed">
              {badge.description}
            </p>

            {badge.unlocked ? (
              <div class="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <span>✓</span>
                <span>Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : ''}</span>
              </div>
            ) : (
              <div>
                {badge.progress !== undefined && badge.maxProgress !== undefined ? (
                  <div>
                    <div class="flex justify-between mb-2 text-sm">
                      <span class="text-neutral-400">Progress</span>
                      <span class="font-semibold text-white">{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div class="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div class="text-neutral-500 text-sm">
                    Not started
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400 text-lg">
            No badges found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
}
