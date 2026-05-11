import type { SupabaseClient, User } from "@supabase/supabase-js";

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
}

export async function ensureUserProfile(supabase: SupabaseClient, user: Pick<User, "id">) {
  const { error } = await supabase.from("users_profile").upsert(
    {
      user_id: user.id,
      currency: "INR",
      timezone: getLocalTimezone()
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true
    }
  );

  if (error) {
    throw new Error(`Profile setup failed: ${error.message}`);
  }
}
