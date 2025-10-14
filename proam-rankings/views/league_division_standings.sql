-- League Division Standings View
-- Provides division-specific standings for league seasons
-- Useful for filtering and displaying division leaderboards

CREATE OR REPLACE VIEW league_division_standings AS
WITH division_team_records AS (
    SELECT 
        tr.season_id,
        tr.division_id,
        tr.team_id,
        t.name AS team_name,
        t.logo_url AS team_logo,
        COUNT(DISTINCT m.id) AS games_played,
        SUM(CASE WHEN m.winner_id = tr.team_id THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN m.winner_id != tr.team_id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) AS losses,
        SUM(CASE 
            WHEN m.team_a_id = tr.team_id THEN m.score_a 
            WHEN m.team_b_id = tr.team_id THEN m.score_b 
            ELSE 0 
        END) AS points_for,
        SUM(CASE 
            WHEN m.team_a_id = tr.team_id THEN m.score_b 
            WHEN m.team_b_id = tr.team_id THEN m.score_a 
            ELSE 0 
        END) AS points_against
    FROM team_rosters tr
    JOIN teams t ON tr.team_id = t.id
    LEFT JOIN v_matches_with_primary_context m ON 
        (m.team_a_id = tr.team_id OR m.team_b_id = tr.team_id)
        AND m.primary_season_id = tr.season_id
        AND m.verified = TRUE
    WHERE tr.division_id IS NOT NULL
        AND tr.season_id IS NOT NULL
    GROUP BY tr.season_id, tr.division_id, tr.team_id, t.name, t.logo_url
)
SELECT 
    dtr.season_id,
    ls.league_name::text AS league_name,
    ls.season_number,
    ls.year AS game_year,
    dtr.division_id,
    ld.name AS division_name,
    ld.abbr AS division_abbr,
    ld.division_logo,
    ld.display_order AS division_display_order,
    ld.conference_id,
    lgc.name AS conference_name,
    lgc.abbr AS conference_abbr,
    dtr.team_id,
    dtr.team_name,
    dtr.team_logo,
    dtr.games_played,
    dtr.wins,
    dtr.losses,
    CASE 
        WHEN dtr.games_played > 0 
        THEN ROUND((dtr.wins::float / dtr.games_played)::numeric, 3)
        ELSE 0 
    END AS win_percentage,
    dtr.points_for,
    dtr.points_against,
    CASE 
        WHEN dtr.games_played > 0 
        THEN ROUND((dtr.points_for::float - dtr.points_against::float) / dtr.games_played, 1)
        ELSE 0 
    END AS point_differential_per_game,
    RANK() OVER (
        PARTITION BY dtr.season_id, dtr.division_id 
        ORDER BY dtr.wins DESC, (dtr.wins::float / NULLIF(dtr.games_played, 0)) DESC
    ) AS division_rank,
    RANK() OVER (
        PARTITION BY dtr.season_id 
        ORDER BY dtr.wins DESC, (dtr.wins::float / NULLIF(dtr.games_played, 0)) DESC
    ) AS overall_rank,
    -- Streak calculation (last 5 games)
    (
        SELECT STRING_AGG(
            CASE WHEN m2.winner_id = dtr.team_id THEN 'W' ELSE 'L' END,
            ''
            ORDER BY m2.played_at DESC
        )
        FROM (
            SELECT winner_id, played_at
            FROM v_matches_with_primary_context
            WHERE (team_a_id = dtr.team_id OR team_b_id = dtr.team_id)
                AND primary_season_id = dtr.season_id
                AND verified = TRUE
            ORDER BY played_at DESC
            LIMIT 5
        ) m2
    ) AS last_5_streak
FROM division_team_records dtr
LEFT JOIN lg_divisions ld ON dtr.division_id = ld.id
LEFT JOIN league_seasons ls ON dtr.season_id = ls.id
LEFT JOIN lg_conf lgc ON ld.conference_id = lgc.id
ORDER BY dtr.season_id, ld.display_order, division_rank;

-- Add comment for documentation
COMMENT ON VIEW league_division_standings IS 'Division-specific standings showing team records, rankings, and streaks within their division and overall';

