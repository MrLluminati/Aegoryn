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

---

## 2. Versioning

- [x] Create baseline Git tag: `v0.0.1-planning`.
- [ ] Create release notes for `v0.0.1-planning`.
- [x] Push baseline tag to GitHub.
- [x] Create app-scaffold Git tag: `v0.1.0-mvp-start`.
- [x] Create Supabase schema Git tag: `v0.1.1-supabase-schema`.
- [x] Create Supabase connection Git tag: `v0.1.2-supabase-connect`.
- [ ] Create account-ledger Git tag: `v0.1.3-account-ledger`.

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

---

## 5. Authentication

- [ ] Add sign-up page.
- [x] Add login page.
- [ ] Add logout action.
- [ ] Add protected dashboard route.
- [ ] Create user profile after first login.

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

---

## 7. Account Management

- [x] Create accounts page.
- [~] Create transactions page.
- [x] Add manual transaction form.
- [x] Add money bucket view.
- [~] Add category handling.
- [x] Add balance update logic.
- [x] Preserve source text for transactions.
- [ ] Verify manual transaction creation locally.
- [ ] Add transaction deletion/reversal safety rule.

---

## 8. Tasks and Projects

- [ ] Create tasks page.
- [ ] Create project page.
- [ ] Add task status handling.
- [ ] Add priority handling.
- [ ] Add project next-action field.
- [ ] Link tasks to projects.

---

## 9. Chat Assistant MVP

- [x] Create static chat UI shell.
- [ ] Create backend chat endpoint.
- [ ] Create AI parser schema.
- [ ] Add classification logic.
- [x] Add clarification-message example.
- [ ] Add clarification handling.
- [ ] Add action validation.
- [ ] Save AI messages.
- [ ] Save structured actions.

---

## 10. Usage Credits

- [ ] Add usage-credit database logic.
- [ ] Add monthly usage check.
- [ ] Block AI calls when credits are exhausted.
- [ ] Deduct credits after successful parsing.
- [ ] Show usage on dashboard.

---

## 11. Private Alpha Readiness

- [ ] Test login.
- [ ] Test account update through chat.
- [ ] Test missing bank clarification.
- [ ] Test missing money-source clarification.
- [ ] Test task creation through chat.
- [ ] Test project update through chat.
- [x] Test dashboard updates.
- [ ] Test usage credit blocking.
- [ ] Verify no secrets are committed.
- [ ] Verify documentation is current.

---

## 12. Future / Not MVP

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
