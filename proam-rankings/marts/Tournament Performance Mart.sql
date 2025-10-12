CREATE MATERIALIZED VIEW tournament_performance_mart AS
WITH tournament_match_stats AS (
    SELECT 
        m.primary_tournament_id AS tournament_id,
        COUNT(DISTINCT m.id) AS total_matches,
        COUNT(DISTINCT m.team_a_id) + COUNT(DISTINCT m.team_b_id) AS total_team_appearances,
        COUNT(DISTINCT ps.player_id) AS total_players,
        AVG(m.score_a + m.score_b) AS avg_total_points_per_game,
        SUM(ps.points) AS total_points_scored,
        MIN(m.played_at) AS first_match_date,
        MAX(m.played_at) AS last_match_date
    FROM v_matches_with_primary_context m
    LEFT JOIN player_stats ps ON m.id = ps.match_id AND ps.verified = TRUE
    WHERE m.primary_tournament_id IS NOT NULL AND m.verified = TRUE
    GROUP BY m.primary_tournament_id
),
tournament_groups_info AS (
    SELECT 
        tournament_id,
        COUNT(DISTINCT id) AS group_count,
        SUM(max_teams) AS planned_team_capacity,
        STRING_AGG(DISTINCT name, ', ') AS group_names
    FROM tournament_groups
    GROUP BY tournament_id
),
tournament_results AS (
    SELECT 
        tournament_id,
        COUNT(DISTINCT team_id) AS teams_with_placement,
        STRING_AGG(t.name || ' (' || er.placement || ')', ', ' ORDER BY er.placement) AS top_3_teams
    FROM event_results er
    JOIN teams t ON er.team_id = t.id
    WHERE er.placement <= 3
    GROUP BY tournament_id
)
SELECT 
    t.id AS tournament_id,
    t.name AS tournament_name,
    t.start_date,
    t.end_date,
    t.game_year,
    t.console,
    t.tier AS tournament_tier,
    t.status,
    t.prize_pool,
    li.league AS organizer,
    li.lg_logo_url AS organizer_logo,
    champion.name AS champion_team,
    runner.name AS runner_up_team,
    t.banner_url,
    t.sponsor,
    t.sponsor_logo,
    COALESCE(tms.total_matches, 0) AS total_matches,
    COALESCE(tms.total_team_appearances, 0) / 2 AS unique_teams,
    COALESCE(tms.total_players, 0) AS total_players,
    COALESCE(tms.avg_total_points_per_game, 0) AS avg_total_points_per_game,
    COALESCE(tms.total_points_scored, 0) AS total_points_scored,
    tms.first_match_date,
    tms.last_match_date,
    COALESCE(tgi.group_count, 0) AS group_count,
    COALESCE(tgi.planned_team_capacity, 0) AS planned_team_capacity,
    tgi.group_names,
    tr.top_3_teams,
    esm.tier_score,
    esm.event_strength,
    esm.tier_label AS calculated_tier,
    CASE
        WHEN t.status = 'completed' THEN TRUE
        ELSE FALSE
    END AS is_completed,
    CASE
        WHEN t.end_date < CURRENT_DATE THEN TRUE
        ELSE FALSE
    END AS is_past_event
FROM tournaments t
LEFT JOIN leagues_info li ON t.organizer_id = li.id
LEFT JOIN teams champion ON t.champion = champion.id
LEFT JOIN teams runner ON t.runner_up = runner.id
LEFT JOIN tournament_match_stats tms ON t.id = tms.tournament_id
LEFT JOIN tournament_groups_info tgi ON t.id = tgi.tournament_id
LEFT JOIN tournament_results tr ON t.id = tr.tournament_id
LEFT JOIN event_strength_metrics_mv esm ON t.id = esm.tournament_id;