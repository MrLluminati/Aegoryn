# AegorynOS Database Schema

This document tracks the current planned Supabase/PostgreSQL schema for the AegorynOS MVP.

Authoritative migration files are stored in:

```text
supabase/migrations/
```

Current migration set:

```text
0001_initial_schema.sql through 0006_atomic_ledger_functions.sql
```

---

## 1. Migration Files

| File | Purpose |
|---|---|
| `supabase/migrations/0001_initial_schema.sql` | Creates core MVP tables and indexes. |
| `supabase/migrations/0002_rls_policies.sql` | Enables Row Level Security and user-owned row policies. |
| `supabase/migrations/0003_api_role_grants.sql` | Grants authenticated Data API access to MVP tables while anonymous users remain blocked. |
| `supabase/migrations/0004_seed_savings_bucket.sql` | Seeds the required default Savings money bucket for the local test user. |
| `supabase/migrations/0005_user_profile_bootstrap.sql` | Creates a trigger to insert a `users_profile` row when Supabase Auth creates a user. |
| `supabase/migrations/0006_atomic_ledger_functions.sql` | Adds RPC functions for atomic transaction creation and reversal. |

---

## 2. Tables

### 2.1 users_profile

Stores app-level user profile and preferences.

Key fields:

- `id`
- `user_id`
- `full_name`
- `currency`
- `timezone`
- `created_at`
- `updated_at`

Purpose:

- links Supabase Auth user to app profile settings;
- stores default currency and timezone.

---

### 2.2 accounts

Stores bank accounts, wallets, or other money accounts.

Key fields:

- `id`
- `user_id`
- `account_name`
- `account_type`
- `current_balance`
- `is_primary`
- `notes`
- `created_at`
- `updated_at`

Initial expected account examples:

- Kotak Mahindra Bank;
- Axis Bank;
- SBI.

---

### 2.3 money_buckets

Stores earmarked money sources such as pocket money, savings, or monthly budgets.

Key fields:

- `id`
- `user_id`
- `bucket_name`
- `bucket_month`
- `starting_amount`
- `current_balance`
- `linked_account_id`
- `notes`
- `created_at`
- `updated_at`

Example bucket:

- Pocket Money for May 2026.

---

### 2.4 transactions

Stores income, expense, and transfer records.

Key fields:

- `id`
- `user_id`
- `transaction_date`
- `transaction_type`
- `amount`
- `category`
- `account_id`
- `money_bucket_id`
- `description`
- `source_text`
- `created_at`
- `updated_at`

Rules:

- `transaction_type` must be one of `income`, `expense`, or `transfer`.
- `amount` must not be negative.
- `source_text` should preserve the original user message wherever possible.

---

### 2.5 projects

Stores user projects.

Key fields:

- `id`
- `user_id`
- `project_name`
- `status`
- `next_action`
- `notes`
- `created_at`
- `updated_at`

Initial project examples:

- AegorynOS;
- Chambers of AK website;
- account management;
- coding learning.

---

### 2.6 tasks

Stores tasks and reminders.

Key fields:

- `id`
- `user_id`
- `title`
- `project_id`
- `priority`
- `status`
- `due_date`
- `source_text`
- `created_at`
- `updated_at`

---

### 2.7 ai_messages

Stores user messages and AI interpretation logs.

Key fields:

- `id`
- `user_id`
- `user_message`
- `ai_response`
- `classification`
- `status`
- `created_at`

Rules:

- store parsed AI output as JSON where applicable;
- do not log secrets or credentials;
- use status values such as `processed`, `clarification_required`, or `failed`;
- parser logs should be created by the authenticated parser API route, not by anonymous clients;
- the chat page may read recent rows for the signed-in user so parser history survives refreshes.

---

### 2.8 ai_usage

Stores monthly AI credit usage.

Key fields:

- `id`
- `user_id`
- `usage_month`
- `credits_used`
- `credits_limit`
- `plan_name`
- `created_at`
- `updated_at`

Rules:

- one row per user per month;
- backend must check usage before AI calls;
- backend must deduct credits after successful AI processing.

---

## 3. Row Level Security

Row Level Security must be enabled before real data is stored.

Current policy file:

```text
supabase/migrations/0002_rls_policies.sql
```

Core rule:

> A user may only access rows where `auth.uid()` equals the row's `user_id`.

Tables covered:

- users_profile;
- accounts;
- money_buckets;
- transactions;
- projects;
- tasks;
- ai_messages;
- ai_usage.

---

## 4. Database Functions

### 4.1 create_profile_for_new_user

Migration:

```text
supabase/migrations/0005_user_profile_bootstrap.sql
```

Purpose:

- automatically creates a `users_profile` row for a new Supabase Auth user;
- uses safe defaults: `INR` and `Asia/Kolkata`;
- avoids manual profile-row creation for future sign-ups.

Existing users may still need a profile row created by signing in once after the client-side profile bootstrap helper is deployed.

### 4.2 create_ledger_transaction

Migration:

```text
supabase/migrations/0006_atomic_ledger_functions.sql
```

Purpose:

- inserts one transaction;
- updates the linked account balance;
- updates the linked money-bucket balance;
- rejects unauthenticated calls;
- rejects account or bucket IDs that do not belong to the authenticated user.

### 4.3 reverse_ledger_transaction

Migration:

```text
supabase/migrations/0006_atomic_ledger_functions.sql
```

Purpose:

- creates one audit-preserving reversal transaction;
- updates linked balances in the same database transaction;
- blocks reversal of reversal entries;
- blocks reversing the same original transaction more than once.

---

## 5. Seed Data

Seed templates are stored in:

```text
supabase/seed/
```

Files:

| File | Purpose |
|---|---|
| `README.md` | Explains seed-data workflow and initial account-management data. |
| `seed_template.sql` | Generic local placeholder seed template. |

Do not commit private production data or credentials.

---

## 6. Next Database Tasks

- Test user-specific RLS policies with a second user.
- Verify saved parser history reloads from `ai_messages` after a signed-in chat parse.
- Test `ai_messages` isolation with a second user.
- Keep migration documentation current as new tables, functions, or grants are added.
- Add usage-credit checks before live AI calls.
