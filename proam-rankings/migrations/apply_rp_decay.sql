CREATE OR REPLACE FUNCTION apply_rp_decay()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  decay_date DATE := CURRENT_DATE;
  affected_teams INTEGER := 0;
  -- New variables for batch processing:
  batch_size INTEGER := 1000;  -- Process this many rows at a time
  rows_updated INTEGER;  -- Track how many rows were updated in each batch
BEGIN
  -- ============================================================================
  -- PART 1: Process event_results in batches (to avoid timeout)
  -- Decay: Starts at 30 days, Full decay at 90 days
  -- ============================================================================
  LOOP
    WITH event_decay AS (
      SELECT 
        er.id,
        GREATEST(0, 
          ROUND((er.rp_awarded * (1 - 
            CASE
              WHEN (decay_date - er.awarded_at::DATE) < COALESCE(er.rp_decay_start_days, 30) THEN 0
              WHEN (decay_date - er.awarded_at::DATE) >= 90 THEN 1.0
              ELSE LEAST(1.0, 
                ((decay_date - er.awarded_at::DATE)::NUMERIC - COALESCE(er.rp_decay_start_days, 30))::NUMERIC 
                / (90 - COALESCE(er.rp_decay_start_days, 30))
              )
            END
          ))::NUMERIC, 2)
        ) AS new_remaining_rp
      FROM event_results er
      WHERE er.awarded_at IS NOT NULL
        AND er.awarded_at::DATE <= decay_date - INTERVAL '30 days'  -- Must be at least 30 days old
        AND er.remaining_rp > 0
        AND er.rp_awarded > 0
        AND (er.last_decay_date IS NULL OR er.last_decay_date::DATE < decay_date)
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED  -- Skip locked rows to avoid blocking
    )
    UPDATE event_results er
    SET 
      remaining_rp = ed.new_remaining_rp,
      last_decay_date = decay_date
    FROM event_decay ed
    WHERE er.id = ed.id
      AND er.remaining_rp != ed.new_remaining_rp;  -- Only update if changed

    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;  -- Exit loop when no more rows to process
  END LOOP;

  -- ============================================================================
  -- PART 2: Process rp_transactions in batches
  -- Only process 'event' and 'bonus' types (penalty/adjustment don't decay)
  -- ============================================================================
  LOOP
    WITH transaction_decay AS (
      SELECT 
        rt.id,
        GREATEST(0, 
          ROUND((rt.amount * (1 - 
            CASE 
              WHEN rt.type = 'event' THEN 
                CASE
                  WHEN COALESCE(rt.rp_decay_start, 60) = 60 THEN
                    CASE
                      WHEN (decay_date - rt.created_at::DATE) < 60 THEN 0
                      WHEN (decay_date - rt.created_at::DATE) >= 120 THEN 1.0
                      ELSE LEAST(1.0, ((decay_date - rt.created_at::DATE)::NUMERIC - 60) / 60)
                    END
                  WHEN COALESCE(rt.rp_decay_start, 90) = 90 THEN
                    CASE
                      WHEN (decay_date - rt.created_at::DATE) < 90 THEN 0
                      WHEN (decay_date - rt.created_at::DATE) >= 180 THEN 1.0
                      ELSE LEAST(1.0, ((decay_date - rt.created_at::DATE)::NUMERIC - 90) / 90)
                    END
                  ELSE
                    CASE
                      WHEN (decay_date - rt.created_at::DATE) < 60 THEN 0
                      WHEN (decay_date - rt.created_at::DATE) >= 120 THEN 1.0
                      ELSE LEAST(1.0, ((decay_date - rt.created_at::DATE)::NUMERIC - 60) / 60)
                    END
                END
              WHEN rt.type = 'bonus' THEN 
                CASE
                  WHEN (decay_date - rt.created_at::DATE) < COALESCE(rt.rp_decay_start, 60) THEN 0
                  WHEN (decay_date - rt.created_at::DATE) >= 120 THEN 1.0
                  ELSE LEAST(1.0, 
                    ((decay_date - rt.created_at::DATE)::NUMERIC - COALESCE(rt.rp_decay_start, 60))::NUMERIC 
                    / (120 - COALESCE(rt.rp_decay_start, 60))
                  )
                END
              ELSE 0
            END
          ))::NUMERIC, 2)
        ) AS new_remaining_rp
      FROM rp_transactions rt
      WHERE rt.created_at IS NOT NULL
        AND rt.created_at::DATE <= decay_date - INTERVAL '60 days'  -- Must be at least 60 days old
        AND rt.remaining_rp > 0
        AND rt.amount > 0
        AND (rt.last_decay_date IS NULL OR rt.last_decay_date::DATE < decay_date)
        AND rt.type IN ('event', 'bonus')  -- Only process types that decay
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED
    )
    UPDATE rp_transactions rt
    SET 
      remaining_rp = td.new_remaining_rp,
      last_decay_date = decay_date,
      updated_at = NOW()
    FROM transaction_decay td
    WHERE rt.id = td.id
      AND rt.remaining_rp != td.new_remaining_rp;

    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
  END LOOP;

  -- ============================================================================
  -- PART 3: Recalculate teams.current_rp
  -- ============================================================================
  WITH team_rp_totals AS (
    SELECT 
      team_id,
      COALESCE(SUM(remaining_rp), 0) AS total_remaining_rp
    FROM (
      SELECT team_id, remaining_rp FROM event_results WHERE remaining_rp > 0
      UNION ALL
      SELECT team_id, remaining_rp FROM rp_transactions WHERE remaining_rp > 0 AND team_id IS NOT NULL
    ) combined_rp
    GROUP BY team_id
  )
  UPDATE teams t
  SET current_rp = trt.total_remaining_rp
  FROM team_rp_totals trt
  WHERE t.id = trt.team_id
    AND COALESCE(t.current_rp, 0) != trt.total_remaining_rp;

  -- Set current_rp to 0 for teams with no RP records
  UPDATE teams t
  SET current_rp = 0
  WHERE t.current_rp > 0
    AND NOT EXISTS (
      SELECT 1 FROM event_results er WHERE er.team_id = t.id AND er.remaining_rp > 0
    )
    AND NOT EXISTS (
      SELECT 1 FROM rp_transactions rt WHERE rt.team_id = t.id AND rt.remaining_rp > 0
    );

  RAISE NOTICE 'RP decay applied on %.', decay_date;
  
END;
$$;