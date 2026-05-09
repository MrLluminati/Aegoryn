import { hasSupabasePublicEnv } from "../../../lib/supabase/env";

export default function SupabaseSetupPage() {
  const isConfigured = hasSupabasePublicEnv();

  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS Setup</p>
        <h1 className="mt-3 text-4xl font-semibold">Supabase Connection Status</h1>
        <p className="mt-3 text-white/60">
          This page checks whether the public Supabase environment values are available to the app.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-6">
          <p className="text-sm text-white/50">Current status</p>
          <p className={isConfigured ? "mt-2 text-2xl font-semibold text-aegoryn-gold" : "mt-2 text-2xl font-semibold text-red-300"}>
            {isConfigured ? "Supabase public environment is configured." : "Supabase public environment is not configured."}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/55">
            Add the required values to your local `.env.local` file, then restart the dev server. Do not commit real environment values to GitHub.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-aegoryn-gold">Required values</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
