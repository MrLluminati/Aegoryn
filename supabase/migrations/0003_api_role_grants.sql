-- AegorynOS API role grants
-- Purpose: allow Supabase authenticated users to access tables through the Data API.
-- Row Level Security policies still restrict users to their own rows.

-- Schema access
grant usage on schema public to authenticated;

grant select, insert, update, delete on public.users_profile to authenticated;
grant select, insert, update, delete on public.accounts to authenticated;
grant select, insert, update, delete on public.money_buckets to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;
grant select, insert, update, delete on public.ai_usage to authenticated;

-- Allow authenticated users to use UUID defaults and identity/default-generated columns where applicable.
grant usage, select on all sequences in schema public to authenticated;

-- Keep anonymous users blocked from private MVP tables.
revoke all on public.users_profile from anon;
revoke all on public.accounts from anon;
revoke all on public.money_buckets from anon;
revoke all on public.transactions from anon;
revoke all on public.projects from anon;
revoke all on public.tasks from anon;
revoke all on public.ai_messages from anon;
revoke all on public.ai_usage from anon;
