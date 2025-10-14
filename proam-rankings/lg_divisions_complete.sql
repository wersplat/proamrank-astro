-- ============================================================================
-- COMPLETE SQL FOR ADDING lg_divisions TO DATABASE
-- Run this entire file to add divisions support
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE lg_divisions TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lg_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    abbr TEXT,
    division_logo TEXT,
    conference_id UUID REFERENCES public.lg_conf(id) ON DELETE SET NULL,
    season_id UUID REFERENCES public.league_seasons(id) ON DELETE CASCADE,
    league_id UUID REFERENCES public.leagues_info(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_division_per_season UNIQUE (season_id, name)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_lg_divisions_conference_id ON public.lg_divisions(conference_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_season_id ON public.lg_divisions(season_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_league_id ON public.lg_divisions(league_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_display_order ON public.lg_divisions(display_order);

-- Add comments
COMMENT ON TABLE public.lg_divisions IS 'League divisions within conferences - subdivides conference into competitive groups';
COMMENT ON COLUMN public.lg_divisions.conference_id IS 'Parent conference this division belongs to';
COMMENT ON COLUMN public.lg_divisions.season_id IS 'Season this division is active in';
COMMENT ON COLUMN public.lg_divisions.display_order IS 'Order for displaying divisions (lower numbers first)';

-- ============================================================================
-- PART 2: ADD division_id TO team_rosters
-- ============================================================================

ALTER TABLE public.team_rosters 
ADD COLUMN IF NOT EXISTS division_id UUID;

ALTER TABLE public.team_rosters
DROP CONSTRAINT IF EXISTS fk_team_rosters_division_id;

ALTER TABLE public.team_rosters
ADD CONSTRAINT fk_team_rosters_division_id 
FOREIGN KEY (division_id) 
REFERENCES public.lg_divisions(id) 
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_team_rosters_division_id ON public.team_rosters(division_id);

COMMENT ON COLUMN public.team_rosters.division_id IS 'Division assignment for this roster entry (nullable for backward compatibility)';

-- ============================================================================
-- PART 3: CREATE league_division_standings VIEW
-- ============================================================================

DROP VIEW IF EXISTS league_division_standings;

CREATE VIEW league_division_standings AS
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
        THEN ROUND(((dtr.points_for::float - dtr.points_against::float) / dtr.games_played)::numeric, 1)
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

COMMENT ON VIEW league_division_standings IS 'Division-specific standings showing team records, rankings, and streaks within their division and overall';

-- ============================================================================
-- PART 4: UPDATE player_league_season_stats_mart
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS player_league_season_stats_mart;

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

-- ============================================================================
-- PART 5: UPDATE team_analytics_mart
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS team_analytics_mart;

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
current_division_context AS (
    SELECT DISTINCT ON (tr.team_id)
        tr.team_id,
        tr.division_id,
        ld.name AS division_name,
        ld.abbr AS division_abbr,
        ld.season_id AS division_season_id
    FROM team_rosters tr
    LEFT JOIN lg_divisions ld ON tr.division_id = ld.id
    WHERE tr.left_at IS NULL AND tr.division_id IS NOT NULL
    ORDER BY tr.team_id, tr.joined_at DESC
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
    END AS rp_tier,
    cdc.division_id,
    cdc.division_name,
    cdc.division_abbr,
    cdc.division_season_id
FROM teams t
LEFT JOIN team_match_summary tms ON t.id = tms.team_id
LEFT JOIN team_achievements ta ON t.id = ta.team_id
LEFT JOIN team_roster_summary trs ON t.id = trs.team_id
LEFT JOIN team_rating_summary tras ON t.id = tras.team_id
LEFT JOIN current_division_context cdc ON t.id = cdc.team_id;

-- ============================================================================
-- PART 6: UPDATE league_season_performance_mart
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS league_season_performance_mart;

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
        SELECT COUNT(DISTINCT id) 
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
LEFT JOIN season_open_info soi ON ls.id = soi.season_id;

-- ============================================================================
-- CREATE UNIQUE INDEXES FOR CONCURRENT REFRESH
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_player_league_season_stats_unique 
  ON player_league_season_stats_mart (player_id, season_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_team_analytics_unique 
  ON team_analytics_mart (team_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_league_season_performance_unique 
  ON league_season_performance_mart (season_id);

-- ============================================================================
-- REFRESH MATERIALIZED VIEWS CONCURRENTLY
-- ============================================================================

REFRESH MATERIALIZED VIEW CONCURRENTLY player_league_season_stats_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY league_season_performance_mart;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table exists
SELECT 'lg_divisions table created' AS status, COUNT(*) AS row_count 
FROM pg_tables WHERE tablename = 'lg_divisions';

-- Verify column added
SELECT 'division_id column added to team_rosters' AS status
FROM information_schema.columns 
WHERE table_name = 'team_rosters' AND column_name = 'division_id';

-- Verify view exists
SELECT 'league_division_standings view created' AS status
FROM pg_views WHERE viewname = 'league_division_standings';

-- Verify marts refreshed
SELECT 'All materialized views refreshed successfully' AS status;

