-- ============================================================================
-- COMMON QUERY EXAMPLES FOR DATA MARTS
-- ============================================================================
-- Quick reference guide for the most common analytical queries
-- Copy and adapt these for your specific needs
-- ============================================================================

-- ============================================================================
-- PLAYER QUERIES
-- ============================================================================

-- Top scorers (overall)
SELECT 
    gamertag, 
    team_name, 
    avg_points, 
    games_played,
    global_rating,
    rating_tier
FROM player_performance_mart
WHERE games_played >= 10
ORDER BY avg_points DESC
LIMIT 20;

-- Hot players right now
SELECT 
    p.gamertag,
    p.team_name,
    h.form_trend,
    h.last_5_avg_points,
    h.career_avg_points,
    h.points_form_vs_career_pct
FROM player_performance_mart p
JOIN player_hot_streak_mart h ON p.player_id = h.player_id
WHERE h.form_trend IN ('Heating Up', 'Hot')
AND h.games_last_5 >= 3
ORDER BY h.last_5_avg_performance DESC
LIMIT 20;

-- Players by position ranking
SELECT 
    gamertag,
    position,
    avg_points,
    avg_assists,
    avg_rebounds,
    global_rating,
    games_played
FROM player_performance_mart
WHERE position = 'Point Guard'
AND games_played >= 10
ORDER BY global_rating DESC
LIMIT 10;

-- Players near career milestones
SELECT 
    gamertag,
    total_points,
    points_milestone_achieved,
    points_to_next_milestone,
    next_achievement_alert
FROM achievement_eligibility_mart
WHERE points_to_next_milestone IS NOT NULL
AND points_to_next_milestone <= 100
ORDER BY points_to_next_milestone ASC;

-- Player season stats (current active seasons)
SELECT 
    p.gamertag,
    pls.league_name,
    pls.season_team_name,
    pls.ppg,
    pls.apg,
    pls.rpg,
    pls.games_played,
    pls.season_points_rank
FROM player_league_season_stats_mart pls
JOIN players p ON pls.player_id = p.id
WHERE pls.season_id IN (SELECT id FROM league_seasons WHERE is_active = TRUE)
AND pls.games_played >= 5
ORDER BY pls.ppg DESC;

-- Player complete profile
SELECT 
    p.gamertag,
    p.team_name,
    p.global_rating,
    p.rating_tier,
    p.games_played,
    p.avg_points,
    p.avg_assists,
    p.avg_rebounds,
    t.career_points,
    t.career_high_points,
    t.count_triple_doubles,
    h.form_trend,
    h.last_10_avg_points
FROM player_performance_mart p
LEFT JOIN player_stats_tracking_mart t ON p.player_id = t.player_id
LEFT JOIN player_hot_streak_mart h ON p.player_id = h.player_id
WHERE p.player_id = 'your-player-uuid-here';

-- ============================================================================
-- TEAM QUERIES
-- ============================================================================

-- Team power rankings
SELECT 
    ta.team_name,
    ta.wins,
    ta.losses,
    ta.win_percentage,
    ta.current_rp,
    ta.rp_tier,
    tm.last_10_win_pct,
    tm.momentum_status,
    rv.roster_tier_assessment,
    rv.avg_roster_rating
FROM team_analytics_mart ta
JOIN team_momentum_indicators_mart tm ON ta.team_id = tm.team_id
JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
WHERE ta.games_played >= 5
ORDER BY ta.win_percentage DESC, tm.last_10_win_pct DESC
LIMIT 25;

-- Teams on hot streaks
SELECT 
    team_name,
    current_win_streak,
    last_5_win_pct,
    last_10_win_pct,
    momentum_status,
    last_5_avg_scored
FROM team_momentum_indicators_mart
WHERE current_win_streak >= 3
ORDER BY current_win_streak DESC, last_5_win_pct DESC;

-- Best rosters by position
SELECT 
    team_name,
    avg_roster_rating,
    total_guards,
    avg_guard_rating,
    total_locks,
    avg_lock_rating,
    total_bigs,
    avg_big_rating,
    positional_balance_score,
    roster_tier_assessment
