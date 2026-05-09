"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Shield } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import { APP_VERSION } from "../../lib/version";

type SessionUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export function AegorynMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-aegoryn-gold/50 bg-aegoryn-charcoal shadow-lg shadow-black/30">
      <Shield className="h-5 w-5 text-aegoryn-gold" />
    </div>
  );
}

export function BrandLockup() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <AegorynMark />
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS</p>
        <p className="text-xs text-white/55">Guard your records. Command your life.</p>
      </div>
    </Link>
  );
}

function getInitial(user: SessionUser | null): string {
  const email = user?.email || "";
  return email.trim().charAt(0).toUpperCase() || "A";
}

type AuthNavbarProps = {
  variant?: "landing" | "app";
};

export function AuthNavbar({ variant = "app" }: AuthNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setUser((data.session?.user as SessionUser | undefined) ?? null);
      setIsLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as SessionUser | undefined) ?? null);
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = Boolean(user);
  const profileLabel = useMemo(() => getInitial(user), [user]);

  async function handleTryAego() {
    router.push(isLoggedIn ? "/chat" : "/login");
  }

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const appLinks = [
    { href: "/chat", label: "Chat" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/accounts", label: "Accounts" }
  ];

  const profileLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
    { href: "/usage", label: "Usage" }
  ];

  return (
    <nav className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <BrandLockup />
      <div className="flex flex-wrap items-center gap-3">
        {!isLoading && isLoggedIn ? (
          <>
            {appLinks.map((link) => (
              <Link
                key={link.href}
                className={
                  pathname === link.href
                    ? "rounded-full border border-aegoryn-gold/60 px-4 py-2 text-sm text-aegoryn-gold"
                    : "rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold"
                }
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <span className="rounded-full border border-aegoryn-gold/40 px-4 py-2 text-sm text-aegoryn-gold">{APP_VERSION}</span>
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-white/75 transition hover:border-aegoryn-gold hover:text-aegoryn-gold"
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-aegoryn-gold text-xs font-bold text-black">{profileLabel}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isMenuOpen ? (
                <div className="absolute right-0 z-20 mt-3 w-56 rounded-3xl border border-white/10 bg-[#090909] p-3 shadow-2xl shadow-black/50">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-aegoryn-gold">Signed in</p>
                    <p className="mt-1 truncate text-sm text-white/65">{user?.email}</p>
                  </div>
                  {profileLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      className={`${index === 0 ? "mt-2 " : ""}flex rounded-2xl px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-aegoryn-gold`}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button className="mt-2 flex w-full rounded-2xl px-3 py-2 text-left text-sm text-white/65 hover:bg-white/5 hover:text-aegoryn-gold" onClick={handleSignOut} type="button">
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            {variant === "landing" ? <Link className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold" href="#features">Features</Link> : null}
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold" href="/login">Login</Link>
            <button className="rounded-full bg-aegoryn-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-white" onClick={handleTryAego} type="button">
              Try Aego
            </button>
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/45">{APP_VERSION}</span>
          </>
        )}
      </div>
    </nav>
  );
}

type AppShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidthClassName?: string;
  navVariant?: "landing" | "app";
};

export function AppShell({ eyebrow = "AegorynOS", title, subtitle, children, actions, maxWidthClassName = "max-w-6xl", navVariant = "app" }: AppShellProps) {
  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className={`mx-auto ${maxWidthClassName}`}>
        <header className="mb-8 border-b border-white/10 pb-6">
          {actions ? (
            <nav className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <BrandLockup />
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            </nav>
          ) : (
            <AuthNavbar variant={navVariant} />
          )}
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55 md:text-base">{subtitle}</p> : null}
          </div>
        </header>
        {children}
        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/35">
          <span>{APP_VERSION}</span>
        </footer>
      </div>
    </main>
  );
}

type NavPillProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function NavPill({ href, children, variant = "secondary" }: NavPillProps) {
  const className =
    variant === "primary"
      ? "rounded-full bg-aegoryn-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-white"
      : "rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold";

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className = "" }: PanelProps) {
  return <section className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/10 ${className}`}>{children}</section>;
}

type MetricCardProps = {
  label: string;
  value: string;
  note?: string;
};

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {note ? <p className="mt-2 text-sm text-aegoryn-gold">{note}</p> : null}
    </article>
  );
}

export function StatusPanel({ label = "Status", value }: { label?: string; value: string }) {
  return (
    <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-lg font-semibold text-aegoryn-gold">{value}</p>
    </section>
  );
}

export const fieldClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-aegoryn-gold";

export const primaryButtonClassName =
  "rounded-full bg-aegoryn-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClassName =
  "rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold disabled:cursor-not-allowed disabled:opacity-60";
