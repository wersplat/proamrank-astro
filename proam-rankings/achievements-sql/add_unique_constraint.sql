-- Add unique constraint to prevent duplicate achievement rules
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_achievement_rule 
ON achievement_rules (name, tier, scope, predicate) 
WHERE is_active = true;

