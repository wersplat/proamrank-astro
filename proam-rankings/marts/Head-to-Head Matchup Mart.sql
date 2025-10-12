CREATE MATERIALIZED VIEW head_to_head_matchup_mart AS
WITH matchup_history AS (
    SELECT
        LEAST(m.team_a_id, m.team_b_id) AS team_1_id,
        GREATEST(m.team_a_id, m.team_b_id) AS team_2_id,
        m.id AS match_id,
        m.played_at,
        m.score_a,
        m.score_b,
        m.winner_id,
        m.primary_league_id,
        m.primary_tournament_id,
        m.primary_season_id,
        m.game_year,
        CASE 
            WHEN m.team_a_id < m.team_b_id THEN m.team_a_id
            ELSE m.team_b_id
        END AS canonical_team_1,
        CASE 
            WHEN m.team_a_id < m.team_b_id THEN m.team_b_id
            ELSE m.team_a_id
        END AS canonical_team_2,
        ROW_NUMBER() OVER (
            PARTITION BY LEAST(m.team_a_id, m.team_b_id), GREATEST(m.team_a_id, m.team_b_id)
            ORDER BY m.played_at DESC
        ) AS recency_rank
    FROM v_matches_with_primary_context m
    WHERE m.verified = TRUE
    AND m.team_a_id IS NOT NULL 
    AND m.team_b_id IS NOT NULL
),
recent_5_games AS (
    SELECT
        team_1_id,
        team_2_id,
        COUNT(*) AS recent_5_meetings,
        SUM(CASE WHEN winner_id = team_1_id THEN 1 ELSE 0 END) AS team_1_recent_wins,
        SUM(CASE WHEN winner_id = team_2_id THEN 1 ELSE 0 END) AS team_2_recent_wins
    FROM matchup_history
    WHERE recency_rank <= 5
    GROUP BY team_1_id, team_2_id
)
SELECT
    mh.team_1_id,
    t1.name AS team_1_name,
    t1.logo_url AS team_1_logo,
    mh.team_2_id,
    t2.name AS team_2_name,
    t2.logo_url AS team_2_logo,
    
    -- Overall Record
    COUNT(DISTINCT mh.match_id) AS total_meetings,
    SUM(CASE WHEN mh.winner_id = mh.team_1_id THEN 1 ELSE 0 END) AS team_1_wins,
    SUM(CASE WHEN mh.winner_id = mh.team_2_id THEN 1 ELSE 0 END) AS team_2_wins,
    
    -- Score Analytics
    AVG(CASE 
        WHEN mh.canonical_team_1 = mh.team_1_id THEN mh.score_a 
        ELSE mh.score_b 
    END) AS team_1_avg_score,
    AVG(CASE 
        WHEN mh.canonical_team_2 = mh.team_2_id THEN mh.score_b 
        ELSE mh.score_a 
    END) AS team_2_avg_score,
    AVG(ABS(mh.score_a - mh.score_b)) AS avg_score_differential,
    
    -- Context Breakdown
    COUNT(DISTINCT CASE WHEN mh.primary_league_id IS NOT NULL THEN mh.match_id END) AS league_meetings,
    COUNT(DISTINCT CASE WHEN mh.primary_tournament_id IS NOT NULL THEN mh.match_id END) AS tournament_meetings,
    
    -- Recent Form (Last 5 Games)
    COALESCE(MAX(r5.team_1_recent_wins), 0) AS team_1_last_5_wins,
    COALESCE(MAX(r5.team_2_recent_wins), 0) AS team_2_last_5_wins,
    
    -- Timeline
    MIN(mh.played_at) AS first_meeting,
    MAX(mh.played_at) AS last_meeting,
    DATE_PART('day', NOW() - MAX(mh.played_at)) AS days_since_last_meeting,
    
    -- Current Streaks
    CASE 
        WHEN (
            SELECT winner_id 
            FROM matchup_history sub 
            WHERE sub.team_1_id = mh.team_1_id 
            AND sub.team_2_id = mh.team_2_id 
            AND sub.recency_rank = 1
        ) = mh.team_1_id THEN 'Team 1'
        WHEN (
            SELECT winner_id 
            FROM matchup_history sub 
            WHERE sub.team_1_id = mh.team_1_id 
            AND sub.team_2_id = mh.team_2_id 
            AND sub.recency_rank = 1
        ) = mh.team_2_id THEN 'Team 2'
        ELSE NULL
    END AS current_winner,
    
    -- Participation Arrays
    ARRAY_AGG(DISTINCT mh.primary_league_id) FILTER (WHERE mh.primary_league_id IS NOT NULL) AS league_ids,
    ARRAY_AGG(DISTINCT mh.primary_tournament_id) FILTER (WHERE mh.primary_tournament_id IS NOT NULL) AS tournament_ids,
    ARRAY_AGG(DISTINCT mh.game_year) FILTER (WHERE mh.game_year IS NOT NULL) AS game_years
    
FROM matchup_history mh
LEFT JOIN teams t1 ON mh.team_1_id = t1.id
LEFT JOIN teams t2 ON mh.team_2_id = t2.id
LEFT JOIN recent_5_games r5 ON mh.team_1_id = r5.team_1_id AND mh.team_2_id = r5.team_2_id
GROUP BY mh.team_1_id, t1.name, t1.logo_url, mh.team_2_id, t2.name, t2.logo_url;

