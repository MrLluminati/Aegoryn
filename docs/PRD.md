# AegorynOS — Version 0.1 Product Requirements Document

**Product Name:** Aegoryn  
**System/App Name:** AegorynOS  
**Assistant Name:** Aego  
**Tagline:** Guard your records. Command your life.  
**Project Type:** AI-first personal assistant operating system  
**Version:** 0.1 MVP  
**Status:** Draft v1

---

## 1. Product Vision

AegorynOS is a private AI-powered personal assistant system where users can enter natural-language updates and the system automatically classifies, structures, stores, and displays them in the correct place.

Example:

> I received ₹3,000 pocket money in Kotak on 07.05.2026 and spent ₹421 on petrol from pocket money.

AegorynOS should understand that the update relates to account management, create the correct income and expense records, update the relevant money bucket, update the account dashboard, and ask clarifying questions only when required details are missing.

---

## 2. Core Promise

AegorynOS turns scattered life updates into structured, searchable records.

The app should function as:

- a personal finance tracker;
- a task and project manager;
- a personal records system;
- a reminder and follow-up assistant;
- a private command dashboard for life administration.

---

## 3. MVP Objective

Version 0.1 must prove one thing:

> A user can enter a natural-language update, and AegorynOS can classify it, extract structured data, store it, and update the dashboard.

---

## 4. MVP Modules

### 4.1 Authentication

- Email/password sign-up
- Email/password login
- Supabase Auth
- User-specific data isolation
- Protected app routes must redirect unauthenticated users before private pages load.
- New users should receive a `users_profile` row automatically or during first authenticated login.

### 4.2 Chat Assistant

Primary input screen. The user enters natural language updates, the backend checks usage credits, calls the AI parser, validates the result, and writes structured data to the database.

The product must remain chat-first. Manual forms may exist for testing, admin fallback, or correction flows, but the intended user experience is that users dump raw updates into the chat and Aego sorts them into the correct data structures.

Parser endpoints must require an authenticated user before processing private updates.

### 4.3 Account Management

Tracks bank accounts, balances, money buckets, income, expenses, transfers, and monthly summaries.

Transaction creation and reversal must be atomic: the transaction record and related account or money-bucket balance changes should succeed together or fail together.

Initial seeded data:

- Kotak Mahindra Bank: ₹6,010.48
- Axis Bank: -₹6.94
- SBI: ₹38.20
- May 2026 pocket money received: ₹3,000
- Petrol expense from pocket money: ₹421
- Remaining May pocket money: ₹2,579

### 4.4 Tasks

Create tasks from natural-language updates.

### 4.5 Projects

Track personal, professional, learning, and product projects.

### 4.6 Dashboard

Shows account balances, pocket money, recent transactions, active tasks, projects, recent updates, and AI usage credits.

### 4.7 Usage Credits

Every AI request must pass through a backend credit check before calling the AI API.

---

## 5. Core AI Behaviour

The AI must act as a structured command parser.

Classifications:

- account_management
- task_management
- project_update
- reminder
- note
- question
- unknown

AI response must include:

- classification
- requires_clarification
- clarification_question
- actions
- user-facing summary

---

## 6. Required Screens

- Login
- Sign-up
- Dashboard
- Chat Assistant
- Accounts
- Transactions
- Tasks
- Projects
- Analysis

---

## 7. Visual Analysis

AegorynOS should include a Visual Analysis layer that converts structured records into understandable charts and insights.

Initial analysis areas:

- monthly spending;
- category-wise expense split;
- pocket-money burn-down;
- savings trend;
- bank-wise balance split;
- AI-generated financial and productivity insights.

---

## 8. Future Expert Modules

These are future monetizable product extensions and are not part of the early MVP.

### 8.1 CA Mode — India First

A Chartered Accountant-style assistant module for Indian users. It should help organize financial records, classify invoices/receipts, prepare tax and compliance checklists, track financial-year and assessment-year requirements, and assist with GST/income-tax documentation workflows.

It must be framed as organizational and preparatory assistance, not a replacement for a licensed Chartered Accountant.

### 8.2 Lawyer Mode — India First

A Lawyer-style assistant module for Indian users. It should help organize legal documents, track case deadlines, create matter notes, support contract/document summaries, assist with legal drafting workflows, and structure compliance/case-management records.

It must be framed as drafting, research, and productivity assistance, and not as a substitute for professional legal advice unless delivered through a compliant professional workflow.

### 8.3 Expansion Direction

Both expert modules should begin with India-native terminology, workflows, and jurisdictional assumptions. Later versions may add country-specific packs for universal expansion.

---

## 9. Success Criteria

Version 0.1 succeeds if:

1. user can log in;
2. user can type a natural-language update;
3. the system extracts structured data;
4. the system asks clarification when required;
5. balances and money buckets update correctly;
6. transactions appear in ledger;
7. tasks/projects can be created through chat;
8. usage credits are tracked;
9. data is user-specific and secure.
