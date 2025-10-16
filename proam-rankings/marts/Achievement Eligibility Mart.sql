CREATE MATERIALIZED VIEW achievement_eligibility_mart AS
WITH player_career_stats AS (
    SELECT
        ps.player_id,
        COUNT(DISTINCT ps.match_id) AS total_games,  -- Use DISTINCT to avoid duplicate counts
        SUM(ps.points) AS total_points,
        SUM(ps.assists) AS total_assists,
        SUM(ps.rebounds) AS total_rebounds,
        SUM(ps.steals) AS total_steals,
        SUM(ps.blocks) AS total_blocks,
        MAX(ps.points) AS career_high_points,
        MAX(ps.assists) AS career_high_assists,
        MAX(ps.rebounds) AS career_high_rebounds,
        -- For milestone counts, use DISTINCT match_id to avoid duplicates
        COUNT(DISTINCT CASE WHEN ps.points >= 10 AND ps.assists >= 10 AND ps.rebounds >= 10 THEN ps.match_id END) AS triple_doubles,
        COUNT(DISTINCT CASE WHEN ps.points >= 30 THEN ps.match_id END) AS games_30plus,
        COUNT(DISTINCT CASE WHEN ps.points >= 40 THEN ps.match_id END) AS games_40plus,
        COUNT(DISTINCT CASE WHEN ps.points >= 50 THEN ps.match_id END) AS games_50plus
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE AND m.verified = TRUE
    GROUP BY ps.player_id
),
current_streaks AS (
    SELECT
        player_id,
        consecutive_games,
        streak_type,
        last_game_date
    FROM (
        SELECT
            ps.player_id,
            COUNT(DISTINCT ps.match_id) AS consecutive_games,  -- Use DISTINCT here too
            CASE 
                WHEN ps.points >= 20 THEN '20pt_streak'
                WHEN ps.points >= 15 THEN '15pt_streak'
                WHEN ps.assists >= 7 THEN '7ast_streak'
                WHEN ps.rebounds >= 8 THEN '8reb_streak'
            END AS streak_type,
            MAX(m.played_at) AS last_game_date,
            ROW_NUMBER() OVER (PARTITION BY ps.player_id ORDER BY MAX(m.played_at) DESC) AS streak_recency
        FROM player_stats ps
        JOIN v_matches_with_primary_context m ON ps.match_id = m.id
        WHERE ps.verified = TRUE AND m.verified = TRUE
        AND m.played_at > (NOW() - INTERVAL '90 days')
        GROUP BY ps.player_id, 
            CASE 
                WHEN ps.points >= 20 THEN '20pt_streak'
                WHEN ps.points >= 15 THEN '15pt_streak'
                WHEN ps.assists >= 7 THEN '7ast_streak'
                WHEN ps.rebounds >= 8 THEN '8reb_streak'
            END
        HAVING COUNT(DISTINCT ps.match_id) >= 3
    ) streaks
    WHERE streak_recency = 1
),
milestone_progress AS (
    SELECT
        player_id,
        -- Points Milestones
        CASE
            WHEN total_points >= 10000 THEN '10000+ Career Points'
            WHEN total_points >= 5000 THEN '5000+ Career Points'
            WHEN total_points >= 2500 THEN '2500+ Career Points'
            WHEN total_points >= 1000 THEN '1000+ Career Points'
            ELSE 'Under 1000 Points'
        END AS points_milestone_achieved,
        CASE
            WHEN total_points < 1000 THEN 1000 - total_points
            WHEN total_points < 2500 THEN 2500 - total_points
            WHEN total_points < 5000 THEN 5000 - total_points
            WHEN total_points < 10000 THEN 10000 - total_points
            ELSE NULL
        END AS points_to_next_milestone,
        
        -- Assists Milestones
        CASE
            WHEN total_assists >= 2000 THEN '2000+ Career Assists'
            WHEN total_assists >= 1000 THEN '1000+ Career Assists'
            WHEN total_assists >= 500 THEN '500+ Career Assists'
            ELSE 'Under 500 Assists'
        END AS assists_milestone_achieved,
        CASE
            WHEN total_assists < 500 THEN 500 - total_assists
            WHEN total_assists < 1000 THEN 1000 - total_assists
            WHEN total_assists < 2000 THEN 2000 - total_assists
            ELSE NULL
        END AS assists_to_next_milestone,
        
        -- Rebounds Milestones
        CASE
            WHEN total_rebounds >= 2000 THEN '2000+ Career Rebounds'
            WHEN total_rebounds >= 1000 THEN '1000+ Career Rebounds'
            WHEN total_rebounds >= 500 THEN '500+ Career Rebounds'
            ELSE 'Under 500 Rebounds'
        END AS rebounds_milestone_achieved,
        
        -- Games Played Milestones
        CASE
            WHEN total_games >= 500 THEN '500+ Games'
            WHEN total_games >= 250 THEN '250+ Games'
            WHEN total_games >= 100 THEN '100+ Games'
            WHEN total_games >= 50 THEN '50+ Games'
            ELSE 'Under 50 Games'
        END AS games_milestone_achieved
    FROM player_career_stats
),
achievement_candidates AS (
    SELECT
        player_id,
        -- Single Game Achievement Potential
        CASE WHEN career_high_points >= 50 THEN 'Eligible: 50-Point Game' END AS fifty_point_eligible,
        CASE WHEN triple_doubles >= 1 THEN 'Eligible: Triple Double' END AS triple_double_eligible,
        
        -- Consistency Achievements
        CASE WHEN games_30plus >= 10 THEN 'Eligible: 10x 30-Point Games' END AS consistent_scorer_eligible,
        
        -- Longevity Achievements
        CASE WHEN total_games >= 100 THEN 'Eligible: Century Club' END AS century_club_eligible,
        CASE WHEN total_games >= 250 THEN 'Eligible: Veteran Status' END AS veteran_eligible
    FROM player_career_stats
),
season_achievements AS (
    SELECT
        ps.player_id,
        STRING_AGG(DISTINCT ls.league_name::text, ', ' ORDER BY ls.league_name::text) AS active_season_leagues,
        STRING_AGG(DISTINCT (ls.league_name::text || ' S' || ls.season_number), ', ' ORDER BY (ls.league_name::text || ' S' || ls.season_number)) AS active_seasons_list,
        COUNT(DISTINCT m.primary_season_id) AS active_season_count,
        SUM(CASE WHEN m.primary_season_id IS NOT NULL THEN 1 ELSE 0 END) AS total_season_games,
        ROUND(AVG(ps.points), 1) AS avg_season_points,
        SUM(ps.points) AS total_season_points,
        CASE 
            WHEN COUNT(DISTINCT ps.match_id) >= 10 AND AVG(ps.points) >= 25 THEN 'Eligible: Season Scoring Leader'
            ELSE NULL
        END AS season_award_eligible
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    LEFT JOIN league_seasons ls ON m.primary_season_id = ls.id
    WHERE ps.verified = TRUE 
    AND m.verified = TRUE
    AND m.primary_season_id IS NOT NULL
    AND ls.is_active = TRUE
    GROUP BY ps.player_id
)
SELECT
    p.id AS player_id,
    p.gamertag,
    p.position,
    p.current_team_id,
    t.name AS current_team,
    
    -- Career Stats
    COALESCE(pcs.total_games, 0) AS total_games,
    COALESCE(pcs.total_points, 0) AS total_points,
    COALESCE(pcs.total_assists, 0) AS total_assists,
    COALESCE(pcs.total_rebounds, 0) AS total_rebounds,
    COALESCE(pcs.total_steals, 0) AS total_steals,
    COALESCE(pcs.total_blocks, 0) AS total_blocks,
    
    -- Milestone Progress
    mp.points_milestone_achieved,
    mp.points_to_next_milestone,
    mp.assists_milestone_achieved,
    mp.assists_to_next_milestone,
    mp.rebounds_milestone_achieved,
    mp.games_milestone_achieved,
    
    -- Achievement Eligibility
    ac.fifty_point_eligible,
    ac.triple_double_eligible,
    ac.consistent_scorer_eligible,
    ac.century_club_eligible,
    ac.veteran_eligible,
    
    -- Active Streaks
    cs.streak_type AS active_streak_type,
    COALESCE(cs.consecutive_games, 0) AS active_streak_length,
    cs.last_game_date AS streak_last_game,
    
    -- Season Awards (aggregated across all active seasons)
    sa.season_award_eligible,
    sa.active_season_leagues AS active_season_league,
    sa.active_seasons_list AS active_season_number,
    COALESCE(sa.total_season_games, 0) AS active_season_games,
    sa.avg_season_points AS active_season_avg_points,
    
    -- Achievement Summary
    COALESCE(
        (SELECT COUNT(*) FROM player_awards WHERE player_id = p.id), 
        0
    ) AS total_achievements_earned,
    
    -- Next Achievable Milestone
    CASE
        WHEN mp.points_to_next_milestone IS NOT NULL AND mp.points_to_next_milestone <= 100 THEN 'Points Milestone Close'
        WHEN mp.assists_to_next_milestone IS NOT NULL AND mp.assists_to_next_milestone <= 50 THEN 'Assists Milestone Close'
        WHEN cs.consecutive_games >= 5 THEN 'Active Long Streak'
        WHEN pcs.total_games >= 95 AND pcs.total_games < 100 THEN 'Near Century Club'
        ELSE NULL
    END AS next_achievement_alert
    
FROM players p
LEFT JOIN player_career_stats pcs ON p.id = pcs.player_id
LEFT JOIN milestone_progress mp ON p.id = mp.player_id
LEFT JOIN achievement_candidates ac ON p.id = ac.player_id
LEFT JOIN current_streaks cs ON p.id = cs.player_id
LEFT JOIN season_achievements sa ON p.id = sa.player_id
LEFT JOIN teams t ON p.current_team_id = t.id;

-- Create index for achievement_eligibility_mart
CREATE UNIQUE INDEX idx_aem_player_id_unique ON achievement_eligibility_mart(player_id);

