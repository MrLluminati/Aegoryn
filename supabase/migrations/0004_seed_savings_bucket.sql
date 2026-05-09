-- Seed default Savings money bucket for the current AegorynOS test user.
-- Version target: v0.1.3-brand-foundation / account-management correction
--
-- Manual use:
-- 1. Replace the user id below with the target Supabase Auth user id if needed.
-- 2. Review calculated savings before running.
-- 3. Run in Supabase SQL Editor.
--
-- Model:
-- bank account = where money physically sits
-- money bucket = source, purpose, or allocation
-- Savings bucket = total current bank balances minus active Pocket Money balance

with target_user as (
  select 'b8a9564b-d54d-44a8-9cd9-2082925b0bd0'::uuid as user_id
), totals as (
  select
    tu.user_id,
    coalesce((
      select sum(a.current_balance)
      from public.accounts a
      where a.user_id = tu.user_id
    ), 0) as total_bank_balance,
    coalesce((
      select mb.current_balance
      from public.money_buckets mb
      where mb.user_id = tu.user_id
        and mb.bucket_name = 'Pocket Money'
      order by mb.bucket_month desc nulls last, mb.created_at desc
      limit 1
    ), 0) as pocket_money_balance
  from target_user tu
), savings as (
  select
    user_id,
    total_bank_balance,
    pocket_money_balance,
    total_bank_balance - pocket_money_balance as savings_balance
  from totals
)
insert into public.money_buckets (
  user_id,
  bucket_name,
  bucket_month,
  starting_amount,
  current_balance,
  linked_account_id,
  notes
)
select
  s.user_id,
  'Savings',
  null,
  s.savings_balance,
  s.savings_balance,
  null,
  'Default savings bucket. Calculated as total current bank balance minus active Pocket Money balance at setup time.'
from savings s
where not exists (
  select 1
  from public.money_buckets existing
  where existing.user_id = s.user_id
    and existing.bucket_name = 'Savings'
);
