"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, MetricCard, NavPill, Panel, StatusPanel, secondaryButtonClassName } from "../../components/brand/AppShell";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import type { Account, MoneyBucket, Transaction } from "../../lib/supabase/types";

const tasks = [
  "Build protected dashboard route",
  "Create account ledger UI",
  "Build chat parser endpoint",
  "Test RLS with another user"
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [buckets, setBuckets] = useState<MoneyBucket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("Loading dashboard records...");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createBrowserSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setStatus("Not signed in. Sign in to load Supabase dashboard records.");
        setIsSignedIn(false);
        return;
      }

      setIsSignedIn(true);

      const [accountsResult, bucketsResult, transactionsResult] = await Promise.all([
        supabase.from("accounts").select("*").order("is_primary", { ascending: false }).order("account_name"),
        supabase.from("money_buckets").select("*").order("bucket_month", { ascending: false }),
        supabase.from("transactions").select("*").order("transaction_date", { ascending: false }).limit(10)
      ]);

      const firstError = accountsResult.error || bucketsResult.error || transactionsResult.error;

      if (firstError) {
        setStatus(firstError.message);
        return;
      }

      setAccounts((accountsResult.data ?? []) as Account[]);
      setBuckets((bucketsResult.data ?? []) as MoneyBucket[]);
      setTransactions((transactionsResult.data ?? []) as Transaction[]);
      setStatus("Connected to Supabase.");
    }

    loadDashboard();
  }, []);

  const pocketMoney = useMemo(() => buckets.find((bucket) => bucket.bucket_name === "Pocket Money"), [buckets]);
  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + Number(account.current_balance), 0),
    [accounts]
  );
  const pocketSpent = useMemo(() => {
    if (!pocketMoney) {
      return 0;
    }

    return transactions
      .filter((transaction) => transaction.money_bucket_id === pocketMoney.id && transaction.transaction_type === "expense")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [pocketMoney, transactions]);
  const savingsTillNow = totalBalance - Number(pocketMoney?.current_balance ?? 0);

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <AppShell
      eyebrow="AegorynOS MVP"
      title="Dashboard"
      subtitle="Supabase-connected private assistant dashboard for records, money buckets, transactions, and next actions."
      actions={
        <>
          <NavPill href="/chat">Chat</NavPill>
          <NavPill href="/accounts">Accounts</NavPill>
          <div className="rounded-full border border-aegoryn-gold/40 px-4 py-2 text-sm text-aegoryn-gold">v0.1.3</div>
          {isSignedIn ? (
            <button className={secondaryButtonClassName} onClick={handleSignOut}>Sign out</button>
          ) : (
            <NavPill href="/login" variant="primary">Sign in</NavPill>
          )}
        </>
      }
    >
      <StatusPanel label="Connection status" value={status} />

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Savings Till Now"
          value={currencyFormatter.format(savingsTillNow)}
          note="Total balance minus pocket money"
        />
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <MetricCard
              key={account.id}
              label={account.account_name}
              value={currencyFormatter.format(Number(account.current_balance))}
              note={account.is_primary ? "Primary account" : account.notes || "Secondary account"}
            />
          ))
        ) : (
          <Panel className="md:col-span-3">
            <p className="text-sm text-white/55">No account records loaded yet.</p>
          </Panel>
        )}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Panel>
          <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Pocket Money</p>
          <h2 className="mt-3 text-2xl font-semibold">{pocketMoney?.bucket_month || "No bucket loaded"}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-white/50">Received</p>
              <p className="mt-2 text-xl font-semibold">{currencyFormatter.format(Number(pocketMoney?.starting_amount ?? 0))}</p>
            </div>
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-white/50">Spent</p>
              <p className="mt-2 text-xl font-semibold">{currencyFormatter.format(pocketSpent)}</p>
            </div>
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-white/50">Remaining</p>
              <p className="mt-2 text-xl font-semibold text-aegoryn-gold">{currencyFormatter.format(Number(pocketMoney?.current_balance ?? 0))}</p>
            </div>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Next Tasks</p>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {tasks.map((task) => (
              <li key={task} className="rounded-2xl bg-black/30 p-3">{task}</li>
            ))}
          </ul>
        </Panel>
      </section>

      <Panel className="mt-6">
        <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Recent Transactions</p>
        <div className="mt-4 space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col justify-between gap-2 rounded-2xl bg-black/30 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-medium">{transaction.description || transaction.category || transaction.transaction_type}</p>
                  <p className="mt-1 text-xs text-white/45">{transaction.transaction_date} · {transaction.transaction_type}</p>
                </div>
                <p className="text-lg font-semibold text-aegoryn-gold">{currencyFormatter.format(Number(transaction.amount))}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/55">No transaction records loaded yet.</p>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