FROM roster_value_comparison_mart
WHERE roster_size >= 5
ORDER BY avg_roster_rating DESC
LIMIT 20;

-- Team complete profile
SELECT 
    ta.team_name,
    ta.logo_url,
    ta.wins,
    ta.losses,
    ta.win_percentage,
    ta.avg_points_scored,
    ta.avg_points_allowed,
    ta.tournaments_played,
    ta.tournament_wins,
    ta.total_prize_money,
    tm.current_win_streak,
    tm.momentum_status,
    rv.roster_size,
    rv.elite_players,
    rv.avg_roster_rating
FROM team_analytics_mart ta
LEFT JOIN team_momentum_indicators_mart tm ON ta.team_id = tm.team_id
LEFT JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
WHERE ta.team_id = 'your-team-uuid-here';

-- ============================================================================
-- MATCHUP & RIVALRY QUERIES
-- ============================================================================

-- Head-to-head record lookup
SELECT 
    team_1_name,
    team_2_name,
    total_meetings,
    team_1_wins,
    team_2_wins,
    team_1_avg_score,
    team_2_avg_score,
    team_1_last_5_wins,
    team_2_last_5_wins,
    last_meeting,
    current_winner
FROM head_to_head_matchup_mart
WHERE (team_1_id = 'team-uuid-1' AND team_2_id = 'team-uuid-2')
   OR (team_1_id = 'team-uuid-2' AND team_2_id = 'team-uuid-1');

-- Biggest rivalries (most meetings)
SELECT 
    team_1_name,
    team_2_name,
    total_meetings,
    team_1_wins,
    team_2_wins,
    ROUND((team_1_wins::float / NULLIF(total_meetings, 0) * 100)::numeric, 1) AS team_1_win_pct
FROM head_to_head_matchup_mart
WHERE total_meetings >= 10
ORDER BY total_meetings DESC;

-- Upcoming match preview (combine head-to-head + current form)
SELECT 
    h.team_1_name,
    h.team_2_name,
    h.total_meetings,
    h.team_1_wins || '-' || h.team_2_wins AS series_record,
    tm1.last_10_win_pct AS team_1_recent_form,
    tm2.last_10_win_pct AS team_2_recent_form,
    tm1.momentum_status AS team_1_momentum,
    tm2.momentum_status AS team_2_momentum,
    h.last_meeting
FROM head_to_head_matchup_mart h
JOIN team_momentum_indicators_mart tm1 ON h.team_1_id = tm1.team_id
JOIN team_momentum_indicators_mart tm2 ON h.team_2_id = tm2.team_id
WHERE h.team_1_id = 'team-a-uuid'
AND h.team_2_id = 'team-b-uuid';

-- ============================================================================
-- MATCH & EVENT QUERIES
-- ============================================================================

-- Recent matches with full context
SELECT 
    team_a_name,
    score_a,
    score_b,
    team_b_name,
    winner_name,
    league_name,
    tournament_name,
    game_type,
    mvp_name,
    played_at
FROM match_analytics_mart
ORDER BY played_at DESC
LIMIT 50;

-- Blowout games
SELECT 
    team_a_name,
    score_a,
    score_b,
    team_b_name,
    score_differential,
    tournament_name,
    played_at
FROM match_analytics_mart
WHERE game_type = 'Blowout'
ORDER BY score_differential DESC
LIMIT 20;

-- Tournament strength rankings
SELECT 
    tournament_name,
    organizer_name,
    tier_label,
    tier_score,
    unique_teams,
    prize_pool,
    champion_team,
    start_date
FROM tournament_performance_mart
WHERE is_completed = TRUE
ORDER BY tier_score DESC, prize_pool DESC
LIMIT 20;

-- Active league seasons
SELECT 
    league_name,
    season_number,
    total_matches,
    total_unique_teams,
    total_players,
    best_record_team,
    last_match_date
FROM league_season_performance_mart
WHERE is_active = TRUE
ORDER BY league_name, season_number DESC;

-- ============================================================================
-- ACHIEVEMENT & AWARDS QUERIES
-- ============================================================================

