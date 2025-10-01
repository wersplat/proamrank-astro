import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db.types";

export function supa() {
  return createClient<Database>(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
