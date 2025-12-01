import { clerkMiddleware } from "@clerk/astro/server";
import { defineMiddleware, sequence } from "astro:middleware";

// Clerk middleware for authentication
// Note: No routes are protected - Clerk middleware authenticates users but doesn't restrict access
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

// Chain middleware: Clerk first (authenticates but doesn't restrict), then Cloudflare env setup
export const onRequest = sequence(clerk, cloudflareEnvMiddleware);

