# AegorynOS Architecture

## Overview

AegorynOS should be built as a private web app first, with mobile app conversion later.

## Recommended Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js |
| Styling | Tailwind CSS |
| Backend | Next.js API routes / server actions |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Route protection | Next.js proxy and Supabase cookie-backed session checks |
| AI | OpenAI API |
| Hosting | Vercel |
| Payments later | Razorpay / Stripe |
| Mobile later | React Native / Expo |

## Core Flow

```text
User logs in
  ↓
User enters chat update
  ↓
Backend checks AI credits
  ↓
Backend calls AI parser
  ↓
Backend validates structured output
  ↓
Backend writes to database
  ↓
Dashboard updates
```

## Current Auth Flow

The browser Supabase client uses cookie-backed auth through `@supabase/ssr`.

The Next.js proxy checks protected app routes before page render:

```text
/chat
/dashboard
/accounts
/profile
/settings
/usage
```

If no verified Supabase user is present, the proxy redirects to `/login`.

The public landing page remains accessible to signed-in users, but its primary action changes to open authenticated app areas.

The client `ProtectedRoute` wrapper remains as a friendly loading and fallback layer, but the proxy is the first guard.

## Current Ledger Write Flow

Manual ledger entries call Supabase RPC functions instead of performing separate client-side writes.

Current functions:

```text
create_ledger_transaction
reverse_ledger_transaction
```

These functions keep transaction creation, reversal creation, account balance updates, and money-bucket updates inside one database transaction.

## AI Safety and Cost Control

The frontend must never call OpenAI directly. All AI calls must go through the backend.

Parser API routes must verify the authenticated Supabase user on the server before processing private text.

## Current Parser Log Flow

The current parser is still deterministic and local to the app. It does not call a paid AI provider yet.

For every signed-in parser request:

```text
Chat page sends private text
  ↓
API route verifies the Supabase user
  ↓
Deterministic parser creates a structured result
  ↓
API route saves the user message and parser result to ai_messages
  ↓
Chat page shows the parser response
```

The chat page also reads recent `ai_messages` rows for the signed-in user and groups them by the user's local calendar day. This creates a daily logbook without adding a separate conversation table yet.

Current daily log behavior:

1. Today opens as the active chat by default.
2. Older days appear in the chat sidebar.
3. When the browser's calendar day changes, the active "today" log becomes a fresh day.
4. Older logs remain readable because the underlying `ai_messages` rows are preserved.

Row Level Security keeps each user's parser history isolated.

The browser voice-input button uses browser speech recognition where supported. Audio is handled by the browser; the app only sends text after the user submits the transcript.

This is not the final action-save workflow. Structured transaction, task, and project writes still need validation and a confirmation step before Aego writes them to the operational tables.

Before every AI call:

1. Authenticate user.
2. Check credit balance.
3. If exhausted, block request.
4. If allowed, call AI.
5. Validate JSON output.
6. Save structured actions.
7. Deduct credits.
8. Save AI message log.

## Future Architecture Requirements

- Payments should connect to the usage-credit system.
- Each user must have isolated data.
- Row Level Security must be enabled in Supabase.
- AI provider should be abstracted so models can be changed later.
- Export/backup should be added before public beta.
