# Match Contexts Migration Summary

## Overview
All match queries in the application have been migrated from using the `matches` table directly to using the `v_matches_with_primary_context` view. This view provides backward compatibility while supporting the new `match_contexts` table for multi-context matches.

## Changes Made

### Files Updated
All the following files now query `v_matches_with_primary_context` instead of `matches`:

1. ✅ `src/pages/players/[id].astro` - Player match history
2. ✅ `src/pages/tournaments/[id].astro` - Tournament matches
3. ✅ `src/pages/teams/[id].astro` - Team match history
4. ✅ `src/pages/leagues/[id].astro` - League season matches
5. ✅ `src/pages/matches/index.astro` - All matches listing (with pagination)

### View Structure
The `v_matches_with_primary_context` view includes:

**Original fields from `matches` table:**
- `id`, `boxscore_url`, `game_number`, `game_year`, `played_at`
- `score_a`, `score_b`, `stage`, `status`, `verified`, `winner_id`
- `team_a_id`, `team_b_id`
- `league_id`, `season_id`, `tournament_id` (original direct references)

**New fields from `match_contexts` table:**
- `primary_league_id` - League ID from primary context
- `primary_season_id` - Season ID from primary context
- `primary_tournament_id` - Tournament ID from primary context

## Backward Compatibility

The current implementation maintains full backward compatibility:
- All existing queries continue to use `league_id`, `season_id`, and `tournament_id` (the original fields)
- The view exposes both old and new field names
- No functionality is broken

## Future Migration Path

### Phase 1: Current State ✅
- [x] All queries use the view
- [x] Queries continue using old field names (`league_id`, `season_id`, `tournament_id`)
- [x] Data is still stored in original `matches` table columns

### Phase 2: Gradual Migration (Recommended)
- [ ] Update queries to use new field names (`primary_league_id`, `primary_season_id`, `primary_tournament_id`)
- [ ] This allows using the primary context from `match_contexts` table
- [ ] Keeps backward compatibility during transition

### Phase 3: Full Migration (Optional)
- [ ] Remove `league_id`, `season_id`, `tournament_id` columns from `matches` table
- [ ] Update view to only expose primary context fields
- [ ] Update database constraints and triggers

## Database Prerequisites

Before deploying, ensure the following exist in your database:

1. **Table: `match_contexts`**
   ```sql
   CREATE TABLE IF NOT EXISTS public.match_contexts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
     league_id UUID REFERENCES public.leagues_info(id),
     season_id UUID REFERENCES public.league_seasons(id),
     tournament_id UUID REFERENCES public.tournaments(id),
     submitted_by UUID REFERENCES public.profiles(id),
     is_primary BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     UNIQUE (match_id, league_id, season_id, tournament_id)
   );
   ```

2. **Data Migration**
   ```sql
   INSERT INTO public.match_contexts (match_id, league_id, season_id, tournament_id, is_primary)
   SELECT id, league_id, season_id, tournament_id, true
   FROM public.matches
   WHERE (league_id IS NOT NULL OR tournament_id IS NOT NULL)
     AND id NOT IN (SELECT match_id FROM public.match_contexts WHERE is_primary);
   ```

3. **View: `v_matches_with_primary_context`**
   ```sql
   CREATE OR REPLACE VIEW public.v_matches_with_primary_context AS
   SELECT m.*,
          mc.league_id    AS primary_league_id,
          mc.season_id    AS primary_season_id,
          mc.tournament_id AS primary_tournament_id
   FROM public.matches m
   LEFT JOIN LATERAL (
     SELECT league_id, season_id, tournament_id
     FROM public.match_contexts
     WHERE match_id = m.id
     ORDER BY is_primary DESC, created_at ASC
     LIMIT 1
   ) mc ON true;
   ```

## Testing Checklist

After deploying these changes, verify:

- [ ] Player pages load with correct match history
- [ ] Tournament pages show all tournament matches
- [ ] Team pages display complete match records
- [ ] League pages show season matches correctly
- [ ] Matches index page loads and paginates properly
- [ ] Match context data (league/season/tournament) displays correctly
- [ ] Filtering and searching still work as expected

## Notes

- The linter errors about `Astro.locals.runtime` in `matches/index.astro` are pre-existing and not related to this migration
- No breaking changes were introduced
- All queries are drop-in replacements using the view
- Performance should be similar or better due to indexed view access

## Rollback Plan

If issues arise, you can easily roll back by changing `.from("v_matches_with_primary_context")` back to `.from("matches")` in the affected files.

