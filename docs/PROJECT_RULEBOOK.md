# AegorynOS Project Rulebook / Bylaws

This document sets out the working rules for the AegorynOS project.

The purpose of this rulebook is to preserve project continuity, prevent careless changes, protect sensitive data, and ensure that any human developer or AI agent can understand how the project should be maintained.

---

## Article 1 — Project Identity

1. The project is currently named **AegorynOS**.
2. The product name is **Aegoryn**.
3. The assistant name is **Aego**.
4. The tagline is **Guard your records. Command your life.**
5. The company/studio candidate is **Aegoryn Labs**.
6. These names must not be changed without explicit owner instruction.
7. Any name change must be recorded in:
   - `docs/PROJECT_REGISTRY.md`;
   - `docs/CONTACTS_AND_DOMAINS.md`;
   - `README.md`;
   - `CHANGELOG.md`.

---

## Article 2 — Source of Truth

The repository is the central source of truth for the project.

Primary documents:

| Document | Purpose |
|---|---|
| `README.md` | Public overview |
| `docs/PRD.md` | Product requirements |
| `docs/ARCHITECTURE.md` | Technical architecture |
| `docs/DATABASE_SCHEMA.md` | Database design |
| `docs/ROADMAP.md` | Development plan |
| `docs/PROJECT_REGISTRY.md` | Administrative project registry |
| `docs/CONTACTS_AND_DOMAINS.md` | Contacts, domains, handles, service accounts |
| `docs/AI_AGENT_GUIDELINES.md` | Rules for AI agents |
| `CONTRIBUTING.md` | Developer contribution rules |
| `CHANGELOG.md` | History of notable changes |

---

## Article 3 — Privacy and Security

1. AegorynOS is expected to manage sensitive personal records.
2. Privacy and data isolation are mandatory.
3. Secrets must never be committed to GitHub.
4. The frontend must never expose private backend credentials.
5. Backend code must validate AI output before writing to the database.
6. Supabase Row Level Security must be enabled before real user data is stored.
7. Production credentials must be stored in deployment environment variables or a secure password manager.

Forbidden repository content:

- API keys;
- passwords;
- OTPs;
- recovery codes;
- database passwords;
- Supabase service-role keys;
- OpenAI API keys;
- GitHub tokens;
- Vercel tokens;
- Razorpay/Stripe secrets;
- private financial credentials.

---

## Article 4 — AI Usage and Cost Control

1. All AI usage must be backend-mediated.
2. The app must check user credits before making AI API calls.
3. If user credits are exhausted, the backend must block the AI call.
4. The AI parser must return structured outputs.
5. The AI must ask clarification questions when required data is missing.
6. No AI result should be blindly trusted for database writes.

---

## Article 5 — Account Management Rules

1. The app must support bank accounts, money buckets, transactions, and monthly summaries.
2. If the user records an expense without mentioning the bank account, the assistant must ask which bank account was used.
3. If the user records an expense without mentioning whether it came from savings, pocket money, or another bucket, the assistant must ask for the source.
4. The assistant must not guess missing financial details.
5. Every transaction should preserve the original user source text.

---

## Article 6 — Documentation Duties

1. Documentation must stay current with project changes.
2. Any new feature must be reflected in the PRD or roadmap.
3. Any architecture change must be reflected in the architecture document.
4. Any database change must be reflected in the database schema document.
5. Any contact/domain/service account change must be reflected in the project registry and contacts/domains document.
6. Any notable change must be recorded in the changelog.

---

## Article 7 — Development Scope Discipline

Version 0.1 must focus on the MVP only.

Included MVP features:

- authentication;
- chat assistant;
- account management;
- transactions;
- tasks;
- projects;
- dashboard;
- AI usage credits.

Excluded from Version 0.1 unless expressly approved:

- payment gateway integration;
- mobile app release;
- public marketing website;
- Gmail integration;
- Calendar integration;
- WhatsApp bot;
- voice assistant;
- browser extension;
- team/family accounts;
- advanced analytics.

---

## Article 8 — Third-Party Services

Before adding a third-party service, document:

1. service name;
2. purpose;
3. account owner/email;
4. whether it stores user data;
5. whether it requires secrets;
6. where secrets are stored;
7. billing risk;
8. privacy/security concerns.

Update:

- `docs/PROJECT_REGISTRY.md`;
- `docs/CONTACTS_AND_DOMAINS.md`;
- `.env.example`, if applicable;
- `CHANGELOG.md`.

---

## Article 9 — Brand and IP Caution

1. Aegoryn is a working brand direction, not a formally registered trademark.
2. No document should claim final trademark ownership unless formal clearance and filing are completed.
3. Before public launch, search should be performed in:
   - IP India;
   - WIPO Global Brand Database;
   - USPTO;
   - EUIPO/TMview;
   - Google Play;
   - Apple App Store;
   - domain registries;
   - MCA name availability, if incorporating in India.
4. Backup names must remain recorded in the project registry.

---

## Article 10 — Change Management

Every substantial change should answer:

1. What changed?
2. Why was it changed?
3. Which files were affected?
4. Does documentation need updating?
5. Does the changelog need updating?
6. Does this affect privacy, security, cost, or user data?

---

## Article 11 — Ownership and Decision Authority

The project owner has final authority over:

- brand identity;
- product direction;
- public launch timing;
- monetisation;
- domain purchases;
- service accounts;
- API provider choices;
- app-store publication;
- sale/licensing of the product.

Developers and AI agents may suggest improvements but should not make strategic changes without approval.

---

## Article 12 — Current MVP Mandate

The immediate mandate is:

> Build a private web-based MVP that proves natural-language updates can be converted into structured records and displayed through a useful dashboard.

All work should support this mandate unless the owner changes direction.
