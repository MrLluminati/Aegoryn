# Security Policy

AegorynOS is expected to process sensitive personal records, including financial logs, tasks, projects, reminders, and possibly professional records. Security must be treated as a core product requirement.

---

## 1. Core Security Principles

- Privacy-first architecture.
- User-specific data isolation.
- Backend-controlled AI calls.
- Backend-controlled database writes.
- No secrets in frontend code.
- No secrets committed to GitHub.
- Row Level Security before real user data.
- Documentation updated for every security-relevant change.

---

## 2. Secret Handling

Never commit real secrets or credentials.

Forbidden examples include:

- API keys;
- service-role keys;
- database credentials;
- payment gateway secrets;
- tokens;
- OTPs;
- recovery codes;
- private keys;
- personal financial credentials.

Use `.env.example` only for safe placeholder names. Use `.env.local` for local development and deployment environment variables for production.

---

## 3. Supabase Security Requirements

Before real data is stored:

1. Row Level Security must be enabled.
2. User-specific policies must be created.
3. Users must only access their own records.
4. Service-role operations must remain server-side only.
5. Schema changes must be documented in `docs/DATABASE_SCHEMA.md`.

---

## 4. AI Security Requirements

AI output must not be blindly trusted.

Before any AI-generated action is written to the database:

1. validate classification;
2. validate required fields;
3. reject incomplete actions;
4. ask clarification where required;
5. preserve source text;
6. log status safely;
7. avoid logging secrets or private credentials.

---

## 5. Frontend Restrictions

The frontend must not directly call:

- AI provider APIs;
- privileged database operations;
- payment secret APIs;
- service-role database functions.

---

## 6. Payment Security - Future

Payment integration is not part of Version 0.1.

When added later:

- use backend webhook verification;
- never trust frontend payment status alone;
- document billing risk;
- store payment secrets only in deployment environment variables;
- update `docs/PROJECT_REGISTRY.md`, `docs/CONTACTS_AND_DOMAINS.md`, and `CHANGELOG.md`.

---

## 7. Reporting Security Issues

For now, report security issues directly to the project owner.

Future public security contact to be added in:

```text
docs/CONTACTS_AND_DOMAINS.md
```

Suggested future email:

```text
security@[domain]
```

---

## 8. Security Checklist Before Private Alpha

- [ ] `.env.local` is ignored by Git.
- [ ] no real credentials are committed.
- [ ] Supabase Row Level Security is enabled.
- [ ] user data is isolated by user ID.
- [ ] AI parser validates structured output.
- [ ] usage-credit gate runs before AI calls.
- [ ] logs do not expose secrets.
- [ ] admin/service-role logic is server-side only.
