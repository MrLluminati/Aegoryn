# AegorynOS MVP Backlog

This backlog converts the roadmap into actionable development tasks.

Status legend:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked

---

## 1. Repository Foundation

- [x] Create GitHub repository.
- [x] Add README.
- [x] Add PRD.
- [x] Add architecture document.
- [x] Add database schema draft.
- [x] Add roadmap.
- [x] Add project registry.
- [x] Add contacts and domains register.
- [x] Add changelog.
- [x] Add contributing guidelines.
- [x] Add AI agent guidelines.
- [x] Add project rulebook.
- [x] Add versioning and release policy.
- [x] Add manual update fallback protocol.
- [x] Add `.gitignore`.
- [x] Add `.env.example`.
- [x] Add setup guide.
- [x] Add security policy.
- [x] Add MVP backlog.
- [x] Add MVP brand guidelines.

---

## 2. Versioning

- [x] Create baseline Git tag: `v0.0.1-planning`.
- [x] Create release notes for `v0.0.1-planning`.
- [x] Push baseline tag to GitHub.
- [x] Create app-scaffold Git tag: `v0.1.0-mvp-start`.
- [x] Create release notes for `v0.1.0-mvp-start`.
- [x] Create Supabase schema Git tag: `v0.1.1-supabase-schema`.
- [x] Create release notes for `v0.1.1-supabase-schema`.
- [x] Create Supabase connection Git tag: `v0.1.2-supabase-connect`.
- [x] Create release notes for `v0.1.2-supabase-connect`.
- [x] Create account-ledger Git tag: `v0.1.3-account-ledger`.
- [x] Create release notes for `v0.1.3-account-ledger`.
- [x] Create brand-foundation Git tag: `v0.1.3-brand-foundation`.
- [x] Create release notes for `v0.1.3-brand-foundation`.
- [x] Create auth-nav-shell Git tag: `v0.1.4-auth-nav-shell`.
- [x] Create release notes for `v0.1.4-auth-nav-shell`.
- [ ] Create AI-parser Git tag: `v0.1.5-ai-parser`.

---

## 3. Project Scaffold

- [x] Create Next.js app scaffold files.
- [x] Add TypeScript configuration.
- [x] Add Tailwind CSS configuration.
- [x] Add base layout.
- [x] Add initial landing page shell.
- [x] Add initial dashboard route shell.
- [x] Add initial chat route shell.
- [~] Add reusable UI components.
- [x] Verify local install and dev server after dependency fixes.
- [x] Verify production build with `npm run build`.
- [x] Commit generated `package-lock.json` for reproducible installs.

---

## 4. Supabase Setup

- [x] Create Supabase project.
- [x] Add Supabase environment values locally.
- [x] Create database migration files.
- [x] Add Row Level Security policy migration.
- [x] Add generic seed-data template.
- [x] Add Supabase setup guide.
- [x] Add Supabase environment helper.
- [x] Add Supabase browser client helper.
- [x] Add Supabase server/client SSR auth helper.
- [x] Add initial Supabase row types.
- [x] Add account/bucket/transaction fetch helpers.
- [x] Add local Supabase connection status page.
- [x] Verify setup status page renders locally without Supabase env values.
- [x] Verify setup status page detects configured local Supabase public environment values.
- [x] Run migrations in Supabase.
- [x] Enable Row Level Security in deployed database.
- [x] Verify Supabase MVP tables exist in Table Editor.
- [x] Create test Auth user.
- [ ] Test user-specific access policies.
- [x] Seed initial account-management data for test user.
- [x] Verify seeded account-management data in Supabase.
- [x] Add explicit authenticated role grants for Data API access.
- [x] Add Savings bucket seed migration.
- [x] Run Savings bucket seed migration in Supabase.
- [x] Run user profile bootstrap migration in Supabase.
- [x] Run atomic ledger functions migration in Supabase.

---

## 5. Authentication

- [x] Add sign-up page.
- [x] Add login page.
- [~] Add logout action.
- [x] Add protected dashboard route.
- [~] Create user profile after first login.
- [x] Add proxy redirect protection for private app routes.

---

## 6. Dashboard

