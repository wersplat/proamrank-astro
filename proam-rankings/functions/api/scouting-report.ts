// Cloudflare Pages function to generate AI scouting reports for players
import OpenAI from 'openai';
import * as Sentry from '@sentry/cloudflare';

interface Env {
  OPENAI_API_KEY: string;
}

interface ScoutingReportRequest {
  player: {
    gamertag: string;
    position: string | null;
    performance: {
      games_played: number;
      avg_points: number | null;
      avg_assists: number | null;
      avg_rebounds: number | null;
      avg_steals: number | null;
      avg_blocks: number | null;
      avg_turnovers: number | null;
      avg_fg_pct: number | null;
      avg_three_pct: number | null;
      avg_ft_pct: number | null;
    };
    recentGames?: Array<{
      points: number | null;
      assists: number | null;
      rebounds: number | null;
      steals: number | null;
      blocks: number | null;
      turnovers: number | null;
      fgm: number | null;
      fga: number | null;
      three_points_made: number | null;
      three_points_attempted: number | null;
    }>;
  };
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  if (!context.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }), {
      status: 500,
      headers: corsHeaders
    });
  }

  try {
    const body: ScoutingReportRequest = await context.request.json();
    const { player } = body;

    if (!player || !player.performance) {
      return new Response(JSON.stringify({ error: 'Player data and performance stats are required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const performance = player.performance;
    
    // Determine primary position
    const primaryPosition = player.position || 'Not specified';
    
    // Position-specific context and expectations
    const positionContext: Record<string, string> = {
      'PG': 'Point Guard - Focus on playmaking, assists, ball handling, court vision, and facilitating offense. Strengths should emphasize distribution and decision-making. Areas for improvement should focus on scoring efficiency, turnovers, and defensive positioning.',
      'SG': 'Shooting Guard - Focus on scoring, shooting efficiency, perimeter defense, and offensive versatility. Strengths should emphasize scoring ability and shooting percentages. Areas for improvement should focus on playmaking, ball handling, and defensive consistency.',
      'SF': 'Small Forward - Focus on versatility, two-way play, scoring from multiple levels, and defensive versatility. Strengths should emphasize all-around game and versatility. Areas for improvement should focus on consistency, shooting efficiency, and playmaking.',
      'PF': 'Power Forward - Focus on rebounding, interior play, mid-range shooting, and physical presence. Strengths should emphasize rebounding and interior statistics. Areas for improvement should focus on perimeter skills, free throw shooting, and defensive positioning.',
      'C': 'Center - Focus on rebounding, blocks, interior defense, post play, and rim protection. Strengths should emphasize rebounding, blocks, and interior presence. Areas for improvement should focus on free throw shooting, perimeter defense, and offensive versatility.',
    };
    
    const positionGuidance = positionContext[primaryPosition] || 'Analyze based on overall statistical profile and playstyle.';
    
    // Build recent games summary
    const recentGamesSummary = player.recentGames && player.recentGames.length > 0
      ? player.recentGames.slice(0, 5).map((game, idx) => 
          `Game ${idx + 1}: ${game.points || 0} PTS, ${game.assists || 0} AST, ${game.rebounds || 0} REB, ${game.steals || 0} STL, ${game.blocks || 0} BLK, ${game.turnovers || 0} TOV`
        ).join('\n')
      : 'No recent games data available';
    
    const prompt = `You are an expert basketball scout analyzing a player for a professional Pro-Am basketball league. Generate a personalized scouting report based on the following statistics.

Player Information:
- Gamertag: ${player.gamertag}
- Position: ${primaryPosition}

Position-Specific Analysis Context:
${positionGuidance}

Career Statistics (${performance.games_played} games):
- Points Per Game: ${performance.avg_points?.toFixed(1) || 'N/A'}
- Assists Per Game: ${performance.avg_assists?.toFixed(1) || 'N/A'}
- Rebounds Per Game: ${performance.avg_rebounds?.toFixed(1) || 'N/A'}
- Steals Per Game: ${performance.avg_steals?.toFixed(1) || 'N/A'}
- Blocks Per Game: ${performance.avg_blocks?.toFixed(1) || 'N/A'}
- Turnovers Per Game: ${performance.avg_turnovers?.toFixed(1) || 'N/A'}
- Field Goal Percentage: ${performance.avg_fg_pct?.toFixed(1) || 'N/A'}%
- Three-Point Percentage: ${performance.avg_three_pct?.toFixed(1) || 'N/A'}%
- Free Throw Percentage: ${performance.avg_ft_pct?.toFixed(1) || 'N/A'}%

Recent Games Performance:
${recentGamesSummary}

Please generate a scouting report with the following structure:
1. Strengths: List 3-5 specific strengths based on their statistical performance, scoped to their primary position (${primaryPosition}). Be specific about what the numbers show and how they relate to position expectations.
2. Areas for Improvement: List 3-5 areas where the player could improve, scoped to their primary position (${primaryPosition}). Again, base this on the statistics and position-specific needs.
3. Scouting Summary: A 2-3 sentence summary paragraph that provides an overall assessment of the player's potential and playstyle.
4. NBA Comparison: Provide a comparison to a current or past NBA player whose playstyle and statistical profile is similar. Consider position, stat distribution, strengths, and weaknesses. Format as: "Player Name (era/team context) - brief 1-2 sentence reasoning for the comparison."

Return your response as a JSON object with this exact structure:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2", "area 3"],
  "summary": "Overall assessment paragraph here",
  "nbaComparison": "Player Name (era/team) - comparison reasoning"
}

Be specific, data-driven, and professional. Focus on what the statistics reveal about the player's skills and potential, with particular attention to position-specific expectations.`;

    const openai = new OpenAI({
      apiKey: context.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert basketball scout providing detailed, data-driven analysis for professional Pro-Am basketball leagues. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const scoutingReport = JSON.parse(content);

    // Validate the response structure
    if (!scoutingReport.strengths || !scoutingReport.areasForImprovement || !scoutingReport.summary || !scoutingReport.nbaComparison) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return new Response(JSON.stringify(scoutingReport), {
      headers: corsHeaders
    });
  } catch (error: any) {
    Sentry.captureException(error);
    console.error('Error generating scouting report:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate scouting report';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

