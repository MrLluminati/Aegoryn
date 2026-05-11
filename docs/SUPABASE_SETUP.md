# Supabase Setup Guide

This guide explains how Supabase should be prepared for the AegorynOS MVP.

Current migration set:

```text
0001_initial_schema.sql through 0006_atomic_ledger_functions.sql
```

---

## 1. Purpose

Supabase will provide:

- authentication;
- PostgreSQL database;
- Row Level Security;
- user-specific data isolation;
- future server-side data operations.

---

## 2. Migration Files

Migration files are stored in:

```text
supabase/migrations/
```

Current files:

| File | Purpose |
|---|---|
| `0001_initial_schema.sql` | Creates the MVP database tables and indexes. |
| `0002_rls_policies.sql` | Enables Row Level Security and user-specific policies. |
| `0003_api_role_grants.sql` | Grants authenticated Data API access to MVP tables while anonymous users remain blocked. |
| `0004_seed_savings_bucket.sql` | Seeds the required default Savings money bucket for the local test user. |
| `0005_user_profile_bootstrap.sql` | Creates a trigger that inserts a profile row for new Auth users. |
| `0006_atomic_ledger_functions.sql` | Adds account-ledger RPC functions for atomic transaction creation and reversal. |

---

## 3. Seed Files

Seed files are stored in:

```text
supabase/seed/
```

Current files:

| File | Purpose |
|---|---|
| `README.md` | Explains seed-data handling. |
| `seed_template.sql` | Generic placeholder seed file for local development. |

The seed template intentionally uses placeholders. Replace them locally after creating a Supabase Auth user.

---

## 4. Manual Supabase Dashboard Setup

1. Create a Supabase project.
2. Save the project URL and public anon key locally in `.env.local`.
3. Do not commit real environment values.
4. Open the SQL Editor.
5. Run `0001_initial_schema.sql`.
6. Run `0002_rls_policies.sql`.
7. Create or sign up a test user.
8. Use that user's UUID for local seed testing.
9. Verify that authenticated users can only read/write their own rows.

### Running a New Migration Manually

Use this every time a new file appears in `supabase/migrations/`.

1. Open Supabase.
2. Open the correct project.
3. Open **SQL Editor**.
4. Create a new query.
5. Copy the full contents of the migration file from VS Code.
6. Paste it into Supabase.
7. Click **Run**.
8. Confirm the query succeeds.
9. Write down the migration filename and date you ran it.

For the current hardening pass, run these in order:

```text
0005_user_profile_bootstrap.sql
0006_atomic_ledger_functions.sql
```

If the app shows `Could not find the function create_ledger_transaction`, the second migration has not been applied successfully.

---

## 5. Environment Variables

Use `.env.example` as the safe template.

Actual values should go only in:

```text
.env.local
```

or production deployment environment variables.

Never commit real values.

Required public values for local connection testing:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` remains as a legacy fallback only if the publishable key is not available.

After adding or changing `.env.local`, restart the dev server.

---

## 6. Local Connection Status Page

A local setup-status page has been added at:

```text
/setup/supabase
```

Use it to confirm whether the app can see the required public Supabase environment values.

Expected local URL:

```text
http://localhost:3000/setup/supabase
```

This page does not display secret values. It only confirms whether required values are configured.

---

## 7. Supabase Client Helpers

Connection helper files:

| File | Purpose |
|---|---|
| `lib/supabase/env.ts` | Reads and validates safe public Supabase environment values. |
| `lib/supabase/client.ts` | Creates the cookie-backed browser Supabase client. |
| `lib/supabase/server.ts` | Creates the server Supabase client for route handlers and proxy-compatible auth checks. |
| `lib/supabase/profile.ts` | Ensures an authenticated user has a profile row. |
| `lib/supabase/types.ts` | Stores initial TypeScript types for account-related rows. |
| `lib/supabase/accounts.ts` | Provides account, bucket, and recent-transaction fetch helpers. |

---

## 8. RLS Test Checklist

Before connecting real app screens to Supabase:

- [ ] RLS is enabled on all MVP tables.
- [ ] authenticated users can access their own rows.
- [ ] authenticated users cannot access other users' rows.
- [ ] anonymous users cannot access private records.
- [ ] service-role logic is not exposed to frontend code.

---

## 9. Next Step After Connection

After the project is connected locally:

1. run `0005_user_profile_bootstrap.sql`;
2. run `0006_atomic_ledger_functions.sql`;
3. sign in again so cookie-backed auth is active;
4. test user-specific RLS policies with a second user;
5. add usage-credit checks before live AI calls;
6. keep migration files and setup documentation in sync.
