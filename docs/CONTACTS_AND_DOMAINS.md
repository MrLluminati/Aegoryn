# Contacts and Domains Register

This document tracks public-facing and administrative contact details, domains, handles, and service accounts for AegorynOS.

**Security warning:** Do not store passwords, API keys, tokens, OTPs, private keys, or recovery codes in this file.

---

## 1. Primary Contacts

| Purpose | Email / Contact | Status | Notes |
|---|---|---|---|
| Founder / Owner | To be added | Pending | Main project owner contact. |
| Product Support | To be added | Pending | Suggested format: support@[domain]. |
| Legal Notices | To be added | Pending | Suggested format: legal@[domain]. |
| Privacy / Data Requests | To be added | Pending | Suggested format: privacy@[domain]. |
| Security Reports | To be added | Pending | Suggested format: security@[domain]. |
| Developer/Admin | To be added | Pending | Used for Vercel, Supabase, OpenAI, etc. |

---

## 2. Domain Candidates

| Domain | Availability | Priority | Intended Use | Notes |
|---|---|---|---|---|
| aegoryn.com | Not checked | High | Main public website | Best global domain if available. |
| aegoryn.in | Not checked | High | India presence | Useful for Indian launch. |
| aegorynos.com | Not checked | Medium | App/system site | Useful if Aegoryn.com unavailable. |
| aegoryn.ai | Not checked | Medium | AI-focused brand | May be expensive. |
| aegorynlabs.com | Not checked | Medium | Company/studio website | Useful if operating as Aegoryn Labs. |

---

## 3. Email Setup Plan

When a domain is purchased, recommended email aliases:

| Alias | Purpose |
|---|---|
| hello@[domain] | General inquiries |
| support@[domain] | Product support |
| legal@[domain] | Legal notices |
| privacy@[domain] | Privacy/data requests |
| security@[domain] | Vulnerability/security reports |
| admin@[domain] | Service/account administration |

---

## 4. Social Handles

| Platform | Desired Handle | Status | Notes |
|---|---|---|---|
| GitHub Organization | Aegoryn / AegorynOS | Pending | Optional later. Current repo is MrLluminati/Aegoryn. |
| X / Twitter | @aegoryn | Pending | Check before launch. |
| LinkedIn Page | Aegoryn / Aegoryn Labs | Pending | Create after formal brand comfort. |
| Instagram | @aegoryn | Pending | Optional. |
| YouTube | @aegoryn | Pending | Optional demos/devlogs. |

---

## 5. Service Accounts

| Service | Purpose | Account Email | Status | Sensitive Data Location |
|---|---|---|---|---|
| GitHub | Code repository | To be added | Active | GitHub account settings |
| Vercel | Hosting | To be added | Pending | Vercel env variables |
| Supabase | Database/Auth | To be added | Pending | Supabase dashboard/env variables |
| OpenAI Platform | AI API | To be added | Pending | Backend env variables only |
| Razorpay | India payments | To be added | Future | Razorpay dashboard/env variables |
| Stripe | Global payments | To be added | Future | Stripe dashboard/env variables |
| Domain Registrar | Domain purchase/DNS | To be added | Pending | Registrar dashboard |

---

## 6. Domain Purchase Checklist

Before buying any domain:

1. Search exact name on Google.
2. Check trademark databases.
3. Check Google Play and Apple App Store.
4. Check existing social handles.
5. Check whether the domain has bad history.
6. Prefer `.com` where possible.
7. Buy `.in` if India launch is planned.
8. Enable domain privacy where legally available.
9. Set up secure email and DNS records.

---

## 7. DNS / Email Setup Checklist

After domain purchase:

- Configure nameservers.
- Add SPF record.
- Add DKIM record.
- Add DMARC record.
- Add MX records.
- Add verification records for Vercel/Supabase if needed.
- Enable two-factor authentication on registrar account.
