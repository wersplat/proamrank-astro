-- Fix for inaccurate badge stat counters
-- Issue: Counters showing more games than player has actually played (e.g., 102 40+ games when only 58 verified games)
-- Root Cause: Not using DISTINCT count on match_id, which can cause duplicates to be counted

-- Step 1: Drop and recreate the player_stats_tracking_mart with proper DISTINCT counts
DROP MATERIALIZED VIEW IF EXISTS player_stats_tracking_mart CASCADE;

CREATE MATERIALIZED VIEW player_stats_tracking_mart AS
WITH player_history AS (
    SELECT DISTINCT ON (ps.player_id, ps.match_id)  -- Ensure we only get one record per player per match
        ps.player_id,
        ps.match_id,  -- Add match_id to the select for DISTINCT ON
        m.played_at,
        m.primary_league_id AS league_id,
        m.primary_tournament_id AS tournament_id,
        m.primary_season_id AS season_id,
        ps.points,
        ps.assists,
        ps.rebounds,
        ps.steals,
        ps.blocks,
        ps.turnovers,
        ps.fgm,
        ps.fga,
        ps.three_points_made,
        ps.three_points_attempted,
        ps.ftm,
        ps.fta,
        ps.plus_minus
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
    ORDER BY ps.player_id, ps.match_id, ps.created_at DESC  -- Take most recent record if duplicates exist
),
player_history_with_row_num AS (
    SELECT
        player_id,
        match_id,
        played_at,
        league_id,
        tournament_id,
        season_id,
        points,
        assists,
        rebounds,
        steals,
        blocks,
        turnovers,
        fgm,
        fga,
        three_points_made,
        three_points_attempted,
        ftm,
        fta,
        plus_minus,
        ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY played_at) AS game_number,
        SUM(points) OVER (PARTITION BY player_id ORDER BY played_at) AS running_point_total,
        AVG(points) OVER (PARTITION BY player_id ORDER BY played_at ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) AS pts_rolling_avg_6,
        AVG(points) OVER (PARTITION BY player_id ORDER BY played_at ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS pts_rolling_avg_10
    FROM player_history
),
recent_games AS (
    SELECT 
        ps.player_id, 
        ps.points, 
        ps.assists, 
        ps.rebounds,
        ROW_NUMBER() OVER (PARTITION BY ps.player_id ORDER BY m.played_at DESC) AS rn
    FROM (
        SELECT DISTINCT ON (player_id, match_id)
            player_id,
            match_id,
            points,
            assists,
            rebounds
        FROM player_stats
        WHERE verified = TRUE
        ORDER BY player_id, match_id, created_at DESC
    ) ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
)
SELECT
    p.id AS player_id,
    p.gamertag,
    p.position,
    p.current_team_id,
    t.name AS current_team,
    COALESCE(pgr.global_rating, 0) AS global_rating,
    COALESCE(pgr.rating_tier, 'Unranked') AS rating_tier,
    
    -- Career Totals - Using COUNT(DISTINCT match_id) to avoid counting duplicates
    COUNT(DISTINCT ph.match_id) AS career_games,
    COALESCE(SUM(ph.points), 0) AS career_points,
    COALESCE(SUM(ph.assists), 0) AS career_assists,
    COALESCE(SUM(ph.rebounds), 0) AS career_rebounds,
    COALESCE(SUM(ph.steals), 0) AS career_steals,
    COALESCE(SUM(ph.blocks), 0) AS career_blocks,
    COALESCE(SUM(ph.turnovers), 0) AS career_turnovers,
    
    -- Career Averages
    ROUND(AVG(ph.points)::numeric, 1) AS avg_points,
    ROUND(AVG(ph.assists)::numeric, 1) AS avg_assists,
    ROUND(AVG(ph.rebounds)::numeric, 1) AS avg_rebounds,
    ROUND(AVG(ph.steals)::numeric, 1) AS avg_steals,
    ROUND(AVG(ph.blocks)::numeric, 1) AS avg_blocks,
    ROUND(AVG(ph.turnovers)::numeric, 1) AS avg_turnovers,
    
    -- Shooting Percentages
    ROUND(((SUM(ph.fgm)::float / NULLIF(SUM(ph.fga), 0)) * 100)::numeric, 1) AS fg_pct,
    ROUND(((SUM(ph.three_points_made)::float / NULLIF(SUM(ph.three_points_attempted), 0)) * 100)::numeric, 1) AS three_pt_pct,
    ROUND(((SUM(ph.ftm)::float / NULLIF(SUM(ph.fta), 0)) * 100)::numeric, 1) AS ft_pct,
    
    -- High Marks
    MAX(ph.points) AS career_high_points,
    MAX(ph.assists) AS career_high_assists,
    MAX(ph.rebounds) AS career_high_rebounds,
    MAX(ph.steals) AS career_high_steals,
    MAX(ph.blocks) AS career_high_blocks,
    
    -- Recent Performance (Last 10 Games)
    AVG(CASE WHEN recent.rn <= 10 THEN recent.points ELSE NULL END) AS last_10_avg_points,
    AVG(CASE WHEN recent.rn <= 10 THEN recent.assists ELSE NULL END) AS last_10_avg_assists,
    AVG(CASE WHEN recent.rn <= 10 THEN recent.rebounds ELSE NULL END) AS last_10_avg_rebounds,
    
    -- Achievement Stats (mutually exclusive ranges)
    -- These counts now properly handle unique matches only
    COUNT(DISTINCT CASE WHEN ph.points >= 30 AND ph.points < 40 THEN ph.match_id END) AS count_30pt_games,
    COUNT(DISTINCT CASE WHEN ph.points >= 40 AND ph.points < 50 THEN ph.match_id END) AS count_40pt_games,
    COUNT(DISTINCT CASE WHEN ph.points >= 50 THEN ph.match_id END) AS count_50pt_games,
    COUNT(DISTINCT CASE WHEN ph.assists >= 10 THEN ph.match_id END) AS count_10ast_games,
    COUNT(DISTINCT CASE WHEN ph.rebounds >= 10 THEN ph.match_id END) AS count_10reb_games,
    COUNT(DISTINCT CASE WHEN ph.blocks >= 5 THEN ph.match_id END) AS count_5blk_games,
    COUNT(DISTINCT CASE WHEN ph.steals >= 5 THEN ph.match_id END) AS count_5stl_games,
    COUNT(DISTINCT CASE WHEN ph.points >= 10 AND ph.assists >= 10 THEN ph.match_id END) AS count_dbl_pt_ast,
    COUNT(DISTINCT CASE WHEN ph.points >= 10 AND ph.rebounds >= 10 THEN ph.match_id END) AS count_dbl_pt_reb,
    COUNT(DISTINCT CASE WHEN ph.assists >= 10 AND ph.rebounds >= 10 THEN ph.match_id END) AS count_dbl_ast_reb,
    COUNT(DISTINCT CASE WHEN 
        (ph.points >= 10 AND ph.assists >= 10) OR 
        (ph.points >= 10 AND ph.rebounds >= 10) OR 
        (ph.assists >= 10 AND ph.rebounds >= 10)
    THEN ph.match_id END) AS count_double_doubles,
    COUNT(DISTINCT CASE WHEN ph.points >= 10 AND ph.assists >= 10 AND ph.rebounds >= 10 THEN ph.match_id END) AS count_triple_doubles,
    
    -- Timeline
    MIN(ph.played_at) AS first_game_date,
    MAX(ph.played_at) AS last_game_date,
    DATE_PART('day', NOW() - MAX(ph.played_at)) AS days_since_last_game,
    
    -- League & Tournament Participation
    COUNT(DISTINCT ph.league_id) AS leagues_played,
    COUNT(DISTINCT ph.tournament_id) AS tournaments_played,
    COUNT(DISTINCT ph.season_id) AS seasons_played,
    
    -- Additional Context
    ARRAY_AGG(DISTINCT ph.league_id) FILTER (WHERE ph.league_id IS NOT NULL) AS league_ids,
    ARRAY_AGG(DISTINCT ph.tournament_id) FILTER (WHERE ph.tournament_id IS NOT NULL) AS tournament_ids,
    ARRAY_AGG(DISTINCT ph.season_id) FILTER (WHERE ph.season_id IS NOT NULL) AS season_ids
