export type Account = {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  current_balance: number;
  is_primary: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MoneyBucket = {
  id: string;
  user_id: string;
  bucket_name: string;
  bucket_month: string | null;
  starting_amount: number;
  current_balance: number;
  linked_account_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  transaction_date: string;
  transaction_type: "income" | "expense" | "transfer";
  amount: number;
  category: string | null;
  account_id: string | null;
  money_bucket_id: string | null;
  description: string | null;
  source_text: string | null;
  created_at: string;
  updated_at: string;
};
