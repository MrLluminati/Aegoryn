"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import type { Account, MoneyBucket, Transaction } from "../../lib/supabase/types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const today = new Date().toISOString().slice(0, 10);

type FormState = {
  transactionDate: string;
  transactionType: "income" | "expense";
  amount: string;
  category: string;
  accountId: string;
  moneyBucketId: string;
  description: string;
  sourceText: string;
};

const initialFormState: FormState = {
  transactionDate: today,
  transactionType: "expense",
  amount: "",
  category: "",
  accountId: "",
  moneyBucketId: "",
  description: "",
  sourceText: ""
};

function getBalanceDelta(type: "income" | "expense" | "transfer", amount: number): number {
  if (type === "income") {
    return amount;
  }

  if (type === "expense") {
    return -amount;
  }

  return 0;
}

function getReversalType(type: "income" | "expense" | "transfer"): "income" | "expense" | "transfer" {
  if (type === "income") {
    return "expense";
  }

  if (type === "expense") {
    return "income";
  }

  return "transfer";
}

function isReversalTransaction(transaction: Transaction): boolean {
  return (
    transaction.category === "reversal" ||
    Boolean(transaction.description?.toLowerCase().includes("reversal")) ||
    Boolean(transaction.source_text?.toLowerCase().includes("reversal"))
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [buckets, setBuckets] = useState<MoneyBucket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("Loading account ledger...");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reversingId, setReversingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  async function loadLedger() {
    const supabase = createBrowserSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setStatus("Not signed in. Sign in to manage account ledger records.");
      setIsSignedIn(false);
      return;
    }

    setIsSignedIn(true);

    const [accountsResult, bucketsResult, transactionsResult] = await Promise.all([
      supabase.from("accounts").select("*").order("is_primary", { ascending: false }).order("account_name"),
      supabase.from("money_buckets").select("*").order("bucket_month", { ascending: false }),
      supabase.from("transactions").select("*").order("transaction_date", { ascending: false }).order("created_at", { ascending: false })
    ]);

    const firstError = accountsResult.error || bucketsResult.error || transactionsResult.error;

    if (firstError) {
      setStatus(firstError.message);
      return;
    }

    const loadedAccounts = (accountsResult.data ?? []) as Account[];
    const loadedBuckets = (bucketsResult.data ?? []) as MoneyBucket[];

    setAccounts(loadedAccounts);
    setBuckets(loadedBuckets);
    setTransactions((transactionsResult.data ?? []) as Transaction[]);
    setForm((current) => ({
      ...current,
      accountId: current.accountId || loadedAccounts[0]?.id || "",
      moneyBucketId: current.moneyBucketId || loadedBuckets[0]?.id || ""
    }));
    setStatus("Connected to Supabase.");
  }

  useEffect(() => {
    loadLedger();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + Number(account.current_balance), 0),
    [accounts]
  );

  const selectedBucket = useMemo(
    () => buckets.find((bucket) => bucket.id === form.moneyBucketId),
    [buckets, form.moneyBucketId]
  );

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSaving(true);

    try {
      const amount = Number(form.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        setStatus("Enter a valid amount greater than zero.");
        return;
      }

      if (!form.accountId) {
        setStatus("Select an account before saving the transaction.");
        return;
      }

      const supabase = createBrowserSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setStatus("Session expired. Sign in again.");
        setIsSignedIn(false);
        return;
      }

      const selectedAccount = accounts.find((account) => account.id === form.accountId);
      const balanceDelta = getBalanceDelta(form.transactionType, amount);

      const insertResult = await supabase.from("transactions").insert({
        user_id: sessionData.session.user.id,
        transaction_date: form.transactionDate,
        transaction_type: form.transactionType,
        amount,
        category: form.category || null,
        account_id: form.accountId,
        money_bucket_id: form.moneyBucketId || null,
        description: form.description || null,
        source_text: form.sourceText || null
      });

      if (insertResult.error) {
        setStatus(insertResult.error.message);
        return;
      }

      if (selectedAccount) {
        const accountUpdate = await supabase
          .from("accounts")
          .update({ current_balance: Number(selectedAccount.current_balance) + balanceDelta })
          .eq("id", selectedAccount.id);

        if (accountUpdate.error) {
          setStatus(accountUpdate.error.message);
          return;
        }
      }

      if (selectedBucket && form.moneyBucketId) {
        const bucketUpdate = await supabase
          .from("money_buckets")
          .update({ current_balance: Number(selectedBucket.current_balance) + balanceDelta })
          .eq("id", selectedBucket.id);

        if (bucketUpdate.error) {
          setStatus(bucketUpdate.error.message);
          return;
        }
      }

      setForm((current) => ({
        ...initialFormState,
        accountId: current.accountId,
        moneyBucketId: current.moneyBucketId,
        transactionDate: today
      }));
      setStatus("Transaction saved and balances updated.");
      await loadLedger();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save transaction.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReverseTransaction(transaction: Transaction) {
    if (isReversalTransaction(transaction)) {
      setStatus("This transaction already appears to be a reversal entry. Create a fresh correction instead.");
      return;
    }

    const confirmed = window.confirm(
      "Create a reversal entry for this transaction? The original record will be preserved for audit history."
    );

    if (!confirmed) {
      return;
    }

    setReversingId(transaction.id);
    setStatus("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setStatus("Session expired. Sign in again.");
        setIsSignedIn(false);
        return;
      }

      const amount = Number(transaction.amount);
      const reversalType = getReversalType(transaction.transaction_type);
      const account = accounts.find((item) => item.id === transaction.account_id);
      const bucket = buckets.find((item) => item.id === transaction.money_bucket_id);
      const reversalDelta = getBalanceDelta(reversalType, amount);

      const reversalResult = await supabase.from("transactions").insert({
        user_id: sessionData.session.user.id,
        transaction_date: today,
        transaction_type: reversalType,
        amount,
        category: "reversal",
        account_id: transaction.account_id,
        money_bucket_id: transaction.money_bucket_id,
        description: `Reversal of: ${transaction.description || transaction.category || transaction.transaction_type}`,
        source_text: `Reversal entry created to preserve audit history. Original transaction id: ${transaction.id}. Original note: ${transaction.source_text || "N/A"}`
      });

      if (reversalResult.error) {
        setStatus(reversalResult.error.message);
        return;
      }

      if (account) {
        const accountUpdate = await supabase
          .from("accounts")
          .update({ current_balance: Number(account.current_balance) + reversalDelta })
          .eq("id", account.id);

        if (accountUpdate.error) {
          setStatus(accountUpdate.error.message);
          return;
        }
      }

      if (bucket) {
        const bucketUpdate = await supabase
          .from("money_buckets")
          .update({ current_balance: Number(bucket.current_balance) + reversalDelta })
          .eq("id", bucket.id);

        if (bucketUpdate.error) {
          setStatus(bucketUpdate.error.message);
          return;
        }
      }

      setStatus("Reversal entry created and balances adjusted. Original transaction preserved.");
      await loadLedger();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to reverse transaction.");
    } finally {
      setReversingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">AegorynOS Ledger</p>
            <h1 className="mt-3 text-4xl font-semibold">Accounts</h1>
            <p className="mt-2 text-white/55">Manage accounts, money buckets, and manual transactions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-aegoryn-gold hover:text-aegoryn-gold" href="/dashboard">
              Dashboard
            </Link>
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

        <section className="mb-6 rounded-3xl border border-aegoryn-gold/20 bg-aegoryn-gold/[0.05] p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Ledger Safety Rule</p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Transactions are not silently deleted. Incorrect entries should be corrected through reversal entries so the audit trail remains intact.
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:col-span-1">
            <p className="text-sm text-white/50">Total balance</p>
            <p className="mt-3 text-3xl font-semibold">{currencyFormatter.format(totalBalance)}</p>
          </article>
          {accounts.map((account) => (
            <article key={account.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/50">{account.account_name}</p>
              <p className="mt-3 text-3xl font-semibold">{currencyFormatter.format(Number(account.current_balance))}</p>
              <p className="mt-2 text-sm text-aegoryn-gold">{account.is_primary ? "Primary account" : account.notes || "Secondary account"}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Manual Entry</p>
            <h2 className="mt-3 text-2xl font-semibold">Add transaction</h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-white/60">Date</span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                    type="date"
                    value={form.transactionDate}
                    onChange={(event) => setForm({ ...form, transactionDate: event.target.value })}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-white/60">Type</span>
                  <select
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                    value={form.transactionType}
                    onChange={(event) => setForm({ ...form, transactionType: event.target.value as FormState["transactionType"] })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-white/60">Amount</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Account</span>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  value={form.accountId}
                  onChange={(event) => setForm({ ...form, accountId: event.target.value })}
                  required
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.account_name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Money bucket</span>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  value={form.moneyBucketId}
                  onChange={(event) => setForm({ ...form, moneyBucketId: event.target.value })}
                >
                  <option value="">No bucket</option>
                  {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>{bucket.bucket_name} {bucket.bucket_month ? `(${bucket.bucket_month})` : ""}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Category</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="petrol, groceries, pocket_money"
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Description</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Short ledger description"
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Original text / note</span>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-aegoryn-gold"
                  value={form.sourceText}
                  onChange={(event) => setForm({ ...form, sourceText: event.target.value })}
                  placeholder="Preserve the raw text or context behind this transaction."
                />
              </label>

              <button
                className="w-full rounded-full bg-aegoryn-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-60"
                type="submit"
                disabled={isSaving || !isSignedIn}
              >
                {isSaving ? "Saving..." : "Save transaction"}
              </button>
            </form>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Transactions</p>
            <h2 className="mt-3 text-2xl font-semibold">Recent ledger</h2>
            <div className="mt-6 space-y-3">
              {transactions.length > 0 ? (
                transactions.map((transaction) => {
                  const account = accounts.find((item) => item.id === transaction.account_id);
                  const bucket = buckets.find((item) => item.id === transaction.money_bucket_id);
                  const reversal = isReversalTransaction(transaction);

                  return (
                    <div key={transaction.id} className="rounded-2xl bg-black/30 p-4">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <p className="font-medium">{transaction.description || transaction.category || transaction.transaction_type}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {transaction.transaction_date} · {transaction.transaction_type} · {account?.account_name || "No account"}
                            {bucket ? ` · ${bucket.bucket_name}` : ""}
                          </p>
                          {reversal ? <p className="mt-2 text-xs text-aegoryn-gold">Audit correction / reversal entry</p> : null}
                        </div>
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <p className="text-lg font-semibold text-aegoryn-gold">{currencyFormatter.format(Number(transaction.amount))}</p>
                          {!reversal ? (
                            <button
                              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:border-aegoryn-gold hover:text-aegoryn-gold disabled:opacity-60"
                              disabled={reversingId === transaction.id}
                              onClick={() => handleReverseTransaction(transaction)}
                            >
                              {reversingId === transaction.id ? "Reversing..." : "Reverse"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                      {transaction.source_text ? <p className="mt-3 text-xs leading-5 text-white/45">{transaction.source_text}</p> : null}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-white/55">No transaction records loaded yet.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
