-- ============================================================================
-- UPDATE STATS AND STANDINGS VIEWS FOR MULTI-CONTEXT SUPPORT
-- ============================================================================
-- These views are updated based on your actual database schema
-- KEY CHANGES: Replace 'matches' with 'v_matches_with_primary_context'
--              and use primary_season_id/primary_tournament_id
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. player_stats_by_league_season
-- ----------------------------------------------------------------------------
-- This is the simplest view - just needs to change the join
CREATE OR REPLACE VIEW public.player_stats_by_league_season AS
SELECT 
    ls.id AS league_season_id,
    ls.league_id,
    ls.season_number,
    ls.year AS game_year,
    ps.player_id,
    p.gamertag AS player_gamertag,
    COUNT(ps.id) AS games_played,
    SUM(ps.points) AS points,
    SUM(ps.rebounds) AS rebounds,
    SUM(ps.assists) AS assists,
    SUM(ps.steals) AS steals,
    SUM(ps.blocks) AS blocks,
    SUM(ps.turnovers) AS turnovers,
    SUM(ps.fouls) AS fouls,
    SUM(ps.fgm) AS fgm,
    SUM(ps.fga) AS fga,
    SUM(ps.ftm) AS ftm,
    SUM(ps.fta) AS fta,
    SUM(ps.three_points_made) AS three_points_made,
    SUM(ps.three_points_attempted) AS three_points_attempted,
    SUM(ps.plus_minus) AS plus_minus,
    SUM(ps.ps) AS performance_score,
    AVG(ps.points::NUMERIC) AS avg_points,
    AVG(ps.rebounds::NUMERIC) AS avg_rebounds,
    AVG(ps.assists::NUMERIC) AS avg_assists,
    AVG(ps.steals::NUMERIC) AS avg_steals,
    AVG(ps.blocks::NUMERIC) AS avg_blocks,
    AVG(ps.turnovers::NUMERIC) AS avg_turnovers,
    AVG(ps.fouls::NUMERIC) AS avg_fouls
FROM player_stats ps
-- KEY CHANGE: Use v_matches_with_primary_context instead of matches
JOIN v_matches_with_primary_context m ON m.id = ps.match_id
-- KEY CHANGE: Join on primary_season_id instead of season_id
JOIN league_seasons ls ON ls.id = m.primary_season_id
JOIN players p ON p.id = ps.player_id
GROUP BY ls.id, ls.league_id, ls.season_number, ls.year, ps.player_id, p.gamertag;


-- ----------------------------------------------------------------------------
-- 2. tournament_player_stats
-- ----------------------------------------------------------------------------
-- Updates tournament player stats to use primary context
CREATE OR REPLACE VIEW public.tournament_player_stats AS
SELECT 
    p.id AS player_id,
    p.gamertag,
    p.position,
    t.id AS tournament_id,
    t.name AS tournament_name,
    t.game_year,
    t.tier AS tournament_tier,
    teams.id AS team_id,
    teams.name AS team_name,
    COUNT(DISTINCT ps.match_id) AS games_played,
    SUM(ps.points) AS total_points,
    AVG(ps.points)::NUMERIC(10,1) AS avg_points,
    SUM(ps.rebounds) AS total_assists,
    AVG(ps.rebounds)::NUMERIC(10,1) AS avg_rebounds,
    SUM(ps.assists) AS total_rebounds,
    AVG(ps.assists)::NUMERIC(10,1) AS avg_assists,
    SUM(ps.steals) AS total_steals,
    AVG(ps.steals)::NUMERIC(10,1) AS avg_steals,
    SUM(ps.blocks) AS total_blocks,
    AVG(ps.blocks)::NUMERIC(10,1) AS avg_blocks,
    SUM(ps.turnovers) AS total_turnovers,
    AVG(ps.turnovers)::NUMERIC(10,1) AS avg_turnovers,
    SUM(ps.fouls) AS total_fouls,
    AVG(ps.fouls)::NUMERIC(10,1) AS avg_fouls,
    SUM(ps.fgm) AS total_fgm,
    SUM(ps.fga) AS total_fga,
    CASE 
        WHEN SUM(ps.fga) > 0 
        THEN ((SUM(ps.fgm)::NUMERIC / SUM(ps.fga)::NUMERIC) * 100)::NUMERIC(10,1)
        ELSE 0
    END AS fg_percentage,
    SUM(ps.three_points_made) AS total_3pm,
    SUM(ps.three_points_attempted) AS total_3pa,
    CASE 
        WHEN SUM(ps.three_points_attempted) > 0 
        THEN ((SUM(ps.three_points_made)::NUMERIC / SUM(ps.three_points_attempted)::NUMERIC) * 100)::NUMERIC(10,1)
        ELSE 0
    END AS three_pt_percentage,
    SUM(ps.ftm) AS total_ftm,
    SUM(ps.fta) AS total_fta,
    CASE 
        WHEN SUM(ps.fta) > 0 
        THEN ((SUM(ps.ftm)::NUMERIC / SUM(ps.fta)::NUMERIC) * 100)::NUMERIC(10,1)
        ELSE 0
    END AS ft_percentage,
    SUM(ps.plus_minus) AS total_plus_minus,
    AVG(ps.plus_minus)::NUMERIC(10,1) AS avg_plus_minus,
    AVG(ps.ps)::NUMERIC(10,1) AS avg_performance_score,
    SUM(ps.ps) AS total_performance_score
