-- Run once (or anytime) in Supabase SQL editor to keep library search fast.

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

create or replace function public.optimize_food_library()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row_count bigint;
  idx_count int;
begin
  analyze public.food_library;
  analyze public.library_suggestions;
  select count(*) into row_count from public.food_library;
  select count(*) into idx_count
  from pg_indexes
  where schemaname = 'public' and tablename = 'food_library';
  return jsonb_build_object(
    'ok', true,
    'food_library_rows', row_count,
    'food_library_indexes', idx_count,
    'analyzed_at', now()
  );
end;
$$;

revoke all on function public.optimize_food_library() from public;
grant execute on function public.optimize_food_library() to service_role;

-- Run maintenance now:
select public.optimize_food_library();
