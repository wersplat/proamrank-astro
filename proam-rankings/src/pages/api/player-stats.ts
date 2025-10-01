import type { APIRoute } from 'astro';
import { supa } from '../../lib/supabase';

export const GET: APIRoute = async ({ url, locals }) => {
  const matchId = url.searchParams.get('match_id');

  if (!matchId) {
    return new Response(JSON.stringify({ error: 'match_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { data, error } = await supa(locals.runtime)
      .from('player_stats')
      .select('player_name, team_id, points, assists, rebounds, steals, blocks, turnovers, fgm, fga, three_points_made, three_points_attempted, ftm, fta')
      .eq('match_id', matchId)
      .order('points', { ascending: false });

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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

