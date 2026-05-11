"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AppShell,
  MetricCard,
  Panel,
  StatusPanel,
  fieldClassName,
  primaryButtonClassName
} from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
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

function isReversalTransaction(transaction: Transaction): boolean {
  return (
    transaction.category === "reversal" ||
    Boolean(transaction.description?.toLowerCase().includes("reversal")) ||
    Boolean(transaction.source_text?.toLowerCase().includes("reversal"))
  );
}

function hasExistingReversal(originalTransaction: Transaction, allTransactions: Transaction[]): boolean {
  return allTransactions.some(
    (transaction) =>
      transaction.id !== originalTransaction.id &&
      isReversalTransaction(transaction) &&
      Boolean(transaction.source_text?.includes(`Original transaction id: ${originalTransaction.id}`))
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [buckets, setBuckets] = useState<MoneyBucket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("Loading account ledger...");
  const [isSaving, setIsSaving] = useState(false);
  const [reversingId, setReversingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  async function loadLedger() {
    const supabase = createBrowserSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setStatus("Not signed in. Redirecting to login...");
      return;
    }

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
        return;
      }

      const transactionResult = await supabase.rpc("create_ledger_transaction", {
        p_transaction_date: form.transactionDate,
        p_transaction_type: form.transactionType,
        p_amount: amount,
        p_category: form.category || null,
        p_account_id: form.accountId,
        p_money_bucket_id: form.moneyBucketId || null,
        p_description: form.description || null,
        p_source_text: form.sourceText || null
      });

      if (transactionResult.error) {
        setStatus(`Transaction save failed: ${transactionResult.error.message}`);
        return;
      }

      setForm((current) => ({ ...initialFormState, accountId: current.accountId, moneyBucketId: current.moneyBucketId, transactionDate: today }));
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
      setStatus("This transaction is a reversal entry. Create a fresh correction instead.");
      return;
    }

    if (hasExistingReversal(transaction, transactions)) {
      setStatus("This transaction has already been reversed once. Multiple reversals are blocked to prevent balance distortion.");
      return;
    }

    const confirmed = window.confirm("Create a reversal entry for this transaction? The original record will be preserved for audit history.");
    if (!confirmed) return;

    setReversingId(transaction.id);
    setStatus("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setStatus("Session expired. Sign in again.");
        return;
      }

      const reversalResult = await supabase.rpc("reverse_ledger_transaction", {
        p_transaction_id: transaction.id
      });

      if (reversalResult.error) {
        setStatus(`Reversal failed: ${reversalResult.error.message}`);
        return;
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
    <AppShell
      eyebrow="AegorynOS Ledger"
      title="Accounts"
      subtitle="Manage accounts, money buckets, manual entries, and audit-preserving ledger corrections."
    >
      <ProtectedRoute>
        <StatusPanel label="Connection status" value={status} />

        <section className="mb-6 rounded-3xl border border-aegoryn-gold/20 bg-aegoryn-gold/[0.05] p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Ledger Safety Rule</p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Transactions are not silently deleted. Incorrect entries should be corrected through one reversal entry so the audit trail remains intact and balances remain accurate.
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard label="Total balance" value={currencyFormatter.format(totalBalance)} />
          {accounts.map((account) => (
            <MetricCard
              key={account.id}
              label={account.account_name}
              value={currencyFormatter.format(Number(account.current_balance))}
              note={account.is_primary ? "Primary account" : account.notes || "Secondary account"}
            />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel>
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Manual Entry</p>
            <h2 className="mt-3 text-2xl font-semibold">Add transaction</h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-white/60">Date</span>
                  <input className={fieldClassName} type="date" value={form.transactionDate} onChange={(event) => setForm({ ...form, transactionDate: event.target.value })} required />
                </label>
                <label className="block">
                  <span className="text-sm text-white/60">Type</span>
                  <select className={fieldClassName} value={form.transactionType} onChange={(event) => setForm({ ...form, transactionType: event.target.value as FormState["transactionType"] })}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-white/60">Amount</span>
                <input className={fieldClassName} min="0" step="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Account</span>
                <select className={fieldClassName} value={form.accountId} onChange={(event) => setForm({ ...form, accountId: event.target.value })} required>
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.account_name}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Money bucket</span>
                <select className={fieldClassName} value={form.moneyBucketId} onChange={(event) => setForm({ ...form, moneyBucketId: event.target.value })}>
                  <option value="">No bucket</option>
                  {buckets.map((bucket) => <option key={bucket.id} value={bucket.id}>{bucket.bucket_name} {bucket.bucket_month ? `(${bucket.bucket_month})` : ""}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Category</span>
                <input className={fieldClassName} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="petrol, groceries, pocket_money" />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Description</span>
                <input className={fieldClassName} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Short ledger description" />
              </label>

              <label className="block">
                <span className="text-sm text-white/60">Original text / note</span>
                <textarea className={`${fieldClassName} min-h-24`} value={form.sourceText} onChange={(event) => setForm({ ...form, sourceText: event.target.value })} placeholder="Preserve the raw text or context behind this transaction." />
              </label>

              <button className={`${primaryButtonClassName} w-full`} type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save transaction"}
              </button>
            </form>
          </Panel>

          <Panel>
            <p className="text-sm uppercase tracking-[0.3em] text-aegoryn-gold">Transactions</p>
            <h2 className="mt-3 text-2xl font-semibold">Recent ledger</h2>
            <div className="mt-6 space-y-3">
              {transactions.length > 0 ? (
                transactions.map((transaction) => {
                  const account = accounts.find((item) => item.id === transaction.account_id);
                  const bucket = buckets.find((item) => item.id === transaction.money_bucket_id);
                  const reversal = isReversalTransaction(transaction);
                  const alreadyReversed = hasExistingReversal(transaction, transactions);

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
                          {!reversal && alreadyReversed ? <p className="mt-2 text-xs text-aegoryn-gold">Already reversed once</p> : null}
                        </div>
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <p className="text-lg font-semibold text-aegoryn-gold">{currencyFormatter.format(Number(transaction.amount))}</p>
                          {!reversal && !alreadyReversed ? (
                            <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:border-aegoryn-gold hover:text-aegoryn-gold disabled:opacity-60" disabled={reversingId === transaction.id} onClick={() => handleReverseTransaction(transaction)}>
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
          </Panel>
        </section>
      </ProtectedRoute>
    </AppShell>
  );
}
