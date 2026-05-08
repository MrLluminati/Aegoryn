# Supabase Seed Data

This folder stores safe seed-data templates for local development.

Do not commit real private credentials or sensitive production data here.

The first seed target is the owner's initial account-management data:

- Kotak Mahindra Bank: ₹6,010.48
- Axis Bank: -₹6.94
- SBI: ₹38.20
- May 2026 pocket money received: ₹3,000
- Petrol expense from pocket money: ₹421
- Remaining May pocket money: ₹2,579

Because Supabase rows require the authenticated user's UUID, seed inserts should be run only after a user account exists.

Use `seed_template.sql` by replacing the placeholder user UUID with the local authenticated user's UUID.
