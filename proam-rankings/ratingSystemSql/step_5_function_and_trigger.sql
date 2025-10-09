-- STEP 5: Create update function and trigger

-- Function to update all player ratings
CREATE OR REPLACE FUNCTION update_player_global_ratings()
RETURNS TABLE(
  player_id UUID,
  gamertag TEXT,
  old_rating NUMERIC,
  new_rating NUMERIC,
  rating_change NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH old_ratings AS (
    SELECT 
      p.id,
      p.gamertag,
      p.performance_score::numeric as old_performance_score,
      pgr.global_rating
    FROM players p
    JOIN v_player_global_rating pgr ON p.id = pgr.player_id
  ),
  updates AS (
    UPDATE players p
    SET 
      performance_score = pgr.global_rating,
      player_rank_score = COALESCE(pgr.global_rating, 0) + COALESCE(p.player_rp, 0),
      salary_tier = CASE
        WHEN pgr.global_rating >= 90 THEN 'S'::salary_tier
        WHEN pgr.global_rating >= 85 THEN 'A'::salary_tier
        WHEN pgr.global_rating >= 80 THEN 'B'::salary_tier
        WHEN pgr.global_rating >= 75 THEN 'C'::salary_tier
        ELSE 'D'::salary_tier
      END
    FROM v_player_global_rating pgr
    WHERE p.id = pgr.player_id
    RETURNING p.id
  )
  SELECT 
    o.id,
    o.gamertag,
    o.old_performance_score,
    o.global_rating,
    (o.global_rating - COALESCE(o.old_performance_score, 0)) as change
  FROM old_ratings o
  WHERE o.id IN (SELECT id FROM updates);
END;
$$;

-- Trigger function for auto-update
CREATE OR REPLACE FUNCTION trigger_update_player_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.verified = TRUE THEN
    UPDATE players p
    SET 
      performance_score = pgr.global_rating,
      player_rank_score = COALESCE(pgr.global_rating, 0) + COALESCE(p.player_rp, 0),
      salary_tier = CASE
        WHEN pgr.global_rating >= 90 THEN 'S'::salary_tier
        WHEN pgr.global_rating >= 85 THEN 'A'::salary_tier
        WHEN pgr.global_rating >= 80 THEN 'B'::salary_tier
        WHEN pgr.global_rating >= 75 THEN 'C'::salary_tier
        ELSE 'D'::salary_tier
      END
    FROM v_player_global_rating pgr
    WHERE p.id = pgr.player_id 
    AND p.id = NEW.player_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and create trigger
DROP TRIGGER IF EXISTS trigger_auto_update_player_rating ON player_stats;

CREATE TRIGGER trigger_auto_update_player_rating
  AFTER INSERT OR UPDATE OF verified
  ON player_stats
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_player_ratings();

-- Test: Run manual update
SELECT 
  gamertag,
  old_rating,
  new_rating,
  rating_change
FROM update_player_global_ratings()
ORDER BY new_rating DESC
LIMIT 10;

