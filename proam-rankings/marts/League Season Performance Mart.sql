CREATE MATERIALIZED VIEW league_season_performance_mart AS
WITH season_match_stats AS (
    SELECT 
        m.primary_season_id AS season_id,
        COUNT(DISTINCT m.id) AS total_matches,
        COUNT(DISTINCT m.team_a_id) + COUNT(DISTINCT m.team_b_id) AS total_team_appearances,
        COUNT(DISTINCT ps.player_id) AS total_players,
        AVG(m.score_a + m.score_b) AS avg_total_points_per_game,
        SUM(ps.points) AS total_points_scored,
        SUM(ps.assists) AS total_assists,
        SUM(ps.rebounds) AS total_rebounds,
        SUM(ps.steals) AS total_steals,
        SUM(ps.blocks) AS total_blocks,
        MIN(m.played_at) AS first_match_date,
        MAX(m.played_at) AS last_match_date
    FROM v_matches_with_primary_context m
    LEFT JOIN player_stats ps ON m.id = ps.match_id AND ps.verified = TRUE
    WHERE m.primary_season_id IS NOT NULL AND m.verified = TRUE
    GROUP BY m.primary_season_id
),
season_team_stats AS (
    SELECT 
        m.primary_season_id AS season_id,
        tr.team_id,
        tr.division_id,
        COUNT(DISTINCT m.id) AS games_played,
        SUM(CASE WHEN m.winner_id = tr.team_id THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN m.winner_id != tr.team_id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) AS losses
    FROM v_matches_with_primary_context m
    JOIN team_rosters tr ON (tr.team_id = m.team_a_id OR tr.team_id = m.team_b_id) 
        AND tr.season_id = m.primary_season_id
    WHERE m.primary_season_id IS NOT NULL AND m.verified = TRUE
    GROUP BY m.primary_season_id, tr.team_id, tr.division_id
),
season_division_stats AS (
    SELECT
        sts.season_id,
        sts.division_id,
        ld.name AS division_name,
        COUNT(DISTINCT sts.team_id) AS teams_in_division,
        SUM(sts.games_played) AS division_total_games,
        AVG(sts.wins::float / NULLIF(sts.games_played, 0)) AS division_avg_win_pct
    FROM season_team_stats sts
    LEFT JOIN lg_divisions ld ON sts.division_id = ld.id
    WHERE sts.division_id IS NOT NULL
    GROUP BY sts.season_id, sts.division_id, ld.name
),
season_playoff_info AS (
    SELECT
        lp.season_id,
        lp.playoff_champion,
        lp.playoff_prize,
        lp.status AS playoff_status,
        lp.team_count AS playoff_team_count,
        lp.start_date AS playoff_start,
        lp.finals_date AS playoff_end
    FROM league_playoff lp
),
season_open_info AS (
    SELECT
        lo.season_id,
        lo.open_champion,
        lo.open_prize,
        lo.status AS open_status,
        lo.team_count AS open_team_count,
        lo.start_date AS open_start,
        lo.finals_date AS open_end
    FROM league_open lo
),
top_performers AS (
    SELECT
        m.primary_season_id AS season_id,
        ps.player_id,
        p.gamertag,
        AVG(ps.points) AS avg_points,
        ROW_NUMBER() OVER(PARTITION BY m.primary_season_id ORDER BY AVG(ps.points) DESC) AS pts_rank
    FROM v_matches_with_primary_context m
    JOIN player_stats ps ON m.id = ps.match_id
    JOIN players p ON ps.player_id = p.id
    WHERE m.primary_season_id IS NOT NULL AND m.verified = TRUE AND ps.verified = TRUE
    GROUP BY m.primary_season_id, ps.player_id, p.gamertag
    HAVING COUNT(ps.match_id) >= 5
)
SELECT 
    ls.id AS season_id,
    ls.league_name::text AS league_name,
    ls.season_number,
    ls.start_date,
    ls.end_date,
    ls.year AS game_year,
    ls.league_id,
    li.league::text AS league,
    li.lg_logo_url,
    ls.prize_pool,
    ls.is_active,
    esm.tier_label AS league_tier,
    COALESCE(sms.total_matches, 0) AS total_matches,
    COALESCE(sms.total_team_appearances, 0) / 2 AS total_unique_teams,
    COALESCE(sms.total_players, 0) AS total_players,
    COALESCE(sms.avg_total_points_per_game, 0) AS avg_total_points_per_game,
    COALESCE(sms.total_points_scored, 0) AS total_points_scored,
    COALESCE(sms.total_assists, 0) AS total_assists,
    COALESCE(sms.total_rebounds, 0) AS total_rebounds,
    COALESCE(sms.total_steals, 0) AS total_steals,
    COALESCE(sms.total_blocks, 0) AS total_blocks,
    sms.first_match_date,
    sms.last_match_date,
    spi.playoff_champion,
    spi.playoff_prize,
    spi.playoff_status,
    spi.playoff_team_count,
    spi.playoff_start,
    spi.playoff_end,
    soi.open_champion,
    soi.open_prize,
    soi.open_status,
    soi.open_team_count,
    soi.open_start,
    soi.open_end,
    (SELECT COUNT(*) FROM team_rosters WHERE season_id = ls.id) AS total_registered_players,
    (SELECT array_agg(gamertag) FROM top_performers tp WHERE tp.season_id = ls.id AND pts_rank <= 5) AS top_scorers,
    (
        SELECT t.name
        FROM season_team_stats sts
        JOIN teams t ON sts.team_id = t.id
        WHERE sts.season_id = ls.id
        ORDER BY sts.wins DESC, (sts.wins::float / NULLIF(sts.games_played, 0)) DESC
        LIMIT 1
    ) AS best_record_team,
    (
        SELECT COUNT(DISTINCT division_id) 
        FROM lg_divisions 
        WHERE season_id = ls.id
    ) AS total_divisions,
    (
        SELECT json_agg(json_build_object(
            'division_id', division_id,
            'division_name', division_name,
            'teams_in_division', teams_in_division,
            'division_total_games', division_total_games,
            'division_avg_win_pct', ROUND(division_avg_win_pct::numeric, 3)
        ))
        FROM season_division_stats
        WHERE season_id = ls.id
    ) AS division_stats
FROM league_seasons ls
LEFT JOIN leagues_info li ON ls.league_id = li.id
LEFT JOIN season_match_stats sms ON ls.id = sms.season_id
LEFT JOIN season_playoff_info spi ON ls.id = spi.season_id
LEFT JOIN season_open_info soi ON ls.id = soi.season_id
LEFT JOIN event_strength_metrics_mv esm ON esm.season_id = ls.id AND esm.event_type = 'league';