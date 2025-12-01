# Global Rankings Analytics Engine (G.R.A.D.E.)

Lightweight Astro version of the Global Rankings Analytics Engine (G.R.A.D.E.) platform, matching the Next.js app's database schema.

## Features

- 🏠 **Home** - Global team rankings with sortable table
- 🏆 **Teams** - Paginated listing (25/page) with detail pages, roster & match history
- 👤 **Players** - Paginated listing (25/page) with detail pages, stats, badges & game logs
- 🏅 **Leagues** - Paginated seasons (25/page) with standings, divisions, and match schedules
- 🎯 **Tournaments** - Paginated listing (25/page) with brackets, results, and prizes
- 🎓 **College Portal** - University/College profiles and student athlete directories
- ⚔️ **Matchups** - Head-to-head comparison tools for teams
- 🎖️ **Achievements** - Player badge and achievement tracking system
- ⚡ **Matches** - Paginated global matches (25/page) with interactive boxscore modals
- 📊 **Ranking System** - Detailed explanation of RP, ELO, and tiers
- 🛡️ **League Divisions** - Support for multi-division league structures
- 📤 **Upload** - Box score screenshot submission
- 📱 Fully responsive (mobile & desktop)
- 🚀 SSR with Cloudflare Pages
- ✨ Interactive features with Astro Islands (React)
- 📄 **Smart Pagination** - All lists paginate at 25 items/page with 7-button navigation
- 📈 **Data Marts** - High-performance analytical data layer for complex stats

## Prereqs
- Cloudflare Pages
- R2 bucket (bind as `R2_BUCKET`  in Pages → Functions)
- Supabase project with read-only views (RLS) and Data Marts

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
- SENTRY_DSN
- SENTRY_AUTH_TOKEN (for build-time sourcemaps)
- PUBLIC_ASSETS_BASE (optional, e.g., https://cdn.proamrank.gg)

## API Routes

The app includes API routes (Astro endpoints + Cloudflare Pages Functions) for:
- `/api/player-stats` - Fetch player stats for a match (works in dev & production)
- `/api/team-stats` - Fetch team stats for a match (works in dev & production)
- `/api/player-badges` - Fetch player badge data
- `/api/upload-direct` - Upload box score screenshots to R2 (Cloudflare Pages only)

**R2 Bindings** (Pages → Functions → R2 Bindings):
- Bind your bucket name as `R2_BUCKET` 

## Database Setup
- Run: `supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/db.types.ts`
- **Required tables**: `teams`, `players`, `matches`, `player_stats`, `team_rosters`, `leagues`, `tournaments`
- **Required views**: `team_performance_view`, `player_performance_view`, `team_roster_current`
- **Data Marts**: See `documentation/DATA_MARTS_SUMMARY.md` for setting up the analytical layer.
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
/colleges           → College/University listing
/colleges/[id]      → College detail page with roster
/students           → Student athlete listing
/leagues            → League seasons listing (paginated, 25/page)
/leagues/[id]       → Season detail with standings & paginated matches (SSR)
/tournaments        → Tournaments listing (paginated, 25/page)
/tournaments/[id]   → Tournament detail with results & paginated matches (SSR)
/matches            → Global matches (paginated, 25/page)
/matchups/[id]      → Head-to-head match analysis
/achievements       → Global achievement/badge listing
/ranking-system     → System explanation
/about              → About page
/upload             → Upload box scores
```

## Documentation

Detailed documentation for specific features can be found in the `documentation/` folder:

- **Data Marts**: `documentation/DATA_MARTS_SUMMARY.md` & `documentation/MART_ARCHITECTURE.md`
- **League Divisions**: `documentation/LG_DIVISIONS_SUMMARY.md`
- **College Portal**: `documentation/COLLEGE_PORTAL_IMPLEMENTATION_COMPLETE.md`
- **Sentry Integration**: `documentation/SENTRY_SETUP.md`
- **Badge/Achievements**: `documentation/BADGE_COUNTER_FIX_SUMMARY.md`

## Architecture & Performance

This project uses a "Data Mart" architecture to handle complex statistical queries efficiently. Instead of complex joins on raw tables for every request, we use optimized views and tables (Marts) that pre-calculate or structure data for specific UI needs (e.g., `Team Analytics Data Mart`, `Player Performance Data Mart`).

Refer to `documentation/MART_QUERY_EXAMPLES.sql` for how to query these marts effectively.
