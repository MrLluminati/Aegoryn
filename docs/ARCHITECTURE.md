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

## AI Safety and Cost Control

The frontend must never call OpenAI directly. All AI calls must go through the backend.

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
