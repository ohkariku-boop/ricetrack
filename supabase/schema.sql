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
  meal_type text check (meal_type in ('breakfast', 'lunch', 'tea', 'dinner', 'supper', 'snack')),
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

-- ========== Food Library (comprehensive Asian dishes) ==========
create table if not exists public.food_library (
  id text primary key,
  name text not null,
  name_original text,
  cuisine text not null,
  country text,
  category text,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric,
  portion text,
  tags text[] default '{}',
  source text default 'seed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Performance indexes
create index if not exists food_library_cuisine_idx on public.food_library (cuisine);
create index if not exists food_library_country_idx on public.food_library (country);
create index if not exists food_library_category_idx on public.food_library (category);
create index if not exists food_library_name_trgm_idx on public.food_library using gin (name gin_trgm_ops);
-- fallback btree for name prefix search if trgm extension missing:
create index if not exists food_library_name_lower_idx on public.food_library (lower(name));

-- Optional: enable trigram for fuzzy search (run once if permitted)
-- create extension if not exists pg_trgm;

alter table public.food_library enable row level security;

drop policy if exists "Public read food library" on public.food_library;
create policy "Public read food library"
  on public.food_library for select
  using (true);

-- Only service role should write; no public insert policy

-- ========== User custom dishes (corrections & favorites) ==========
create table if not exists public.user_foods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  name_original text,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  portion text,
  cuisine text,
  times_logged integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists user_foods_user_idx on public.user_foods(user_id);
create index if not exists user_foods_user_name_idx on public.user_foods(user_id, lower(name));

alter table public.user_foods enable row level security;
create policy "Users manage own foods" on public.user_foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ========== Weight log ==========
create table if not exists public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  logged_at date not null default current_date,
  created_at timestamptz default now(),
  unique(user_id, logged_at)
);
create index if not exists weight_logs_user_idx on public.weight_logs(user_id, logged_at desc);
alter table public.weight_logs enable row level security;
create policy "Users manage own weight" on public.weight_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ========== Soft recovery (Balance) with undo ==========
create table if not exists public.balance_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  excess_calories numeric not null,
  days integer not null default 7,
  per_day numeric not null,
  applied_from date not null,
  undone boolean default false,
  created_at timestamptz default now()
);
create index if not exists balance_user_idx on public.balance_events(user_id, created_at desc);
alter table public.balance_events enable row level security;
create policy "Users manage own balance" on public.balance_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Profile: allow manual target flag
alter table public.profiles add column if not exists targets_manual boolean default false;

-- ========== Library suggestions (user contributions; moderated) ==========
create table if not exists public.library_suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  client_id text,
  meal_id text,
  name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  portion text,
  cuisine text,
  source text default 'user',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'published')),
  created_at timestamptz default now(),
  published_at timestamptz
);
create index if not exists library_suggestions_status_idx
  on public.library_suggestions(status, created_at desc);

alter table public.library_suggestions enable row level security;

create policy "Anyone can insert suggestions"
  on public.library_suggestions for insert
  with check (true);

create policy "Users read own suggestions"
  on public.library_suggestions for select
  using (auth.uid() = user_id or user_id is null);

-- Expand meal_type for tea / supper (run on existing projects):
-- alter table public.meals drop constraint if exists meals_meal_type_check;
-- alter table public.meals add constraint meals_meal_type_check
--   check (meal_type is null or meal_type in ('breakfast', 'lunch', 'tea', 'dinner', 'supper', 'snack'));
