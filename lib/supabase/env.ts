export type SupabasePublicEnv = {
  url: string;
  publicKey: string;
};

function isPlaceholder(value: string): boolean {
  return value.toLowerCase().includes("replace_with") || value.toLowerCase().includes("your_");
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publicKey) {
    throw new Error("Missing Supabase public environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.");
  }

  if (isPlaceholder(url) || !isValidHttpUrl(url)) {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL. It must be the real Supabase Project URL beginning with https://.");
  }

  if (isPlaceholder(publicKey)) {
    throw new Error("Invalid Supabase public key. Replace the placeholder with the real publishable key or legacy anon key.");
  }

  return { url, publicKey };
}

export function getSupabasePublicEnvStatus(): { isConfigured: boolean; message: string } {
  try {
    getSupabasePublicEnv();
    return { isConfigured: true, message: "Supabase public environment is configured." };
  } catch (error) {
    return {
      isConfigured: false,
      message: error instanceof Error ? error.message : "Supabase public environment is not configured."
    };
  }
}

export function hasSupabasePublicEnv(): boolean {
  return getSupabasePublicEnvStatus().isConfigured;
}
