create materialized view public.event_strength_metrics_mv as
with
  tournament_regs as (
    select
      'tournament'::text as event_type,
      tr.tournament_id,
      null::uuid as season_id,
      COALESCE(tr.game_year, t.game_year) as game_year,
      tr.team_id,
      tr.player_id,
      true as is_confirmed
    from
      team_rosters tr
      join tournaments t on t.id = tr.tournament_id
    where
      tr.tournament_id is not null
  ),
  league_regs as (
    select
      'league'::text as event_type,
      null::uuid as tournament_id,
      tr.season_id,
      COALESCE(tr.game_year, ls.year) as game_year,
      tr.team_id,
      tr.player_id,
      true as is_confirmed
    from
      team_rosters tr
      join league_seasons ls on ls.id = tr.season_id
    where
      tr.season_id is not null
  ),
  raw_registrations as (
    select
      tournament_regs.event_type,
      tournament_regs.tournament_id,
      tournament_regs.season_id,
      tournament_regs.game_year,
      tournament_regs.team_id,
      tournament_regs.player_id,
      tournament_regs.is_confirmed
    from
      tournament_regs
    union all
    select
      league_regs.event_type,
      league_regs.tournament_id,
      league_regs.season_id,
      league_regs.game_year,
      league_regs.team_id,
      league_regs.player_id,
      league_regs.is_confirmed
    from
      league_regs
  ),
  team_participants as (
    select
      rr.event_type,
      rr.tournament_id,
      rr.season_id,
      rr.game_year,
      rr.team_id,
      count(distinct rr.player_id) as registered_players
    from
      raw_registrations rr
    where
      rr.is_confirmed
    group by
      rr.event_type,
      rr.tournament_id,
      rr.season_id,
      rr.game_year,
      rr.team_id
  ),
  team_strength_inputs as (
    select
      tp.event_type,
      tp.tournament_id,
      tp.season_id,
      tp.game_year,
      tp.team_id,
      tp.registered_players,
      tm.hybrid_score,
      tm.elo_rating as global_elo,
      null::double precision as recent_elo_30d
    from
      team_participants tp
      left join teams tm on tm.id = tp.team_id
  ),
  player_strength_inputs as (
    select
      rr.event_type,
      rr.tournament_id,
      rr.season_id,
      rr.game_year,
      rr.team_id,
      avg(p.player_rank_score) as avg_player_value,
      avg(p.monthly_value) as avg_recent_player_value
    from
      raw_registrations rr
      join players p on p.id = rr.player_id
    where
      rr.is_confirmed
    group by
      rr.event_type,
      rr.tournament_id,
      rr.season_id,
      rr.game_year,
      rr.team_id
  ),
  participant_strengths as (
    select
      tsi.event_type,
      tsi.tournament_id,
      tsi.season_id,
      tsi.game_year,
      tsi.team_id,
      COALESCE(
        tsi.hybrid_score::double precision,
        tsi.recent_elo_30d,
        tsi.global_elo
      ) as blended_team_strength,
      tsi.hybrid_score,
      tsi.global_elo,
      tsi.recent_elo_30d,
      psi.avg_player_value,
      psi.avg_recent_player_value,
      tsi.registered_players
    from
      team_strength_inputs tsi
      left join player_strength_inputs psi on psi.event_type = tsi.event_type
      and psi.tournament_id = tsi.tournament_id
      and psi.season_id = tsi.season_id
      and psi.game_year = tsi.game_year
      and psi.team_id = tsi.team_id
  ),
  ranked_field as (
    select
      ps.event_type,
      ps.tournament_id,
      ps.season_id,
      ps.game_year,
      ps.team_id,
      ps.blended_team_strength,
      ps.hybrid_score,
      ps.global_elo,
      ps.recent_elo_30d,
      ps.avg_player_value,
      ps.avg_recent_player_value,
      ps.registered_players,
      count(*) over (
        partition by
          ps.event_type,
          ps.tournament_id,
          ps.season_id,
          ps.game_year
      ) as team_count,
      row_number() over (
        partition by
          ps.event_type,
          ps.tournament_id,
          ps.season_id,
          ps.game_year
        order by
          ps.blended_team_strength desc nulls last
      ) as field_rank
    from
      participant_strengths ps
  ),
  event_aggregates as (
    select
      rf.event_type,
      rf.tournament_id,
      rf.season_id,
      rf.game_year,
      count(*) as team_count,
      avg(rf.hybrid_score) as avg_hybrid_strength,
      avg(rf.global_elo) as avg_global_elo,
      avg(rf.recent_elo_30d) as avg_recent_elo,
      avg(rf.avg_player_value) as avg_player_value,
      avg(rf.avg_recent_player_value) as avg_recent_player_value,
      avg(
        case
          when rf.field_rank::numeric <= GREATEST(
            1::numeric,
            LEAST(8::numeric, ceil(rf.team_count::numeric * 0.20))
          ) then rf.blended_team_strength
          else null::double precision
        end
      ) as top_field_strength,
      stddev_pop(rf.blended_team_strength) as parity_stddev
    from
      ranked_field rf
    group by
      rf.event_type,
      rf.tournament_id,
      rf.season_id,
      rf.game_year
  ),
  event_details as (
    select
      ea.event_type,
      ea.tournament_id,
      ea.season_id,
      ea.game_year,
      ea.team_count,
      ea.avg_hybrid_strength,
      ea.avg_global_elo,
      ea.avg_recent_elo,
      ea.avg_player_value,
      ea.avg_recent_player_value,
      ea.top_field_strength,
      ea.parity_stddev,
      COALESCE(t.prize_pool::numeric, ls.prize_pool::numeric) as prize_pool,
      COALESCE(
        t.start_date::timestamp without time zone::timestamp with time zone,
        ls.start_date
      ) as start_date,
      COALESCE(
        t.name,
        'League Season '::text || ls.season_number
      ) as tournament_name,
      COALESCE(li1.league::text, li2.league::text) as organizer_name
    from
      event_aggregates ea
      left join tournaments t on t.id = ea.tournament_id
      left join league_seasons ls on ls.id = ea.season_id
      left join leagues_info li1 on li1.id = t.organizer_id
      left join leagues_info li2 on li2.id = ls.league_id
  ),
  feature_matrix as (
    select
      ed.event_type,
      ed.tournament_id,
      ed.season_id,
      ed.game_year,
      ed.team_count,
      ed.avg_hybrid_strength,
      ed.avg_global_elo,
      ed.avg_recent_elo,
      ed.avg_player_value,
      ed.avg_recent_player_value,
      ed.top_field_strength,
      ed.parity_stddev,
      ed.prize_pool,
      ed.start_date,
      ed.tournament_name,
      ed.organizer_name,
      GREATEST(ed.team_count, 1::bigint) as safe_team_count,
      ed.team_count as effective_bracket_size,
      ln(
        GREATEST(COALESCE(ed.prize_pool, 0::numeric), 1::numeric)
      ) as log_prize_pool,
      0.00 as lan_bonus
    from
      event_details ed
  ),
  normalized_features as (
    select
      fm.event_type,
      fm.tournament_id,
      fm.season_id,
      fm.game_year,
      fm.team_count,
      fm.avg_hybrid_strength,
      fm.avg_global_elo,
      fm.avg_recent_elo,
      fm.avg_player_value,
      fm.avg_recent_player_value,
      fm.top_field_strength,
      fm.parity_stddev,
      fm.prize_pool,
      fm.start_date,
      fm.tournament_name,
      fm.organizer_name,
      fm.safe_team_count,
      fm.effective_bracket_size,
      fm.log_prize_pool,
      fm.lan_bonus,
      COALESCE(
        (
          fm.avg_hybrid_strength - avg(fm.avg_hybrid_strength) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.avg_hybrid_strength) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_avg_hybrid_strength,
      COALESCE(
        (
          fm.avg_global_elo - avg(fm.avg_global_elo) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.avg_global_elo) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_avg_global_elo,
      COALESCE(
        (
          fm.avg_recent_elo - avg(fm.avg_recent_elo) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.avg_recent_elo) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_avg_recent_elo,
      COALESCE(
        (
          fm.avg_player_value - avg(fm.avg_player_value) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.avg_player_value) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_avg_player_value,
      COALESCE(
        (
          fm.top_field_strength - avg(fm.top_field_strength) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.top_field_strength) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_top_field_strength,
      COALESCE(
        (
          fm.effective_bracket_size::numeric - avg(fm.effective_bracket_size) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.effective_bracket_size) over (
            partition by
              fm.game_year
          ),
          0::numeric
        ),
        0::numeric
      ) as z_bracket_size,
      COALESCE(
        (
          fm.log_prize_pool - avg(fm.log_prize_pool) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.log_prize_pool) over (
            partition by
              fm.game_year
          ),
          0::numeric
        ),
        0::numeric
      ) as z_log_prize_pool,
      COALESCE(
        (
          fm.parity_stddev - avg(fm.parity_stddev) over (
            partition by
              fm.game_year
          )
        ) / NULLIF(
          stddev_pop(fm.parity_stddev) over (
            partition by
              fm.game_year
          ),
          0::double precision
        ),
        0::double precision
      ) as z_parity_stddev
    from
      feature_matrix fm
  ),
  squashed_features as (
    select
      nf.event_type,
      nf.tournament_id,
      nf.season_id,
      nf.game_year,
      nf.team_count,
      nf.avg_hybrid_strength,
      nf.avg_global_elo,
      nf.avg_recent_elo,
      nf.avg_player_value,
      nf.avg_recent_player_value,
      nf.top_field_strength,
      nf.parity_stddev,
      nf.prize_pool,
      nf.start_date,
      nf.tournament_name,
      nf.organizer_name,
      nf.safe_team_count,
      nf.effective_bracket_size,
      nf.log_prize_pool,
      nf.lan_bonus,
      nf.z_avg_hybrid_strength,
      nf.z_avg_global_elo,
      nf.z_avg_recent_elo,
      nf.z_avg_player_value,
      nf.z_top_field_strength,
      nf.z_bracket_size,
      nf.z_log_prize_pool,
      nf.z_parity_stddev,
      1::double precision / (
        1::double precision + exp(- nf.z_avg_hybrid_strength)
      ) as hybrid_strength_score,
      1::double precision / (1::double precision + exp(- nf.z_avg_recent_elo)) as recent_strength_score,
      1::double precision / (
        1::double precision + exp(- nf.z_avg_player_value)
      ) as player_value_score,
      1::double precision / (
        1::double precision + exp(- nf.z_top_field_strength)
      ) as top_field_score,
      1::numeric / (1::numeric + exp(- nf.z_bracket_size)) as bracket_size_score,
      1::numeric / (1::numeric + exp(- nf.z_log_prize_pool)) as prize_pool_score,
      1::double precision / (1::double precision + exp(nf.z_parity_stddev)) as parity_score
    from
      normalized_features nf
  ),
  weighted_scores as (
    select
      sf.event_type,
      sf.tournament_id,
      sf.season_id,
      sf.game_year,
      sf.team_count,
      sf.avg_hybrid_strength,
      sf.avg_global_elo,
      sf.avg_recent_elo,
      sf.avg_player_value,
      sf.avg_recent_player_value,
      sf.top_field_strength,
      sf.parity_stddev,
      sf.prize_pool,
      sf.start_date,
      sf.tournament_name,
      sf.organizer_name,
      sf.safe_team_count,
      sf.effective_bracket_size,
      sf.log_prize_pool,
      sf.lan_bonus,
      sf.z_avg_hybrid_strength,
      sf.z_avg_global_elo,
      sf.z_avg_recent_elo,
      sf.z_avg_player_value,
      sf.z_top_field_strength,
      sf.z_bracket_size,
      sf.z_log_prize_pool,
      sf.z_parity_stddev,
      sf.hybrid_strength_score,
      sf.recent_strength_score,
      sf.player_value_score,
      sf.top_field_score,
      sf.bracket_size_score,
      sf.prize_pool_score,
      sf.parity_score,
      LEAST(
        1.0::double precision,
        GREATEST(
          0.0::double precision,
          sf.hybrid_strength_score * 0.32::double precision + sf.recent_strength_score * 0.15::double precision + sf.player_value_score * 0.15::double precision + sf.top_field_score * 0.18::double precision + (sf.bracket_size_score * 0.08)::double precision + sf.parity_score * 0.04::double precision + (sf.prize_pool_score * 0.08)::double precision + sf.lan_bonus::double precision
        )
      ) as event_strength_score
    from
      squashed_features sf
  )
select
  event_type,
  tournament_id,
  season_id,
  game_year,
  COALESCE(tournament_id, season_id) as event_key,
  tournament_name as event_name,
  organizer_name,
  start_date,
  team_count,
  team_count as bracket_size,
  prize_pool,
  round(event_strength_score::numeric, 4) as event_strength,
  round(
    (event_strength_score * 100::double precision)::numeric,
    2
  ) as tier_score,
  case
    when event_strength_score >= 0.85::double precision then 'T1'::text
    when event_strength_score >= 0.70::double precision then 'T2'::text
    when event_strength_score >= 0.55::double precision then 'T3'::text
    when event_strength_score >= 0.40::double precision then 'T4'::text
    else 'T5'::text
  end as tier_label,
  case
    when event_strength_score >= 0.85::double precision then 1000
    when event_strength_score >= 0.70::double precision then 600
    when event_strength_score >= 0.55::double precision then 300
    when event_strength_score >= 0.40::double precision then 150
    else 50
  end as rp_cap,
  hybrid_strength_score * 0.32::double precision as hybrid_strength_component,
  recent_strength_score * 0.15::double precision as recent_strength_component,
  player_value_score * 0.15::double precision as player_value_component,
  top_field_score * 0.18::double precision as top_field_component,
  bracket_size_score * 0.08 as bracket_component,
  parity_score * 0.04::double precision as parity_component,
  prize_pool_score * 0.08 as prize_pool_component,
  lan_bonus as lan_bonus_component,
  now() as calculated_at
from
  weighted_scores ws;