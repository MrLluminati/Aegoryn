# AegorynOS Database Schema Draft

## users_profile

```sql
create table users_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  full_name text,
  currency text default 'INR',
  timezone text default 'Asia/Kolkata',
  created_at timestamptz default now()
);
```

## accounts

```sql
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_name text not null,
  account_type text default 'bank',
  current_balance numeric(12,2) not null default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);
```

## money_buckets

```sql
create table money_buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  bucket_name text not null,
  month text,
  starting_amount numeric(12,2) default 0,
  current_balance numeric(12,2) default 0,
  linked_account_id uuid references accounts(id),
  created_at timestamptz default now()
);
```

## transactions

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  transaction_date date not null,
  transaction_type text not null check (transaction_type in ('income', 'expense', 'transfer')),
  amount numeric(12,2) not null,
  category text,
  account_id uuid references accounts(id),
  money_bucket_id uuid references money_buckets(id),
  description text,
  source_text text,
  created_at timestamptz default now()
);
```

## projects

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_name text not null,
  status text default 'active',
  next_action text,
  notes text,
  created_at timestamptz default now()
);
```

## tasks

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  project_id uuid references projects(id),
  priority text default 'medium',
  status text default 'pending',
  due_date timestamptz,
  source_text text,
  created_at timestamptz default now()
);
```

## ai_messages

```sql
create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_message text not null,
  ai_response jsonb,
  classification text,
  status text default 'processed',
  created_at timestamptz default now()
);
```

## ai_usage

```sql
create table ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  month text not null,
  credits_used integer default 0,
  credits_limit integer default 100,
  plan_name text default 'free',
  created_at timestamptz default now()
);
```
