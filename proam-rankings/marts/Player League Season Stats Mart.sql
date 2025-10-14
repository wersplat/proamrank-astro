CREATE MATERIALIZED VIEW player_league_season_stats_mart AS
WITH player_season_games AS (
    SELECT
        ps.player_id,
        m.primary_season_id AS season_id,
        m.primary_league_id AS league_id,
        COUNT(ps.match_id) AS games_played,
        SUM(ps.points) AS total_points,
        SUM(ps.assists) AS total_assists,
        SUM(ps.rebounds) AS total_rebounds,
        SUM(ps.steals) AS total_steals,
        SUM(ps.blocks) AS total_blocks,
        SUM(ps.turnovers) AS total_turnovers,
        SUM(ps.fgm) AS total_fgm,
        SUM(ps.fga) AS total_fga,
        SUM(ps.three_points_made) AS total_3pm,
        SUM(ps.three_points_attempted) AS total_3pa,
        SUM(ps.ftm) AS total_ftm,
        SUM(ps.fta) AS total_fta,
        AVG(ps.ps) AS avg_performance_score,
        MAX(ps.points) AS season_high_points,
        MAX(ps.assists) AS season_high_assists,
        MAX(ps.rebounds) AS season_high_rebounds,
        MIN(m.played_at) AS season_start_date,
        MAX(m.played_at) AS season_last_game
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE 
    AND m.verified = TRUE
    AND m.primary_season_id IS NOT NULL
    GROUP BY ps.player_id, m.primary_season_id, m.primary_league_id
),
season_team_context AS (
    SELECT DISTINCT ON (tr.player_id, tr.season_id)
        tr.player_id,
        tr.season_id,
        tr.team_id,
        t.name AS team_name,
        tr.joined_at,
        tr.left_at,
        tr.is_captain,
        tr.division_id,
        ld.name AS division_name,
        ld.abbr AS division_abbr
    FROM team_rosters tr
    JOIN teams t ON tr.team_id = t.id
    LEFT JOIN lg_divisions ld ON tr.division_id = ld.id
    WHERE tr.season_id IS NOT NULL
    ORDER BY tr.player_id, tr.season_id, tr.left_at NULLS FIRST, tr.joined_at DESC
),
season_rankings AS (
    SELECT
        psg.season_id,
        psg.league_id,
        psg.player_id,
        RANK() OVER (PARTITION BY psg.season_id ORDER BY psg.total_points DESC) AS points_rank,
        RANK() OVER (PARTITION BY psg.season_id ORDER BY psg.total_assists DESC) AS assists_rank,
        RANK() OVER (PARTITION BY psg.season_id ORDER BY psg.total_rebounds DESC) AS rebounds_rank,
        RANK() OVER (PARTITION BY psg.season_id ORDER BY psg.avg_performance_score DESC) AS performance_rank
    FROM player_season_games psg
    WHERE psg.games_played >= 5
)
SELECT
    psg.player_id,
    p.gamertag,
    p.position,
    psg.season_id,
    ls.league_name::text AS league_name,
    ls.season_number,
    ls.year AS game_year,
    psg.league_id,
    stc.team_id AS season_team_id,
    stc.team_name AS season_team_name,
    stc.is_captain,
    stc.division_id,
    stc.division_name,
    stc.division_abbr,
    
    -- Games & Dates
    psg.games_played,
    psg.season_start_date,
    psg.season_last_game,
    
    -- Totals
    COALESCE(psg.total_points, 0) AS total_points,
    COALESCE(psg.total_assists, 0) AS total_assists,
    COALESCE(psg.total_rebounds, 0) AS total_rebounds,
    COALESCE(psg.total_steals, 0) AS total_steals,
    COALESCE(psg.total_blocks, 0) AS total_blocks,
    COALESCE(psg.total_turnovers, 0) AS total_turnovers,
    
    -- Averages
    ROUND((psg.total_points::float / NULLIF(psg.games_played, 0))::numeric, 1) AS ppg,
    ROUND((psg.total_assists::float / NULLIF(psg.games_played, 0))::numeric, 1) AS apg,
    ROUND((psg.total_rebounds::float / NULLIF(psg.games_played, 0))::numeric, 1) AS rpg,
    ROUND((psg.total_steals::float / NULLIF(psg.games_played, 0))::numeric, 1) AS spg,
    ROUND((psg.total_blocks::float / NULLIF(psg.games_played, 0))::numeric, 1) AS bpg,
    ROUND((psg.total_turnovers::float / NULLIF(psg.games_played, 0))::numeric, 1) AS tpg,
    
    -- Shooting Percentages
    ROUND((psg.total_fgm::float / NULLIF(psg.total_fga, 0) * 100)::numeric, 1) AS fg_pct,
    ROUND((psg.total_3pm::float / NULLIF(psg.total_3pa, 0) * 100)::numeric, 1) AS three_pt_pct,
    ROUND((psg.total_ftm::float / NULLIF(psg.total_fta, 0) * 100)::numeric, 1) AS ft_pct,
    
    -- Performance
    ROUND(COALESCE(psg.avg_performance_score, 0)::numeric, 1) AS avg_performance_score,
    psg.season_high_points,
    psg.season_high_assists,
    psg.season_high_rebounds,
    
    -- Season Rankings
    sr.points_rank AS season_points_rank,
    sr.assists_rank AS season_assists_rank,
    sr.rebounds_rank AS season_rebounds_rank,
    sr.performance_rank AS season_performance_rank,
    
    -- Award Indicators
    CASE
        WHEN sr.points_rank <= 3 AND psg.games_played >= 10 THEN 'Top 3 Scorer'
        WHEN sr.assists_rank <= 3 AND psg.games_played >= 10 THEN 'Top 3 Playmaker'
        WHEN sr.rebounds_rank <= 3 AND psg.games_played >= 10 THEN 'Top 3 Rebounder'
        WHEN sr.performance_rank <= 5 AND psg.games_played >= 10 THEN 'Top 5 Performer'
        ELSE NULL
    END AS potential_season_award

FROM player_season_games psg
JOIN players p ON psg.player_id = p.id
LEFT JOIN league_seasons ls ON psg.season_id = ls.id
LEFT JOIN season_team_context stc ON psg.player_id = stc.player_id AND psg.season_id = stc.season_id
LEFT JOIN season_rankings sr ON psg.player_id = sr.player_id AND psg.season_id = sr.season_id;

