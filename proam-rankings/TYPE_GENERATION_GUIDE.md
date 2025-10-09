# TypeScript Type Generation Guide

## Issue

After adding the new `v_player_global_rating` database view, TypeScript doesn't recognize it because the type definitions haven't been regenerated.

## Solution

You need to regenerate TypeScript types from your Supabase database schema.

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate types
supabase gen types typescript --linked > src/lib/db.types.ts
```

### Option 2: Using npx (No Installation Required)

```bash
npx supabase gen types typescript --project-id "your-project-ref" --schema public > src/lib/db.types.ts
```

Replace `your-project-ref` with your actual Supabase project reference ID (found in your project settings).

### Option 3: Manual via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to: Settings → API
3. Copy the "Project URL" and "Project API keys"
4. Run:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts
   ```

## What Gets Updated

The command will regenerate `src/lib/db.types.ts` to include:

- `v_player_global_rating` view types
- All fields from the view:
  - `player_id`
  - `gamertag`
  - `position`
  - `global_rating`
  - `rating_tier`
  - `base_rating`
  - `game_impact`
  - `event_bonus`
  - `consistency_bonus`
  - `decay_penalty`
  - `total_games`
  - `recent_games`
  - `days_since_last_game`
  - `peak_performance`

## After Regeneration

1. **Remove @ts-ignore comments** from:
   - `src/pages/players/index.astro`
   
2. **Verify types** by running:
   ```bash
   npm run build
   ```

3. **Check for errors**:
   ```bash
   npm run astro check
   ```

## Troubleshooting

### Error: "Project not found"

Make sure you're using the correct project reference ID. Find it in:
- Supabase Dashboard → Settings → General → Reference ID

### Error: "Unauthorized"

Run `supabase login` again and make sure you're logged in.

### Error: "Schema not found"

Make sure the database views are created. Check in Supabase Dashboard → SQL Editor:
```sql
SELECT * FROM v_player_global_rating LIMIT 1;
```

If the view doesn't exist, run the migration SQL files from `ratingSystemSql/` directory.

## Alternative: Use `any` Type (Quick Fix)

If you can't regenerate types immediately, the code will still work with the `@ts-ignore` comments that are already in place. However, you'll lose TypeScript type checking for those queries.

## Best Practice

Set up a script in `package.json`:

```json
{
  "scripts": {
    "gen:types": "supabase gen types typescript --linked > src/lib/db.types.ts"
  }
}
```

Then run:
```bash
npm run gen:types
```

## When to Regenerate Types

Regenerate types whenever you:
- Create new database tables
- Create new database views
- Add new columns to existing tables
- Change column types
- Add new enums

## Documentation

- [Supabase Type Generation](https://supabase.com/docs/guides/api/generating-types)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