FROM players p
LEFT JOIN player_history_with_row_num ph ON p.id = ph.player_id
LEFT JOIN v_player_global_rating pgr ON p.id = pgr.player_id
LEFT JOIN teams t ON p.current_team_id = t.id
LEFT JOIN recent_games recent ON p.id = recent.player_id
GROUP BY p.id, p.gamertag, p.position, p.current_team_id, t.name, pgr.global_rating, pgr.rating_tier;

-- Indexes for optimal performance
-- UNIQUE index required for concurrent refreshes
CREATE UNIQUE INDEX idx_pstm_player_id_unique ON player_stats_tracking_mart(player_id);
CREATE INDEX idx_pstm_global_rating ON player_stats_tracking_mart(global_rating DESC);
CREATE INDEX idx_pstm_career_points ON player_stats_tracking_mart(career_points DESC);
CREATE INDEX idx_pstm_current_team ON player_stats_tracking_mart(current_team_id) WHERE current_team_id IS NOT NULL;

-- Step 2: Also fix the Achievement Eligibility Mart to use DISTINCT counts
DROP MATERIALIZED VIEW IF EXISTS achievement_eligibility_mart CASCADE;

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

-- Step 3: Add a unique constraint to player_stats to prevent future duplicates
-- First check if constraint already exists, if not add it
DO $$ 
DECLARE
    duplicate_count INT;
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'player_stats_player_match_unique' 
        AND conrelid = 'player_stats'::regclass
    ) THEN
        -- First, check how many duplicates exist
        SELECT COUNT(*) INTO duplicate_count
        FROM (
            SELECT player_id, match_id, COUNT(*) as cnt
            FROM player_stats
            GROUP BY player_id, match_id
            HAVING COUNT(*) > 1
        ) dups;
        
        RAISE NOTICE 'Found % duplicate player_stats combinations', duplicate_count;
        
        -- Remove duplicates by keeping only the row with the latest created_at
        -- Use a CTE to identify which rows to delete
        WITH duplicates AS (
            SELECT id,
                   ROW_NUMBER() OVER (
                       PARTITION BY player_id, match_id 
                       ORDER BY created_at DESC NULLS LAST, id DESC
                   ) as rn
            FROM player_stats
        )
        DELETE FROM player_stats
        WHERE id IN (
            SELECT id FROM duplicates WHERE rn > 1
        );
        
        GET DIAGNOSTICS duplicate_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % duplicate player_stats rows', duplicate_count;
        
        -- Now add the unique constraint
        ALTER TABLE player_stats 
        ADD CONSTRAINT player_stats_player_match_unique 
        UNIQUE (player_id, match_id);
        
        RAISE NOTICE 'Added unique constraint to prevent duplicate player_stats';
    ELSE
        RAISE NOTICE 'Unique constraint already exists on player_stats';
    END IF;
END $$;

-- Step 4: Refresh the materialized views with the fixed counts
REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats_tracking_mart;
REFRESH MATERIALIZED VIEW CONCURRENTLY achievement_eligibility_mart;

-- Step 5: Verify the fix - run this for a sample player
-- SELECT 
--     player_id,
--     gamertag,
--     career_games,
--     count_40pt_games,
--     count_50pt_games,
--     (count_40pt_games + count_50pt_games) as total_40plus_games
-- FROM player_stats_tracking_mart
-- WHERE career_games > 0
-- ORDER BY (count_40pt_games + count_50pt_games) DESC
-- LIMIT 20;

