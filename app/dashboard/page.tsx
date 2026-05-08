const accounts = [
  { name: "Kotak Mahindra Bank", balance: "₹6,010.48", note: "Primary account" },
  { name: "Axis Bank", balance: "-₹6.94", note: "Needs adjustment" },
  { name: "SBI", balance: "₹38.20", note: "Secondary account" }
];

const tasks = [
  "Create Supabase project",
  "Add database migrations",
  "Build chat parser endpoint",
  "Create account ledger UI"
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS MVP</p>
            <h1 className="mt-3 text-4xl font-semibold">Dashboard Shell</h1>
            <p className="mt-2 text-white/55">Static scaffold for the first private assistant dashboard.</p>
          </div>
          <div className="rounded-full border border-aegoryn-gold/40 px-4 py-2 text-sm text-aegoryn-gold">
            v0.1.0-mvp-start
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {accounts.map((account) => (
            <article key={account.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/50">{account.name}</p>
              <p className="mt-3 text-3xl font-semibold">{account.balance}</p>
              <p className="mt-2 text-sm text-aegoryn-gold">{account.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Pocket Money</p>
            <h2 className="mt-3 text-2xl font-semibold">May 2026</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-white/50">Received</p>
                <p className="mt-2 text-xl font-semibold">₹3,000</p>
              </div>
              <div className="rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-white/50">Spent</p>
                <p className="mt-2 text-xl font-semibold">₹421</p>
              </div>
              <div className="rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-white/50">Remaining</p>
                <p className="mt-2 text-xl font-semibold text-aegoryn-gold">₹2,579</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Next Tasks</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              {tasks.map((task) => (
                <li key={task} className="rounded-2xl bg-black/30 p-3">{task}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
