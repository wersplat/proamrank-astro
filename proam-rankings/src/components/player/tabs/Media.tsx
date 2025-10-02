import { useState, useEffect } from 'react';

type MediaProps = {
  player: any;
  playerId: string;
};

type MediaItem = {
  id: string;
  title: string;
  description: string;
  type: 'youtube' | 'twitch' | 'twitter' | 'instagram' | 'tiktok' | 'other';
  url: string;
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string;
  views?: number;
  likes?: number;
};

export default function Media({ player, playerId }: MediaProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'youtube' | 'twitch' | 'twitter' | 'instagram'>('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for now - this would typically be an API call
        const mockMedia: MediaItem[] = [
          {
            id: '1',
            title: 'Epic Triple Double Game',
            description: 'My best game of the season with 25 points, 12 assists, and 10 rebounds',
            type: 'youtube',
            url: 'https://youtube.com/watch?v=example1',
            thumbnailUrl: 'https://img.youtube.com/vi/example1/maxresdefault.jpg',
            publishedAt: '2024-01-15',
            duration: '12:34',
            views: 1250,
            likes: 89
          },
          {
            id: '2',
            title: 'Live Stream - Pro-Am Practice',
            description: 'Practicing with the team before the big tournament',
            type: 'twitch',
            url: 'https://twitch.tv/videos/example2',
            thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_example-320x180.jpg',
            publishedAt: '2024-01-20',
            duration: '2:15:30',
            views: 450,
            likes: 23
          },
          {
            id: '3',
            title: 'Game-winning shot! 🏀',
            description: 'Clutch 3-pointer to win the championship game',
            type: 'twitter',
            url: 'https://twitter.com/status/example3',
            thumbnailUrl: 'https://pbs.twimg.com/media/example3.jpg',
            publishedAt: '2024-01-25',
            views: 2100,
            likes: 156
          },
          {
            id: '4',
            title: 'Behind the Scenes: Team Practice',
            description: 'Getting ready for the upcoming season',
            type: 'instagram',
            url: 'https://instagram.com/p/example4',
            thumbnailUrl: 'https://scontent.cdninstagram.com/example4.jpg',
            publishedAt: '2024-02-01',
            views: 890,
            likes: 67
          },
          {
            id: '5',
            title: 'TikTok: Crazy Crossover',
            description: 'My signature move that always works',
            type: 'tiktok',
            url: 'https://tiktok.com/@user/video/example5',
            thumbnailUrl: 'https://p16-sign.tiktokcdn-us.com/example5.jpg',
            publishedAt: '2024-02-05',
            views: 5600,
            likes: 445
          }
        ];

        setMediaItems(mockMedia);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchMedia();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '📺';
      case 'twitch': return '🎮';
      case 'twitter': return '🐦';
      case 'instagram': return '📷';
      case 'tiktok': return '🎵';
      default: return '🔗';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube': return 'text-red-400';
      case 'twitch': return 'text-purple-400';
      case 'twitter': return 'text-blue-400';
      case 'instagram': return 'text-pink-400';
      case 'tiktok': return 'text-white';
      default: return 'text-neutral-400';
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (duration: string) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}`;
    } else if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    return duration;
  };

  if (loading) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Media & Highlights</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400">Loading media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 class="text-xl font-bold mb-6 text-white">Media & Highlights</h2>
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-red-400">Error loading media: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Media & Highlights</h2>
        <div class="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('youtube')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'youtube' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setFilter('twitch')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'twitch' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Twitch
          </button>
          <button
            onClick={() => setFilter('twitter')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'twitter' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => setFilter('instagram')}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'instagram' 
                ? 'bg-blue-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Instagram
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMedia.map((item) => (
          <div 
            key={item.id}
            class="rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-all duration-200 cursor-pointer group"
            onClick={() => window.open(item.url, '_blank')}
          >
            {/* Thumbnail */}
            <div class="relative aspect-video bg-neutral-800">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div class="w-full h-full flex items-center justify-center text-4xl text-neutral-500">
                  {getTypeIcon(item.type)}
                </div>
              )}
              
              {/* Duration overlay */}
              {item.duration && (
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
                  {formatDuration(item.duration)}
                </div>
              )}

              {/* Type indicator */}
              <div class={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getTypeColor(item.type)} bg-black bg-opacity-80`}>
                <span>{getTypeIcon(item.type)}</span>
                <span class="capitalize">{item.type}</span>
              </div>
            </div>

            {/* Content */}
            <div class="p-4">
              <h4 class="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>

              <p class="text-neutral-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Stats */}
              <div class="flex justify-between items-center text-xs text-neutral-500">
                <span>{formatDate(item.publishedAt)}</span>
                <div class="flex gap-3">
                  {item.views && (
                    <span>👁️ {item.views.toLocaleString()}</span>
                  )}
                  {item.likes && (
                    <span>❤️ {item.likes.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div class="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p class="text-neutral-400 text-lg">
            No media found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
}
