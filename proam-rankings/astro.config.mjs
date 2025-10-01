import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwind(), react()],
  // Static output fits public site best. If you later want Edge SSR, switch to:
  // output: "server",
  // adapter: (await import("@astrojs/cloudflare")).default(),
});
