// Cloudflare Pages function to fetch player stats for a match
import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(context.request.url);
  const matchId = url.searchParams.get('match_id');
  const playerId = url.searchParams.get('player_id');

  if (!matchId && !playerId) {
    return new Response(JSON.stringify({ error: 'match_id or player_id required' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ 
        error: 'Supabase not configured',
        debug: { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch by player_id (for career stats)
    if (playerId) {
      const { data, error } = await supabase
        .from('player_stats')
        .select('id, match_id, points, assists, rebounds, steals, blocks, turnovers, fgm, fga, three_points_made, three_points_attempted, ftm, fta, created_at')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify(data || []), {
        headers: corsHeaders
      });
    }

    // Fetch by match_id (for match boxscore)
    if (matchId) {
      const { data, error } = await supabase
        .from('player_stats')
        .select('player_name, team_id, points, assists, rebounds, steals, blocks, turnovers, fgm, fga, three_points_made, three_points_attempted, ftm, fta')
        .eq('match_id', matchId)
        .order('points', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({ playerStats: data || [] }), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: corsHeaders
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

