-- Supabase SQL: registrations table for student registration form
-- Run this in the Supabase SQL editor (SQL > New query)

create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  dob date,
  parent_name text,
  parent_cnic numeric(13),
  student_contact numeric,
  parent_contact numeric,
  class text,
  registration_fee integer,
  registration_date text,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.registrations enable row level security;

drop policy if exists "Users can select all registrations" on public.registrations;
create policy "Users can select all registrations" on public.registrations
  for select using (auth.uid() IS NOT NULL);

drop policy if exists "Users can insert their own registrations" on public.registrations;
create policy "Users can insert their own registrations" on public.registrations
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own registrations" on public.registrations;
create policy "Users can update their own registrations" on public.registrations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own registrations" on public.registrations;
create policy "Users can delete their own registrations" on public.registrations
  for delete using (auth.uid() = user_id);

-- Index for quick lookup by user
create index if not exists idx_registrations_user_id on public.registrations(user_id);

-- Example: grant insert/select to anon (if you want client-side inserts via anon key)
-- grant insert, select on public.registrations to anon;