-- Players with active scoring streaks
SELECT 
    gamertag,
    active_streak_type,
    active_streak_length,
    streak_last_game,
    total_achievements_earned
FROM achievement_eligibility_mart
WHERE active_streak_type LIKE '%pt_streak'
AND active_streak_length >= 5
ORDER BY active_streak_length DESC;

-- Season award candidates (active seasons only)
SELECT 
    pls.gamertag,
    pls.league_name,
    pls.season_number,
    pls.season_team_name,
    pls.ppg,
    pls.apg,
    pls.rpg,
    pls.potential_season_award,
    pls.season_points_rank,
    pls.season_performance_rank
FROM player_league_season_stats_mart pls
WHERE pls.potential_season_award IS NOT NULL
AND pls.season_id IN (SELECT id FROM league_seasons WHERE is_active = TRUE)
ORDER BY pls.season_performance_rank;

-- Century Club members (100+ games)
SELECT 
    gamertag,
    games_milestone_achieved,
    total_games,
    total_points,
    points_milestone_achieved
FROM achievement_eligibility_mart
WHERE total_games >= 100
ORDER BY total_games DESC;

-- ============================================================================
-- DASHBOARD & WIDGET QUERIES
-- ============================================================================

-- Homepage: Featured Stats
SELECT 
    (SELECT COUNT(*) FROM player_performance_mart WHERE games_played >= 1) AS total_active_players,
    (SELECT COUNT(*) FROM team_analytics_mart WHERE games_played >= 1) AS total_active_teams,
    (SELECT COUNT(*) FROM match_analytics_mart) AS total_matches,
    (SELECT COUNT(*) FROM tournament_performance_mart WHERE is_completed = TRUE) AS completed_tournaments;

-- Trending Now Widget
SELECT 
    'hot_player' AS item_type,
    gamertag AS display_name,
    form_trend AS status,
    last_5_avg_points AS stat_value
FROM player_hot_streak_mart
WHERE form_trend = 'Heating Up'
AND games_last_5 >= 3
ORDER BY last_5_avg_performance DESC
LIMIT 5;

-- Recent Activity Feed
SELECT 
    played_at,
    team_a_name || ' ' || score_a || '-' || score_b || ' ' || team_b_name AS match_summary,
    winner_name,
    COALESCE(tournament_name, league_name || ' Season') AS event_name,
    game_type
FROM match_analytics_mart
ORDER BY played_at DESC
LIMIT 20;

-- Leaderboard: Multiple Categories
WITH leaderboard_data AS (
    SELECT 
        player_id,
        gamertag,
        team_name,
        avg_points,
        avg_assists,
        avg_rebounds,
        games_played,
        ROW_NUMBER() OVER (ORDER BY avg_points DESC) AS pts_rank,
        ROW_NUMBER() OVER (ORDER BY avg_assists DESC) AS ast_rank,
        ROW_NUMBER() OVER (ORDER BY avg_rebounds DESC) AS reb_rank
    FROM player_performance_mart
    WHERE games_played >= 10
)
SELECT * FROM leaderboard_data
WHERE pts_rank <= 10 OR ast_rank <= 10 OR reb_rank <= 10
ORDER BY pts_rank;

-- ============================================================================
-- ANALYTICAL QUERIES
-- ============================================================================

-- Position performance analysis
SELECT 
    position,
    COUNT(*) AS player_count,
    ROUND(AVG(avg_points)::numeric, 1) AS position_avg_points,
    ROUND(AVG(avg_assists)::numeric, 1) AS position_avg_assists,
    ROUND(AVG(avg_rebounds)::numeric, 1) AS position_avg_rebounds,
    ROUND(AVG(global_rating)::numeric, 1) AS position_avg_rating
FROM player_performance_mart
WHERE games_played >= 10
GROUP BY position
ORDER BY position_avg_rating DESC;

-- Win percentage by roster strength
SELECT 
    rv.roster_tier_assessment,
    COUNT(DISTINCT ta.team_id) AS team_count,
    ROUND(AVG(ta.win_percentage)::numeric, 1) AS avg_win_pct,
    ROUND(AVG(rv.avg_roster_rating)::numeric, 1) AS avg_roster_rating
