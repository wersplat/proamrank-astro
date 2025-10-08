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
    // Fetch by player_id (for career stats) - Use efficient view + single query for highs
    if (playerId) {
      // Get career aggregates from view (much more efficient!)
      const { data: careerData, error: careerError } = await supa(locals)
        .from('player_performance_view')
        .select('games_played, avg_points, avg_assists, avg_rebounds, avg_steals, avg_blocks')
        .eq('id', playerId)
        .single();

      if (careerError) {
        return new Response(JSON.stringify({ error: careerError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get career highs in one efficient query (max only, not all records)
      const { data: highsData, error: highsError } = await supa(locals)
        .from('player_stats')
        .select('points, assists, rebounds, steals, blocks, fgm, three_points_made, ftm')
        .eq('player_id', playerId)
        .order('points', { ascending: false })
        .limit(1);

      // Get other career highs with separate optimized queries
      const [assistsHigh, reboundsHigh, stealsHigh, blocksHigh] = await Promise.all([
        supa(locals).from('player_stats').select('assists').eq('player_id', playerId).order('assists', { ascending: false }).limit(1).single(),
        supa(locals).from('player_stats').select('rebounds').eq('player_id', playerId).order('rebounds', { ascending: false }).limit(1).single(),
        supa(locals).from('player_stats').select('steals').eq('player_id', playerId).order('steals', { ascending: false }).limit(1).single(),
        supa(locals).from('player_stats').select('blocks').eq('player_id', playerId).order('blocks', { ascending: false }).limit(1).single()
      ]);

      const careerStats = {
        games_played: careerData?.games_played || 0,
        // Averages from view
        avg_points: careerData?.avg_points || 0,
        avg_assists: careerData?.avg_assists || 0,
        avg_rebounds: careerData?.avg_rebounds || 0,
        avg_steals: careerData?.avg_steals || 0,
        avg_blocks: careerData?.avg_blocks || 0,
        // Career highs
        high_points: highsData?.[0]?.points || 0,
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

