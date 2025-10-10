// Cloudflare Pages function to fetch team stats for a match
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

  if (!matchId) {
    return new Response(JSON.stringify({ error: 'match_id required' }), {
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

    // First get team stats
    const { data: statsData, error: statsError } = await supabase
      .from('team_match_stats')
      .select('team_id, points, rebounds, assists, steals, blocks, turnovers, field_goals_made, field_goals_attempted, three_points_made, three_points_attempted, free_throws_made, free_throws_attempted')
      .eq('match_id', matchId);

    if (statsError) {
      return new Response(JSON.stringify({ error: statsError.message }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Get team names
    const teamIds = (statsData || []).map((s: any) => s.team_id).filter(Boolean);
    const { data: teamsData } = teamIds.length > 0 ? await supabase
      .from('teams')
      .select('id, name, logo_url')
      .in('id', teamIds) : { data: [] };

    // Combine stats with team info
    const teamMap = new Map((teamsData || []).map((t: any) => [t.id, t]));
    const enrichedStats = (statsData || []).map((s: any) => ({
      ...s,
      teams: teamMap.get(s.team_id)
    }));

    return new Response(JSON.stringify({ teamStats: enrichedStats }), {
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

