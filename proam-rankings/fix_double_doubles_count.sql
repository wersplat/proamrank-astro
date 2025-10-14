-- Fix double doubles count in player_stats_tracking_mart
-- This adds the missing count_double_doubles column

-- Drop existing view and recreate with the fix
DROP MATERIALIZED VIEW IF EXISTS player_stats_tracking_mart CASCADE;

CREATE MATERIALIZED VIEW player_stats_tracking_mart AS
WITH player_history AS (
    SELECT
        ps.player_id,
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
        ps.plus_minus,
        ROW_NUMBER() OVER (PARTITION BY ps.player_id ORDER BY m.played_at) AS game_number,
        SUM(ps.points) OVER (PARTITION BY ps.player_id ORDER BY m.played_at) AS running_point_total,
        AVG(ps.points) OVER (PARTITION BY ps.player_id ORDER BY m.played_at ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) AS pts_rolling_avg_6,
        AVG(ps.points) OVER (PARTITION BY ps.player_id ORDER BY m.played_at ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS pts_rolling_avg_10
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
),
recent_games AS (
    SELECT 
        ps.player_id, 
        ps.points, 
        ps.assists, 
        ps.rebounds,
        ROW_NUMBER() OVER (PARTITION BY ps.player_id ORDER BY m.played_at DESC) AS rn
    FROM player_stats ps
    JOIN v_matches_with_primary_context m ON ps.match_id = m.id
    WHERE ps.verified = TRUE
)
SELECT
    p.id AS player_id,
    p.gamertag,
    p.position,
    p.current_team_id,
    t.name AS current_team,
    COALESCE(pgr.global_rating, 0) AS global_rating,
    COALESCE(pgr.rating_tier, 'Unranked') AS rating_tier,
    
    -- Career Totals
    COUNT(ph.player_id) AS career_games,
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
    COUNT(CASE WHEN ph.points >= 30 AND ph.points < 40 THEN 1 END) AS count_30pt_games,
    COUNT(CASE WHEN ph.points >= 40 AND ph.points < 50 THEN 1 END) AS count_40pt_games,
    COUNT(CASE WHEN ph.points >= 50 THEN 1 END) AS count_50pt_games,
    COUNT(CASE WHEN ph.assists >= 10 THEN 1 END) AS count_10ast_games,
    COUNT(CASE WHEN ph.rebounds >= 10 THEN 1 END) AS count_10reb_games,
    COUNT(CASE WHEN ph.blocks >= 5 THEN 1 END) AS count_5blk_games,
    COUNT(CASE WHEN ph.steals >= 5 THEN 1 END) AS count_5stl_games,
    COUNT(CASE WHEN ph.points >= 10 AND ph.assists >= 10 THEN 1 END) AS count_dbl_pt_ast,
    COUNT(CASE WHEN ph.points >= 10 AND ph.rebounds >= 10 THEN 1 END) AS count_dbl_pt_reb,
    COUNT(CASE WHEN ph.assists >= 10 AND ph.rebounds >= 10 THEN 1 END) AS count_dbl_ast_reb,
    COUNT(CASE WHEN 
        (ph.points >= 10 AND ph.assists >= 10) OR 
        (ph.points >= 10 AND ph.rebounds >= 10) OR 
        (ph.assists >= 10 AND ph.rebounds >= 10)
    THEN 1 END) AS count_double_doubles,
    COUNT(CASE WHEN ph.points >= 10 AND ph.assists >= 10 AND ph.rebounds >= 10 THEN 1 END) AS count_triple_doubles,
    
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
LEFT JOIN player_history ph ON p.id = ph.player_id
LEFT JOIN v_player_global_rating pgr ON p.id = pgr.player_id
LEFT JOIN teams t ON p.current_team_id = t.id
LEFT JOIN recent_games recent ON p.id = recent.player_id
GROUP BY p.id, p.gamertag, p.position, p.current_team_id, t.name, pgr.global_rating, pgr.rating_tier;

-- Recreate indexes for optimal performance
-- UNIQUE index required for concurrent refreshes
CREATE UNIQUE INDEX idx_pstm_player_id_unique ON player_stats_tracking_mart(player_id);
CREATE INDEX idx_pstm_global_rating ON player_stats_tracking_mart(global_rating DESC);
CREATE INDEX idx_pstm_career_points ON player_stats_tracking_mart(career_points DESC);
CREATE INDEX idx_pstm_current_team ON player_stats_tracking_mart(current_team_id) WHERE current_team_id IS NOT NULL;

-- Verify the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'player_stats_tracking_mart' 
AND column_name = 'count_double_doubles';

