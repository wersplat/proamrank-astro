import { clerkMiddleware } from "@clerk/astro/server";
import { defineMiddleware, sequence } from "astro:middleware";

// Clerk middleware for authentication
// IMPORTANT: Clerk environment variables MUST be set in Cloudflare Pages dashboard
// (Settings → Environment Variables) for production builds, not just in wrangler.toml
// Required variables:
// - PUBLIC_CLERK_PUBLISHABLE_KEY (build-time + runtime)
// - CLERK_SECRET_KEY (build-time + runtime)
// wrangler.toml vars are runtime-only, but Clerk Astro integration needs them at build time
const clerk = clerkMiddleware();

// Middleware to expose Cloudflare environment to Astro.locals
// Note: Sentry middleware is automatically injected by the @sentry/astro integration
const cloudflareEnvMiddleware = defineMiddleware(async (context, next) => {
  // In Cloudflare Pages with Astro adapter, runtime exposes the env
  // Make it available to our pages
  const runtime = context.locals.runtime as any;
  
  if (runtime?.env) {
    // Expose env directly on locals for our supa function
    context.locals.env = runtime.env;
  }
  
  return next();
});

// Chain middleware: Clerk first, then Cloudflare env setup
export const onRequest = sequence(clerk, cloudflareEnvMiddleware);

