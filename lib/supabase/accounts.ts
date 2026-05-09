import { createBrowserSupabaseClient } from "./client";
import type { Account, MoneyBucket, Transaction } from "./types";

export async function fetchAccounts(): Promise<Account[]> {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("account_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Account[];
}

export async function fetchMoneyBuckets(): Promise<MoneyBucket[]> {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("money_buckets")
    .select("*")
    .order("bucket_month", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as MoneyBucket[];
}

export async function fetchRecentTransactions(limit = 10): Promise<Transaction[]> {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Transaction[];
}
