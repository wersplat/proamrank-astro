# Pro-Am Rankings (Astro + Supabase + R2)

Lightweight Astro version of the Pro-Am Rankings platform, matching the Next.js app's database schema.

## Features
- 🏠 **Home** - Global team rankings with sortable table
- 🏆 **Teams** - Listing and detail pages with roster & match history
- 👤 **Players** - Listing and detail pages with stats & game logs
- 🏅 **Leagues** - Active leagues with standings and schedules
- 🎯 **Tournaments** - Tournament brackets, results, and prizes
- ⚡ **Matches** - Paginated match results (25/page) with interactive boxscore modals
- 📊 **Ranking System** - Detailed explanation of RP, ELO, and tiers
- 📤 **Upload** - Box score screenshot submission
- 📱 Fully responsive (mobile & desktop)
- 🚀 SSR with Cloudflare Pages
- ✨ Interactive features with Astro Islands (React)

## Prereqs
- Cloudflare Pages
- R2 bucket (bind as `R2_BUCKET`  in Pages → Functions)
- Supabase project with read-only views (RLS)

## Local dev
```bash
npm install
npm run dev
```

**Note**: 
- Dynamic routes (team/player detail pages) use SSR
- API routes work in both dev and production
- Make sure `@astrojs/cloudflare` is installed

## Env (Pages → Settings → Environment Variables)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- PUBLIC_ASSETS_BASE (optional, e.g., https://cdn.proamrank.gg)

## API Routes

The app includes API routes (Astro endpoints + Cloudflare Pages Functions) for:
- `/api/player-stats` - Fetch player stats for a match (works in dev & production)
- `/api/team-stats` - Fetch team stats for a match (works in dev & production)
- `/api/upload-direct` - Upload box score screenshots to R2 (Cloudflare Pages only)

**R2 Bindings** (Pages → Functions → R2 Bindings):
- Bind your bucket name as `R2_BUCKET` 

## Database Setup
- Run: `supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/db.types.ts`
- **Required tables**: `teams`, `players`, `matches`, `player_stats`, `team_rosters`
- **Required views**: `team_performance_view`, `player_performance_view`, `team_roster_current`
- These should match your Next.js app's database schema exactly

## Deploy
- Connect repo to Cloudflare Pages
- Build: `npm run build` 
- Output dir: `dist` 

## Pages Structure

```
/                   → Home (top 100 teams)
/teams              → Teams listing (paginated, 25/page)
/teams/[id]         → Team detail with paginated match history (SSR)
/players            → Players listing (paginated, 25/page)
/players/[id]       → Player detail with paginated game log (SSR)
/leagues            → League seasons listing (paginated, 25/page)
/leagues/[id]       → Season detail with standings & paginated matches (SSR)
/tournaments        → Tournaments listing (paginated, 25/page)
/tournaments/[id]   → Tournament detail with results & paginated matches (SSR)
/matches            → Global matches (paginated, 25/page)
/ranking-system     → System explanation
/upload             → Upload box scores
```

After setup, you will:
- Replace `src/lib/db.types.ts` with your actual generated types
- Ensure all required views exist in your Supabase database
- Set env vars and R2 binding in Cloudflare Pages
- (Optional) Map `PUBLIC_ASSETS_BASE` to an R2 public domain for serving assets
