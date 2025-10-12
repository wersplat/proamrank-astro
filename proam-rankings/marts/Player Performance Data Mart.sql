CREATE MATERIALIZED VIEW player_performance_mart AS
WITH player_stats_summary AS (
    SELECT 
        ps.player_id,
        COUNT(DISTINCT ps.match_id) AS games_played,
        AVG(ps.points) AS avg_points,
        AVG(ps.rebounds) AS avg_rebounds,
        AVG(ps.assists) AS avg_assists,
        AVG(ps.steals) AS avg_steals,
        AVG(ps.blocks) AS avg_blocks,
        AVG(ps.turnovers) AS avg_turnovers,
        ROUND((AVG(ps.fgm::float / NULLIF(ps.fga, 0)) * 100)::numeric, 1) AS avg_fg_pct,
        ROUND((AVG(ps.three_points_made::float / NULLIF(ps.three_points_attempted, 0)) * 100)::numeric, 1) AS avg_three_pct,
        ROUND((AVG(ps.ftm::float / NULLIF(ps.fta, 0)) * 100)::numeric, 1) AS avg_ft_pct,
        AVG(ps.ps) AS avg_performance_score,
        MAX(ps.ps) AS max_performance_score,
        ARRAY_AGG(DISTINCT m.primary_league_id) FILTER (WHERE m.primary_league_id IS NOT NULL) AS league_ids,
        ARRAY_AGG(DISTINCT m.primary_tournament_id) FILTER (WHERE m.primary_tournament_id IS NOT NULL) AS tournament_ids,
        ARRAY_AGG(DISTINCT m.primary_season_id) FILTER (WHERE m.primary_season_id IS NOT NULL) AS season_ids
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    GROUP BY ps.player_id
),
recent_stats AS (
    SELECT 
        ps.player_id,
        COUNT(DISTINCT ps.match_id) AS recent_games,
        AVG(ps.points) AS recent_avg_points,
        AVG(ps.ps) AS recent_avg_performance_score,
        MAX(m.played_at) AS last_game_date
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    AND m.played_at > (NOW() - INTERVAL '60 days')
    GROUP BY ps.player_id
)
SELECT 
    p.id AS player_id,
    p.gamertag,
    p.position,
    p.current_team_id,
    t.name AS team_name,
    COALESCE(pgr.global_rating, 0) AS global_rating,
    COALESCE(pgr.rating_tier, 'Unranked') AS rating_tier,
    COALESCE(pss.games_played, 0) AS games_played,
    COALESCE(pss.avg_points, 0) AS avg_points,
    COALESCE(pss.avg_rebounds, 0) AS avg_rebounds,
    COALESCE(pss.avg_assists, 0) AS avg_assists,
    COALESCE(pss.avg_steals, 0) AS avg_steals,
    COALESCE(pss.avg_blocks, 0) AS avg_blocks,
    COALESCE(pss.avg_turnovers, 0) AS avg_turnovers,
    COALESCE(pss.avg_fg_pct, 0) AS avg_fg_pct,
    COALESCE(pss.avg_three_pct, 0) AS avg_three_pct,
    COALESCE(pss.avg_ft_pct, 0) AS avg_ft_pct,
    COALESCE(pss.avg_performance_score, 0) AS avg_performance_score,
    COALESCE(pss.max_performance_score, 0) AS max_performance_score,
    COALESCE(rs.recent_games, 0) AS recent_games,
    COALESCE(rs.recent_avg_points, 0) AS recent_avg_points,
    COALESCE(rs.recent_avg_performance_score, 0) AS recent_avg_performance_score,
    rs.last_game_date,
    CASE 
        WHEN rs.last_game_date IS NULL THEN NULL
        ELSE EXTRACT(DAY FROM NOW() - rs.last_game_date)
    END AS days_since_last_game,
    COALESCE(tr.is_captain, FALSE) AS is_captain,
    COALESCE(pa.award_count, 0) AS total_achievements,
    p.player_rank_score,
    p.player_rp,
    pss.league_ids,
    pss.tournament_ids,
    pss.season_ids
FROM players p
LEFT JOIN v_player_global_rating pgr ON p.id = pgr.player_id
LEFT JOIN player_stats_summary pss ON p.id = pss.player_id
LEFT JOIN recent_stats rs ON p.id = rs.player_id
LEFT JOIN teams t ON p.current_team_id = t.id
LEFT JOIN (
    SELECT player_id, COUNT(*) AS award_count 
    FROM player_awards 
    GROUP BY player_id
) pa ON p.id = pa.player_id
LEFT JOIN (
    SELECT player_id, bool_or(is_captain) AS is_captain 
    FROM team_rosters 
    WHERE left_at IS NULL 
    GROUP BY player_id
) tr ON p.id = tr.player_id;