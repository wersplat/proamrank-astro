import type { APIRoute } from 'astro';
import { supa } from '../../lib/supabase';
import { getBadgeUrl } from '../../lib/badgeMapper';

export const GET: APIRoute = async ({ url, locals }) => {
  const playerId = url.searchParams.get('playerId');

  if (!playerId) {
    return new Response(JSON.stringify({ error: 'playerId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch achievement progress from achievement_eligibility_mart
    const { data: achievementData, error: martError } = await supa(locals)
      .from('achievement_eligibility_mart')
      .select('*')
      .eq('player_id', playerId)
      .single();

    // Fetch game counts from player_stats_tracking_mart (has detailed milestone counts)
    const { data: trackingData, error: trackingError } = await supa(locals)
      .from('player_stats_tracking_mart')
      .select('count_30pt_games, count_40pt_games, count_50pt_games, count_triple_doubles, count_double_doubles, count_10ast_games, count_10reb_games')
      .eq('player_id', playerId)
      .single();

    // Also fetch already unlocked awards with match details
    const { data: playerAwards, error: awardsError } = await supa(locals)
      .from('player_awards')
      .select(`
        *,
        match:matches!player_awards_match_id_fkey(
          id,
          played_at,
          score_a,
          score_b,
          team_a:teams!matches_team_a_id_fkey(name),
          team_b:teams!matches_team_b_id_fkey(name)
        )
      `)
      .eq('player_id', playerId)
      .order('awarded_at', { ascending: false });

    if (martError && awardsError) {
      console.error('Error fetching achievement data:', { martError, awardsError });
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

      // Get badge CDN URL - use custom domain badges.proamrank.gg
      const r2BaseUrl = import.meta.env.PUBLIC_BADGES_BASE_URL || 'https://badges.proamrank.gg';
      
      // Get fallback emoji icon (used when badge image is not available)
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

      // Build gameData from match info
      const gameData = award.match ? {
        played_at: award.match.played_at,
        team_a_name: award.match.team_a?.name || 'Team A',
        team_b_name: award.match.team_b?.name || 'Team B',
        score_a: award.match.score_a,
        score_b: award.match.score_b,
        player_stats: award.stats // Include the stats from the award
      } : undefined;

      // Try to get badge URL from R2
      const badgeUrl = getBadgeUrl(award.title, r2BaseUrl);
      const fallbackIcon = getIcon(award.title, category);
      
      return {
        id: award.id,
        name: award.title,
        description: getDescription(award.title, award.stats),
        icon: fallbackIcon, // Always keep fallback icon for error cases
        badgeImage: badgeUrl || undefined, // Set badgeImage if URL exists
        category,
        rarity,
        unlocked: true,
        unlockedAt: award.awarded_at,
        progress: undefined,
        maxProgress: undefined,
        match_id: award.match_id,
        gameData
      };
    });

    // Create response with both badges and achievement progress
    const response = {
      badges,
      achievementProgress: achievementData ? {
        totalAchievementsEarned: achievementData.total_achievements_earned || 0,
        nextAchievementAlert: achievementData.next_achievement_alert,
        pointsToNextMilestone: achievementData.points_to_next_milestone,
        reboundsToNextMilestone: null, // Not in achievement mart, would need to calculate
        assistsToNextMilestone: achievementData.assists_to_next_milestone,
        activeStreakType: achievementData.active_streak_type,
        activeStreakLength: achievementData.active_streak_length,
        streakLastGame: achievementData.streak_last_game,
        // Milestone counts from player_stats_tracking_mart
        count50PtGames: trackingData?.count_50pt_games || 0,
        count40PtGames: trackingData?.count_40pt_games || 0,
        count30PtGames: trackingData?.count_30pt_games || 0,
        countTripleDoubles: trackingData?.count_triple_doubles || 0,
        countDoubleDoubles: trackingData?.count_double_doubles || 0,
        count10AssistGames: trackingData?.count_10ast_games || 0,
        count10ReboundGames: trackingData?.count_10reb_games || 0,
        // Career totals from achievement_eligibility_mart
        careerPoints: achievementData.total_points || 0,
        careerAssists: achievementData.total_assists || 0,
        careerRebounds: achievementData.total_rebounds || 0,
        careerGames: achievementData.total_games || 0,
      } : null
    };

    return new Response(JSON.stringify(response), {
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