FROM player_stats ps
-- KEY CHANGE: Use v_matches_with_primary_context instead of matches
JOIN v_matches_with_primary_context m ON ps.match_id = m.id
-- KEY CHANGE: Join on primary_tournament_id instead of tournament_id
JOIN tournaments t ON m.primary_tournament_id = t.id
JOIN players p ON ps.player_id = p.id
JOIN teams ON ps.team_id = teams.id
-- KEY CHANGE: Filter on primary_tournament_id instead of tournament_id
WHERE m.primary_tournament_id IS NOT NULL
GROUP BY p.id, p.gamertag, p.position, t.id, t.name, t.game_year, t.tier, teams.id, teams.name
ORDER BY t.name, teams.name, p.gamertag;


-- ----------------------------------------------------------------------------
-- 3. league_results (Complex view - Update CTEs)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.league_results AS
WITH team_standings AS (
    SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.logo_url,
        t.current_rp,
        t.elo_rating,
        li.id AS league_id,
        li.league AS league_name,
        ls.id AS season_id,
        ls.season_number,
        ls.year,
        COALESCE(lc.name, 'N/A') AS conference_name,
        -- Count wins
        COUNT(DISTINCT CASE 
            WHEN m.winner_id = t.id THEN m.id 
        END) AS wins,
        -- Count losses
        COUNT(DISTINCT CASE 
            WHEN (m.team_a_id = t.id OR m.team_b_id = t.id) 
                AND m.winner_id <> t.id 
                AND m.winner_id IS NOT NULL 
            THEN m.id 
        END) AS losses,
        -- Win percentage
        ROUND(
            (COUNT(DISTINCT CASE WHEN m.winner_id = t.id THEN m.id END)::NUMERIC / 
             NULLIF(COUNT(DISTINCT CASE 
                WHEN (m.team_a_id = t.id OR m.team_b_id = t.id) 
                    AND m.winner_id IS NOT NULL 
                THEN m.id 
            END), 0)::NUMERIC) * 100, 1
        ) AS win_percentage,
        -- Points for
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_a
            ELSE m.score_b
        END) AS points_for,
        -- Points against
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_b
            ELSE m.score_a
        END) AS points_against,
        -- Point differential
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_a - m.score_b
            ELSE m.score_b - m.score_a
        END) AS point_differential
    FROM teams t
    -- KEY CHANGE: Use v_matches_with_primary_context
    LEFT JOIN v_matches_with_primary_context m 
        ON (m.team_a_id = t.id OR m.team_b_id = t.id) 
        AND m.winner_id IS NOT NULL
    LEFT JOIN leagues_info li ON m.primary_league_id = li.id
    LEFT JOIN league_seasons ls ON m.primary_season_id = ls.id
    LEFT JOIN lg_conf lc ON t.lg_conf = lc.id
    GROUP BY t.id, t.name, t.logo_url, t.current_rp, t.elo_rating, 
             li.id, li.league, ls.id, ls.season_number, ls.year, lc.name
),
team_rosters_aggregated AS (
    SELECT 
        tr.team_id,
        li.id AS league_id,
        ls.id AS season_id,
        JSON_AGG(JSON_BUILD_OBJECT(
            'player_id', p.id,
            'gamertag', p.gamertag,
            'position', p.position,
            'is_captain', tr.is_captain,
            'is_player_coach', tr.is_player_coach,
            'player_rp', p.player_rp,
            'performance_score', p.performance_score
        )) AS roster
    FROM team_rosters tr
    JOIN players p ON tr.player_id = p.id
    JOIN leagues_info li ON tr.league_id = li.id
    LEFT JOIN league_seasons ls ON li.id = ls.league_id
    WHERE tr.left_at IS NULL
    GROUP BY tr.team_id, li.id, ls.id
),
team_stats AS (
    SELECT 
        tms.team_id,
        m.primary_league_id AS league_id,
        m.primary_season_id AS season_id,
        AVG(tms.points) AS avg_points,
        AVG(tms.rebounds) AS avg_rebounds,
        AVG(tms.assists) AS avg_assists,
        AVG(tms.steals) AS avg_steals,
        AVG(tms.blocks) AS avg_blocks,
        AVG(tms.turnovers) AS avg_turnovers,
        AVG(tms.field_goals_made) AS avg_fgm,
        AVG(tms.field_goals_attempted) AS avg_fga,
        CASE 
            WHEN SUM(tms.field_goals_attempted) > 0 
            THEN ROUND((SUM(tms.field_goals_made)::NUMERIC / SUM(tms.field_goals_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS fg_percentage,
        CASE 
            WHEN SUM(tms.three_points_attempted) > 0 
            THEN ROUND((SUM(tms.three_points_made)::NUMERIC / SUM(tms.three_points_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS three_pt_percentage
    FROM team_match_stats tms
    -- KEY CHANGE: Use v_matches_with_primary_context
    JOIN v_matches_with_primary_context m ON tms.match_id = m.id
    GROUP BY tms.team_id, m.primary_league_id, m.primary_season_id
),
player_stats_aggregated AS (
    SELECT 
        ps.team_id,
        m.primary_league_id AS league_id,
        m.primary_season_id AS season_id,
        ps.player_id,
        p.gamertag,
        COUNT(DISTINCT ps.match_id) AS games_played,
        AVG(ps.points) AS ppg,
        AVG(ps.assists) AS apg,
        AVG(ps.rebounds) AS rpg,
        AVG(ps.steals) AS spg,
        AVG(ps.blocks) AS bpg,
        AVG(ps.turnovers) AS topg,
        CASE 
            WHEN SUM(ps.fga) > 0 
            THEN ROUND((SUM(ps.fgm)::NUMERIC / SUM(ps.fga)::NUMERIC) * 100, 1)
            ELSE 0
        END AS fg_percentage,
        CASE 
            WHEN SUM(ps.three_points_attempted) > 0 
            THEN ROUND((SUM(ps.three_points_made)::NUMERIC / SUM(ps.three_points_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS three_pt_percentage,
        AVG(ps.ps) AS performance_score
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.id
    -- KEY CHANGE: Use v_matches_with_primary_context
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    -- KEY CHANGE: Filter on primary_league_id
    WHERE m.primary_league_id IS NOT NULL
    GROUP BY ps.team_id, ps.player_id, p.gamertag, m.primary_league_id, m.primary_season_id
),
league_stats_leaders AS (
    SELECT 
        psa.league_id,
        psa.season_id,
        JSON_BUILD_OBJECT(
            'points_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.ppg
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.ppg DESC),
            'rebounds_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.rpg
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.rpg DESC),
            'assists_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.apg
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.apg DESC),
            'steals_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.spg
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.spg DESC),
            'blocks_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.bpg
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.bpg DESC),
            'performance_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', psa.player_id,
                'gamertag', psa.gamertag,
                'team_id', psa.team_id,
                'team_name', t.name,
                'value', psa.performance_score
            )) OVER (PARTITION BY psa.league_id, psa.season_id ORDER BY psa.performance_score DESC)
        ) AS stat_leaders
    FROM player_stats_aggregated psa
    JOIN teams t ON psa.team_id = t.id
    WHERE psa.games_played >= 3
),
team_performance_ranks AS (
    SELECT 
        ts.league_id,
        ts.season_id,
        JSON_BUILD_OBJECT(
            'offense', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                    'team_id', ts2.team_id,
                    'team_name', ts2.team_name,
                    'value', ts2.avg_points
                ) ORDER BY ts2.avg_points DESC)
                FROM (
                    SELECT 
                        st.team_id,
                        st.team_name,
                        tst.avg_points,
                        ROW_NUMBER() OVER (PARTITION BY st.league_id, st.season_id ORDER BY tst.avg_points DESC) AS rank
                    FROM team_standings st
                    JOIN team_stats tst ON st.team_id = tst.team_id 
                        AND st.league_id = tst.league_id 
                        AND st.season_id = tst.season_id
                ) ts2
                WHERE ts2.rank <= 5
            ),
            'defense', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                    'team_id', td.team_id,
                    'team_name', td.team_name,
                    'value', td.points_against
                ) ORDER BY td.points_against)
                FROM (
                    SELECT 
                        team_id,
                        team_name,
                        points_against,
                        ROW_NUMBER() OVER (PARTITION BY league_id, season_id ORDER BY points_against) AS rank
                    FROM team_standings
                ) td
                WHERE td.rank <= 5
            )
        ) AS team_rankings
    FROM team_standings ts
    GROUP BY ts.league_id, ts.season_id
)
SELECT 
    ts.league_id,
    ts.league_name,
    ts.season_id,
    ts.season_number,
    ts.year,
    ts.team_id,
    ts.team_name,
    ts.logo_url,
    ts.conference_name,
    ts.wins,
    ts.losses,
    ts.win_percentage,
    ts.current_rp,
    ts.elo_rating,
    ts.points_for,
    ts.points_against,
    ts.point_differential,
    tra.roster,
    tst.avg_points,
    tst.avg_rebounds,
    tst.avg_assists,
    tst.avg_steals,
    tst.avg_blocks,
    tst.avg_turnovers,
    tst.fg_percentage,
    tst.three_pt_percentage,
    lsl.stat_leaders,
    tpr.team_rankings
