# Daily Player Rating Cron Job Setup

This document explains how to set up the daily cron job that updates player global ratings and applies decay penalties.

## Overview

The cron job runs daily at 2:00 AM UTC and:
- Recalculates all player global ratings
- Applies decay penalties based on days of inactivity
- Updates player salary tiers based on new ratings
- Maintains the integrity of the rating system

## Setup Methods

### Method 1: Cloudflare Pages Dashboard (Recommended)

1. **Go to your Cloudflare Pages project**
   - Navigate to: https://dash.cloudflare.com
   - Select your project: `proam-rankings`

2. **Navigate to Functions Settings**
   - Go to: Settings → Functions → Cron Triggers

3. **Add Cron Trigger**
   - Click "Add Cron Trigger"
   - **Schedule**: `0 2 * * *` (Daily at 2:00 AM UTC)
   - **Route**: `/scheduled/update-player-ratings`
   - Click "Save"

4. **Set Environment Variables**
   - Go to: Settings → Environment variables
   - Add the following variables for **Production**:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Make sure they're set for the **Production** environment

### Method 2: Using Wrangler CLI

1. **Install Wrangler** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy with Cron**
   ```bash
   wrangler pages publish dist --project-name=proam-rankings
   ```

4. **Configure Cron via CLI** (alternative to dashboard)
   ```bash
   # The cron schedule is defined in wrangler.toml
   # Wrangler will automatically set it up on deploy
   ```

### Method 3: Manual API Endpoint

If you prefer to trigger the update manually or via an external cron service:

**Endpoint**: `https://your-domain.pages.dev/scheduled/update-player-ratings`

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Example using curl**:
```bash
curl -X POST https://your-domain.pages.dev/scheduled/update-player-ratings
```

**Example using cron (Unix/Linux)**:
```bash
# Add to crontab
0 2 * * * curl -X POST https://your-domain.pages.dev/scheduled/update-player-ratings
```

## Verification

### Check if Cron is Running

1. **Via Cloudflare Dashboard**
   - Go to: Workers & Pages → proam-rankings → Logs
   - Filter by: "update-player-ratings"
   - Look for successful execution logs

2. **Via Response**
   The endpoint returns a JSON response:
   ```json
   {
     "success": true,
     "message": "Player ratings updated successfully",
     "playersUpdated": 150,
     "timestamp": "2024-01-15T02:00:00.000Z"
   }
   ```

### Manual Test

Trigger the function manually to test:

```bash
curl -X POST https://your-domain.pages.dev/scheduled/update-player-ratings
```

Or use an API client like Postman/Insomnia.

## Monitoring

### What the Cron Does

1. **Calls Supabase Function**: `update_player_global_ratings()`
2. **Updates Player Tables**: 
   - `players.performance_score` → New global rating
   - `players.player_rank_score` → Rating + RP
   - `players.salary_tier` → Updated based on rating
3. **Returns Summary**: Number of players updated

### Expected Behavior

- **Success**: Returns 200 status with JSON summary
- **Failure**: Returns error status with details
- **Logs**: Viewable in Cloudflare Dashboard

### Performance

- **Duration**: Usually < 5 seconds for 100-200 players
- **Cost**: Minimal (Cloudflare Cron is free on Pages)
- **Database Load**: Single function call, optimized query

## Troubleshooting

### Cron Not Running

1. **Check Environment Variables**
   - Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - Verify they're set for Production environment

2. **Check Cron Configuration**
   - Verify cron schedule in dashboard: `0 2 * * *`
   - Ensure route is correct: `/scheduled/update-player-ratings`

3. **Check Logs**
   - View Cloudflare Pages logs for errors
   - Check Supabase logs for database errors

### Database Errors

1. **Function Not Found**
   - Ensure `update_player_global_ratings()` function is created in Supabase
   - Run the SQL migration files in `ratingSystemSql/`

2. **View Not Found**
   - Ensure `v_player_global_rating` view exists
   - Check Supabase → SQL Editor for the view

3. **Permission Errors**
   - Verify the anon key has permission to call the function
   - Check RLS policies if enabled

### Manual Update

If cron fails, you can manually update ratings via Supabase:

```sql
SELECT * FROM update_player_global_ratings();
```

## Cron Schedule Explanation

```
0 2 * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Current Schedule**: `0 2 * * *` = Every day at 2:00 AM UTC

### Alternative Schedules

If you want to change the schedule:

- **Every 6 hours**: `0 */6 * * *`
- **Twice daily** (2 AM & 2 PM): `0 2,14 * * *`
- **Weekly** (Sunday 2 AM): `0 2 * * 0`
- **Every hour**: `0 * * * *`

Update the schedule in:
1. Cloudflare Dashboard → Cron Triggers
2. Or `wrangler.toml` file

## Support

For issues or questions:
1. Check Cloudflare Pages logs
2. Check Supabase function logs
3. Review database migration files
4. Verify environment variables

## References

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

