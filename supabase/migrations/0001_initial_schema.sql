-- AegorynOS initial Supabase schema
-- Version target: v0.1.1-supabase-schema

create extension if not exists pgcrypto;

create table if not exists public.users_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  currency text not null default 'INR',
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_name text not null,
  account_type text not null default 'bank',
  current_balance numeric(12,2) not null default 0,
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.money_buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_name text not null,
  bucket_month text,
  starting_amount numeric(12,2) not null default 0,
  current_balance numeric(12,2) not null default 0,
  linked_account_id uuid references public.accounts(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_date date not null default current_date,
  transaction_type text not null check (transaction_type in ('income', 'expense', 'transfer')),
  amount numeric(12,2) not null check (amount >= 0),
  category text,
  account_id uuid references public.accounts(id) on delete set null,
  money_bucket_id uuid references public.money_buckets(id) on delete set null,
  description text,
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_name text not null,
  status text not null default 'active',
  next_action text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  project_id uuid references public.projects(id) on delete set null,
  priority text not null default 'medium',
  status text not null default 'pending',
  due_date timestamptz,
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_message text not null,
  ai_response jsonb,
  classification text,
  status text not null default 'processed',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_month text not null,
  credits_used integer not null default 0,
  credits_limit integer not null default 100,
  plan_name text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_month)
);

create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_money_buckets_user_id on public.money_buckets(user_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(transaction_date);
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_ai_messages_user_id on public.ai_messages(user_id);
create index if not exists idx_ai_usage_user_month on public.ai_usage(user_id, usage_month);
