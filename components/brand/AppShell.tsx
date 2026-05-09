import Link from "next/link";
import { Shield } from "lucide-react";
import type { ReactNode } from "react";

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

type AppShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidthClassName?: string;
};

export function AppShell({ eyebrow = "AegorynOS", title, subtitle, children, actions, maxWidthClassName = "max-w-6xl" }: AppShellProps) {
  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className={`mx-auto ${maxWidthClassName}`}>
        <header className="mb-8 border-b border-white/10 pb-6">
          <nav className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <BrandLockup />
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          </nav>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55 md:text-base">{subtitle}</p> : null}
          </div>
        </header>
        {children}
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
