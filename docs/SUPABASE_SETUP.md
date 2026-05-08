# Supabase Setup Guide

This guide explains how Supabase should be prepared for the AegorynOS MVP.

Current version target:

```text
v0.1.1-supabase-schema
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

---

## 5. Environment Variables

Use `.env.example` as the safe template.

Actual values should go only in:

```text
.env.local
```

or production deployment environment variables.

Never commit real values.

---

## 6. RLS Test Checklist

Before connecting real app screens to Supabase:

- [ ] RLS is enabled on all MVP tables.
- [ ] authenticated users can access their own rows.
- [ ] authenticated users cannot access other users' rows.
- [ ] anonymous users cannot access private records.
- [ ] service-role logic is not exposed to frontend code.

---

## 7. Next Step After Schema

After the schema is tested:

1. create typed database helpers;
2. connect dashboard to real account records;
3. build authentication screens;
4. create the first protected dashboard route.
