import type { APIRoute } from 'astro';
import { supa } from '../../lib/supabase';

export const GET: APIRoute = async ({ url, locals }) => {
  const matchId = url.searchParams.get('match_id');
  const playerId = url.searchParams.get('player_id');

  if (!matchId && !playerId) {
    return new Response(JSON.stringify({ error: 'match_id or player_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch by player_id (for career stats) - Use player_performance_mart and player_stats_tracking_mart
    if (playerId) {
      // Get performance data from player_performance_mart (much more efficient!)
      const { data: perfData, error: perfError } = await supa(locals)
        .from('player_performance_mart')
        .select('games_played, avg_points, avg_assists, avg_rebounds, avg_steals, avg_blocks')
        .eq('player_id', playerId)
        .single();

      if (perfError) {
        return new Response(JSON.stringify({ error: perfError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get career highs from player_stats_tracking_mart
      const { data: trackingData, error: trackingError } = await supa(locals)
        .from('player_stats_tracking_mart')
        .select('career_high_points, career_high_assists, career_high_rebounds, career_high_steals, career_high_blocks')
        .eq('player_id', playerId)
        .single();

      if (trackingError) {
        // If tracking mart doesn't exist or has no data, fall back to direct queries
        const [highsData, assistsHigh, reboundsHigh, stealsHigh, blocksHigh] = await Promise.all([
          supa(locals).from('player_stats').select('points').eq('player_id', playerId).order('points', { ascending: false }).limit(1).single(),
          supa(locals).from('player_stats').select('assists').eq('player_id', playerId).order('assists', { ascending: false }).limit(1).single(),
          supa(locals).from('player_stats').select('rebounds').eq('player_id', playerId).order('rebounds', { ascending: false }).limit(1).single(),
          supa(locals).from('player_stats').select('steals').eq('player_id', playerId).order('steals', { ascending: false }).limit(1).single(),
          supa(locals).from('player_stats').select('blocks').eq('player_id', playerId).order('blocks', { ascending: false }).limit(1).single()
        ]);

        const careerStats = {
          games_played: perfData?.games_played || 0,
          avg_points: perfData?.avg_points || 0,
          avg_assists: perfData?.avg_assists || 0,
          avg_rebounds: perfData?.avg_rebounds || 0,
          avg_steals: perfData?.avg_steals || 0,
          avg_blocks: perfData?.avg_blocks || 0,
          high_points: highsData.data?.points || 0,
          high_assists: assistsHigh.data?.assists || 0,
          high_rebounds: reboundsHigh.data?.rebounds || 0,
          high_steals: stealsHigh.data?.steals || 0,
          high_blocks: blocksHigh.data?.blocks || 0
        };

        return new Response(JSON.stringify(careerStats), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const careerStats = {
        games_played: perfData?.games_played || 0,
        // Averages from performance mart
        avg_points: perfData?.avg_points || 0,
        avg_assists: perfData?.avg_assists || 0,
        avg_rebounds: perfData?.avg_rebounds || 0,
        avg_steals: perfData?.avg_steals || 0,
        avg_blocks: perfData?.avg_blocks || 0,
        // Career highs from tracking mart
        high_points: trackingData?.career_high_points || 0,
        high_assists: trackingData?.career_high_assists || 0,
        high_rebounds: trackingData?.career_high_rebounds || 0,
        high_steals: trackingData?.career_high_steals || 0,
        high_blocks: trackingData?.career_high_blocks || 0
      };

      return new Response(JSON.stringify(careerStats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch by match_id (for match boxscore)
    if (matchId) {
      const { data, error } = await supa(locals)
        .from('player_stats')
        .select('player_name, team_id, points, assists, rebounds, steals, blocks, turnovers, fouls, fgm, fga, three_points_made, three_points_attempted, ftm, fta, plus_minus, grd, slot_index')
        .eq('match_id', matchId)
        .order('slot_index', { ascending: true });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ playerStats: data || [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

