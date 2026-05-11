# Release Notes Index

This folder stores one release-note file for every stable Git tag.

Release notes are not a substitute for Git history. They are a human-readable guide for the project owner or a future developer who needs to understand what each rollback point means.

## Current Tagged Releases

| Version | Date | Meaning |
|---|---|---|
| [`v0.0.1-planning`](v0.0.1-planning.md) | 2026-05-08 | Documentation and governance baseline. |
| [`v0.1.0-mvp-start`](v0.1.0-mvp-start.md) | 2026-05-09 | Initial Next.js/Tailwind app scaffold. |
| [`v0.1.1-supabase-schema`](v0.1.1-supabase-schema.md) | 2026-05-09 | Supabase schema, RLS, and seed-template baseline. |
| [`v0.1.2-supabase-connect`](v0.1.2-supabase-connect.md) | 2026-05-09 | Supabase connection, login page, and live dashboard baseline. |
| [`v0.1.3-account-ledger`](v0.1.3-account-ledger.md) | 2026-05-09 | Account ledger, manual transactions, and reversal safety baseline. |
| [`v0.1.3-brand-foundation`](v0.1.3-brand-foundation.md) | 2026-05-09 | MVP brand shell and UI consistency baseline. |
| [`v0.1.4-auth-nav-shell`](v0.1.4-auth-nav-shell.md) | 2026-05-11 | Authenticated navigation, sign-up, route protection, and ledger hardening baseline. |

## Rule

Every future Git tag must get a matching file in this folder before the tag is pushed.
