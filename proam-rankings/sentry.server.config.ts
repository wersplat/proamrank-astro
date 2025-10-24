import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://15ecc8d420bd1ac21d6ca88698ca4566@o4509330775277568.ingest.us.sentry.io/4510164326023168",
  environment: "production",
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  
  // Enable additional debugging information
  debug: false,
});

