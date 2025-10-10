import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // This will trigger a server-side API error captured by Sentry
  throw new Error('[Sentry Test] API Route error - triggered from /api/sentry-test-error');
  
  // This code is unreachable but shows what a normal response would look like
  return new Response(JSON.stringify({ 
    message: 'This should not be reached'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Simulate a processing error
    if (body.trigger === 'error') {
      throw new Error('[Sentry Test] API Route POST error - triggered with body: ' + JSON.stringify(body));
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'No error triggered'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Error will be automatically captured by Sentry middleware
    throw error;
  }
};

