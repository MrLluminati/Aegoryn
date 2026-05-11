# AI Agent Guidelines for AegorynOS

This document gives instructions to AI agents working on this repository.

AegorynOS may be worked on by different AI assistants or human developers in the future. Any AI agent accessing this repository must follow these rules before making changes.

---

## 1. Read These Files First

Before editing code or documentation, read:

1. `README.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATABASE_SCHEMA.md`
5. `docs/ROADMAP.md`
6. `docs/PROJECT_REGISTRY.md`
7. `docs/CONTACTS_AND_DOMAINS.md`
8. `docs/PROJECT_RULEBOOK.md`
9. `docs/VERSIONING_AND_RELEASES.md`
10. `CONTRIBUTING.md`
11. `CHANGELOG.md`
12. `docs/LOCAL_VERIFICATION_GUIDE.md`

Do not make assumptions that contradict these files.

---

## 2. Product Identity

Current identity:

- Product: Aegoryn
- App/System: AegorynOS
- Assistant: Aego
- Tagline: Guard your records. Command your life.

Do not change these without explicit user instruction.

---

## 3. Mission

AegorynOS is not just a chatbot. It is a structured personal assistant system.

The core mission is:

> Convert natural-language life updates into structured, searchable, auditable records.

The AI should help organize:

- accounts;
- transactions;
- money buckets;
- tasks;
- projects;
- reminders;
- notes;
- personal records;
- future monetisation usage credits.

---

## 4. Critical Restrictions

AI agents must not:

- commit secrets or private credentials;
- place secret values in source code;
- expose backend-only credentials to frontend code;
- remove security warnings;
- remove or weaken `NOTICE.md`, CODEOWNERS, package author metadata, or ownership records;
- rename the product casually;
- delete project registry documents;
- ignore changelog updates;
- add payment logic without documenting it;
- add third-party services without recording them in the registry;
- claim trademark clearance is final unless formal clearance has been completed.

---

## 5. Credential Handling

If a feature requires credentials or service configuration, create or update `.env.example` with safe placeholder names only.

Never commit real credential values.

Real credential values must be stored only in:

- local environment files excluded from Git;
- deployment environment variables;
- the relevant service dashboard;
- a secure password manager.

---

## 6. Mandatory Documentation Update Rule

Every meaningful change must update documentation. This is mandatory, not optional.

A change is not complete until all affected documentation is updated.

Examples:

- Add new screen → update `docs/PRD.md` and `docs/ROADMAP.md`.
- Add new table → update `docs/DATABASE_SCHEMA.md`.
- Add new service → update `docs/PROJECT_REGISTRY.md` and `docs/CONTACTS_AND_DOMAINS.md`.
- Change architecture → update `docs/ARCHITECTURE.md`.
- Change project rule → update `docs/PROJECT_RULEBOOK.md`.
- Any notable change → update `CHANGELOG.md`.
- Any manual owner action → update `docs/LOCAL_VERIFICATION_GUIDE.md`.
- Any tag/release work → update `docs/releases/<tag>.md`, `docs/releases/README.md`, and the matching GitHub Release.

If unsure whether documentation needs updating, update it or clearly document why no update was required.

---

## 7. Finance-Tracking Behaviour

For account-management features, the system must ask clarifying questions if spending details are incomplete.

If a user says they paid/spent money but does not mention the bank account or whether it came from savings/pocket money, the assistant must ask:

> Which bank account was used, and was this from savings or pocket money?

Do not guess missing financial source details.

---

## 8. AI Parser Behaviour

The AI parser must produce structured outputs.

It should classify messages into:

- account_management;
- task_management;
- project_update;
- reminder;
- note;
- question;
- unknown.

If required fields are missing, set `requires_clarification` to true and do not write incomplete actions to the database.

---

## 9. Architecture Rule

All AI and database-writing logic must be backend-controlled.

Frontend may send user messages to backend endpoints, but must not directly call:

- AI provider APIs;
- privileged database operations;
- payment secret APIs.

---

## 10. User Safety and Privacy

AegorynOS is expected to handle sensitive personal records. Treat all user data as private.

Minimum requirements:

- user-specific data isolation;
- Row Level Security for Supabase;
- server-side validation;
- safe environment-variable handling;
- no secrets in logs;
- no unnecessary third-party sharing.

---

## 11. Changelog Rule

Every meaningful AI or human contribution must add an entry under `[Unreleased]` in `CHANGELOG.md`.

Use sections:

- Added;
- Changed;
- Fixed;
- Removed;
- Security.

---

## 12. MVP Discipline

Do not expand scope unnecessarily.

Version 0.1 is focused on:

- login;
- chat input;
- AI parser;
- accounts;
- transactions;
- tasks;
- projects;
- dashboard;
- usage credits.

Avoid adding advanced features before the MVP works.

---

## 13. Ownership Notice Discipline

The project owner is Abhijeet Kumar, alias MrLluminati.

AI agents must preserve:

- `NOTICE.md`;
- `.github/CODEOWNERS`;
- package author/license metadata;
- `lib/ownership.ts`;
- ownership entries in `docs/PROJECT_REGISTRY.md`.

If new ownership-sensitive files are added, update `NOTICE.md` or the registry when needed. Do not add an open-source license or third-party ownership claim without explicit owner approval.
