CREATE MATERIALIZED VIEW match_analytics_mart AS
WITH match_contexts_summary AS (
    SELECT 
        match_id,
        ARRAY_AGG(DISTINCT league_id) FILTER (WHERE league_id IS NOT NULL) AS league_ids,
        ARRAY_AGG(DISTINCT season_id) FILTER (WHERE season_id IS NOT NULL) AS season_ids,
        ARRAY_AGG(DISTINCT tournament_id) FILTER (WHERE tournament_id IS NOT NULL) AS tournament_ids,
        MAX(CASE WHEN is_primary THEN 1 ELSE 0 END) = 1 AS has_primary_context
    FROM match_contexts
    GROUP BY match_id
),
match_team_stats AS (
    SELECT
        tms.match_id,
        m.team_a_id,
        m.team_b_id,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.points ELSE NULL END) AS team_a_points,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.points ELSE NULL END) AS team_b_points,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.assists ELSE NULL END) AS team_a_assists,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.assists ELSE NULL END) AS team_b_assists,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.rebounds ELSE NULL END) AS team_a_rebounds,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.rebounds ELSE NULL END) AS team_b_rebounds,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.steals ELSE NULL END) AS team_a_steals,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.steals ELSE NULL END) AS team_b_steals,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.blocks ELSE NULL END) AS team_a_blocks,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.blocks ELSE NULL END) AS team_b_blocks,
        MAX(CASE WHEN tms.team_id = m.team_a_id THEN tms.turnovers ELSE NULL END) AS team_a_turnovers,
        MAX(CASE WHEN tms.team_id = m.team_b_id THEN tms.turnovers ELSE NULL END) AS team_b_turnovers
    FROM team_match_stats tms
    JOIN matches m ON tms.match_id = m.id
    GROUP BY tms.match_id, m.team_a_id, m.team_b_id
),
match_mvp_info AS (
    SELECT
        mm.match_id,
        mm.player_id,
        p.gamertag AS mvp_name
    FROM match_mvp mm
    JOIN players p ON mm.player_id = p.id
)
SELECT
    m.id AS match_id,
    m.played_at,
    m.status,
    m.verified,
    m.stage,
    m.game_number,
    m.game_year,
    m.team_a_id,
    ta.name AS team_a_name,
    ta.logo_url AS team_a_logo,
    m.team_b_id,
    tb.name AS team_b_name,
    tb.logo_url AS team_b_logo,
    m.winner_id,
    tw.name AS winner_name,
    m.score_a,
    m.score_b,
    m.boxscore_url,
    mcs.league_ids,
    mcs.season_ids,
    mcs.tournament_ids,
    mcs.has_primary_context,
    COALESCE(mts.team_a_points, m.score_a) AS team_a_points,
    COALESCE(mts.team_b_points, m.score_b) AS team_b_points,
    mts.team_a_assists,
    mts.team_b_assists,
    mts.team_a_rebounds,
    mts.team_b_rebounds,
    mts.team_a_steals,
    mts.team_b_steals,
    mts.team_a_blocks,
    mts.team_b_blocks,
    mts.team_a_turnovers,
    mts.team_b_turnovers,
    ABS(COALESCE(m.score_a, 0) - COALESCE(m.score_b, 0)) AS score_differential,
    (SELECT COUNT(*) FROM player_stats WHERE match_id = m.id) AS total_player_stats,
    mmi.player_id AS mvp_player_id,
    mmi.mvp_name,
    l.league AS league_name,
    t.name AS tournament_name,
    CASE
        WHEN ABS(COALESCE(m.score_a, 0) - COALESCE(m.score_b, 0)) > 20 THEN 'Blowout'
        WHEN ABS(COALESCE(m.score_a, 0) - COALESCE(m.score_b, 0)) > 10 THEN 'Decisive'
        WHEN ABS(COALESCE(m.score_a, 0) - COALESCE(m.score_b, 0)) > 5 THEN 'Comfortable'
        ELSE 'Close'
    END AS game_type,
    EXTRACT(QUARTER FROM m.played_at) AS quarter,
    EXTRACT(YEAR FROM m.played_at) AS year,
    EXTRACT(MONTH FROM m.played_at) AS month,
    CASE
        WHEN m.played_at BETWEEN 
            DATE_TRUNC('year', m.played_at) + INTERVAL '0 month'
            AND DATE_TRUNC('year', m.played_at) + INTERVAL '3 month - 1 day'
        THEN 'Q1'
        WHEN m.played_at BETWEEN 
            DATE_TRUNC('year', m.played_at) + INTERVAL '3 month'
            AND DATE_TRUNC('year', m.played_at) + INTERVAL '6 month - 1 day'
        THEN 'Q2'
        WHEN m.played_at BETWEEN 
            DATE_TRUNC('year', m.played_at) + INTERVAL '6 month'
            AND DATE_TRUNC('year', m.played_at) + INTERVAL '9 month - 1 day'
        THEN 'Q3'
        ELSE 'Q4'
    END AS fiscal_quarter
FROM v_matches_with_primary_context m
LEFT JOIN match_contexts_summary mcs ON m.id = mcs.match_id
LEFT JOIN match_team_stats mts ON m.id = mts.match_id
LEFT JOIN match_mvp_info mmi ON m.id = mmi.match_id
LEFT JOIN teams ta ON m.team_a_id = ta.id
LEFT JOIN teams tb ON m.team_b_id = tb.id
LEFT JOIN teams tw ON m.winner_id = tw.id
LEFT JOIN leagues_info l ON m.primary_league_id = l.id
LEFT JOIN tournaments t ON m.primary_tournament_id = t.id
WHERE m.verified = TRUE;