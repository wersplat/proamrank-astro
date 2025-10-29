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

        // TODO: Fetch actual media from API when implemented
        // For now, return empty array - only show real media
        const media: MediaItem[] = [];

        setMediaItems(media);
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

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6 text-white">Media & Highlights</h2>
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-red-400">Error loading media: {error}</p>
        </div>
      </div>
    );
  }

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Media & Highlights</h2>
        {mediaItems.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-patriot-blue-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'youtube' 
                ? 'bg-patriot-blue-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setFilter('twitch')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'twitch' 
                ? 'bg-patriot-blue-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            Twitch
          </button>
          <button
            onClick={() => setFilter('twitter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'twitter' 
                ? 'bg-patriot-blue-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => setFilter('instagram')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'instagram' 
                ? 'bg-patriot-blue-600 text-white' 
                : 'bg-patriot-blue-800 text-neutral-200 hover:text-white'
            }`}
          >
            Instagram
          </button>
        </div>
        )}
      </div>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMedia.map((item) => (
          <div 
            key={item.id}
            className="rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-all duration-200 cursor-pointer group"
            onClick={() => window.open(item.url, '_blank')}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-neutral-800">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-500">
                  {getTypeIcon(item.type)}
                </div>
              )}
              
              {/* Duration overlay */}
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
                  {formatDuration(item.duration)}
                </div>
              )}

              {/* Type indicator */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getTypeColor(item.type)} bg-black bg-opacity-80`}>
                <span>{getTypeIcon(item.type)}</span>
                <span className="capitalize">{item.type}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>

              <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-neutral-500">
                <span>{formatDate(item.publishedAt)}</span>
                <div className="flex gap-3">
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
      )}

      {filteredMedia.length === 0 && !loading && (
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-neutral-400 text-lg">
            {mediaItems.length === 0 ? 'No media available yet' : 'No media found for the selected filter'}
          </p>
        </div>
      )}
      
      {loading && (
        <div className="rounded-lg border border-neutral-800 p-8 text-center bg-neutral-900">
          <p className="text-neutral-400">Loading media...</p>
        </div>
      )}
    </div>
  );
}
