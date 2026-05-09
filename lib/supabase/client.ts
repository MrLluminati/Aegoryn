import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./env";

export function createBrowserSupabaseClient() {
  const { url, publicKey } = getSupabasePublicEnv();
  return createClient(url, publicKey);
}
