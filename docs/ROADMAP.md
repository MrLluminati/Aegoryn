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

## Phase 6 — Chat Assistant MVP

- Add chat input
- Add backend parser endpoint
- Add structured output schema
- Add clarification handling
- Save AI message logs

## Phase 7 — Usage Credits

- Add monthly usage record
- Add credit check before AI call
- Add usage display
- Add blocked-state UI

## Phase 8 — Private Deployment

- Deploy on Vercel
- Connect Supabase
- Seed personal data
- Test daily tracking

## Phase 9 — Public-Beta Preparation

- Payment architecture
- Razorpay/Stripe planning
- Terms and privacy policy
- Data export
- Admin dashboard
- Error logging

## Phase 10 — Visual Analysis

- Add `/analysis` page.
- Add monthly spending charts.
- Add category-wise expense charts.
- Add pocket-money burn-down view.
- Add savings trend view.
- Add bank-wise balance split.
- Add AI-generated insight summaries based on stored records.

## Phase 11 — Expert Assistant Modules

These modules are future monetizable product extensions and are not part of the early MVP.

### CA Mode — India First

- Add a Chartered Accountant-style assistant for personal finance, tax-record organization, GST/income-tax document checklists, invoice/receipt classification, and financial-compliance reminders.
- Start with India-native terminology and workflows.
- Keep outputs framed as organizational assistance and preparatory guidance, not a replacement for a licensed Chartered Accountant.
- Require jurisdiction, assessment year/financial year, entity type, and source documents before giving structured tax/compliance workflows.
- Later expand to other jurisdictions through country-specific packs.

### Lawyer Mode — India First

- Add a Lawyer-style assistant for document organization, legal-task tracking, case-note drafting support, contract-summary assistance, deadline tracking, and legal research workflows.
- Start with India-native legal terminology, courts, statutes, compliance categories, and filing/deadline workflows.
- Keep outputs framed as drafting/research/productivity assistance and not a substitute for professional legal advice unless provided by a licensed professional through a compliant workflow.
- Require jurisdiction, forum/court/authority, matter type, dates, documents, and user role before generating legal workflows.
- Later expand to other jurisdictions through country-specific packs.

### Product Constraint

- Expert modules must remain clearly separated from the core personal assistant MVP until the product has revenue, stronger compliance controls, disclaimers, audit trails, and jurisdiction-specific content governance.
