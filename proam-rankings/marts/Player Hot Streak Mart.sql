CREATE MATERIALIZED VIEW player_hot_streak_mart AS
WITH player_game_sequence AS (
    SELECT
        ps.player_id,
        ps.match_id,
        m.played_at,
        ps.points,
        ps.assists,
        ps.rebounds,
        ps.steals,
        ps.blocks,
        ps.turnovers,
        ps.ps AS performance_score,
        ROW_NUMBER() OVER (PARTITION BY ps.player_id ORDER BY m.played_at DESC) AS game_recency
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    AND m.verified = TRUE
),
rolling_averages AS (
    SELECT
        player_id,
        -- Last 5 Games
        AVG(CASE WHEN game_recency <= 5 THEN points END) AS last_5_avg_points,
        AVG(CASE WHEN game_recency <= 5 THEN assists END) AS last_5_avg_assists,
        AVG(CASE WHEN game_recency <= 5 THEN rebounds END) AS last_5_avg_rebounds,
        AVG(CASE WHEN game_recency <= 5 THEN performance_score END) AS last_5_avg_performance,
        
        -- Last 10 Games
        AVG(CASE WHEN game_recency <= 10 THEN points END) AS last_10_avg_points,
        AVG(CASE WHEN game_recency <= 10 THEN assists END) AS last_10_avg_assists,
        AVG(CASE WHEN game_recency <= 10 THEN rebounds END) AS last_10_avg_rebounds,
        AVG(CASE WHEN game_recency <= 10 THEN performance_score END) AS last_10_avg_performance,
        
        -- Last 20 Games
        AVG(CASE WHEN game_recency <= 20 THEN points END) AS last_20_avg_points,
        AVG(CASE WHEN game_recency <= 20 THEN assists END) AS last_20_avg_assists,
        AVG(CASE WHEN game_recency <= 20 THEN rebounds END) AS last_20_avg_rebounds,
        AVG(CASE WHEN game_recency <= 20 THEN performance_score END) AS last_20_avg_performance,
        
        -- Consistency Metrics (Standard Deviation)
        STDDEV(CASE WHEN game_recency <= 10 THEN points END) AS last_10_pts_stddev,
        STDDEV(CASE WHEN game_recency <= 10 THEN performance_score END) AS last_10_perf_stddev,
        
        -- Recent Game Count
        COUNT(CASE WHEN game_recency <= 5 THEN 1 END) AS games_last_5,
        COUNT(CASE WHEN game_recency <= 10 THEN 1 END) AS games_last_10,
        COUNT(CASE WHEN game_recency <= 20 THEN 1 END) AS games_last_20
    FROM player_game_sequence
    GROUP BY player_id
),
career_baseline AS (
    SELECT
        ps.player_id,
        AVG(ps.points) AS career_avg_points,
        AVG(ps.assists) AS career_avg_assists,
        AVG(ps.rebounds) AS career_avg_rebounds,
        AVG(ps.ps) AS career_avg_performance,
        COUNT(ps.match_id) AS total_career_games
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE AND m.verified = TRUE
    GROUP BY ps.player_id
),
position_benchmarks AS (
    SELECT
        p.position,
        AVG(ps.points) AS position_avg_points,
        AVG(ps.assists) AS position_avg_assists,
        AVG(ps.rebounds) AS position_avg_rebounds,
        AVG(ps.ps) AS position_avg_performance
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.id
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE 
    AND m.verified = TRUE
    AND m.played_at > (NOW() - INTERVAL '90 days')
    GROUP BY p.position
)
SELECT
    p.id AS player_id,
    p.gamertag,
    p.position,
    p.current_team_id,
    t.name AS current_team,
    
    -- Rolling Averages
    ROUND(COALESCE(ra.last_5_avg_points, 0)::numeric, 1) AS last_5_avg_points,
    ROUND(COALESCE(ra.last_5_avg_assists, 0)::numeric, 1) AS last_5_avg_assists,
    ROUND(COALESCE(ra.last_5_avg_rebounds, 0)::numeric, 1) AS last_5_avg_rebounds,
    ROUND(COALESCE(ra.last_5_avg_performance, 0)::numeric, 1) AS last_5_avg_performance,
    
    ROUND(COALESCE(ra.last_10_avg_points, 0)::numeric, 1) AS last_10_avg_points,
    ROUND(COALESCE(ra.last_10_avg_assists, 0)::numeric, 1) AS last_10_avg_assists,
    ROUND(COALESCE(ra.last_10_avg_rebounds, 0)::numeric, 1) AS last_10_avg_rebounds,
    ROUND(COALESCE(ra.last_10_avg_performance, 0)::numeric, 1) AS last_10_avg_performance,
    
    ROUND(COALESCE(ra.last_20_avg_points, 0)::numeric, 1) AS last_20_avg_points,
    ROUND(COALESCE(ra.last_20_avg_assists, 0)::numeric, 1) AS last_20_avg_assists,
    ROUND(COALESCE(ra.last_20_avg_rebounds, 0)::numeric, 1) AS last_20_avg_rebounds,
    ROUND(COALESCE(ra.last_20_avg_performance, 0)::numeric, 1) AS last_20_avg_performance,
    
    -- Consistency Scores
    ROUND(COALESCE(ra.last_10_pts_stddev, 0)::numeric, 2) AS points_consistency_stddev,
    ROUND(COALESCE(ra.last_10_perf_stddev, 0)::numeric, 2) AS performance_consistency_stddev,
    
    -- Form Indicators (Recent vs Career)
    CASE
        WHEN cb.total_career_games >= 10 AND ra.games_last_10 >= 5 THEN
            ROUND(((ra.last_10_avg_points - cb.career_avg_points) / NULLIF(cb.career_avg_points, 0) * 100)::numeric, 1)
        ELSE NULL
    END AS points_form_vs_career_pct,
    
    CASE
        WHEN cb.total_career_games >= 10 AND ra.games_last_10 >= 5 THEN
            ROUND(((ra.last_10_avg_performance - cb.career_avg_performance) / NULLIF(cb.career_avg_performance, 0) * 100)::numeric, 1)
        ELSE NULL
    END AS performance_form_vs_career_pct,
    
    -- Trend Indicator
    CASE
        WHEN ra.games_last_20 >= 10 THEN
            CASE
                WHEN ra.last_5_avg_performance > ra.last_10_avg_performance 
                     AND ra.last_10_avg_performance > ra.last_20_avg_performance THEN 'Heating Up'
                WHEN ra.last_5_avg_performance < ra.last_10_avg_performance 
                     AND ra.last_10_avg_performance < ra.last_20_avg_performance THEN 'Cooling Down'
                WHEN ra.last_5_avg_performance > ra.last_20_avg_performance THEN 'Improving'
                WHEN ra.last_5_avg_performance < ra.last_20_avg_performance THEN 'Declining'
                ELSE 'Stable'
            END
        ELSE 'Insufficient Data'
    END AS form_trend,
    
    -- Position-Relative Performance
    CASE
        WHEN ra.games_last_10 >= 5 AND pb.position_avg_points > 0 THEN
            ROUND(((ra.last_10_avg_points / NULLIF(pb.position_avg_points, 0)) * 100)::numeric, 1)
        ELSE NULL
    END AS pts_vs_position_avg_pct,
    
    CASE
        WHEN ra.games_last_10 >= 5 AND pb.position_avg_performance > 0 THEN
            ROUND(((ra.last_10_avg_performance / NULLIF(pb.position_avg_performance, 0)) * 100)::numeric, 1)
        ELSE NULL
    END AS perf_vs_position_avg_pct,
    
    -- Game Counts
    COALESCE(ra.games_last_5, 0) AS games_last_5,
    COALESCE(ra.games_last_10, 0) AS games_last_10,
    COALESCE(ra.games_last_20, 0) AS games_last_20,
    COALESCE(cb.total_career_games, 0) AS total_career_games,
    
    -- Career Baseline
    ROUND(COALESCE(cb.career_avg_points, 0)::numeric, 1) AS career_avg_points,
    ROUND(COALESCE(cb.career_avg_performance, 0)::numeric, 1) AS career_avg_performance
    
FROM players p
LEFT JOIN rolling_averages ra ON p.id = ra.player_id
LEFT JOIN career_baseline cb ON p.id = cb.player_id
LEFT JOIN teams t ON p.current_team_id = t.id
LEFT JOIN position_benchmarks pb ON p.position = pb.position;

