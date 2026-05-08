-- AegorynOS Row Level Security policies
-- Version target: v0.1.1-supabase-schema

alter table public.users_profile enable row level security;
alter table public.accounts enable row level security;
alter table public.money_buckets enable row level security;
alter table public.transactions enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_usage enable row level security;

create policy "Users can read own profile" on public.users_profile
  for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.users_profile
  for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.users_profile
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own profile" on public.users_profile
  for delete using (auth.uid() = user_id);

create policy "Users can read own accounts" on public.accounts
  for select using (auth.uid() = user_id);
create policy "Users can insert own accounts" on public.accounts
  for insert with check (auth.uid() = user_id);
create policy "Users can update own accounts" on public.accounts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own accounts" on public.accounts
  for delete using (auth.uid() = user_id);

create policy "Users can read own money buckets" on public.money_buckets
  for select using (auth.uid() = user_id);
create policy "Users can insert own money buckets" on public.money_buckets
  for insert with check (auth.uid() = user_id);
create policy "Users can update own money buckets" on public.money_buckets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own money buckets" on public.money_buckets
  for delete using (auth.uid() = user_id);

create policy "Users can read own transactions" on public.transactions
  for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions
  for delete using (auth.uid() = user_id);

create policy "Users can read own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

create policy "Users can read own tasks" on public.tasks
  for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);

create policy "Users can read own ai messages" on public.ai_messages
  for select using (auth.uid() = user_id);
create policy "Users can insert own ai messages" on public.ai_messages
  for insert with check (auth.uid() = user_id);

create policy "Users can read own ai usage" on public.ai_usage
  for select using (auth.uid() = user_id);
create policy "Users can insert own ai usage" on public.ai_usage
  for insert with check (auth.uid() = user_id);
create policy "Users can update own ai usage" on public.ai_usage
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
