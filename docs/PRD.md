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

- Email/password login
- Supabase Auth
- User-specific data isolation

### 4.2 Chat Assistant

Primary input screen. The user enters natural language updates, the backend checks usage credits, calls the AI parser, validates the result, and writes structured data to the database.

### 4.3 Account Management

Tracks bank accounts, balances, money buckets, income, expenses, transfers, and monthly summaries.

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
- Dashboard
- Chat Assistant
- Accounts
- Transactions
- Tasks
- Projects

---

## 7. Success Criteria

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
