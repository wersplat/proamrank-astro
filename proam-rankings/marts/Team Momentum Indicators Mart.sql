CREATE MATERIALIZED VIEW team_momentum_indicators_mart AS
WITH team_game_sequence AS (
    SELECT
        CASE WHEN m.team_a_id = tms.team_id THEN m.team_a_id ELSE m.team_b_id END AS team_id,
        m.id AS match_id,
        m.played_at,
        tms.points AS team_points,
        CASE WHEN m.team_a_id = tms.team_id THEN m.score_b ELSE m.score_a END AS opponent_points,
        CASE WHEN m.winner_id = tms.team_id THEN 1 ELSE 0 END AS is_win,
        m.primary_league_id,
        m.primary_tournament_id,
        ROW_NUMBER() OVER (PARTITION BY tms.team_id ORDER BY m.played_at DESC) AS game_recency,
        LAG(m.played_at) OVER (PARTITION BY tms.team_id ORDER BY m.played_at) AS prev_game_date
    FROM team_match_stats tms
    JOIN v_matches_with_primary_context m ON tms.match_id = m.id
    WHERE m.verified = TRUE
),
form_windows AS (
    SELECT
        team_id,
        -- Last 5 Games
        SUM(CASE WHEN game_recency <= 5 THEN is_win ELSE 0 END) AS last_5_wins,
        COUNT(CASE WHEN game_recency <= 5 THEN 1 END) AS last_5_games,
        AVG(CASE WHEN game_recency <= 5 THEN team_points END) AS last_5_avg_scored,
        AVG(CASE WHEN game_recency <= 5 THEN opponent_points END) AS last_5_avg_allowed,
        
        -- Last 10 Games
        SUM(CASE WHEN game_recency <= 10 THEN is_win ELSE 0 END) AS last_10_wins,
        COUNT(CASE WHEN game_recency <= 10 THEN 1 END) AS last_10_games,
        AVG(CASE WHEN game_recency <= 10 THEN team_points END) AS last_10_avg_scored,
        AVG(CASE WHEN game_recency <= 10 THEN opponent_points END) AS last_10_avg_allowed,
        
        -- Last 20 Games
        SUM(CASE WHEN game_recency <= 20 THEN is_win ELSE 0 END) AS last_20_wins,
        COUNT(CASE WHEN game_recency <= 20 THEN 1 END) AS last_20_games,
        AVG(CASE WHEN game_recency <= 20 THEN team_points END) AS last_20_avg_scored,
        AVG(CASE WHEN game_recency <= 20 THEN opponent_points END) AS last_20_avg_allowed,
        
        -- Rest Days Metrics
        AVG(CASE WHEN game_recency <= 10 THEN 
            EXTRACT(DAY FROM played_at - prev_game_date) 
        END) AS avg_rest_days_last_10
    FROM team_game_sequence
    GROUP BY team_id
),
current_streaks AS (
    SELECT
        team_id,
        CASE 
            WHEN is_win = 1 THEN
                (SELECT COUNT(*) 
                 FROM team_game_sequence tgs2 
                 WHERE tgs2.team_id = tgs1.team_id 
                 AND tgs2.game_recency <= (
                     SELECT MIN(game_recency) 
                     FROM team_game_sequence tgs3 
                     WHERE tgs3.team_id = tgs1.team_id 
                     AND tgs3.is_win = 0
                 ))
            ELSE 0
        END AS current_win_streak,
        CASE 
            WHEN is_win = 0 THEN
                (SELECT COUNT(*) 
                 FROM team_game_sequence tgs2 
                 WHERE tgs2.team_id = tgs1.team_id 
                 AND tgs2.game_recency <= (
                     SELECT MIN(game_recency) 
                     FROM team_game_sequence tgs3 
                     WHERE tgs3.team_id = tgs1.team_id 
                     AND tgs3.is_win = 1
                 ))
            ELSE 0
        END AS current_loss_streak
    FROM team_game_sequence tgs1
    WHERE game_recency = 1
),
context_performance AS (
    SELECT
        team_id,
        -- League Performance
        AVG(CASE WHEN primary_league_id IS NOT NULL AND game_recency <= 10 THEN is_win END) AS league_win_rate_last_10,
        COUNT(CASE WHEN primary_league_id IS NOT NULL AND game_recency <= 10 THEN 1 END) AS league_games_last_10,
        
        -- Tournament Performance
        AVG(CASE WHEN primary_tournament_id IS NOT NULL AND game_recency <= 10 THEN is_win END) AS tournament_win_rate_last_10,
        COUNT(CASE WHEN primary_tournament_id IS NOT NULL AND game_recency <= 10 THEN 1 END) AS tournament_games_last_10
    FROM team_game_sequence
    GROUP BY team_id
)
SELECT
    t.id AS team_id,
    t.name AS team_name,
    t.logo_url,
    t.elo_rating AS current_elo,
    t.current_rp,
    
    -- Last 5 Games Form
    COALESCE(fw.last_5_wins, 0) AS last_5_wins,
    COALESCE(fw.last_5_games, 0) AS last_5_games,
    CASE 
        WHEN fw.last_5_games > 0 THEN ROUND((fw.last_5_wins::float / fw.last_5_games * 100)::numeric, 1)
        ELSE 0
    END AS last_5_win_pct,
    ROUND(COALESCE(fw.last_5_avg_scored, 0)::numeric, 1) AS last_5_avg_scored,
    ROUND(COALESCE(fw.last_5_avg_allowed, 0)::numeric, 1) AS last_5_avg_allowed,
    ROUND((COALESCE(fw.last_5_avg_scored, 0) - COALESCE(fw.last_5_avg_allowed, 0))::numeric, 1) AS last_5_point_diff,
    
    -- Last 10 Games Form
    COALESCE(fw.last_10_wins, 0) AS last_10_wins,
    COALESCE(fw.last_10_games, 0) AS last_10_games,
    CASE 
        WHEN fw.last_10_games > 0 THEN ROUND((fw.last_10_wins::float / fw.last_10_games * 100)::numeric, 1)
        ELSE 0
    END AS last_10_win_pct,
    ROUND(COALESCE(fw.last_10_avg_scored, 0)::numeric, 1) AS last_10_avg_scored,
    ROUND(COALESCE(fw.last_10_avg_allowed, 0)::numeric, 1) AS last_10_avg_allowed,
    ROUND((COALESCE(fw.last_10_avg_scored, 0) - COALESCE(fw.last_10_avg_allowed, 0))::numeric, 1) AS last_10_point_diff,
    
    -- Last 20 Games Form
    COALESCE(fw.last_20_wins, 0) AS last_20_wins,
    COALESCE(fw.last_20_games, 0) AS last_20_games,
    CASE 
        WHEN fw.last_20_games > 0 THEN ROUND((fw.last_20_wins::float / fw.last_20_games * 100)::numeric, 1)
        ELSE 0
    END AS last_20_win_pct,
    ROUND(COALESCE(fw.last_20_avg_scored, 0)::numeric, 1) AS last_20_avg_scored,
    ROUND(COALESCE(fw.last_20_avg_allowed, 0)::numeric, 1) AS last_20_avg_allowed,
    ROUND((COALESCE(fw.last_20_avg_scored, 0) - COALESCE(fw.last_20_avg_allowed, 0))::numeric, 1) AS last_20_point_diff,
    
    -- Current Streaks
    COALESCE(cs.current_win_streak, 0) AS current_win_streak,
    COALESCE(cs.current_loss_streak, 0) AS current_loss_streak,
    
    -- Momentum Indicator
    CASE
        WHEN fw.last_5_games >= 3 AND fw.last_10_games >= 7 THEN
            CASE
                WHEN (fw.last_5_wins::float / NULLIF(fw.last_5_games, 0)) > 
                     (fw.last_10_wins::float / NULLIF(fw.last_10_games, 0)) + 0.15 THEN 'Hot'
                WHEN (fw.last_5_wins::float / NULLIF(fw.last_5_games, 0)) < 
                     (fw.last_10_wins::float / NULLIF(fw.last_10_games, 0)) - 0.15 THEN 'Cold'
                ELSE 'Steady'
            END
        ELSE 'Insufficient Data'
    END AS momentum_status,
    
    -- Context-Specific Form
    ROUND(COALESCE(cp.league_win_rate_last_10, 0)::numeric, 3) AS league_win_rate_last_10,
    COALESCE(cp.league_games_last_10, 0) AS league_games_last_10,
    ROUND(COALESCE(cp.tournament_win_rate_last_10, 0)::numeric, 3) AS tournament_win_rate_last_10,
    COALESCE(cp.tournament_games_last_10, 0) AS tournament_games_last_10,
    
    -- Rest Impact
    ROUND(COALESCE(fw.avg_rest_days_last_10, 0)::numeric, 1) AS avg_rest_days_last_10

FROM teams t
LEFT JOIN form_windows fw ON t.id = fw.team_id
LEFT JOIN current_streaks cs ON t.id = cs.team_id
LEFT JOIN context_performance cp ON t.id = cp.team_id;

