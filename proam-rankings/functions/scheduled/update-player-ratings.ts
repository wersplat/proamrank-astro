/**
 * Cloudflare Pages Scheduled Function
 * Updates player global ratings daily to apply decay penalties
 * 
 * Schedule: Daily at 2:00 AM UTC
 * Trigger: Via Cloudflare Pages Dashboard -> Settings -> Functions -> Cron Triggers
 * Cron Expression: 0 2 * * *
 */

import * as Sentry from '@sentry/cloudflare';

// Initialize Sentry
Sentry.init({
  dsn: "https://15ecc8d420bd1ac21d6ca88698ca4566@o4509330775277568.ingest.us.sentry.io/4510164326023168",
  environment: "production",
  tracesSampleRate: 1.0,
});

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase credentials' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call the Supabase function to update all player ratings
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_player_global_ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update ratings:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update ratings', 
          details: errorText 
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    console.log(`✅ Player ratings updated successfully. ${data?.length || 0} players updated.`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Player ratings updated successfully',
        playersUpdated: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating player ratings:', error);
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

