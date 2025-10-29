/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly PUBLIC_ASSETS_BASE?: string; // e.g. https://cdn.proamrank.gg (optional)
  readonly PUBLIC_BADGES_BASE_URL?: string; // Badge CDN URL, defaults to https://badges.proamrank.gg
}
