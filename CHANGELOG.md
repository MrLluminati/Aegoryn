# Changelog

All notable changes to AegorynOS should be documented in this file.

This project follows a human-readable changelog format inspired by Keep a Changelog. Dates use `YYYY-MM-DD` format.

---

## [Unreleased]

### Changed

- Backfilled release notes for all existing Git tags.
- Clarified the release-note requirement in versioning and contributor documentation.
- Updated stale references from `v0.1.4-ai-parser` to `v0.1.5-ai-parser`.

---

## [v0.1.4-auth-nav-shell] - 2026-05-11

### Added

- Supabase email/password sign-up page for private alpha account creation.
- Cookie-backed Supabase auth using `@supabase/ssr`.
- Next.js proxy route protection for private app routes.
- Server-side authentication check for the Aego parser API.
- User-profile bootstrap helper and Supabase trigger migration.
- Atomic Supabase ledger RPC functions for transaction creation and reversal.
- Local verification guide with manual Supabase migration and auth/ledger smoke-test steps.

### Changed

- Account-ledger writes now use database functions instead of separate client-side insert/update calls.
- Signed-in landing-page actions now open authenticated app areas while keeping the landing page accessible.
- Supabase setup documentation now includes step-by-step migration guidance for non-coder verification.

### Fixed

- Suppressed root hydration noise caused by browser extensions adding attributes before React loads.
- Fixed mixed landing-page state where a signed-in navbar could appear with logged-out landing actions.

### Security

- Protected private app pages with proxy-backed route checks.
- Rejected signed-out parser API requests before processing private text.
- Preserved ledger balance consistency through atomic database functions.

### Verified

- `npm run typecheck`
- `npm run build`
- Supabase migrations `0005_user_profile_bootstrap.sql` and `0006_atomic_ledger_functions.sql` applied.
- Email sign-up and verification flow tested.
- Transaction creation and reversal tested after atomic ledger migration.
- Signed-in landing page tested.

---

## [v0.1.3-brand-foundation] - 2026-05-09

### Added

- Shared AegorynOS brand shell components.
- Dark command-system UI treatment across home, login, chat, dashboard, and accounts pages.
- Temporary favicon placeholder.
- Savings bucket seed migration and dashboard Savings metric support.

### Changed

- Standardized app shell, cards, forms, buttons, and version badge presentation.
- Updated brand foundation roadmap/backlog tracking.
- Clarified manual fallback ZIP and PowerShell workflow guidance.

### Verified

- Brand consistency was checked across the MVP app screens available at the time.
- Savings bucket correction was verified.

---

## [v0.1.3-account-ledger] - 2026-05-09

### Added

- Supabase-backed account ledger page at `/accounts`.
- Manual transaction form for income and expense entries.
- Account and money-bucket balance update logic for manual ledger entries.
- Audit-preserving transaction reversal flow.
- Multiple-reversal blocking rule.
- Supabase GitHub integration timing and production-readiness workflow rules.
- Future expert assistant roadmap notes.

### Changed

- Dashboard Savings calculation now uses the Savings bucket when available.
- PRD and roadmap were updated for chat-first UX, visual analysis, and future expert modules.

### Security

- Ledger corrections preserve financial audit history instead of silently deleting rows.

### Verified

- Manual transaction creation was verified locally.
- Transaction reversal safety was verified locally.

---

## [v0.1.2-supabase-connect] - 2026-05-09

### Added

- Supabase public environment helpers.
- Local Supabase setup status page at `/setup/supabase`.
- Initial TypeScript row types for account-related data.
- Account, money-bucket, and recent-transaction fetch helpers.
- Supabase login page at `/login`.
- Supabase-backed dashboard data loading.
- API role grants migration for authenticated Data API access.

### Changed

- Supabase environment handling now supports publishable keys with a legacy anon-key fallback.
- Setup documentation now prioritizes the VS Code and PowerShell 7 workflow.
- Project registry records the active Supabase project details without storing secrets.

### Security

- Confirmed RLS migration ran successfully in Supabase.
- Confirmed authenticated role grants were applied while anonymous users remained blocked from private MVP tables.

### Verified

- Supabase setup page rendered locally.
- Hosted Supabase tables were verified in Table Editor.
- Test Auth user was created.
- Initial account-management seed data was inserted and verified.
- Dashboard loaded live Supabase account, pocket-money, and transaction records.
- Production build passed before tagging.

---

## [v0.1.1-supabase-schema] - 2026-05-09

### Added

- Initial Supabase schema migration for core MVP tables and indexes.
- Row Level Security migration for user-owned records.
- Supabase seed-data README.
- Generic local seed template.
- Supabase setup guide.

### Changed

- Database schema documentation now references migration files, RLS policies, and seed templates.
- MVP backlog now tracks Supabase schema files.

### Security

- Added RLS policies for users_profile, accounts, money_buckets, transactions, projects, tasks, ai_messages, and ai_usage.

---

## [v0.1.0-mvp-start] - 2026-05-09

### Added

- Next.js app scaffold with package manifest.
- Next.js, TypeScript, Tailwind CSS, and PostCSS configuration.
- Root app layout and global styles.
- Initial landing page shell.
- Initial dashboard shell.
- Initial static chat assistant shell.
- Supabase browser client helper.
- Committed `package-lock.json` for reproducible installs.

### Changed

- Pinned Tailwind CSS to v3.4.x for the current PostCSS setup.
- Simplified scaffold dependencies to keep the first local install unblocked.
- Updated MVP backlog and setup documentation for the app scaffold.

### Verified

- Local scaffold run was recorded.
- Production build passed before tagging.

### Known Limitations

- App screens were static shells.
- Authentication, database reads/writes, and AI parsing were not active yet.

---

## [v0.0.1-planning] - 2026-05-08

### Added

- Initial AegorynOS repository foundation.
- Product Requirements Document.
- Architecture document.
- Database schema draft.
- Roadmap.
- Project registry.
- Contacts and domains register.
- Changelog.
- Contributing guidelines.
- AI agent guidelines.
- Project rulebook/bylaws.
- Manual update fallback protocol.
- Versioning and release policy.
- `.gitignore`.
- `.env.example`.
- Setup guide.
- Security policy.
- MVP backlog.

### Changed

- Finalized working product identity: Aegoryn, AegorynOS, Aego, and “Guard your records. Command your life.”

### Security

- Established the rule that real credentials, API keys, tokens, OTPs, recovery codes, and private financial credentials must never be committed.

### Known Limitations

- No app code was present yet.
- Supabase, AI provider, and deployment setup were still future work.
