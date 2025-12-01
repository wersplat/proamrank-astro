import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import sentry from "@sentry/astro";

export default defineConfig({
  integrations: [
    sentry({
      sourceMapsUploadOptions: {
        enabled: true,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "bodegacatsgc",
        project: "proamrank",
      },
    }),
    tailwind(),
    react(),
  ],
  // Server mode for SSR on Cloudflare Pages
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
  // Configure image service to compile at build time for Cloudflare compatibility
  imageService: "compile",
});
