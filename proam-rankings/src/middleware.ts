import { clerkMiddleware } from "@clerk/astro/server";
import { defineMiddleware, sequence } from "astro:middleware";

// Clerk middleware for authentication
// Note: No routes are protected - Clerk middleware authenticates users but doesn't restrict access
// Clerk middleware reads from import.meta.env which Astro populates from Cloudflare Pages env vars
let clerk: ReturnType<typeof clerkMiddleware>;
try {
  clerk = clerkMiddleware();
} catch (error) {
  // If Clerk middleware fails to initialize, use no-op middleware
  console.error("Clerk middleware initialization error:", error);
  clerk = defineMiddleware(async (context, next) => {
    return next();
  }) as any;
}

// Middleware to expose Cloudflare environment to Astro.locals and set Clerk env vars
// Note: Sentry middleware is automatically injected by the @sentry/astro integration
const cloudflareEnvMiddleware = defineMiddleware(async (context, next) => {
  // In Cloudflare Pages with Astro adapter, runtime exposes the env
  // Make it available to our pages
  const runtime = context.locals.runtime as any;
  
  if (runtime?.env) {
    // Expose env directly on locals for our supa function
    context.locals.env = runtime.env;
    
    // Also set on process.env for any libraries that need it at runtime
    if (runtime.env.PUBLIC_CLERK_PUBLISHABLE_KEY) {
      process.env.PUBLIC_CLERK_PUBLISHABLE_KEY = runtime.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
    }
    if (runtime.env.CLERK_SECRET_KEY) {
      process.env.CLERK_SECRET_KEY = runtime.env.CLERK_SECRET_KEY;
    }
  }
  
  return next();
});

// Chain middleware: Clerk first (authenticates but doesn't restrict), then Cloudflare env setup
export const onRequest = sequence(clerk, cloudflareEnvMiddleware);

