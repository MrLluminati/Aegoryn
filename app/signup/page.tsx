"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell, Panel, fieldClassName, primaryButtonClassName } from "../../components/brand/AppShell";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import { ensureUserProfile } from "../../lib/supabase/profile";

function getSafeNextPath(): string {
  const params = new URLSearchParams(window.location.search);
  const nextPath = params.get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/chat";
  }

  return nextPath;
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function redirectIfSignedIn() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(getSafeNextPath());
      }
    }

    redirectIfSignedIn();
  }, [router]);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const normalizedEmail = email.trim();

    if (password.length < 6) {
      setMessage("Use a password with at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session && data.user) {
        await ensureUserProfile(supabase, data.user);
        router.push(getSafeNextPath());
        router.refresh();
        return;
      }

      setIsSuccess(true);
      setMessage("Account created. Check your email to confirm it, then sign in.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Sign-up failed. Check Supabase URL, publishable key, network, and dev-server restart."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Access"
      title="Create account"
      subtitle="Create a private alpha account with email and password. Google login remains deferred until the production-auth stage."
      maxWidthClassName="max-w-2xl"
    >
      <Panel>
        <form className="space-y-5" onSubmit={handleSignup}>
          <label className="block">
            <span className="text-sm text-white/60">Email</span>
            <input
              autoComplete="email"
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
              autoComplete="new-password"
              className={fieldClassName}
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/60">Confirm password</span>
            <input
              autoComplete="new-password"
              className={fieldClassName}
              minLength={6}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {message ? (
            <p className={isSuccess ? "rounded-2xl border border-aegoryn-gold/30 bg-aegoryn-gold/10 p-4 text-sm text-aegoryn-gold" : "rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"}>
              {message}
            </p>
          ) : null}

          <button className={`${primaryButtonClassName} w-full`} type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-white/50">
            Already have access?{" "}
            <Link className="text-aegoryn-gold transition hover:text-white" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </Panel>
    </AppShell>
  );
}
