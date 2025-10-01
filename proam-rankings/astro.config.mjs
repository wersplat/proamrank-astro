import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [tailwind(), react()],
  // Server mode for SSR on Cloudflare Pages
  output: "server",
  adapter: cloudflare(),
});
