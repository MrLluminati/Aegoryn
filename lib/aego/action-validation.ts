import type { SupabaseClient } from "@supabase/supabase-js";
import type { AegoActionValidation, AegoParserResult, ParsedTransaction } from "./parser";
import type { Account, MoneyBucket } from "../supabase/types";

type ValidationLookup = {
  accounts: Account[];
  buckets: MoneyBucket[];
};

function normalizeName(value: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

function findAccountByName(accounts: Account[], parsedName: string | null): Account | null {
  const normalized = normalizeName(parsedName);

  if (!normalized) {
    return null;
  }

  return (
    accounts.find((account) => normalizeName(account.account_name) === normalized) ??
    accounts.find((account) => normalizeName(account.account_name).includes(normalized)) ??
    accounts.find((account) => normalized.includes(normalizeName(account.account_name))) ??
    null
  );
}

function findBucketByName(buckets: MoneyBucket[], parsedName: string | null): MoneyBucket | null {
  const normalized = normalizeName(parsedName);

  if (!normalized) {
    return null;
  }

  return (
    buckets.find((bucket) => normalizeName(bucket.bucket_name) === normalized) ??
    buckets.find((bucket) => normalizeName(bucket.bucket_name).includes(normalized)) ??
    buckets.find((bucket) => normalized.includes(normalizeName(bucket.bucket_name))) ??
    null
  );
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateParsedTransaction(transaction: ParsedTransaction, lookup: ValidationLookup): AegoActionValidation {
  const issues: string[] = [];
  const account = findAccountByName(lookup.accounts, transaction.accountName);
  const bucket = findBucketByName(lookup.buckets, transaction.bucketName);

  if (!transaction.type) {
    issues.push("Transaction type is missing. Aego must know whether this is income or expense before saving.");
  }

  if (!transaction.amount || !Number.isFinite(transaction.amount) || transaction.amount <= 0) {
    issues.push("Amount is missing or invalid. Aego can only prepare a transaction with an amount greater than zero.");
  }

  if (!transaction.accountName) {
    issues.push("Bank account is missing. Aego must know which account should be affected.");
  } else if (!account) {
    issues.push(`Bank account '${transaction.accountName}' was not found in your saved accounts.`);
  }

  if (!transaction.bucketName) {
    issues.push("Money bucket is missing. Aego must know whether this came from Savings, Pocket Money, or another bucket.");
  } else if (!bucket) {
    issues.push(`Money bucket '${transaction.bucketName}' was not found. Aego should ask before creating new buckets.`);
  }

  if (issues.length > 0 || !transaction.type || !transaction.amount || !account) {
    return {
      isValid: false,
      requiresConfirmation: false,
      issues
    };
  }

  return {
    isValid: true,
    requiresConfirmation: true,
    issues: [],
    resolvedTransaction: {
      transactionDate: todayIsoDate(),
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      accountId: account.id,
      accountName: account.account_name,
      moneyBucketId: bucket?.id ?? null,
      moneyBucketName: bucket?.bucket_name ?? null,
      description: transaction.description,
      sourceText: transaction.sourceText
    }
  };
}

export async function validateAegoParserResult(
  supabase: SupabaseClient,
  result: AegoParserResult
): Promise<AegoParserResult> {
  if (result.intent !== "create_transaction") {
    return result;
  }

  const transactionAction = result.actions.find((action) => action.actionType === "create_transaction" && action.transaction);

  if (!transactionAction?.transaction) {
    return result;
  }

  const [accountsResult, bucketsResult] = await Promise.all([
    supabase.from("accounts").select("*").order("is_primary", { ascending: false }).order("account_name"),
    supabase.from("money_buckets").select("*").order("bucket_month", { ascending: false })
  ]);

  if (accountsResult.error || bucketsResult.error) {
    const errorMessage = accountsResult.error?.message ?? bucketsResult.error?.message ?? "Unable to load validation records.";
    return {
      ...result,
      summary: "Aego parsed the update but could not validate it against your saved records.",
      actions: result.actions.map((action) =>
        action === transactionAction
          ? {
              ...action,
              validation: {
                isValid: false,
                requiresConfirmation: false,
                issues: [errorMessage]
              }
            }
          : action
      )
    };
  }

  const validation = validateParsedTransaction(transactionAction.transaction, {
    accounts: (accountsResult.data ?? []) as Account[],
    buckets: (bucketsResult.data ?? []) as MoneyBucket[]
  });

  return {
    ...result,
    summary: validation.isValid
      ? "Aego validated this transaction against your saved account records. Review and confirm before saving."
      : "Aego parsed the update, but validation found issues that must be fixed before saving.",
    actions: result.actions.map((action) => (action === transactionAction ? { ...action, validation } : action))
  };
}
