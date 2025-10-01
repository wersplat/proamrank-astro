import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db.types";

// For Cloudflare Pages runtime
type RuntimeEnv = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

export function supa(runtime?: { env?: RuntimeEnv }) {
  // Try runtime env first (Cloudflare Pages), fallback to import.meta.env (local dev)
  const supabaseUrl = runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const supabaseKey = runtime?.env?.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseKey,
    { auth: { persistSession: false } }
  );
}
