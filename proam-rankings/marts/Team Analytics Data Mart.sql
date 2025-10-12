CREATE MATERIALIZED VIEW team_analytics_mart AS
WITH team_match_summary AS (
    SELECT 
        tm.team_id,
        COUNT(DISTINCT tm.match_id) AS games_played,
        SUM(CASE WHEN m.winner_id = tm.team_id THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN m.winner_id != tm.team_id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) AS losses,
        AVG(tm.points) AS avg_points_scored,
        AVG(CASE WHEN m.team_a_id = tm.team_id THEN m.score_b ELSE m.score_a END) AS avg_points_allowed,
        ROUND((AVG(tm.field_goals_made::float / NULLIF(tm.field_goals_attempted, 0)) * 100)::numeric, 1) AS avg_fg_pct,
        ROUND((AVG(tm.three_points_made::float / NULLIF(tm.three_points_attempted, 0)) * 100)::numeric, 1) AS avg_three_pct,
        AVG(tm.assists) AS avg_assists,
        AVG(tm.rebounds) AS avg_rebounds,
        AVG(tm.steals) AS avg_steals,
        AVG(tm.blocks) AS avg_blocks,
        AVG(tm.turnovers) AS avg_turnovers,
        MAX(m.played_at) AS last_game_date,
        COUNT(DISTINCT m.primary_tournament_id) AS tournaments_played,
        COUNT(DISTINCT m.primary_league_id) AS leagues_played,
        ARRAY_AGG(DISTINCT m.primary_tournament_id) FILTER (WHERE m.primary_tournament_id IS NOT NULL) AS tournament_ids,
        ARRAY_AGG(DISTINCT m.primary_league_id) FILTER (WHERE m.primary_league_id IS NOT NULL) AS league_ids
    FROM team_match_stats tm
    JOIN v_matches_with_primary_context m ON tm.match_id = m.id
    WHERE m.verified = TRUE
    GROUP BY tm.team_id
),
team_achievements AS (
    SELECT 
        team_id,
        COUNT(*) AS total_achievements,
        COUNT(DISTINCT CASE WHEN placement = 1 THEN tournament_id END) AS tournament_wins,
        SUM(prize_amount) AS total_prize_money
    FROM event_results
    GROUP BY team_id
),
team_roster_summary AS (
    SELECT 
        team_id,
        COUNT(DISTINCT player_id) AS roster_size,
        ARRAY_AGG(player_id) AS player_ids
    FROM team_rosters
    WHERE left_at IS NULL
    GROUP BY team_id
),
team_rating_summary AS (
    SELECT 
        tr.team_id,
        AVG(pgr.global_rating) AS avg_player_rating,
        COUNT(CASE WHEN pgr.rating_tier = 'S+' OR pgr.rating_tier = 'S' THEN 1 END) AS elite_players,
        COUNT(CASE WHEN pgr.rating_tier = 'A+' OR pgr.rating_tier = 'A' OR pgr.rating_tier = 'B' THEN 1 END) AS starter_players,
        COUNT(CASE WHEN pgr.rating_tier = 'C' OR pgr.rating_tier = 'D' THEN 1 END) AS role_players
    FROM team_rosters tr
    JOIN v_player_global_rating pgr ON tr.player_id = pgr.player_id
    WHERE tr.left_at IS NULL
    GROUP BY tr.team_id
)
SELECT 
    t.id AS team_id,
    t.name AS team_name,
    t.logo_url,
    t.hybrid_score,
    t.elo_rating,
    t.current_rp,
    t.team_twitter,
    COALESCE(tms.games_played, 0) AS games_played,
    COALESCE(tms.wins, 0) AS wins,
    COALESCE(tms.losses, 0) AS losses,
    CASE 
        WHEN COALESCE(tms.games_played, 0) > 0 
        THEN ROUND(((COALESCE(tms.wins, 0)::float / COALESCE(tms.games_played, 0)) * 100)::numeric, 1) 
        ELSE 0 
    END AS win_percentage,
    COALESCE(tms.avg_points_scored, 0) AS avg_points_scored,
    COALESCE(tms.avg_points_allowed, 0) AS avg_points_allowed,
    COALESCE(tms.avg_fg_pct, 0) AS avg_fg_pct,
    COALESCE(tms.avg_three_pct, 0) AS avg_three_pct,
    COALESCE(tms.avg_assists, 0) AS avg_assists,
    COALESCE(tms.avg_rebounds, 0) AS avg_rebounds,
    COALESCE(tms.avg_steals, 0) AS avg_steals,
    COALESCE(tms.avg_blocks, 0) AS avg_blocks,
    COALESCE(tms.avg_turnovers, 0) AS avg_turnovers,
    tms.last_game_date,
    CASE 
        WHEN tms.last_game_date IS NULL THEN NULL
        ELSE EXTRACT(DAY FROM NOW() - tms.last_game_date)
    END AS days_since_last_game,
    COALESCE(tms.tournaments_played, 0) AS tournaments_played,
    COALESCE(tms.leagues_played, 0) AS leagues_played,
    tms.tournament_ids,
    tms.league_ids,
    COALESCE(ta.total_achievements, 0) AS total_achievements,
    COALESCE(ta.tournament_wins, 0) AS tournament_wins,
    COALESCE(ta.total_prize_money, 0) AS total_prize_money,
    COALESCE(trs.roster_size, 0) AS roster_size,
    COALESCE(trs.player_ids, ARRAY[]::uuid[]) AS player_ids,
    COALESCE(tras.avg_player_rating, 0) AS avg_player_rating,
    COALESCE(tras.elite_players, 0) AS elite_players,
    COALESCE(tras.starter_players, 0) AS starter_players,
    COALESCE(tras.role_players, 0) AS role_players,
    CASE 
        WHEN t.current_rp >= 800 THEN 'Elite'
        WHEN t.current_rp >= 600 THEN 'Premier'
        WHEN t.current_rp >= 400 THEN 'Contender'
        WHEN t.current_rp >= 200 THEN 'Challenger'
        ELSE 'Prospect'
    END AS rp_tier
FROM teams t
LEFT JOIN team_match_summary tms ON t.id = tms.team_id
LEFT JOIN team_achievements ta ON t.id = ta.team_id
LEFT JOIN team_roster_summary trs ON t.id = trs.team_id
LEFT JOIN team_rating_summary tras ON t.id = tras.team_id;