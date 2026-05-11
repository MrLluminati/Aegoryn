# AegorynOS Setup Guide

This guide explains how to prepare the local development environment for AegorynOS.

Current local repository path expected by the project owner:

```text
D:\Coding\Repos\Aegoryn
```

Primary development environment:

```text
Visual Studio Code on Windows, using the VS Code integrated terminal with PowerShell 7.
```

---

## 1. Prerequisites

Install these before app development begins:

- Git
- Node.js LTS
- npm
- Visual Studio Code
- PowerShell 7
- GitHub account access
- Supabase account
- Vercel account
- OpenAI Platform account

---

## 2. Open Project in VS Code

Recommended workflow:

```powershell
cd D:\Coding\Repos\Aegoryn
code .
```

Use VS Code's integrated terminal:

```text
Terminal → New Terminal
```

Use PowerShell 7 as the terminal for project commands.

---

## 3. Clone Repository

```powershell
cd D:\Coding\Repos
git clone https://github.com/MrLluminati/Aegoryn.git
cd D:\Coding\Repos\Aegoryn
code .
```

If the folder already exists:

```powershell
cd D:\Coding\Repos\Aegoryn
git pull origin main
code .
```

---

## 4. Environment File

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Then fill `.env.local` with actual local development values.

Never commit `.env.local`.

In VS Code, `.env.local` may be edited locally, but it must remain ignored by Git.

---

## 5. Install Dependencies

```powershell
npm install
```

---

## 6. Start Development Server

```powershell
npm run dev
```

Expected local URL:

```text
http://localhost:3000
```

Useful current routes:

```text
http://localhost:3000
http://localhost:3000/signup
http://localhost:3000/login
http://localhost:3000/dashboard
http://localhost:3000/chat
http://localhost:3000/setup/supabase
```

After auth-related changes, sign in again if protected pages redirect unexpectedly. The app uses cookie-backed Supabase auth so the Next.js proxy and API routes can verify the user.

For a step-by-step non-coder verification checklist, see:

```text
docs/LOCAL_VERIFICATION_GUIDE.md
```

---

## 7. Build Check

Before creating a version tag, run:

```powershell
npm run build
```

If the build fails, fix the error before tagging.

---

## 8. Supabase Setup Overview

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

## 9. AI Provider Setup Overview

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

## 10. Manual Update Fallback

If direct GitHub updates fail, a ZIP-based manual update may be provided.

Default ZIP download location:

```powershell
$env:USERPROFILE\Downloads
```

Local repository path:

```powershell
D:\Coding\Repos\Aegoryn
```

The assistant should provide a PowerShell 7-compatible script to extract, copy, stage, commit, and push the update.

---

## 11. Common Git Commands

```powershell
git status
git pull origin main
git add .
git commit -m "Your commit message"
git push origin main
```

When local commits exist and remote changes were added by the assistant:

```powershell
git pull --rebase origin main
git push origin main
```

---

## 12. Version Tags

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
