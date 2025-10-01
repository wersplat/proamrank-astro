export const onRequest: PagesFunction<{ R2_BUCKET: R2Bucket }> = async (ctx) => {
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
};
