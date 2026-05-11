# AegorynOS

**Product:** Aegoryn  
**Assistant:** Aego  
**Tagline:** Guard your records. Command your life.

AegorynOS is an AI-first personal assistant operating system designed to turn natural-language life updates into structured, searchable records.

## MVP Goal

Version 0.1 proves the core workflow:

> User enters a natural-language update → AI classifies and extracts structured data → backend validates it → database updates → dashboard reflects the record.

## Initial Modules

- Authentication
- Chat Assistant
- Account Management
- Transactions
- Tasks
- Projects
- Dashboard
- AI Usage Credits

## Recommended Stack

- Next.js
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- OpenAI API
- Vercel deployment

## Repository Foundation

This repository includes the project foundation documents and safety rules required before app code begins:

- `.gitignore`
- `.env.example`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `docs/SETUP.md`
- `docs/SECURITY.md`
- `docs/MVP_BACKLOG.md`
- `docs/LOCAL_VERIFICATION_GUIDE.md`
- `docs/VERSIONING_AND_RELEASES.md`
- `docs/releases/`
- `docs/PROJECT_RULEBOOK.md`
- `docs/AI_AGENT_GUIDELINES.md`

## Documentation

See the `docs/` folder:

- `PRD.md`
- `ARCHITECTURE.md`
- `DATABASE_SCHEMA.md`
- `ROADMAP.md`
- `PROJECT_REGISTRY.md`
- `CONTACTS_AND_DOMAINS.md`
- `SETUP.md`
- `SECURITY.md`
- `MVP_BACKLOG.md`
- `LOCAL_VERIFICATION_GUIDE.md`
- `VERSIONING_AND_RELEASES.md`
- `releases/`
- `PROJECT_RULEBOOK.md`
- `AI_AGENT_GUIDELINES.md`

## Security Note

Do not commit real credentials, API keys, tokens, OTPs, recovery codes, or private financial information. Use `.env.local` for local development and deployment environment variables for production.

## Current Status

MVP development is in progress. The repository now includes the Next.js app scaffold, Supabase-backed authentication and account-ledger surfaces, protected app navigation, the initial deterministic Aego parser endpoint, and placeholder profile/settings/usage pages.
