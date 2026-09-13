-- Daily / on-demand food library maintenance.
-- Run in Supabase SQL editor once to deploy the function, then call daily via API cron.
-- Or: select public.optimize_food_library();

create extension if not exists pg_trgm;

create index if not exists food_library_cuisine_idx on public.food_library (cuisine);
create index if not exists food_library_country_idx on public.food_library (country);
create index if not exists food_library_category_idx on public.food_library (category);
create index if not exists food_library_cuisine_name_idx on public.food_library (cuisine, lower(name));
create index if not exists food_library_name_lower_idx on public.food_library (lower(name));
create index if not exists food_library_name_trgm_idx on public.food_library using gin (name gin_trgm_ops);
create index if not exists food_library_name_original_trgm_idx on public.food_library using gin (name_original gin_trgm_ops);
create index if not exists food_library_tags_gin_idx on public.food_library using gin (tags);
create index if not exists food_library_updated_idx on public.food_library (updated_at desc);
create index if not exists library_suggestions_status_idx
  on public.library_suggestions (status, created_at desc);

create or replace function public.optimize_food_library()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row_count bigint;
  suggestion_count bigint;
  idx_count int;
  table_bytes bigint;
  index_bytes bigint;
begin
  -- Indexes (idempotent)
  create index if not exists food_library_cuisine_idx on public.food_library (cuisine);
  create index if not exists food_library_country_idx on public.food_library (country);
  create index if not exists food_library_category_idx on public.food_library (category);
  create index if not exists food_library_cuisine_name_idx on public.food_library (cuisine, lower(name));
  create index if not exists food_library_name_lower_idx on public.food_library (lower(name));
  create index if not exists food_library_name_trgm_idx on public.food_library using gin (name gin_trgm_ops);
  create index if not exists food_library_name_original_trgm_idx on public.food_library using gin (name_original gin_trgm_ops);
  create index if not exists food_library_tags_gin_idx on public.food_library using gin (tags);
  create index if not exists food_library_updated_idx on public.food_library (updated_at desc);
  create index if not exists library_suggestions_status_idx
    on public.library_suggestions (status, created_at desc);

  analyze public.food_library;
  if to_regclass('public.library_suggestions') is not null then
    analyze public.library_suggestions;
  end if;
  if to_regclass('public.user_foods') is not null then
    analyze public.user_foods;
  end if;
  if to_regclass('public.meals') is not null then
    analyze public.meals;
  end if;

  select count(*) into row_count from public.food_library;
  select count(*) into suggestion_count
    from public.library_suggestions
    where status = 'pending';
  select count(*) into idx_count
    from pg_indexes
    where schemaname = 'public' and tablename = 'food_library';
  select pg_total_relation_size('public.food_library') into table_bytes;
  select coalesce(sum(pg_relation_size(indexrelid)), 0)
    into index_bytes
    from pg_index
    where indrelid = 'public.food_library'::regclass;

  return jsonb_build_object(
    'ok', true,
    'food_library_rows', row_count,
    'pending_suggestions', coalesce(suggestion_count, 0),
    'food_library_indexes', idx_count,
    'table_bytes', table_bytes,
    'index_bytes', index_bytes,
    'analyzed_at', now()
  );
end;
$$;

revoke all on function public.optimize_food_library() from public;
grant execute on function public.optimize_food_library() to service_role;

-- One-shot run after deploy:
-- select public.optimize_food_library();