- [x] Create dashboard shell.
- [x] Add static account balance cards.
- [x] Add static pocket money summary.
- [x] Add recent transactions section.
- [x] Add active tasks placeholder.
- [ ] Add active projects.
- [ ] Add AI usage card.
- [x] Connect dashboard to database.
- [x] Verify dashboard loads Supabase account, pocket-money, and transaction records.
- [x] Use Savings bucket for Savings Till Now when available.

---

## 7. Account Management

- [x] Create accounts page.
- [~] Create transactions page.
- [x] Add manual transaction form.
- [x] Add money bucket view.
- [~] Add category handling.
- [x] Add balance update logic.
- [x] Preserve source text for transactions.
- [x] Verify manual transaction creation locally.
- [x] Add transaction deletion/reversal safety rule.
- [x] Verify transaction reversal locally.
- [x] Add Savings as required default money-bucket rule.
- [x] Verify Savings bucket appears in account ledger dropdown.
- [x] Move transaction creation and reversal balance updates into atomic database functions.
- [x] Verify atomic ledger transaction creation and reversal after Supabase RPC migration.

---

## 8. Brand Foundation

- [x] Create lightweight MVP brand guidelines.
- [x] Standardize shared page shell.
- [x] Standardize card, form, and button styling.
- [x] Add temporary AegorynOS identity mark or wordmark.
- [x] Add favicon placeholder.
- [x] Verify branding consistency across home, login, dashboard, chat, and accounts.

---

## 9. Authenticated Navigation Shell

- [x] Keep `/` as the public landing page.
- [x] Add logged-out navbar with Login and Try Aego CTA.
- [x] Make Try Aego route logged-out users to `/login`.
- [x] Make Try Aego route logged-in users to `/chat`.
- [x] Protect `/chat`, `/dashboard`, and `/accounts`.
- [x] Redirect unauthenticated feature access to `/login`.
- [~] Redirect logged-out users to `/` after sign-out.
- [x] Add consistent logged-in navbar with Chat, Dashboard, Accounts, and future tools.
- [x] Add generated profile/avatar button.
- [x] Add profile dropdown with Settings, Account, Usage, and Sign out placeholders.
- [x] Display app version consistently across pages.
- [x] Defer Google OAuth login and real OAuth profile pictures until later production-auth stage.

---

## 10. Tasks and Projects

- [ ] Create tasks page.
- [ ] Create project page.
- [ ] Add task status handling.
- [ ] Add priority handling.
- [ ] Add project next-action field.
- [ ] Link tasks to projects.

---

## 11. Chat Assistant MVP

- [x] Create static chat UI shell.
- [x] Create backend chat endpoint.
- [x] Require authentication before parser API calls.
- [x] Create AI parser schema.
- [x] Add classification logic.
- [x] Add clarification-message example.
- [ ] Add clarification handling.
- [ ] Add action validation.
- [ ] Save AI messages.
- [ ] Save structured actions.
- [ ] Add AI-confirmed money-bucket creation flow.
- [x] Verify parser locally with account-management prompts.

---

## 12. Usage Credits

- [ ] Add usage-credit database logic.
- [ ] Add monthly usage check.
- [ ] Block AI calls when credits are exhausted.
- [ ] Deduct credits after successful parsing.
- [ ] Show usage on dashboard.

---

## 13. Private Alpha Readiness

- [ ] Test login.
- [ ] Test account update through chat.
- [x] Test missing bank clarification.
- [x] Test missing money-source clarification.
- [ ] Test task creation through chat.
- [ ] Test project update through chat.
- [x] Test dashboard updates.
- [ ] Test usage credit blocking.
- [ ] Verify no secrets are committed.
- [ ] Verify documentation is current.

---

## 14. Future / Not MVP

- [ ] Google OAuth login.
- [ ] Real OAuth profile pictures.
- [ ] Uploaded profile pictures through Supabase Storage.
- [ ] Production auth email templates and redirect URL hardening.
- [ ] Payment gateway integration.
- [ ] Mobile app.
- [ ] Push notifications.
- [ ] Gmail integration.
- [ ] Calendar integration.
- [ ] WhatsApp bot.
- [ ] Voice input.
- [ ] PDF export.
- [ ] Admin dashboard.
- [ ] Public marketing website.
