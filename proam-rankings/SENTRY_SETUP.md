# Sentry Integration Setup

This project has been integrated with Sentry for comprehensive error monitoring across all application layers.

## What's Monitored

- **Client-side (Browser)**: All frontend JavaScript errors, including React components
- **Server-side (SSR)**: All server-side rendering errors in Astro pages
- **API Routes**: All API endpoint errors in the main Astro app
- **Cloudflare Functions**: All errors in Cloudflare Pages Functions (4 functions)

## Configuration Files

### 1. `sentry.client.config.ts`
Browser-side Sentry configuration with:
- Error tracking
- Performance monitoring (Browser Tracing)
- Session Replay (10% of sessions, 100% of error sessions)
- Environment: production

### 2. `sentry.server.config.ts`
Server-side Sentry configuration with:
- Error tracking
- Performance monitoring
- Environment: production

### 3. `astro.config.mjs`
Astro integration that automatically:
- Injects Sentry client/server configurations
- Generates source maps
- Uploads source maps to Sentry during build

### 4. `src/middleware.ts`
Enhanced with Sentry middleware to capture SSR and API route errors

### 5. Cloudflare Functions
All 4 functions have Sentry initialized:
- `functions/api/player-stats.ts`
- `functions/api/team-stats.ts`
- `functions/api/upload-direct.ts`
- `functions/scheduled/update-player-ratings.ts`

## Environment Variables

### Required for Build (Cloudflare Pages)

Add this to your Cloudflare Pages environment variables:

```
SENTRY_AUTH_TOKEN=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
```

This token is used during the build process to upload source maps to Sentry.

### How to Add in Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** → **Environment variables**
3. Add `SENTRY_AUTH_TOKEN` with the value above
4. Apply to both **Production** and **Preview** environments
5. Redeploy your site

## Source Maps

Source maps are automatically:
- Generated during the build (`npm run build`)
- Uploaded to Sentry using `SENTRY_AUTH_TOKEN`
- Hidden from production (only Sentry receives them)

This allows you to see the original source code in error stack traces, even though the production code is minified.

## Sentry Project Details

- **Organization**: bodegacatsgc
- **Project Slug**: proamrank
- **Project ID**: 4510164326023168
- **DSN**: `https://15ecc8d420bd1ac21d6ca88698ca4566@o4509330775277568.ingest.us.sentry.io/4510164326023168`
- **Environment**: production
- **Traces Sample Rate**: 100% (adjust in production if needed)
- **Replays Session Sample Rate**: 10%
- **Replays on Error Sample Rate**: 100%

## Testing the Integration

After deployment, you can test if Sentry is working:

1. **Test client-side**: Add `throw new Error("Test error")` in a React component
2. **Test server-side**: Add `throw new Error("Test error")` in an Astro page
3. **Test Functions**: Trigger an error in one of the API endpoints

Check your Sentry dashboard at: https://sentry.io/organizations/bodegacatsgc/issues/

## Adjusting Sample Rates

For production, you may want to adjust the sample rates in the config files to reduce costs:

- **tracesSampleRate**: Percentage of transactions to capture (currently 100%)
- **replaysSessionSampleRate**: Percentage of normal sessions to record (currently 10%)
- **replaysOnErrorSampleRate**: Percentage of error sessions to record (currently 100%)

Edit `sentry.client.config.ts` and `sentry.server.config.ts` to adjust these values.

## Troubleshooting

### Source maps not uploading

- Ensure `SENTRY_AUTH_TOKEN` is set in Cloudflare Pages environment variables
- Check build logs for Sentry upload errors
- Verify the auth token has `project:releases` and `org:read` scopes

### Errors not appearing in Sentry

- Check the Sentry DSN is correct
- Verify the project is deployed and receiving traffic
- Check browser console for Sentry initialization errors

### High quota usage

- Reduce `tracesSampleRate` in both config files
- Reduce `replaysSessionSampleRate` in client config
- Filter out certain errors using Sentry's inbound filters

## Documentation

- [Sentry Astro Docs](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Sentry Cloudflare Docs](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)

