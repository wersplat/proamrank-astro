import * as Sentry from '@sentry/cloudflare';

// Initialize Sentry
Sentry.init({
  dsn: "https://15ecc8d420bd1ac21d6ca88698ca4566@o4509330775277568.ingest.us.sentry.io/4510164326023168",
  environment: "production",
  tracesSampleRate: 1.0,
});

export const onRequest: PagesFunction<{ R2_BUCKET: R2Bucket }> = async (ctx) => {
  try {
    const url = new URL(ctx.request.url);
    if (ctx.request.method !== "PUT") return new Response("Method Not Allowed", { status: 405 });

    const key = url.searchParams.get("key");
    if (!key) return new Response("Missing key", { status: 400 });

    const ct = ctx.request.headers.get("content-type") || "application/octet-stream";
    if (!/^image\/(png|jpe?g|webp)$/i.test(ct)) return new Response("Invalid type", { status: 400 });

    // Optional: size cap
    const len = Number(ctx.request.headers.get("content-length") || "0");
    if (len && len > 5 * 1024 * 1024) return new Response("Too large", { status: 413 });

    await ctx.env.R2_BUCKET.put(key, ctx.request.body, {
      httpMetadata: { contentType: ct },
      // customMetadata: { gameId: "..." } // you can add later by passing it via query or JSON
    });

    return new Response("OK", { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
