// Cloudflare Pages function to fetch player stats for a match
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/cloudflare';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// Initialize Sentry
Sentry.init({
  dsn: "https://15ecc8d420bd1ac21d6ca88698ca4566@o4509330775277568.ingest.us.sentry.io/4510164326023168",
  environment: "production",
  tracesSampleRate: 1.0,
});

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

    // Fetch by player_id (for career stats) - Use efficient view + single query for highs
    if (playerId) {
      // Get career aggregates from view (much more efficient!)
      const { data: careerData, error: careerError } = await supabase
        .from('player_performance_view')
        .select('games_played, avg_points, avg_assists, avg_rebounds, avg_steals, avg_blocks')
        .eq('id', playerId)
        .single();

      if (careerError) {
        return new Response(JSON.stringify({ error: careerError.message }), {
          status: 500,
          headers: corsHeaders
        });
      }

      // Get career highs with optimized queries
      const [pointsHigh, assistsHigh, reboundsHigh, stealsHigh, blocksHigh] = await Promise.all([
        supabase.from('player_stats').select('points').eq('player_id', playerId).order('points', { ascending: false }).limit(1).single(),
        supabase.from('player_stats').select('assists').eq('player_id', playerId).order('assists', { ascending: false }).limit(1).single(),
        supabase.from('player_stats').select('rebounds').eq('player_id', playerId).order('rebounds', { ascending: false }).limit(1).single(),
        supabase.from('player_stats').select('steals').eq('player_id', playerId).order('steals', { ascending: false }).limit(1).single(),
        supabase.from('player_stats').select('blocks').eq('player_id', playerId).order('blocks', { ascending: false }).limit(1).single()
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
        high_points: pointsHigh.data?.points || 0,
        high_assists: assistsHigh.data?.assists || 0,
        high_rebounds: reboundsHigh.data?.rebounds || 0,
        high_steals: stealsHigh.data?.steals || 0,
        high_blocks: blocksHigh.data?.blocks || 0
      };

      return new Response(JSON.stringify(careerStats), {
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
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

