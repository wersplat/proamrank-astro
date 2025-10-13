-- Optimization functions for achievements worker
-- These functions reduce the number of database calls and subrequests

-- Function to upsert player counters with proper increment logic
CREATE OR REPLACE FUNCTION upsert_player_counter(
  p_player_id uuid,
  p_scope text,
  p_season_id uuid DEFAULT NULL,
  p_games_played integer DEFAULT 1,
  p_pts_total integer DEFAULT 0,
  p_ast_total integer DEFAULT 0,
  p_reb_total integer DEFAULT 0,
  p_stl_total integer DEFAULT 0,
  p_blk_total integer DEFAULT 0,
  p_tov_total integer DEFAULT 0,
  p_fgm_total integer DEFAULT 0,
  p_fga_total integer DEFAULT 0,
  p_tpm_total integer DEFAULT 0,
  p_tpa_total integer DEFAULT 0,
  p_ftm_total integer DEFAULT 0,
  p_fta_total integer DEFAULT 0,
  p_has_50pt_game boolean DEFAULT false,
  p_has_triple_double boolean DEFAULT false
)
RETURNS void AS $$
BEGIN
  INSERT INTO player_counters (
    player_id, scope, season_id, games_played,
    pts_total, ast_total, reb_total, stl_total, blk_total, tov_total,
    fgm_total, fga_total, tpm_total, tpa_total, ftm_total, fta_total,
    has_50pt_game, has_triple_double
  ) VALUES (
    p_player_id, p_scope::counter_scope, p_season_id, p_games_played,
    p_pts_total, p_ast_total, p_reb_total, p_stl_total, p_blk_total, p_tov_total,
    p_fgm_total, p_fga_total, p_tpm_total, p_tpa_total, p_ftm_total, p_fta_total,
    p_has_50pt_game, p_has_triple_double
  )
  ON CONFLICT (player_id, scope, season_id) 
  DO UPDATE SET
    games_played = player_counters.games_played + p_games_played,
    pts_total = player_counters.pts_total + p_pts_total,
    ast_total = player_counters.ast_total + p_ast_total,
    reb_total = player_counters.reb_total + p_reb_total,
    stl_total = player_counters.stl_total + p_stl_total,
    blk_total = player_counters.blk_total + p_blk_total,
    tov_total = player_counters.tov_total + p_tov_total,
    fgm_total = player_counters.fgm_total + p_fgm_total,
    fga_total = player_counters.fga_total + p_fga_total,
    tpm_total = player_counters.tpm_total + p_tpm_total,
    tpa_total = player_counters.tpa_total + p_tpa_total,
    ftm_total = player_counters.ftm_total + p_ftm_total,
    fta_total = player_counters.fta_total + p_fta_total,
    has_50pt_game = player_counters.has_50pt_game OR p_has_50pt_game,
    has_triple_double = player_counters.has_triple_double OR p_has_triple_double,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to mark queue item for retry with proper logic
CREATE OR REPLACE FUNCTION mark_queue_retry(
  p_queue_id integer,
  p_error_message text,
  p_max_attempts integer
)
RETURNS jsonb AS $$
DECLARE
  v_current_attempts integer;
  v_new_attempts integer;
  v_backoff_minutes integer;
  v_visible_at timestamp;
  v_result jsonb;
BEGIN
  -- Get current attempts
  SELECT attempts INTO v_current_attempts
  FROM event_queue
  WHERE id = p_queue_id;
  
  -- Check if queue item exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found', 'message', 'Queue item not found');
  END IF;
  
  v_current_attempts := COALESCE(v_current_attempts, 0);
  v_new_attempts := v_current_attempts + 1;
  
  IF v_new_attempts >= p_max_attempts THEN
    -- Mark as error
    UPDATE event_queue
    SET 
      status = 'error',
      attempts = v_new_attempts,
      last_error = p_error_message,
      updated_at = NOW()
    WHERE id = p_queue_id;
    
    v_result := jsonb_build_object(
      'status', 'error',
      'attempts', v_new_attempts,
      'message', 'Max attempts reached'
    );
  ELSE
    -- Schedule retry with exponential backoff
    v_backoff_minutes := POWER(2, LEAST(v_new_attempts, 7));
    v_visible_at := NOW() + (v_backoff_minutes || ' minutes')::interval;
    
    UPDATE event_queue
    SET 
      status = 'queued',
      attempts = v_new_attempts,
      last_error = p_error_message,
      visible_at = v_visible_at,
      updated_at = NOW()
    WHERE id = p_queue_id;
    
    v_result := jsonb_build_object(
      'status', 'retry',
      'attempts', v_new_attempts,
      'backoff_minutes', v_backoff_minutes,
      'visible_at', v_visible_at
    );
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION upsert_player_counter TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_player_counter TO service_role;
GRANT EXECUTE ON FUNCTION mark_queue_retry TO authenticated;
GRANT EXECUTE ON FUNCTION mark_queue_retry TO service_role;
