-- AegorynOS atomic ledger functions
-- Purpose: keep transaction inserts and account/bucket balance updates in one database transaction.

create or replace function public.create_ledger_transaction(
  p_transaction_date date,
  p_transaction_type text,
  p_amount numeric,
  p_category text,
  p_account_id uuid,
  p_money_bucket_id uuid,
  p_description text,
  p_source_text text
)
returns public.transactions
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_delta numeric(12,2);
  v_transaction public.transactions%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero.' using errcode = '22023';
  end if;

  if p_transaction_type not in ('income', 'expense', 'transfer') then
    raise exception 'Transaction type must be income, expense, or transfer.' using errcode = '22023';
  end if;

  if p_account_id is not null and not exists (
    select 1 from public.accounts
    where id = p_account_id and user_id = v_user_id
  ) then
    raise exception 'Selected account was not found for this user.' using errcode = '22023';
  end if;

  if p_money_bucket_id is not null and not exists (
    select 1 from public.money_buckets
    where id = p_money_bucket_id and user_id = v_user_id
  ) then
    raise exception 'Selected money bucket was not found for this user.' using errcode = '22023';
  end if;

  v_delta := case
    when p_transaction_type = 'income' then p_amount
    when p_transaction_type = 'expense' then -p_amount
    else 0
  end;

  insert into public.transactions (
    user_id,
    transaction_date,
    transaction_type,
    amount,
    category,
    account_id,
    money_bucket_id,
    description,
    source_text
  )
  values (
    v_user_id,
    p_transaction_date,
    p_transaction_type,
    p_amount,
    nullif(p_category, ''),
    p_account_id,
    p_money_bucket_id,
    nullif(p_description, ''),
    nullif(p_source_text, '')
  )
  returning * into v_transaction;

  if p_account_id is not null then
    update public.accounts
    set current_balance = current_balance + v_delta,
        updated_at = now()
    where id = p_account_id and user_id = v_user_id;
  end if;

  if p_money_bucket_id is not null then
    update public.money_buckets
    set current_balance = current_balance + v_delta,
        updated_at = now()
    where id = p_money_bucket_id and user_id = v_user_id;
  end if;

  return v_transaction;
end;
$$;

create or replace function public.reverse_ledger_transaction(p_transaction_id uuid)
returns public.transactions
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_original public.transactions%rowtype;
  v_reversal_type text;
  v_delta numeric(12,2);
  v_reversal public.transactions%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  select *
  into v_original
  from public.transactions
  where id = p_transaction_id and user_id = v_user_id;

  if not found then
    raise exception 'Original transaction was not found for this user.' using errcode = '22023';
  end if;

  if v_original.category = 'reversal'
    or lower(coalesce(v_original.description, '')) like '%reversal%'
    or lower(coalesce(v_original.source_text, '')) like '%reversal%' then
    raise exception 'This transaction is already a reversal entry.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.transactions
    where user_id = v_user_id
      and id <> v_original.id
      and category = 'reversal'
      and source_text ilike ('%' || v_original.id::text || '%')
  ) then
    raise exception 'This transaction has already been reversed once.' using errcode = '22023';
  end if;

  v_reversal_type := case
    when v_original.transaction_type = 'income' then 'expense'
    when v_original.transaction_type = 'expense' then 'income'
    else 'transfer'
  end;

  v_delta := case
    when v_reversal_type = 'income' then v_original.amount
    when v_reversal_type = 'expense' then -v_original.amount
    else 0
  end;

  insert into public.transactions (
    user_id,
    transaction_date,
    transaction_type,
    amount,
    category,
    account_id,
    money_bucket_id,
    description,
    source_text
  )
  values (
    v_user_id,
    current_date,
    v_reversal_type,
    v_original.amount,
    'reversal',
    v_original.account_id,
    v_original.money_bucket_id,
    'Reversal of: ' || coalesce(v_original.description, v_original.category, v_original.transaction_type),
    'Reversal entry created to preserve audit history. Original transaction id: ' || v_original.id::text || '. Original note: ' || coalesce(v_original.source_text, 'N/A')
  )
  returning * into v_reversal;

  if v_original.account_id is not null then
    update public.accounts
    set current_balance = current_balance + v_delta,
        updated_at = now()
    where id = v_original.account_id and user_id = v_user_id;
  end if;

  if v_original.money_bucket_id is not null then
    update public.money_buckets
    set current_balance = current_balance + v_delta,
        updated_at = now()
    where id = v_original.money_bucket_id and user_id = v_user_id;
  end if;

  return v_reversal;
end;
$$;

revoke all on function public.create_ledger_transaction(date, text, numeric, text, uuid, uuid, text, text) from public;
revoke all on function public.create_ledger_transaction(date, text, numeric, text, uuid, uuid, text, text) from anon;
grant execute on function public.create_ledger_transaction(date, text, numeric, text, uuid, uuid, text, text) to authenticated;

revoke all on function public.reverse_ledger_transaction(uuid) from public;
revoke all on function public.reverse_ledger_transaction(uuid) from anon;
grant execute on function public.reverse_ledger_transaction(uuid) to authenticated;
