# Changelog

All notable changes to AegorynOS should be documented in this file.

This project follows a human-readable changelog format inspired by Keep a Changelog. Dates should use `YYYY-MM-DD` format.

---

## [Unreleased]

### Added

- Initial project documentation.
- Product Requirements Document for AegorynOS v0.1.
- Architecture document.
- Database schema draft.
- Development roadmap.
- Project registry.
- Contacts and domains register.
- Contributor guidelines.
- AI agent guidelines.
- Project rulebook/bylaws.
- Manual update fallback protocol for cases where direct repository updates fail.
- Versioning and release policy for Git tags, release notes, and rollback checkpoints.
- `.gitignore` for Node.js, Next.js, environment files, editor files, and secret/key file patterns.
- `.env.example` with safe placeholder environment variable names for future local setup.
- Setup guide for local development, Supabase preparation, AI provider flow, manual fallback, and version tags.
- Security policy covering secret handling, Supabase requirements, AI validation, frontend restrictions, and private-alpha checklist.
- MVP backlog with actionable checklists for repository foundation, app scaffold, Supabase, authentication, dashboard, account management, chat assistant, and usage credits.
- Next.js app scaffold with package manifest, app router layout, global styles, Tailwind config, PostCSS config, and TypeScript config.
- Initial landing page shell for AegorynOS.
- Initial static dashboard shell with account cards, pocket money summary, and task placeholders.
- Initial static chat assistant shell with clarification-message example.
- Supabase browser client helper.
- `v0.1.0-mvp-start` Git tag for the working app scaffold baseline.
- Supabase initial schema migration for core MVP tables and indexes.
- Supabase Row Level Security policy migration for user-owned records.
- Supabase seed-data folder with safe README and generic placeholder seed template.
- Supabase setup guide for migrations, RLS checks, and environment handling.
- `v0.1.1-supabase-schema` Git tag for the Supabase schema and RLS baseline.
- Supabase environment helper for safe public configuration checks.
- Supabase setup status page at `/setup/supabase`.
- Initial TypeScript row types for accounts, money buckets, and transactions.
- Account, money bucket, and recent transaction fetch helpers.
- Supabase login page at `/login`.
- Recent transactions section on the dashboard.
- Supabase API role grants migration for authenticated Data API access.
- `v0.1.2-supabase-connect` Git tag for the Supabase connection and live dashboard baseline.
- Supabase-backed account ledger page at `/accounts`.
- Manual transaction entry form with account, bucket, category, description, and source-text fields.
- Account balance and money-bucket balance update logic for manual income and expense entries.
- Ledger reversal flow that creates audit-preserving correction entries instead of silently deleting transactions.

### Changed

- Repository initialized as the central source of truth for the AegorynOS project.
- Strengthened the project rulebook to state that documentation updates are mandatory and form part of the definition of done for every meaningful project change.
- Clarified that Git tags and changelog entries, not a plain version file, are the authoritative rollback/versioning mechanism.
- Updated README to list repository foundation files, security note, and complete documentation index.
- Updated MVP backlog to reflect app scaffold progress.
- Pinned Tailwind CSS to v3.4.x so the current PostCSS configuration and `@tailwind base/components/utilities` stylesheet work without requiring the Tailwind v4 PostCSS plugin package.
- Temporarily removed ESLint dependencies and lint script from the MVP scaffold to avoid local npm dependency-resolution blocking during the first run.
- Recorded successful local scaffold run for landing page, dashboard, and chat shell.
- Recorded successful production build for the initial Next.js scaffold.
- Marked the app-scaffold rollback checkpoint as complete.
- Updated database schema documentation to reference Supabase migration files, RLS policies, and seed templates.
- Marked the Supabase schema rollback checkpoint as complete.
- Updated Supabase setup documentation for local connection testing and helper files.
- Updated MVP backlog to reflect Supabase connection helper progress.
- Recorded successful local verification that `/setup/supabase` renders without Supabase environment values and shows the expected not-configured state.
- Recorded Visual Studio Code on Windows with PowerShell as the active development environment.
- Updated setup documentation to prioritize VS Code workflow and current local routes.
- Recorded Supabase project creation details in the project registry without storing secrets or keys.
- Recorded successful execution of Supabase schema and RLS migrations in the hosted Supabase project.
- Recorded Supabase Table Editor verification of all MVP tables.
- Recorded creation of the initial test Auth user for RLS and seed-data testing.
- Recorded successful seeding of initial account-management records for the test user.
- Recorded verification of seeded account-management records in Supabase.
- Updated `/dashboard` to load account, pocket-money, and recent-transaction records from Supabase after sign-in.
- Recorded successful execution of the authenticated role grants migration in Supabase.
- Recorded successful dashboard verification with live Supabase account, pocket-money, and recent-transaction records.
- Recorded successful production build before creating the `v0.1.2-supabase-connect` rollback tag.
- Started `v0.1.3-account-ledger` account-management phase.
- Recorded successful local manual transaction verification through `/accounts`.
- Updated account ledger UI to explain the no-silent-delete safety rule.

### Security

- Added rule that secrets, API keys, tokens, passwords, OTPs, recovery codes, and private credentials must never be committed to the repository.
- Added Row Level Security policy migration for all MVP user-data tables.
- Added Supabase secret keys and database passwords to the explicit do-not-commit list in the project registry.
- Confirmed RLS policy migration ran successfully in Supabase.
- Granted authenticated Data API access while keeping anonymous users blocked from private MVP tables.
- Preserved financial audit history by using reversal transactions instead of destructive deletion.

---

## [0.1.0-planning] - 2026-05-08

### Added

- Finalized working brand direction: Aegoryn.
- Finalized assistant name: Aego.
- Finalized app/system name: AegorynOS.
- Finalized tagline: "Guard your records. Command your life."
- Created GitHub repository: `MrLluminati/Aegoryn`.
- Added planning documentation for the initial MVP.
