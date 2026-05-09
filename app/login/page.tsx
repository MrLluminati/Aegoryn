"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <section className="mx-auto mt-20 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS</p>
        <h1 className="mt-3 text-4xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Sign in with the Supabase test user to view protected dashboard data.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-sm text-white/60">Email</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/60">Password</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {message ? <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{message}</p> : null}

          <button
            className="w-full rounded-full bg-aegoryn-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
