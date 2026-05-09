"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS MVP</p>
            <h1 className="mt-3 text-4xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-white/55">Supabase-connected private assistant dashboard.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-aegoryn-gold hover:text-aegoryn-gold" href="/accounts">
              Accounts
            </Link>
            <div className="rounded-full border border-aegoryn-gold/40 px-4 py-2 text-sm text-aegoryn-gold">
              v0.1.3-account-ledger
            </div>
            {isSignedIn ? (
              <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-aegoryn-gold hover:text-aegoryn-gold" onClick={handleSignOut}>
                Sign out
              </button>
            ) : (
              <Link className="rounded-full bg-aegoryn-gold px-4 py-2 text-sm font-semibold text-black hover:bg-white" href="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/50">Connection status</p>
          <p className="mt-2 text-lg font-semibold text-aegoryn-gold">{status}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/50">Savings Till Now</p>
            <p className="mt-3 text-3xl font-semibold">{currencyFormatter.format(savingsTillNow)}</p>
            <p className="mt-2 text-sm text-aegoryn-gold">Total balance minus pocket money</p>
          </article>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <article key={account.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">{account.account_name}</p>
                <p className="mt-3 text-3xl font-semibold">{currencyFormatter.format(Number(account.current_balance))}</p>
                <p className="mt-2 text-sm text-aegoryn-gold">{account.is_primary ? "Primary account" : account.notes || "Secondary account"}</p>
              </article>
            ))
          ) : (
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:col-span-3">
              <p className="text-sm text-white/55">No account records loaded yet.</p>
            </article>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
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

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
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
        </section>
      </div>
    </main>
  );
}
