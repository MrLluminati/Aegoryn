-- AegorynOS user profile bootstrap
-- Purpose: create a users_profile row automatically whenever Supabase Auth creates a user.

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (user_id, currency, timezone)
  values (new.id, 'INR', 'Asia/Kolkata')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

revoke all on function public.create_profile_for_new_user() from public;
revoke all on function public.create_profile_for_new_user() from anon;
revoke all on function public.create_profile_for_new_user() from authenticated;
