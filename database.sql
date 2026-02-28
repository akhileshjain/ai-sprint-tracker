-- ============================================================
-- AI Sprint Tracker - Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Automatically populated when a user signs up via trigger below
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null,
  full_name    text default '',
  is_admin     boolean default false,
  created_at   timestamptz default now()
);

-- 2. TASK PROGRESS TABLE
-- One row per user per task. Upserted on every status/note change.
create table if not exists public.task_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  task_id      text not null,
  status       text default 'todo' check (status in ('todo', 'inprog', 'done')),
  note         text default '',
  updated_at   timestamptz default now(),
  unique(user_id, task_id)
);

-- 3. ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.task_progress enable row level security;

-- Profiles: users can read/update/insert their own
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Helper function: checks if current user is admin WITHOUT triggering RLS
-- (security definer runs as the function owner, bypassing row-level policies)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
$$ language sql security definer stable;

-- Profiles: admins can read ALL profiles (needed for admin dashboard)
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Task progress: users manage their own rows
create policy "Users can manage own progress"
  on public.task_progress for all
  using (auth.uid() = user_id);

-- Task progress: admins can read all rows
create policy "Admins can view all progress"
  on public.task_progress for select
  using (public.is_admin());

-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- When a new user signs up, automatically insert a profiles row
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. MAKE YOURSELF ADMIN
-- After signing up with your own account, run this to give yourself admin access.
-- Replace 'your@email.com' with your actual email.
--
-- update public.profiles set is_admin = true where email = 'your@email.com';
