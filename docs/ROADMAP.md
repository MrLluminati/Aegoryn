# AegorynOS Roadmap

## Phase 1 — Planning and Repository Setup

- Create repository
- Add README
- Add PRD
- Add architecture document
- Add database schema draft
- Add roadmap

## Phase 2 — Project Setup

- Create Next.js app
- Add Tailwind CSS
- Configure Supabase
- Add environment variable template
- Add basic folder structure

## Phase 3 — Authentication

- Add login page
- Add signup page
- Add protected dashboard route
- Add user profile creation

## Phase 4 — Core Dashboard

- Account balance cards
- Pocket money summary
- Recent transactions
- Active tasks
- Active projects
- AI usage card

## Phase 5 — Account Management

- Add accounts table UI
- Add transactions table UI
- Add manual transaction form
- Add money buckets
- Move ledger writes into atomic database functions

## Phase 6 — Brand Foundation Checkpoint

This is a lightweight UI/brand consistency checkpoint before the AI parser phase, not a full public-launch branding exercise.

- Add MVP brand guidelines.
- Lock the dark command-system UI direction.
- Standardize black/gold/parchment visual tokens.
- Standardize page shell, card, button, and form patterns.
- Add a temporary AegorynOS/Aego identity direction.
- Defer final logo suite, app icon, marketing website assets, and public brand kit until after AI parser, visual analysis, and private deployment are stable.

## Phase 7 — Chat Assistant MVP

- Add chat input.
- Add backend parser endpoint.
- Add structured output schema.
- Add deterministic MVP parser before paid AI calls.
- Add account-management classification.
- Add missing-detail detection.
- Add clarification handling.
- Add action validation before any database write.
- Add confirmation step before saving structured actions.
- Save AI message logs.

Current checkpoint note: parser requests are now saved to `ai_messages` after authentication, and recent parser history reloads on the chat page. The next AI-parser work is action validation, clarification handling, and confirmed writes into transactions, tasks, or projects.

## Phase 8 — Authenticated Navigation Shell

This checkpoint must happen before chat-based database writes are enabled.

- Keep `/` as the public landing page.
- Make login mandatory before using product features.
- Protect `/chat`, `/dashboard`, and `/accounts`.
- Redirect unauthenticated feature access to `/login`.
- Redirect logged-out users to `/` after sign-out.
- Add a consistent navbar across landing and app pages.
- Logged-out navbar should show product/marketing links, `Login`, and `Try Aego`.
- `Try Aego` should route logged-out users to `/login` and logged-in users to `/chat`.
- Logged-in navbar should show tool links: `Chat`, `Dashboard`, `Accounts`, and future tools.
- Add generated profile/avatar button for logged-in users.
- Add profile dropdown with Settings, Account, Usage, and Sign out placeholders.
- Display the current app version consistently across pages, preferably as a navbar pill or footer/system badge.
- Add proxy-backed protection for private app routes.
- Add automatic user-profile bootstrap for new sign-ups.

### Deferred Authentication Enhancements

Google login and real OAuth profile pictures are deferred until after the email/password auth flow, protected routes, and core parser/save workflow are stable.

Later auth enhancements:

- Google OAuth sign-in through Supabase Auth.
- Additional OAuth providers if needed.
- Real profile pictures from OAuth metadata.
- Uploaded profile pictures through Supabase Storage.
- Auth email templates and production redirect URL hardening.

## Phase 9 — Usage Credits

- Add monthly usage record
- Add credit check before AI call
- Add usage display
- Add blocked-state UI

## Phase 10 — Private Deployment

- Deploy on Vercel
- Connect Supabase
- Seed personal data
- Test daily tracking

## Phase 11 — Public-Beta Preparation

- Payment architecture
- Razorpay/Stripe planning
- Terms and privacy policy
- Data export
- Admin dashboard
- Error logging

## Phase 12 — Visual Analysis

- Add `/analysis` page.
- Add monthly spending charts.
- Add category-wise expense charts.
- Add pocket-money burn-down view.
- Add savings trend view.
- Add bank-wise balance split.
- Add AI-generated insight summaries based on stored records.

## Phase 13 — Expert Assistant Modules

These modules are future monetizable product extensions and are not part of the early MVP.

### CA Mode — India First

- Add a Chartered Accountant-style assistant for personal finance, tax-record organization, GST/income-tax document checklists, invoice/receipt classification, and financial-compliance reminders.
- Start with India-native terminology and workflows.
- Keep outputs framed as organizational assistance and preparatory guidance, not a replacement for a licensed Chartered Accountant.
- Require jurisdiction, assessment year/financial year, entity type, and source documents before giving structured tax/compliance workflows.
- Later expand to other jurisdictions through country-specific packs.

### Lawyer Mode — India First

- Add a Lawyer-style assistant for document organization, legal-task tracking support, case-note drafting support, contract-summary assistance, deadline tracking, and legal research workflows.
- Start with India-native legal terminology, courts, statutes, compliance categories, and filing/deadline workflows.
- Keep outputs framed as drafting/research/productivity assistance and not a substitute for professional legal advice unless provided by a licensed professional through a compliant workflow.
- Require jurisdiction, forum/court/authority, matter type, dates, documents, and user role before generating legal workflows.
- Later expand to other jurisdictions through country-specific packs.

### Product Constraint

- Expert modules must remain clearly separated from the core personal assistant MVP until the product has revenue, stronger compliance controls, disclaimers, audit trails, and jurisdiction-specific content governance.
