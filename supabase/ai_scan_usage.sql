-- P0: server-side AI scan quota (run in Supabase SQL editor)
-- Tracks free-tier weekly scans by stable client key (device cookie or user id).

create table if not exists public.ai_scan_usage (
  id bigserial primary key,
  client_key text not null,
  week_key text not null,
  scan_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (client_key, week_key)
);

create index if not exists ai_scan_usage_week_idx on public.ai_scan_usage (week_key);

-- Service role only (API routes). No public access.
alter table public.ai_scan_usage enable row level security;

-- Optional: deny all for anon/authenticated; service role bypasses RLS
drop policy if exists "deny_all_ai_scan_usage" on public.ai_scan_usage;
create policy "deny_all_ai_scan_usage"
  on public.ai_scan_usage
  for all
  using (false)
  with check (false);

comment on table public.ai_scan_usage is 'Server-enforced free AI scan counters per client_key + ISO week';