FROM team_standings ts
LEFT JOIN team_rosters_aggregated tra 
    ON ts.team_id = tra.team_id 
    AND ts.league_id = tra.league_id 
    AND ts.season_id = tra.season_id
LEFT JOIN team_stats tst 
    ON ts.team_id = tst.team_id 
    AND ts.league_id = tst.league_id 
    AND ts.season_id = tst.season_id
LEFT JOIN (
    SELECT DISTINCT ON (league_id, season_id) 
        league_id, season_id, stat_leaders
    FROM league_stats_leaders
) lsl ON ts.league_id = lsl.league_id AND ts.season_id = lsl.season_id
LEFT JOIN (
    SELECT DISTINCT ON (league_id, season_id) 
        league_id, season_id, team_rankings
    FROM team_performance_ranks
) tpr ON ts.league_id = tpr.league_id AND ts.season_id = tpr.season_id;


-- ----------------------------------------------------------------------------
-- 4. tournament_results (Complex view - Update CTEs)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.tournament_results AS
WITH tournament_standings AS (
    SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.logo_url,
        t.current_rp,
        t.elo_rating,
        tr.id AS tournament_id,
        tr.name AS tournament_name,
        tr.start_date,
        tr.end_date,
        tr.game_year,
        tr.tier AS tournament_tier,
        tr.prize_pool,
        tr.status AS tournament_status,
        li.id AS organizer_id,
        li.league AS organizer_name,
        -- Final placement
        CASE 
            WHEN tr.champion = t.id THEN 1
            WHEN tr.runner_up = t.id THEN 2
            WHEN tr.place = t.id THEN 3
            ELSE NULL
        END AS final_placement,
        -- Count wins
        COUNT(DISTINCT CASE 
            WHEN m.winner_id = t.id THEN m.id 
        END) AS wins,
        -- Count losses
        COUNT(DISTINCT CASE 
            WHEN (m.team_a_id = t.id OR m.team_b_id = t.id) 
                AND m.winner_id <> t.id 
                AND m.winner_id IS NOT NULL 
            THEN m.id 
        END) AS losses,
        -- Win percentage
        ROUND(
            (COUNT(DISTINCT CASE WHEN m.winner_id = t.id THEN m.id END)::NUMERIC / 
             NULLIF(COUNT(DISTINCT CASE 
                WHEN (m.team_a_id = t.id OR m.team_b_id = t.id) 
                    AND m.winner_id IS NOT NULL 
                THEN m.id 
            END), 0)::NUMERIC) * 100, 1
        ) AS win_percentage,
        -- Points for
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_a
            ELSE m.score_b
        END) AS points_for,
        -- Points against
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_b
            ELSE m.score_a
        END) AS points_against,
        -- Point differential
        SUM(CASE 
            WHEN m.team_a_id = t.id THEN m.score_a - m.score_b
            ELSE m.score_b - m.score_a
        END) AS point_differential,
        MAX(tpt.prize_amount) AS prize_won,
        -- Groups
        (SELECT STRING_AGG(tgg.name, ', ')
         FROM tournament_group_members tgm
         JOIN tournament_groups tgg ON tgm.group_id = tgg.id
         WHERE tgm.team_id = t.id AND tgg.tournament_id = tr.id
        ) AS groups
    FROM teams t
    -- KEY CHANGE: Use v_matches_with_primary_context
    JOIN v_matches_with_primary_context m 
        ON (m.team_a_id = t.id OR m.team_b_id = t.id) 
        -- KEY CHANGE: Filter by primary_tournament_id
        AND m.primary_tournament_id IS NOT NULL
    -- KEY CHANGE: Join on primary_tournament_id
    JOIN tournaments tr ON m.primary_tournament_id = tr.id
    LEFT JOIN leagues_info li ON tr.organizer_id = li.id
    LEFT JOIN teams_pot_tracker tpt 
        ON tpt.team_id = t.id AND tpt.tournament_id = tr.id
    GROUP BY t.id, t.name, t.logo_url, t.current_rp, t.elo_rating, 
             tr.id, tr.name, tr.start_date, tr.end_date, tr.game_year, 
             tr.tier, tr.prize_pool, tr.status, li.id, li.league, 
             tr.champion, tr.runner_up, tr.place
),
tournament_rosters AS (
    SELECT 
        tr.team_id,
        tr.tournament_id,
        JSON_AGG(JSON_BUILD_OBJECT(
            'player_id', p.id,
            'gamertag', p.gamertag,
            'position', p.position,
            'is_captain', tr.is_captain,
            'is_player_coach', tr.is_player_coach,
            'player_rp', p.player_rp,
            'performance_score', p.performance_score
        )) AS roster
    FROM team_rosters tr
    JOIN players p ON tr.player_id = p.id
    WHERE tr.tournament_id IS NOT NULL 
        AND tr.left_at IS NULL
    GROUP BY tr.team_id, tr.tournament_id
),
tournament_team_stats AS (
    SELECT 
        tms.team_id,
        m.primary_tournament_id AS tournament_id,
        AVG(tms.points) AS avg_points,
        AVG(tms.rebounds) AS avg_rebounds,
        AVG(tms.assists) AS avg_assists,
        AVG(tms.steals) AS avg_steals,
        AVG(tms.blocks) AS avg_blocks,
        AVG(tms.turnovers) AS avg_turnovers,
        AVG(tms.field_goals_made) AS avg_fgm,
        AVG(tms.field_goals_attempted) AS avg_fga,
        CASE 
            WHEN SUM(tms.field_goals_attempted) > 0 
            THEN ROUND((SUM(tms.field_goals_made)::NUMERIC / SUM(tms.field_goals_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS fg_percentage,
        CASE 
            WHEN SUM(tms.three_points_attempted) > 0 
            THEN ROUND((SUM(tms.three_points_made)::NUMERIC / SUM(tms.three_points_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS three_pt_percentage
    FROM team_match_stats tms
    -- KEY CHANGE: Use v_matches_with_primary_context
    JOIN v_matches_with_primary_context m ON tms.match_id = m.id
    -- KEY CHANGE: Filter by primary_tournament_id
    WHERE m.primary_tournament_id IS NOT NULL
    GROUP BY tms.team_id, m.primary_tournament_id
),
tournament_player_stats AS (
    SELECT 
        ps.team_id,
        m.primary_tournament_id AS tournament_id,
        ps.player_id,
        p.gamertag,
        COUNT(DISTINCT ps.match_id) AS games_played,
        AVG(ps.points) AS ppg,
        AVG(ps.assists) AS rpg,
        AVG(ps.rebounds) AS apg,
        AVG(ps.steals) AS spg,
        AVG(ps.blocks) AS bpg,
        AVG(ps.turnovers) AS topg,
        CASE 
            WHEN SUM(ps.fga) > 0 
            THEN ROUND((SUM(ps.fgm)::NUMERIC / SUM(ps.fga)::NUMERIC) * 100, 1)
            ELSE 0
        END AS fg_percentage,
        CASE 
            WHEN SUM(ps.three_points_attempted) > 0 
            THEN ROUND((SUM(ps.three_points_made)::NUMERIC / SUM(ps.three_points_attempted)::NUMERIC) * 100, 1)
            ELSE 0
        END AS three_pt_percentage,
        AVG(ps.ps) AS performance_score,
        (SELECT COUNT(*) 
         FROM match_mvp 
         WHERE match_mvp.player_id = ps.player_id 
            AND match_mvp.match_id IN (
                -- KEY CHANGE: Use v_matches_with_primary_context and primary_tournament_id
                SELECT id FROM v_matches_with_primary_context 
                WHERE primary_tournament_id = m.primary_tournament_id
            )
        ) AS mvp_count
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.id
    -- KEY CHANGE: Use v_matches_with_primary_context
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    -- KEY CHANGE: Filter by primary_tournament_id
    WHERE m.primary_tournament_id IS NOT NULL
    GROUP BY ps.team_id, ps.player_id, p.gamertag, m.primary_tournament_id
),
tournament_stats_leaders AS (
    SELECT 
        tps.tournament_id,
        JSON_BUILD_OBJECT(
            'points_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.ppg
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.ppg DESC),
            'rebounds_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.rpg
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.rpg DESC),
            'assists_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.apg
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.apg DESC),
            'steals_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.spg
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.spg DESC),
            'blocks_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.bpg
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.bpg DESC),
            'performance_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.performance_score
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.performance_score DESC),
            'mvp_leader', FIRST_VALUE(JSON_BUILD_OBJECT(
                'player_id', tps.player_id,
                'gamertag', tps.gamertag,
                'team_id', tps.team_id,
                'team_name', t.name,
                'value', tps.mvp_count
            )) OVER (PARTITION BY tps.tournament_id ORDER BY tps.mvp_count DESC NULLS LAST, tps.performance_score DESC)
        ) AS stat_leaders
    FROM tournament_player_stats tps
    JOIN teams t ON tps.team_id = t.id
    WHERE tps.games_played >= 2
),
tournament_group_standings AS (
    SELECT 
        gs.group_id,
        tg.tournament_id,
        tg.name AS group_name,
        JSON_AGG(JSON_BUILD_OBJECT(
            'team_id', gs.team_id,
            'team_name', t.name,
            'matches_played', gs.matches_played,
            'wins', gs.wins,
            'losses', gs.losses,
            'points_for', gs.points_for,
            'points_against', gs.points_against,
            'point_differential', gs.point_differential,
            'position', gs.position
        ) ORDER BY gs.position) AS group_standings
    FROM group_standings gs
    JOIN tournament_groups tg ON gs.group_id = tg.id
    JOIN teams t ON gs.team_id = t.id
    GROUP BY gs.group_id, tg.tournament_id, tg.name
),
tournament_team_rankings AS (
    SELECT 
        ts.tournament_id,
        JSON_BUILD_OBJECT(
            'offense', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                    'team_id', ts2.team_id,
                    'team_name', ts2.team_name,
                    'value', ts2.avg_points
                ) ORDER BY ts2.avg_points DESC)
                FROM (
                    SELECT 
                        st.team_id,
                        st.team_name,
                        tts.avg_points,
                        ROW_NUMBER() OVER (PARTITION BY st.tournament_id ORDER BY tts.avg_points DESC) AS rank
                    FROM tournament_standings st
                    JOIN tournament_team_stats tts 
                        ON st.team_id = tts.team_id 
                        AND st.tournament_id = tts.tournament_id
                ) ts2
                WHERE ts2.rank <= 5
            ),
            'defense', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                    'team_id', td.team_id,
                    'team_name', td.team_name,
                    'value', td.points_against
                ) ORDER BY td.points_against)
                FROM (
                    SELECT 
                        team_id,
                        team_name,
                        points_against,
                        ROW_NUMBER() OVER (PARTITION BY tournament_id ORDER BY points_against) AS rank
                    FROM tournament_standings
                    WHERE points_against > 0
                ) td
                WHERE td.rank <= 5
            )
        ) AS team_rankings
    FROM tournament_standings ts
    GROUP BY ts.tournament_id
),
tournament_awards AS (
    SELECT 
        ar.tournament_id,
        JSON_OBJECT_AGG(
            ar.award_type::TEXT,
            JSON_BUILD_OBJECT(
                'player_id', p.id,
                'gamertag', p.gamertag,
                'team_id', ar.team_id,
                'team_name', t.name
            )
        ) AS awards
    FROM awards_race ar
    JOIN players p ON ar.player_id = p.id
    JOIN teams t ON ar.team_id = t.id
    WHERE ar.award_winner = true 
        AND ar.tournament_id IS NOT NULL
    GROUP BY ar.tournament_id
)
SELECT 
    ts.tournament_id,
    ts.tournament_name,
    ts.start_date,
    ts.end_date,
    ts.game_year,
    ts.tournament_tier,
    ts.prize_pool,
    ts.tournament_status,
    ts.organizer_id,
    ts.organizer_name,
    ts.team_id,
    ts.team_name,
    ts.logo_url,
    ts.final_placement,
    ts.wins,
    ts.losses,
    ts.win_percentage,
    ts.current_rp,
    ts.elo_rating,
    ts.points_for,
    ts.points_against,
    ts.point_differential,
    ts.prize_won,
    ts.groups,
    tr.roster,
    tts.avg_points,
    tts.avg_rebounds,
    tts.avg_assists,
    tts.avg_steals,
    tts.avg_blocks,
    tts.avg_turnovers,
    tts.fg_percentage,
    tts.three_pt_percentage,
    tsl.stat_leaders,
    tr2.team_rankings,
    ta.awards,
    (SELECT JSON_AGG(gs.*) 
     FROM tournament_group_standings gs 
     WHERE gs.tournament_id = ts.tournament_id
    ) AS group_standings
FROM tournament_standings ts
LEFT JOIN tournament_rosters tr 
    ON ts.team_id = tr.team_id 
    AND ts.tournament_id = tr.tournament_id
LEFT JOIN tournament_team_stats tts 
    ON ts.team_id = tts.team_id 
    AND ts.tournament_id = tts.tournament_id
LEFT JOIN (
    SELECT DISTINCT ON (tournament_id) 
        tournament_id, stat_leaders
    FROM tournament_stats_leaders
) tsl ON ts.tournament_id = tsl.tournament_id
LEFT JOIN (
    SELECT DISTINCT ON (tournament_id) 
        tournament_id, team_rankings
    FROM tournament_team_rankings
) tr2 ON ts.tournament_id = tr2.tournament_id
LEFT JOIN tournament_awards ta ON ts.tournament_id = ta.tournament_id;


-- ============================================================================
-- DEPLOYMENT INSTRUCTIONS
-- ============================================================================
-- 1. Run these 4 CREATE OR REPLACE VIEW statements in Supabase SQL Editor
-- 2. Verify views work: SELECT * FROM league_results LIMIT 1;
-- 3. Test cross-context functionality by adding a tournament match to a league
-- 4. Regenerate TypeScript types:
--    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts
-- ============================================================================
