-- Complete Achievement Rules for all 45 achievements
-- Run this SQL script to create all achievement rules

-- Single Game Achievements
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('40 Bomb', 'rare', 'per_game', '{"per_game.points": {"gte": 40}}', true),
('60 Bomb', 'epic', 'per_game', '{"per_game.points": {"gte": 60}}', true),
('81 Club', 'legendary', 'per_game', '{"per_game.points": {"gte": 81}}', true),
('100 Club', 'legendary', 'per_game', '{"per_game.points": {"gte": 100}}', true),
('Triple-Double Machine', 'legendary', 'per_game', '{"and": [{"per_game.points": {"gte": 10}}, {"per_game.rebounds": {"gte": 10}}, {"per_game.assists": {"gte": 10}}]}', true),
('Quadruple-Double', 'legendary', 'per_game', '{"and": [{"per_game.points": {"gte": 10}}, {"per_game.rebounds": {"gte": 10}}, {"per_game.assists": {"gte": 10}}, {"per_game.steals": {"gte": 10}}]}', true),
('5x5 Club', 'legendary', 'per_game', '{"and": [{"per_game.points": {"gte": 5}}, {"per_game.rebounds": {"gte": 5}}, {"per_game.assists": {"gte": 5}}, {"per_game.steals": {"gte": 5}}, {"per_game.blocks": {"gte": 5}}]}', true),
('Double Dimes', 'epic', 'per_game', '{"per_game.assists": {"gte": 20}}', true),
('Pickpocket', 'epic', 'per_game', '{"per_game.steals": {"gte": 10}}', true),
('Shot Block Party', 'epic', 'per_game', '{"per_game.blocks": {"gte": 8}}', true),
('Defensive Beast', 'legendary', 'per_game', '{"and": [{"per_game.steals": {"gte": 5}}, {"per_game.blocks": {"gte": 5}}]}', true),
('Sharp Shooter', 'epic', 'per_game', '{"per_game.three_points_made": {"gte": 10}}', true),
('30 Board Club', 'legendary', 'per_game', '{"per_game.rebounds": {"gte": 30}}', true),
('Floor General', 'legendary', 'per_game', '{"per_game.assists": {"gte": 15}}', true),
('Efficiency King', 'epic', 'per_game', '{"and": [{"per_game.fga": {"gte": 15}}, {"per_game.fgm": {"div": ["per_game.fga"]}}]}', true),
('Flawless', 'legendary', 'per_game', '{"and": [{"per_game.fga": {"gte": 10}}, {"per_game.fgm": {"eq": "per_game.fga"}}]}', true),
('Perfect Game', 'legendary', 'per_game', '{"and": [{"per_game.turnovers": {"eq": 0}}, {"per_game.fgm": {"eq": "per_game.fga"}}, {"per_game.fga": {"gte": 10}}]}', true);

-- Career Milestone Achievements
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('1K Scorer', 'common', 'career', '{"career.pts_total": {"gte": 1000}}', true),
('2.5K Scorer', 'common', 'career', '{"career.pts_total": {"gte": 2500}}', true),
('5K Scorer', 'rare', 'career', '{"career.pts_total": {"gte": 5000}}', true),
('7.5K Scorer', 'rare', 'career', '{"career.pts_total": {"gte": 7500}}', true),
('10K Scorer', 'epic', 'career', '{"career.pts_total": {"gte": 10000}}', true),
('15K Scorer', 'epic', 'career', '{"career.pts_total": {"gte": 15000}}', true),
('20K Scorer', 'legendary', 'career', '{"career.pts_total": {"gte": 20000}}', true),
('25K Scorer', 'legendary', 'career', '{"career.pts_total": {"gte": 25000}}', true),
('30K Club', 'legendary', 'career', '{"career.pts_total": {"gte": 30000}}', true),
('1K Dimes', 'common', 'career', '{"career.ast_total": {"gte": 1000}}', true),
('2.5K Dimes', 'rare', 'career', '{"career.ast_total": {"gte": 2500}}', true),
('5K Dimes', 'epic', 'career', '{"career.ast_total": {"gte": 5000}}', true),
('10K Dimes', 'legendary', 'career', '{"career.ast_total": {"gte": 10000}}', true),
('1K Boards', 'common', 'career', '{"career.reb_total": {"gte": 1000}}', true),
('5K Boards', 'epic', 'career', '{"career.reb_total": {"gte": 5000}}', true),
('10K Boards', 'legendary', 'career', '{"career.reb_total": {"gte": 10000}}', true);

-- Season Achievements
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('10+ APG', 'legendary', 'season', '{"season.ast_total": {"div": ["season.games_played"], "gte": 10}}', true),
('Board Leader', 'legendary', 'season', '{"season.reb_total": {"div": ["season.games_played"], "gte": 15}}', true),
('Season Stealer', 'legendary', 'season', '{"season.stl_total": {"div": ["season.games_played"], "gte": 3}}', true),
('Season Swatter', 'legendary', 'season', '{"season.blk_total": {"div": ["season.games_played"], "gte": 3}}', true),
('Double-Double Machine', 'epic', 'season', '{"season.double_doubles": {"gte": 10}}', true);

-- Streak & Longevity Achievements
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('Hot Streak', 'rare', 'streak', '{"streak.consecutive_20pt_games": {"gte": 5}}', true),
('Iron Man', 'rare', 'season', '{"season.games_played": {"gte": 82}}', true),
('Career Longevity', 'epic', 'career', '{"career.games_played": {"gte": 500}}', true),
('Consistency Award', 'epic', 'season', '{"and": [{"season.pts_total": {"div": ["season.games_played"], "gte": 15}}, {"season.reb_total": {"div": ["season.games_played"], "gte": 5}}, {"season.ast_total": {"div": ["season.games_played"], "gte": 5}}]}', true);

-- Defense Achievements
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('Clamps', 'rare', 'per_game', '{"per_game.points_allowed": {"lt": 5}}', true);

-- Legendary Achievements (Special Cases)
INSERT INTO public.achievement_rules (name, tier, scope, predicate, is_active) VALUES
('Carry Job
', 'legendary', 'per_game', '{"and": [{"per_game.points": {"gte": 50}}, {"per_game.team_points_ratio": {"gte": 0.5}}]}', true),
('Underdog Upset', 'legendary', 'per_game', '{"and": [{"per_game.points": {"gte": 30}}, {"per_game.upset_win": {"eq": true}}]}', true);

-- Verify the rules were created
SELECT COUNT(*) as total_rules FROM public.achievement_rules;
SELECT name, tier, scope FROM public.achievement_rules ORDER BY tier, name;
