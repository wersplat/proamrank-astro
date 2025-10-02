import { defineMiddleware } from "astro:middleware";

// Middleware to expose Cloudflare environment to Astro.locals
export const onRequest = defineMiddleware((context, next) => {
  // In Cloudflare Pages with Astro adapter, runtime exposes the env
  // Make it available to our pages
  const runtime = context.locals.runtime as any;
  
  if (runtime?.env) {
    // Expose env directly on locals for our supa function
    context.locals.env = runtime.env;
  }
  
  return next();
});

