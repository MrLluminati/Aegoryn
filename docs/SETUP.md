# AegorynOS Setup Guide

This guide explains how to prepare the local development environment for AegorynOS.

Current local repository path expected by the project owner:

```text
D:\Coding\Repos\Aegoryn
```

---

## 1. Prerequisites

Install these before app development begins:

- Git
- Node.js LTS
- npm or pnpm
- Visual Studio Code
- GitHub account access
- Supabase account
- Vercel account
- OpenAI Platform account

---

## 2. Clone Repository

```powershell
cd D:\Coding\Repos
git clone https://github.com/MrLluminati/Aegoryn.git
cd D:\Coding\Repos\Aegoryn
```

If the folder already exists:

```powershell
cd D:\Coding\Repos\Aegoryn
git pull origin main
```

---

## 3. Environment File

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Then fill `.env.local` with actual local development values.

Never commit `.env.local`.

---

## 4. Install Dependencies

This will be used after the Next.js app is scaffolded:

```powershell
npm install
```

or, if using pnpm later:

```powershell
pnpm install
```

---

## 5. Start Development Server

After app setup:

```powershell
npm run dev
```

Expected local URL:

```text
http://localhost:3000
```

---

## 6. Supabase Setup Overview

Supabase will be used for:

- authentication;
- PostgreSQL database;
- Row Level Security;
- user-specific data isolation.

Before storing real user data:

1. create Supabase project;
2. add environment values to `.env.local`;
3. run database schema or migrations;
4. enable Row Level Security;
5. create access policies;
6. test that one user cannot access another user's data.

---

## 7. AI Provider Setup Overview

AI calls must be backend-controlled.

The frontend must not directly call the AI provider.

Backend flow:

1. authenticate user;
2. check monthly AI credits;
3. call AI parser;
4. validate structured output;
5. write safe actions to database;
6. log the processed message;
7. deduct usage credits.

---

## 8. Manual Update Fallback

If direct GitHub updates fail, a ZIP-based manual update may be provided.

Default ZIP download location:

```powershell
$env:USERPROFILE\Downloads
```

Local repository path:

```powershell
D:\Coding\Repos\Aegoryn
```

The assistant should provide a PowerShell script to extract, copy, stage, commit, and push the update.

---

## 9. Common Commands

```powershell
git status
git pull origin main
git add .
git commit -m "Your commit message"
git push origin main
```

---

## 10. Version Tags

Versioning is handled through Git tags.

Example:

```powershell
git tag -a v0.0.1-planning -m "AegorynOS planning baseline"
git push origin v0.0.1-planning
```

See:

```text
docs/VERSIONING_AND_RELEASES.md
```
