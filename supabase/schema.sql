-- RiceTrack Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  sex text check (sex in ('male', 'female', 'other')),
  age integer,
  height_cm numeric,
  weight_kg numeric,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal text check (goal in ('lose', 'maintain', 'gain')),
  preferred_cuisines text[] default '{}',
  daily_calorie_target integer default 2000,
  daily_protein_target integer default 120,
  daily_carbs_target integer default 200,
  daily_fat_target integer default 65,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Meals table
create table if not exists public.meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_url text,
  items jsonb not null default '[]',
  total_calories numeric not null default 0,
  total_protein numeric not null default 0,
  total_carbs numeric not null default 0,
  total_fat numeric not null default 0,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  notes text,
  cuisine_detected text,
  logged_at timestamptz not null default now(),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists meals_user_id_idx on public.meals(user_id);
create index if not exists meals_logged_at_idx on public.meals(logged_at desc);
create index if not exists meals_user_logged_idx on public.meals(user_id, logged_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.meals enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Meals policies
create policy "Users can view own meals"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on public.meals for delete
  using (auth.uid() = user_id);

-- Storage bucket for meal photos (run in Storage or via API)
-- insert into storage.buckets (id, name, public) values ('meal-photos', 'meal-photos', true);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: public reference library (app currently ships static seed in src/data/asian-foods.ts)
-- create table if not exists public.food_library (
--   id text primary key,
--   name text not null,
--   name_original text,
--   cuisine text,
--   category text,
--   calories numeric,
--   protein numeric,
--   carbs numeric,
--   fat numeric,
--   portion text,
--   tags text[]
-- );