FROM team_analytics_mart ta
JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
WHERE ta.games_played >= 5
GROUP BY rv.roster_tier_assessment
ORDER BY avg_win_pct DESC;

-- Event strength over time
SELECT 
    game_year,
    tier_label,
    COUNT(*) AS event_count,
    ROUND(AVG(tier_score)::numeric, 2) AS avg_tier_score,
    ROUND(AVG(team_count)::numeric, 1) AS avg_teams_per_event,
    SUM(prize_pool) AS total_prize_pool
FROM event_strength_metrics_mv
WHERE event_type = 'tournament'
GROUP BY game_year, tier_label
ORDER BY game_year DESC, tier_label;

-- Consistency vs Performance (find reliable scorers)
SELECT 
    p.gamertag,
    p.team_name,
    p.avg_points,
    h.points_consistency_stddev,
    h.last_10_avg_points,
    p.games_played,
    CASE 
        WHEN h.points_consistency_stddev < 5 THEN 'Very Consistent'
        WHEN h.points_consistency_stddev < 8 THEN 'Consistent'
        WHEN h.points_consistency_stddev < 12 THEN 'Average'
        ELSE 'Volatile'
    END AS consistency_rating
FROM player_performance_mart p
JOIN player_hot_streak_mart h ON p.player_id = h.player_id
WHERE p.games_played >= 10
AND h.games_last_10 >= 10
ORDER BY p.avg_points DESC;

-- ============================================================================
-- TEAM COMPARISON QUERIES
-- ============================================================================

-- Side-by-side team comparison
SELECT 
    team_id,
    team_name,
    wins,
    losses,
    win_percentage,
    avg_points_scored,
    avg_points_allowed,
    current_rp,
    elo_rating,
    tournaments_played,
    tournament_wins
FROM team_analytics_mart
WHERE team_id IN ('team-uuid-1', 'team-uuid-2')
ORDER BY win_percentage DESC;

-- Roster comparison
SELECT 
    team_name,
    roster_size,
    elite_players,
    role_players,
    avg_roster_rating,
    total_roster_value,
    pg_rank,
    sg_rank,
    lock_rank,
    roster_tier_assessment
FROM roster_value_comparison_mart
WHERE team_id IN ('team-uuid-1', 'team-uuid-2');

-- ============================================================================
-- CONTEXTUAL QUERIES (League/Tournament Specific)
-- ============================================================================

-- Tournament results and winners
SELECT 
    tournament_name,
    organizer,
    tier_score,
    champion_team,
    runner_up_team,
    unique_teams,
    prize_pool,
    start_date,
    end_date
FROM tournament_performance_mart
WHERE is_completed = TRUE
AND game_year = '2K25'
ORDER BY start_date DESC;

-- Season standings (simulated from team stats)
SELECT 
    pls.season_team_name AS team,
    COUNT(DISTINCT pls.player_id) AS players,
    SUM(pls.games_played) AS team_games,
    ROUND(AVG(pls.ppg)::numeric, 1) AS team_avg_ppg,
    MAX(pls.season_points_rank) AS best_player_rank
FROM player_league_season_stats_mart pls
WHERE pls.season_id = 'season-uuid-here'
GROUP BY pls.season_team_name
ORDER BY team_avg_ppg DESC;

-- ============================================================================
-- TIME-BASED QUERIES
-- ============================================================================

-- Matches by month (volume analysis)
SELECT 
    DATE_TRUNC('month', played_at) AS month,
    COUNT(*) AS match_count,
    COUNT(DISTINCT team_a_id) + COUNT(DISTINCT team_b_id) AS team_participations,
    AVG(score_a + score_b) AS avg_combined_score
FROM match_analytics_mart
WHERE played_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', played_at)
ORDER BY month DESC;

-- Recently active players (last 30 days)
SELECT 
    gamertag,
    team_name,
    last_game_date,
    days_since_last_game,
    recent_games,
    recent_avg_points
FROM player_performance_mart
WHERE last_game_date >= NOW() - INTERVAL '30 days'
ORDER BY last_game_date DESC;

