import { defineMiddleware } from "astro:middleware";

// Middleware to expose Cloudflare environment to Astro.locals
// Note: Sentry middleware is automatically injected by the @sentry/astro integration
export const onRequest = defineMiddleware(async (context, next) => {
  // In Cloudflare Pages with Astro adapter, runtime exposes the env
  // Make it available to our pages
  const runtime = (context.locals as any).runtime;
  
  if (runtime?.env) {
    // Expose env directly on locals for our supa function
    (context.locals as any).env = runtime.env;
  }
  
  return next();
});

