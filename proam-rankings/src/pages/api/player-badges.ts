import type { APIRoute } from 'astro';
import { supa } from '../../lib/supabase';

export const GET: APIRoute = async ({ url, locals }) => {
  const playerId = url.searchParams.get('playerId');

  if (!playerId) {
    return new Response(JSON.stringify({ error: 'playerId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch player awards from database
    const { data: playerAwards, error } = await supa(locals)
      .from('player_awards')
      .select('*')
      .eq('player_id', playerId)
      .order('awarded_at', { ascending: false });

    if (error) {
      console.error('Error fetching player awards:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch badges' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Transform to Badge format expected by the UI
    const badges = (playerAwards || []).map((award: any) => {
      // Map tier to rarity (normalize to lowercase for consistency)
      const rarityMap: Record<string, 'common' | 'rare' | 'epic' | 'legendary'> = {
        'bronze': 'common',
        'silver': 'common',
        'gold': 'rare',
        'platinum': 'epic',
        'common': 'common',
        'rare': 'rare',
        'epic': 'epic',
        'legendary': 'legendary'
      };

      const rarity = rarityMap[award.tier?.toLowerCase()] || 'common';

      // Determine category from stats or default to 'scoring'
      let category = 'scoring';
      if (award.stats?.rule_predicate) {
        const predicate = JSON.stringify(award.stats.rule_predicate);
        if (predicate.includes('assists') || predicate.includes('ast')) category = 'assists';
        else if (predicate.includes('rebounds') || predicate.includes('reb')) category = 'rebounding';
        else if (predicate.includes('steals') || predicate.includes('blocks') || predicate.includes('stl') || predicate.includes('blk')) category = 'defense';
        else if (predicate.includes('triple') || predicate.includes('double')) category = 'mixed';
      }

      // Get icon based on badge title/category
      const getIcon = (title: string, cat: string): string => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('bomb') || lowerTitle.includes('club') || lowerTitle.includes('scorer')) return '💥';
        if (lowerTitle.includes('efficiency') || lowerTitle.includes('sharp')) return '🎯';
        if (lowerTitle.includes('dimes') || cat === 'assists') return '🎯';
        if (lowerTitle.includes('defense') || lowerTitle.includes('clamps') || cat === 'defense') return '🛡️';
        if (lowerTitle.includes('board') || lowerTitle.includes('glass') || cat === 'rebounding') return '🪣';
        if (lowerTitle.includes('triple') || lowerTitle.includes('double') || cat === 'mixed') return '📊';
        if (lowerTitle.includes('streak') || lowerTitle.includes('iron')) return '🔥';
        if (lowerTitle.includes('perfect') || lowerTitle.includes('legendary')) return '🌟';
        return '🏀';
      };

      // Get description based on title or stats
      const getDescription = (title: string, stats: any): string => {
        if (stats?.per_game?.points) {
          return `Scored ${stats.per_game.points} points in a single game`;
        }
        // Default descriptions based on common badge names
        const descriptions: Record<string, string> = {
          '40 bomb': 'Score 40+ points in one game',
          '60 bomb': 'Score 60+ points in one game',
          '81 club': 'Score 81+ points in one game',
          '100 club': 'Score 100+ points in one game',
          'efficiency king': 'Achieve 70%+ FG with 15+ attempts',
          'sharp shooter': 'Make 10+ three-pointers in one game',
          'double dimes': 'Record 20+ assists in one game',
          'glass cleaner': 'Grab 20+ rebounds in one game',
          'triple-double machine': 'Record a triple-double',
        };
        
        const key = title.toLowerCase();
        return descriptions[key] || `Achieved ${title} badge`;
      };

      return {
        id: award.id,
        name: award.title,
        description: getDescription(award.title, award.stats),
        icon: getIcon(award.title, category),
        category,
        rarity,
        unlocked: true,
        unlockedAt: award.awarded_at,
        progress: undefined,
        maxProgress: undefined
      };
    });

    return new Response(JSON.stringify(badges), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Error in player-badges API:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

