-- ============================================================================
-- STEP-BY-STEP PLAYER RATING IMPLEMENTATION
-- Run each section separately to identify any issues
-- ============================================================================

-- STEP 1: Create weight table
-- Run this first
CREATE TABLE IF NOT EXISTS player_rating_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_tier event_tier NOT NULL,
  weight_multiplier NUMERIC(4,2) NOT NULL,
  bonus_points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: Insert weights
INSERT INTO player_rating_weights (event_tier, weight_multiplier, bonus_points, description)
VALUES 
  ('T1', 1.50, 8, 'Major LANs'),
  ('T2', 1.30, 5, 'Franchise Events'),
  ('T3', 1.10, 3, 'Qualifiers'),
  ('T4', 0.90, 2, 'Invitationals'),
  ('T5', 0.70, 1, 'Community Events')
ON CONFLICT DO NOTHING;

-- Verify step 1 & 2
SELECT * FROM player_rating_weights ORDER BY event_tier;

