import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db.types";

// For Cloudflare Pages runtime
type RuntimeEnv = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

export function supa(locals?: { env?: RuntimeEnv; runtime?: any }) {
  // Try locals.env first (set by middleware), then runtime, then import.meta.env (local dev)
  const supabaseUrl = 
    locals?.env?.SUPABASE_URL || 
    locals?.runtime?.env?.SUPABASE_URL || 
    import.meta.env.SUPABASE_URL;
    
  const supabaseKey = 
    locals?.env?.SUPABASE_ANON_KEY || 
    locals?.runtime?.env?.SUPABASE_ANON_KEY || 
    import.meta.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const hasRuntimeEnv = !!locals?.runtime?.env;
    const hasLocalsEnv = !!locals?.env;
    const hasImportMetaEnv = !!(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_ANON_KEY);
    
    throw new Error(
      `Missing Supabase environment variables. ` +
      `Debug: hasRuntimeEnv=${hasRuntimeEnv}, hasLocalsEnv=${hasLocalsEnv}, hasImportMetaEnv=${hasImportMetaEnv}`
    );
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseKey,
    { auth: { persistSession: false } }
  );
}
