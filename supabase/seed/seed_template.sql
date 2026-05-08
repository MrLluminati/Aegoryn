-- AegorynOS local development seed template
-- Replace placeholders before running locally.
-- Do not use this file for production data.
-- Do not commit private financial details, credentials, or production user data.

-- Required placeholder:
-- <USER_UUID> = authenticated user's UUID from Supabase Auth

insert into public.users_profile (user_id, full_name, currency, timezone)
values ('<USER_UUID>', '<DISPLAY_NAME>', 'INR', 'Asia/Kolkata')
on conflict (user_id) do nothing;

insert into public.accounts (user_id, account_name, account_type, current_balance, is_primary, notes)
values
  ('<USER_UUID>', '<PRIMARY_BANK_NAME>', 'bank', 0.00, true, 'Primary account placeholder.'),
  ('<USER_UUID>', '<SECONDARY_BANK_NAME>', 'bank', 0.00, false, 'Secondary account placeholder.')
;

insert into public.money_buckets (user_id, bucket_name, bucket_month, starting_amount, current_balance, linked_account_id, notes)
values (
  '<USER_UUID>',
  '<BUCKET_NAME>',
  '<YYYY-MM>',
  0.00,
  0.00,
  (select id from public.accounts where user_id = '<USER_UUID>' and account_name = '<PRIMARY_BANK_NAME>' limit 1),
  'Money bucket placeholder.'
);

insert into public.transactions (user_id, transaction_date, transaction_type, amount, category, account_id, money_bucket_id, description, source_text)
values
  (
    '<USER_UUID>',
    current_date,
    'income',
    0.00,
    '<CATEGORY>',
    (select id from public.accounts where user_id = '<USER_UUID>' and account_name = '<PRIMARY_BANK_NAME>' limit 1),
    (select id from public.money_buckets where user_id = '<USER_UUID>' and bucket_name = '<BUCKET_NAME>' and bucket_month = '<YYYY-MM>' limit 1),
    'Income placeholder.',
    'Original user message placeholder.'
  )
;
