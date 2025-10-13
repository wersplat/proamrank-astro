-- Optional: Remove duplicate awards (run AFTER fixing the rules)
-- WARNING: This permanently deletes duplicate awards!

-- 1. Preview what will be deleted (run this first)
WITH ranked_awards AS (
  SELECT 
    id,
    player_id,
    title,
    scope_key,
    level,
    awarded_at,
    ROW_NUMBER() OVER (
      PARTITION BY player_id, title, scope_key, level 
      ORDER BY awarded_at ASC
    ) as rn
  FROM player_awards
)
SELECT 
  id,
  player_id,
  title,
  scope_key,
  awarded_at
FROM ranked_awards
WHERE rn > 1
ORDER BY title, player_id;

-- 2. Delete duplicates (uncomment to run)
/*
WITH ranked_awards AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY player_id, title, scope_key, level 
      ORDER BY awarded_at ASC
    ) as rn
  FROM player_awards
)
DELETE FROM player_awards
WHERE id IN (
  SELECT id 
  FROM ranked_awards 
  WHERE rn > 1
);
*/

