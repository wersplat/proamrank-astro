import type { APIRoute } from 'astro';
import { supa } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const matchId = url.searchParams.get('match_id');

  if (!matchId) {
    return new Response(JSON.stringify({ error: 'match_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get team stats
    const { data: statsData, error: statsError } = await supa()
      .from('team_match_stats')
      .select('team_id, points, rebounds, assists, steals, blocks, turnovers, field_goals_made, field_goals_attempted, three_points_made, three_points_attempted, free_throws_made, free_throws_attempted')
      .eq('match_id', matchId);

    if (statsError) {
      return new Response(JSON.stringify({ error: statsError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get team names
    const teamIds = (statsData || []).map((s: any) => s.team_id).filter(Boolean);
    const { data: teamsData } = teamIds.length > 0 ? await supa()
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

