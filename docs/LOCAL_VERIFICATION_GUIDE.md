# AegorynOS Local Verification Guide

This guide is written for a non-coder project owner. Use it when a change touches authentication, Supabase, the account ledger, protected pages, or the parser API.

Do not paste secrets into GitHub, chat, screenshots, or documentation. Real values belong only in `.env.local`, Supabase, Vercel, or a password manager.

---

## 1. Start From a Clean Local App

Open PowerShell in VS Code and run:

```powershell
cd D:\Coding\Repos\Aegoryn
git status -sb
npm install
npm run typecheck
npm run build
```

If `npm run build` passes, start the local app:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

If `npm audit` reports a Next.js/PostCSS warning and suggests `npm audit fix --force`, do not run the forced fix without a review. Forced audit fixes can downgrade or replace major framework packages.

---

## 2. Manual Supabase Work After This Hardening Pass

The app now expects two new database migrations to be applied manually in Supabase:

```text
supabase/migrations/0005_user_profile_bootstrap.sql
supabase/migrations/0006_atomic_ledger_functions.sql
```

### How to run each migration

1. Open the Supabase project dashboard.
2. Open **SQL Editor**.
3. Click **New query**.
4. Open the migration file locally in VS Code.
5. Copy the full SQL from the migration file.
6. Paste it into Supabase SQL Editor.
7. Click **Run**.
8. Confirm Supabase reports success.
9. Repeat for the next migration.

Run them in order:

1. `0005_user_profile_bootstrap.sql`
2. `0006_atomic_ledger_functions.sql`

If you see an error, stop and copy the exact error message into the project notes or ask for help before continuing.

---

## 3. Important Sign-In Note

This hardening pass moved Supabase browser auth to cookie-backed auth so the Next.js proxy and API routes can verify the signed-in user.

After pulling or applying this change, you may need to:

1. Open `http://localhost:3000/login`.
2. Sign in again.
3. If something looks stuck, sign out and sign in once more.

This is expected because older sessions may have been stored only in browser local storage.

---

## 4. Auth Flow Checklist

Use a test account, not a real personal account.

### Sign-up page

1. Open `http://localhost:3000/signup`.
2. Confirm the page says **Create account**.
3. Try two different passwords.
4. Confirm the page says **Passwords do not match**.
5. Create a test account if Supabase Auth sign-ups are enabled.

### Login page

1. Open `http://localhost:3000/login`.
2. Sign in with the test account.
3. Confirm you land on `/chat`.
4. Open `http://localhost:3000` while still signed in.
5. Confirm the landing page still opens and the main action says **Open Aego**.

### Protected routes

When signed out, these pages should redirect to `/login`:

```text
http://localhost:3000/chat
http://localhost:3000/dashboard
http://localhost:3000/accounts
http://localhost:3000/profile
http://localhost:3000/settings
http://localhost:3000/usage
```

When signed in, those pages should open normally.

---

## 5. Parser API Checklist

When signed out, Aego parser calls should be blocked.

When signed in:

1. Open `http://localhost:3000/chat`.
2. Send:

```text
Paid ₹500 for groceries from Kotak from Savings.
```

3. Confirm Aego returns a structured parser result.
4. Refresh the page.
5. Confirm the recent parser message appears again from saved history.
6. Confirm the left sidebar shows **Today** with at least one saved entry.
7. Click **Today** and confirm the same daily conversation remains visible.

If the chat says you must sign in, sign in again. If it still fails, check `.env.local` and restart the dev server.

### Voice input checklist

Voice input depends on the browser. It should work in Chrome-like browsers, but may not work in every browser.

1. Open `http://localhost:3000/chat` while signed in.
2. Click the microphone button beside the input box.
3. If the browser asks for microphone permission, allow it for local testing.
4. Say a short test message, for example:

```text
Paid one hundred rupees for snacks from Kotak from Pocket Money.
```

5. Confirm the spoken text appears in the input box.
6. Review the text.
7. Click **Send**.
8. Confirm Aego saves the parser entry in today's daily log.

The app sends only the final text when you click **Send**. Do not test with private secrets, passwords, OTPs, or real credentials.

### Optional Supabase table check

Use this only if you want to confirm the saved row directly.

1. Open the Supabase dashboard.
2. Open **Table Editor**.
3. Open the `ai_messages` table.
4. Look for the newest row for your test user.
5. Confirm:
   - `user_message` contains your chat text;
   - `classification` is `account_management` for the sample above;
   - `status` is `processed` when no clarification is needed, or `clarification_required` when Aego asks a question;
   - `ai_response` contains JSON.

Do not paste private financial details into screenshots or public issue reports.

---

## 6. Ledger Checklist

This checklist requires `0006_atomic_ledger_functions.sql` to be run in Supabase first.

1. Sign in.
2. Open `http://localhost:3000/accounts`.
3. Add a small test expense.
4. Confirm the transaction appears in the recent ledger.
5. Confirm the account and bucket balances changed.
6. Click **Reverse** on that test transaction.
7. Confirm a reversal entry appears.
8. Confirm the balance returns to the earlier amount.

If the page says `Could not find the function create_ledger_transaction`, run `0006_atomic_ledger_functions.sql` in Supabase SQL Editor.

---

## 7. What To Record After Verification

After testing, update project notes or ask the assistant to update docs with:

- date tested;
- which test account was used;
- which routes passed;
- whether sign-up required email confirmation;
- whether transaction creation and reversal worked;
- any exact error messages.

Do not record passwords, OTPs, recovery codes, API keys, or private financial details.

Latest recorded verification:

| Date | Check | Result |
|---|---|---|
| 2026-05-11 | User profile bootstrap migration `0005_user_profile_bootstrap.sql` | Applied |
| 2026-05-11 | Atomic ledger transaction creation and reversal after `0006_atomic_ledger_functions.sql` | Passed |
| 2026-05-11 | Signed-in landing page remains accessible with authenticated actions | Passed |

---

## 8. Browser Extension Hydration Warning

If the local app shows a Next.js hydration warning mentioning attributes such as:

```text
data-new-gr-c-s-check-loaded
data-gr-ext-installed
```

that usually means a browser extension changed the page before React loaded. Grammarly and similar writing extensions commonly do this.

What to do:

1. Refresh the page once.
2. If the warning remains, test the app in an incognito/private window with extensions disabled.
3. You can also disable the writing extension for `localhost:3000`.

This warning is not caused by Supabase migrations, account data, or your app database.
