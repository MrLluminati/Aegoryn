import { MessageSquareText, WalletCards, ListChecks, BarChart3 } from "lucide-react";
import { AppShell, NavPill, Panel } from "../components/brand/AppShell";

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
    title: "Visual Analysis",
    description: "Turn records into charts, trends, and AI-readable insight summaries.",
    icon: BarChart3
  },
  {
    title: "Tasks & Projects",
    description: "Convert reminders, workstreams, and goals into organized action records.",
    icon: ListChecks
  }
];

export default function HomePage() {
  return (
    <AppShell
      eyebrow="Private AI Command System"
      title="Turn scattered life updates into structured records."
      subtitle="AegorynOS is an AI-first personal assistant that classifies natural-language updates, asks for missing details, and organizes money, tasks, projects, and records into a private command dashboard."
      actions={
        <>
          <NavPill href="/chat">Chat</NavPill>
          <NavPill href="/dashboard" variant="primary">Open Dashboard</NavPill>
        </>
      }
    >
      <section className="grid items-stretch gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Panel className="flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Aego Command</p>
            <p className="mt-5 rounded-2xl bg-black/35 p-5 text-sm leading-7 text-white/75">
              I received ₹3,000 pocket money in Kotak on 07.05.2026 and spent ₹421 on petrol from pocket money.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-aegoryn-gold/20 bg-aegoryn-charcoal p-5 text-sm leading-6 text-white/70">
            <p className="font-medium text-aegoryn-gold">Aego will classify this as account management.</p>
            <p className="mt-2">Then it can create income, expense, bucket, and account-ledger records after validation.</p>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">MVP Principle</p>
          <h2 className="mt-3 text-2xl font-semibold">Chat first. Manual fallback only.</h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Forms are available for verification and correction, but the long-term product experience is data-dumping into chat and automatic structuring into the correct dashboard areas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NavPill href="/accounts">Ledger</NavPill>
            <NavPill href="/login">Login</NavPill>
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10">
              <Icon className="h-6 w-6 text-aegoryn-gold" />
              <h2 className="mt-4 text-lg font-semibold">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{module.description}</p>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
