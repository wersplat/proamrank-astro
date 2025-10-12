CREATE MATERIALIZED VIEW roster_value_comparison_mart AS
WITH current_rosters AS (
    SELECT
        tr.team_id,
        tr.player_id,
        p.position,
        p.salary_tier,
        p.monthly_value,
        p.player_rank_score,
        COALESCE(pgr.global_rating, 0) AS player_rating,
        pgr.rating_tier,
        tr.is_captain,
        tr.is_player_coach
    FROM team_rosters tr
    JOIN players p ON tr.player_id = p.id
    LEFT JOIN v_player_global_rating pgr ON p.id = pgr.player_id
    WHERE tr.left_at IS NULL
),
roster_by_position AS (
    SELECT
        team_id,
        position,
        COUNT(player_id) AS players_at_position,
        AVG(player_rating) AS avg_rating_at_position,
        SUM(monthly_value) AS total_value_at_position,
        ARRAY_AGG(player_id ORDER BY player_rating DESC) AS players_by_rating
    FROM current_rosters
    WHERE position IS NOT NULL
    GROUP BY team_id, position
),
roster_by_tier AS (
    SELECT
        team_id,
        salary_tier,
        COUNT(player_id) AS players_in_tier,
        AVG(player_rating) AS avg_rating_in_tier,
        SUM(monthly_value) AS total_value_in_tier
    FROM current_rosters
    WHERE salary_tier IS NOT NULL
    GROUP BY team_id, salary_tier
),
team_roster_summary AS (
    SELECT
        team_id,
        COUNT(player_id) AS total_roster_size,
        SUM(monthly_value) AS total_roster_value,
        AVG(monthly_value) AS avg_player_value,
        AVG(player_rating) AS avg_roster_rating,
        (ARRAY_AGG(player_id) FILTER (WHERE is_captain = TRUE))[1] AS captain_id,
        COUNT(CASE WHEN is_player_coach THEN 1 END) AS player_coaches,
        
        -- Star Power
        COUNT(CASE WHEN rating_tier IN ('S+', 'S', 'A+', 'A') THEN 1 END) AS elite_players,
        COUNT(CASE WHEN rating_tier IN ('B', 'C') THEN 1 END) AS role_players,
        COUNT(CASE WHEN rating_tier IN ('D', 'F') THEN 1 END) AS bench_players,
        
        -- Salary Cap Distribution
        COUNT(CASE WHEN salary_tier = 'S' THEN 1 END) AS s_tier_count,
        COUNT(CASE WHEN salary_tier = 'A' THEN 1 END) AS a_tier_count,
        COUNT(CASE WHEN salary_tier = 'B' THEN 1 END) AS b_tier_count,
        COUNT(CASE WHEN salary_tier = 'C' THEN 1 END) AS c_tier_count,
        COUNT(CASE WHEN salary_tier = 'D' THEN 1 END) AS d_tier_count
    FROM current_rosters
    GROUP BY team_id
),
depth_chart_analysis AS (
    SELECT
        team_id,
        -- Guard Depth
        MAX(CASE WHEN position IN ('Point Guard', 'Shooting Guard') THEN players_at_position ELSE 0 END) AS total_guards,
        AVG(CASE WHEN position IN ('Point Guard', 'Shooting Guard') THEN avg_rating_at_position END) AS avg_guard_rating,
        SUM(CASE WHEN position IN ('Point Guard', 'Shooting Guard') THEN total_value_at_position ELSE 0 END) AS total_guard_value,
        
        -- Wing Depth  
        MAX(CASE WHEN position = 'Lock' THEN players_at_position ELSE 0 END) AS total_locks,
        AVG(CASE WHEN position = 'Lock' THEN avg_rating_at_position END) AS avg_lock_rating,
        SUM(CASE WHEN position = 'Lock' THEN total_value_at_position ELSE 0 END) AS total_lock_value,
        
        -- Big Depth
        MAX(CASE WHEN position IN ('Power Forward', 'Center') THEN players_at_position ELSE 0 END) AS total_bigs,
        AVG(CASE WHEN position IN ('Power Forward', 'Center') THEN avg_rating_at_position END) AS avg_big_rating,
        SUM(CASE WHEN position IN ('Power Forward', 'Center') THEN total_value_at_position ELSE 0 END) AS total_big_value
    FROM roster_by_position
    GROUP BY team_id
),
positional_rankings AS (
    SELECT
        rbp.team_id,
        rbp.position,
        rbp.avg_rating_at_position,
        RANK() OVER (PARTITION BY rbp.position ORDER BY rbp.avg_rating_at_position DESC) AS position_rank
    FROM roster_by_position rbp
)
SELECT
    t.id AS team_id,
    t.name AS team_name,
    t.logo_url,
    
    -- Roster Overview
    COALESCE(trs.total_roster_size, 0) AS roster_size,
    COALESCE(trs.total_roster_value, 0) AS total_roster_value,
    ROUND(COALESCE(trs.avg_player_value, 0)::numeric, 0) AS avg_player_value,
    ROUND(COALESCE(trs.avg_roster_rating, 0)::numeric, 1) AS avg_roster_rating,
    
    -- Star Power Distribution
    COALESCE(trs.elite_players, 0) AS elite_players,
    COALESCE(trs.role_players, 0) AS role_players,
    COALESCE(trs.bench_players, 0) AS bench_players,
    
    -- Salary Tier Breakdown
    COALESCE(trs.s_tier_count, 0) AS s_tier_players,
    COALESCE(trs.a_tier_count, 0) AS a_tier_players,
    COALESCE(trs.b_tier_count, 0) AS b_tier_players,
    COALESCE(trs.c_tier_count, 0) AS c_tier_players,
    COALESCE(trs.d_tier_count, 0) AS d_tier_players,
    
    -- Position Group Depth
    COALESCE(dca.total_guards, 0) AS total_guards,
    ROUND(COALESCE(dca.avg_guard_rating, 0)::numeric, 1) AS avg_guard_rating,
    COALESCE(dca.total_guard_value, 0) AS total_guard_value,
    
    COALESCE(dca.total_locks, 0) AS total_locks,
    ROUND(COALESCE(dca.avg_lock_rating, 0)::numeric, 1) AS avg_lock_rating,
    COALESCE(dca.total_lock_value, 0) AS total_lock_value,
    
    COALESCE(dca.total_bigs, 0) AS total_bigs,
    ROUND(COALESCE(dca.avg_big_rating, 0)::numeric, 1) AS avg_big_rating,
    COALESCE(dca.total_big_value, 0) AS total_big_value,
    
    -- Positional Rankings (Relative to League)
    MAX(CASE WHEN pr.position = 'Point Guard' THEN pr.position_rank END) AS pg_rank,
    MAX(CASE WHEN pr.position = 'Shooting Guard' THEN pr.position_rank END) AS sg_rank,
    MAX(CASE WHEN pr.position = 'Lock' THEN pr.position_rank END) AS lock_rank,
    MAX(CASE WHEN pr.position = 'Power Forward' THEN pr.position_rank END) AS pf_rank,
    MAX(CASE WHEN pr.position = 'Center' THEN pr.position_rank END) AS center_rank,
    
    -- Team Building Indicators
    CASE
        WHEN trs.total_roster_size < 5 THEN 'Understaffed'
        WHEN trs.total_roster_size >= 5 AND trs.total_roster_size <= 8 THEN 'Optimal'
        WHEN trs.total_roster_size > 8 THEN 'Deep Roster'
        ELSE 'No Roster'
    END AS roster_depth_status,
    
    CASE
        WHEN trs.elite_players >= 2 AND trs.role_players >= 3 THEN 'Championship Contender'
        WHEN trs.elite_players >= 1 AND trs.role_players >= 3 THEN 'Playoff Contender'
        WHEN trs.elite_players >= 1 OR (trs.role_players >= 4 AND trs.avg_roster_rating >= 70) THEN 'Competitive'
        ELSE 'Developing'
    END AS roster_tier_assessment,
    
    -- Balance Score (how evenly distributed is talent across positions)
    CASE
        WHEN dca.avg_guard_rating > 0 AND dca.avg_lock_rating > 0 AND dca.avg_big_rating > 0 THEN
            ROUND((1 - (
                (SELECT STDDEV_POP(val) / NULLIF(AVG(val), 0) 
                 FROM (VALUES (dca.avg_guard_rating), (dca.avg_lock_rating), (dca.avg_big_rating)) AS t(val))
            ))::numeric, 3)
        ELSE NULL
    END AS positional_balance_score,
    
    -- Captain Info
    trs.captain_id,
    (SELECT gamertag FROM players WHERE id = trs.captain_id) AS captain_name,
    COALESCE(trs.player_coaches, 0) AS player_coaches

FROM teams t
LEFT JOIN team_roster_summary trs ON t.id = trs.team_id
LEFT JOIN depth_chart_analysis dca ON t.id = dca.team_id
LEFT JOIN positional_rankings pr ON t.id = pr.team_id
WHERE t.is_active = TRUE OR trs.total_roster_size > 0
GROUP BY t.id, t.name, t.logo_url, trs.total_roster_size, trs.total_roster_value, 
         trs.avg_player_value, trs.avg_roster_rating, trs.elite_players, trs.role_players,
         trs.bench_players, trs.s_tier_count, trs.a_tier_count, trs.b_tier_count, 
         trs.c_tier_count, trs.d_tier_count, dca.total_guards, dca.avg_guard_rating,
         dca.total_guard_value, dca.total_locks, dca.avg_lock_rating, dca.total_lock_value,
         dca.total_bigs, dca.avg_big_rating, dca.total_big_value, trs.captain_id, trs.player_coaches;

