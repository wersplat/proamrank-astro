-- Fix team_roster_history view to properly populate season_number
-- The issue was that the join condition only worked for tournaments and used tournament dates
-- instead of matching based on when players actually joined/left teams
--
-- The original join was:
--   LEFT JOIN league_seasons ls ON l.id = ls.league_id AND tour.start_date >= ls.start_date AND tour.start_date <= ls.end_date
-- This failed for league rosters because tour.start_date is NULL when there's no tournament
--
-- The fix matches league_seasons based on:
--   - For league rosters: tr.joined_at falls within the season date range
--   - For tournaments: tour.start_date falls within the season date range

CREATE OR REPLACE VIEW team_roster_history AS
SELECT 
    tr.id,
    tr.team_id,
    t.name AS team_name,
    t.logo_url AS team_logo,
    tr.player_id,
    p.gamertag,
    p."position",
    tr.is_captain,
    tr.is_player_coach,
    tr.joined_at,
    tr.left_at,
    CASE
        WHEN tr.left_at IS NULL THEN 'Active'::text
        ELSE 'Inactive'::text
    END AS status,
    tr.league_id,
    l.league AS league_name,
    tr.tournament_id,
    tour.name AS tournament_name,
    ls.season_number,
    ls.year AS game_year
FROM team_rosters tr
    JOIN teams t ON tr.team_id = t.id
    JOIN players p ON tr.player_id = p.id
    LEFT JOIN leagues_info l ON tr.league_id = l.id
    LEFT JOIN tournaments tour ON tr.tournament_id = tour.id
    LEFT JOIN league_seasons ls ON (
        l.id = ls.league_id 
        AND (
            -- For league rosters (no tournament): match based on joined_at date
            (tr.tournament_id IS NULL AND tr.joined_at >= ls.start_date AND tr.joined_at <= ls.end_date)
            OR
            -- For tournaments: match based on tournament start date
            (tr.tournament_id IS NOT NULL AND tour.start_date >= ls.start_date AND tour.start_date <= ls.end_date)
        )
    )
ORDER BY t.name, tr.joined_at DESC;