-- ============================================================================
-- AWARD & RECOGNITION QUERIES
-- ============================================================================

-- MVP candidates (current season)
SELECT 
    pls.gamertag,
    pls.season_team_name,
    pls.ppg,
    pls.apg,
    pls.rpg,
    pls.avg_performance_score,
    pls.season_performance_rank,
    pls.potential_season_award
FROM player_league_season_stats_mart pls
WHERE pls.season_id IN (SELECT id FROM league_seasons WHERE is_active = TRUE)
AND pls.games_played >= 10
ORDER BY pls.season_performance_rank
LIMIT 10;

-- Breakthrough players (recent form >> career average)
SELECT 
    p.gamertag,
    p.team_name,
    h.last_10_avg_points,
    h.career_avg_points,
    h.points_form_vs_career_pct,
    h.form_trend
FROM player_performance_mart p
JOIN player_hot_streak_mart h ON p.player_id = h.player_id
WHERE h.points_form_vs_career_pct > 20
AND h.games_last_10 >= 10
AND p.games_played >= 20
ORDER BY h.points_form_vs_career_pct DESC;

-- ============================================================================
-- EXPORT QUERIES (for reports/exports)
-- ============================================================================

-- Complete player export
SELECT 
    p.player_id,
    p.gamertag,
    p.position,
    p.team_name,
    p.global_rating,
    p.rating_tier,
    p.games_played,
    p.avg_points,
    p.avg_assists,
    p.avg_rebounds,
    p.avg_fg_pct,
    p.avg_three_pct,
    t.career_points,
    t.career_games,
    t.count_triple_doubles,
    h.form_trend,
    h.last_10_avg_points
FROM player_performance_mart p
LEFT JOIN player_stats_tracking_mart t ON p.player_id = t.player_id
LEFT JOIN player_hot_streak_mart h ON p.player_id = h.player_id
ORDER BY p.global_rating DESC;

-- Complete team export
SELECT 
    ta.team_id,
    ta.team_name,
    ta.wins,
    ta.losses,
    ta.win_percentage,
    ta.avg_points_scored,
    ta.avg_points_allowed,
    ta.current_rp,
    ta.elo_rating,
    rv.roster_size,
    rv.elite_players,
    rv.avg_roster_rating,
    tm.momentum_status,
    tm.current_win_streak
FROM team_analytics_mart ta
LEFT JOIN roster_value_comparison_mart rv ON ta.team_id = rv.team_id
LEFT JOIN team_momentum_indicators_mart tm ON ta.team_id = tm.team_id
ORDER BY ta.current_rp DESC;

-- ============================================================================
-- DIAGNOSTIC QUERIES
-- ============================================================================

-- Check mart freshness (when was data last calculated)
SELECT 
    'player_performance_mart' AS mart_name,
    MAX(last_game_date) AS latest_game_in_mart,
    (SELECT MAX(played_at) FROM matches WHERE verified = TRUE) AS latest_game_in_db,
    EXTRACT(EPOCH FROM (
        (SELECT MAX(played_at) FROM matches WHERE verified = TRUE) - MAX(last_game_date)
    )) / 3600 AS hours_behind
FROM player_performance_mart;

-- Find data quality issues
SELECT 
    'Players with 0 games' AS issue,
    COUNT(*) AS count
FROM player_performance_mart
WHERE games_played = 0
UNION ALL
SELECT 
    'Teams with 0 games',
    COUNT(*)
FROM team_analytics_mart
WHERE games_played = 0
UNION ALL
SELECT 
    'Matches missing MVP',
    COUNT(*)
FROM match_analytics_mart
WHERE mvp_player_id IS NULL;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- Performance Tips:
-- 1. Always include WHERE clauses to filter data
-- 2. Use LIMIT when exploring data
-- 3. Create covering indexes for frequently filtered columns
-- 4. Materialize complex subqueries if used repeatedly
-- 5. Use EXPLAIN ANALYZE to understand query plans
--
-- Data Freshness:
-- - Marts are snapshots; they need to be refreshed
-- - Check mart timestamps vs source table timestamps
-- - Set up automated refresh schedule for production
--
-- ============================================================================

