-- Fixed league_calendar view that properly groups data by season, not just by league
create or replace view public.league_calendar as
with
  league_season_info as (
    select
      ls.id as season_id,
      ls.league_id,
      li.id as league_info_id,
      li.league as league_name,
      ls.season_number,
      ls.start_date,
      ls.end_date,
      ls.is_active,
      ls.year as game_year,
      li.lg_logo_url as league_logo,
      li.lg_url as league_website,
      li.lg_discord as discord_link,
      li.twitter_id,
      li.twitch_url
    from
      league_seasons ls
      join leagues_info li on ls.league_id = li.id
  ),
  league_tournaments as (
    select
      t.id as tournament_id,
      t.organizer_id as league_id,
      t.name as tournament_name,
      t.start_date,
      t.end_date,
      t.status,
      t.tier
    from
      tournaments t
    where
      t.organizer_id is not null
  ),
  league_matches as (
    select
      m.season_id,  -- Group by season_id instead of league_id
      count(m.id) as total_matches,
      max(m.played_at) as last_match_date
    from
      matches m
    where
      m.season_id is not null  -- Only include matches with a season_id
    group by
      m.season_id
  ),
  upcoming_league_matches as (
    select
      um.league_id,
      count(um.id) as upcoming_matches_count,
      min(um.scheduled_at) as next_match_time
    from
      upcoming_matches um
    group by
      um.league_id
  ),
  league_champions as (
    select
      pc.league_id,
      pc.season,
      pc.team_id as champion_id,
      pc.team_name as champion_name,
      pc.champion_logo,
      pc.tournament_date,
      row_number() over (
        partition by
          pc.league_id,
          pc.season
        order by
          pc.tournament_date desc
      ) as rn
    from
      past_champions pc
    where
      pc.is_tournament = false
  )
select
  lsi.league_info_id as league_id,
  lsi.league_name,
  lsi.season_id,
  lsi.season_number,
  lsi.start_date,
  lsi.end_date,
  lsi.is_active,
  lsi.game_year,
  lsi.league_logo,
  lsi.league_website,
  lsi.discord_link,
  lsi.twitter_id,
  lsi.twitch_url,
  (
    select
      count(*) as count
    from
      league_tournaments lt
    where
      lt.league_id = lsi.league_id
  ) as tournament_count,
  COALESCE(lm.total_matches, 0::bigint) as total_matches,
  lm.last_match_date,
  COALESCE(ulm.upcoming_matches_count, 0::bigint) as upcoming_matches_count,
  ulm.next_match_time,
  lc.champion_id,
  lc.champion_name,
  lc.champion_logo,
  lc.tournament_date as championship_date,
  case
    when lsi.end_date < CURRENT_DATE then 'completed'::text
    when lsi.start_date > CURRENT_DATE then 'upcoming'::text
    when lsi.is_active = true then 'active'::text
    when lsi.start_date <= CURRENT_DATE
    and (
      lsi.end_date is null
      or lsi.end_date >= CURRENT_DATE
    ) then 'active'::text
    else 'unknown'::text
  end as league_status,
  case
    when lsi.end_date < CURRENT_DATE then 3
    when lsi.start_date > CURRENT_DATE then 1
    when lsi.is_active = true then 2
    when lsi.start_date <= CURRENT_DATE
    and (
      lsi.end_date is null
      or lsi.end_date >= CURRENT_DATE
    ) then 2
    else 4
  end as sort_order
from
  league_season_info lsi
  left join league_matches lm on lsi.season_id = lm.season_id  -- Join on season_id instead of league_id
  left join upcoming_league_matches ulm on lsi.league_id = ulm.league_id
  left join league_champions lc on lsi.league_id = lc.league_id
  and lsi.season_number = lc.season
  and lc.rn = 1
order by
  (
    case
      when lsi.end_date < CURRENT_DATE then 3
      when lsi.start_date > CURRENT_DATE then 1
      when lsi.is_active = true then 2
      when lsi.start_date <= CURRENT_DATE
      and (
        lsi.end_date is null
        or lsi.end_date >= CURRENT_DATE
      ) then 2
      else 4
    end
  ),
  (COALESCE(lsi.is_active, false)) desc,
  (
    COALESCE(
      lsi.start_date,
      '2099-12-31'::date::timestamp with time zone
    )
  ),
  lsi.league_name,
  lsi.season_number desc;
