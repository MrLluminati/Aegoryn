"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Panel, fieldClassName, primaryButtonClassName } from "../../components/brand/AppShell";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function redirectIfSignedIn() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/chat");
      }
    }

    redirectIfSignedIn();
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Check Supabase URL, publishable key, network, and dev-server restart."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Access"
      title="Sign in"
      subtitle="Sign in with email and password to open Aego and the private dashboard. Google login is planned for a later production-auth stage."
      maxWidthClassName="max-w-2xl"
    >
      <Panel>
        <form className="space-y-5" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-sm text-white/60">Email</span>
            <input
              className={fieldClassName}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/60">Password</span>
            <input
              className={fieldClassName}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {message ? <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{message}</p> : null}

          <button className={`${primaryButtonClassName} w-full`} type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in and open Aego"}
          </button>
        </form>
      </Panel>
    </AppShell>
  );
}
