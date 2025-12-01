# Clerk Authentication Setup for Cloudflare Pages

## Problem

If your site loads in development but not in production, it's likely because Clerk environment variables aren't properly configured for Cloudflare Pages builds.

## Root Cause

The `@clerk/astro` integration reads environment variables at **build time**, but environment variables defined in `wrangler.toml` are only available at **runtime**. This means:

- ✅ Development works (reads from `.dev.vars` or `wrangler.toml`)
- ❌ Production fails (Clerk integration can't find keys at build time)

## Solution

You **must** set Clerk environment variables in the **Cloudflare Pages dashboard**, not just in `wrangler.toml`.

### Steps to Fix

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production** environment:

   ```
   PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsucHJvYW1yYW5rLmdnJA
   CLERK_SECRET_KEY=sk_live_PkcRjUAiqVYO4kv2zkkpAPBi7zsqHBKQ7HyKbICmp9
   ```

   (Use your actual production keys from Clerk dashboard)

4. Optionally add them for **Preview** environment as well (use test keys)
5. **Redeploy** your site (trigger a new build)

### Why This Works

- Environment variables set in Cloudflare Pages dashboard are available at **both build time and runtime**
- `wrangler.toml` variables are only available at **runtime**
- Clerk Astro integration needs the keys at **build time** to properly configure the integration

### Verification

After setting the variables and redeploying:

1. Check build logs to ensure no Clerk-related errors
2. Visit your production site - it should load correctly
3. Test authentication flows (sign in/sign up)

### Current Configuration

Your `wrangler.toml` already has the production keys in `[env.production.vars]`, which is good for runtime access. However, you still need to add them to Cloudflare Pages dashboard for build-time access.

### Additional Notes

- The `PUBLIC_` prefix on `PUBLIC_CLERK_PUBLISHABLE_KEY` makes it available to client-side code
- `CLERK_SECRET_KEY` is server-side only and should never be exposed to the client
- Always use production keys (`pk_live_` and `sk_live_`) for production environment
- Use test keys (`pk_test_` and `sk_test_`) for preview/development environments

