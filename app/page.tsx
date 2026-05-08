import Link from "next/link";
import { Shield, MessageSquareText, WalletCards, ListChecks } from "lucide-react";

const modules = [
  {
    title: "Chat Assistant",
    description: "Enter natural-language updates and let Aego classify them into structured records.",
    icon: MessageSquareText
  },
  {
    title: "Account Ledger",
    description: "Track accounts, transactions, money buckets, and monthly summaries.",
    icon: WalletCards
  },
  {
    title: "Tasks & Projects",
    description: "Convert reminders, workstreams, and goals into organized action records.",
    icon: ListChecks
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-aegoryn-black text-aegoryn-parchment">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <nav className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-aegoryn-gold/50 bg-aegoryn-charcoal shadow-lg">
              <Shield className="h-5 w-5 text-aegoryn-gold" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS</p>
              <p className="text-xs text-white/55">Guard your records. Command your life.</p>
            </div>
          </div>
          <Link href="/dashboard" className="rounded-full border border-aegoryn-gold/50 px-4 py-2 text-sm text-aegoryn-gold transition hover:bg-aegoryn-gold hover:text-black">
            Open Dashboard
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-aegoryn-gold">Private AI Command System</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
              Turn scattered life updates into structured records.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              AegorynOS is being built as an AI-first personal assistant that understands natural-language updates, asks for missing details, and organizes money, tasks, projects, and records into a clear dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-full bg-aegoryn-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-white">
                View MVP Dashboard
              </Link>
              <Link href="/chat" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-aegoryn-gold hover:text-aegoryn-gold">
                Open Chat Shell
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
            <div className="rounded-[1.5rem] border border-aegoryn-gold/20 bg-black/35 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-aegoryn-gold">Example Command</p>
              <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-white/75">
                I received ₹3,000 pocket money in Kotak on 07.05.2026 and spent ₹421 on petrol from pocket money.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-aegoryn-charcoal p-4 text-sm text-white/70">
                <p className="text-aegoryn-gold">Aego will classify this as account management.</p>
                <p className="mt-2">Then it can create income, expense, bucket, and account-ledger records after validation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pb-8 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <Icon className="h-6 w-6 text-aegoryn-gold" />
                <h2 className="mt-4 text-lg font-semibold">{module.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">{module.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
