# Contributing Guidelines

These guidelines explain how humans and AI agents should contribute to AegorynOS.

---

## 1. Project Identity

AegorynOS is an AI-first personal assistant operating system.

Current identity:

- Product Name: Aegoryn
- App/System Name: AegorynOS
- Assistant Name: Aego
- Tagline: Guard your records. Command your life.

Do not rename the project, assistant, or tagline without updating:

- `docs/PROJECT_REGISTRY.md`
- `docs/CONTACTS_AND_DOMAINS.md`
- `CHANGELOG.md`
- relevant README/docs references

---

## 2. Development Principles

AegorynOS must be built around these principles:

1. Privacy-first architecture.
2. User-specific data isolation.
3. Structured records over loose chat.
4. AI calls must be backend-mediated.
5. No exposed API keys in frontend code.
6. Every important project decision must be documented.
7. Every major change must update the changelog.
8. Sensitive credentials must never be committed.

---

## 3. Documentation Rules

When making project changes, update the relevant documentation:

| Change Type | Required Document Updates |
|---|---|
| Product feature | `docs/PRD.md`, `docs/ROADMAP.md`, `CHANGELOG.md` |
| Architecture change | `docs/ARCHITECTURE.md`, `CHANGELOG.md` |
| Database change | `docs/DATABASE_SCHEMA.md`, migration file, `CHANGELOG.md` |
| New service/account/domain | `docs/PROJECT_REGISTRY.md`, `docs/CONTACTS_AND_DOMAINS.md` |
| Naming/brand change | `docs/PROJECT_REGISTRY.md`, `README.md`, `CHANGELOG.md` |
| Security/credential handling | `docs/PROJECT_RULEBOOK.md`, `.env.example`, `CHANGELOG.md` |
| Manual owner verification | `docs/LOCAL_VERIFICATION_GUIDE.md`, relevant setup guide, `CHANGELOG.md` |
| Version tag or release | `CHANGELOG.md`, `docs/VERSIONING_AND_RELEASES.md`, `docs/releases/<tag>.md`, GitHub Release |

---

## 4. Git Rules

- Keep commits small and meaningful.
- Use clear commit messages.
- Do not mix unrelated changes.
- Do not commit generated secrets or local environment files.
- Prefer feature branches for substantial code changes.

Suggested commit message style:

```text
Add dashboard account summary cards
Update database schema for money buckets
Fix AI parser clarification handling
Document Supabase setup process
```

---

## 5. Security Rules

Never commit:

- API keys;
- passwords;
- database credentials;
- Supabase service-role keys;
- OpenAI API keys;
- GitHub tokens;
- Vercel tokens;
- payment gateway secrets;
- OTPs or recovery codes;
- private financial information.

Use:

- `.env.local` for local development;
- `.env.example` for safe variable names;
- deployment environment variables for production;
- a password manager for real credentials.

---

## 5A. Ownership Rules

The project is owned by Abhijeet Kumar, alias MrLluminati.

Do not remove or weaken:

- `NOTICE.md`;
- `.github/CODEOWNERS`;
- package author/license metadata;
- ownership records in `docs/PROJECT_REGISTRY.md`.

This repository is not open-source licensed unless the owner explicitly adds a license file later.

---

## 6. Code Quality Rules

When code is added later:

- use TypeScript where possible;
- keep components small and readable;
- validate AI output before database writes;
- sanitize user input;
- handle errors clearly;
- keep database operations server-side;
- enable Row Level Security in Supabase;
- write migration files for schema changes;
- avoid unnecessary dependencies.

---

## 7. AI Parser Rules

The AI parser must return structured data, not uncontrolled prose.

For user updates, the parser should classify messages into:

- account_management;
- task_management;
- project_update;
- reminder;
- note;
- question;
- unknown.

If required details are missing, the AI should ask a clarification question instead of guessing.

Example missing finance details:

> Which bank account was used, and was this from savings or pocket money?

---

## 8. Review Checklist

Before merging or accepting any substantial change:

- Does it follow the product vision?
- Does it preserve privacy and data isolation?
- Does it avoid committing credentials?
- Does it update relevant docs?
- Does it update `CHANGELOG.md`?
- Does it avoid breaking current MVP scope?
- Does it keep future monetisation in mind?

---

## 9. Contact and Ownership

Administrative project details should be maintained in:

- `docs/PROJECT_REGISTRY.md`
- `docs/CONTACTS_AND_DOMAINS.md`

Do not add private credentials to these documents.
