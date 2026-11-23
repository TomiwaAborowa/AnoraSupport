import { createClient } from "@supabase/supabase-js";

export const SONGS_BUCKET = process.env.SUPABASE_SONGS_BUCKET || "songs";

// Server-only client. Uses the service role key so it can create signed URLs for the private bucket.
// Never import this file from a client component.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(url, key, { auth: { persistSession: false } });
}
