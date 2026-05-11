import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

export function createBrowserSupabaseClient() {
  const { url, publicKey } = getSupabasePublicEnv();
  return createBrowserClient(url, publicKey);
}
