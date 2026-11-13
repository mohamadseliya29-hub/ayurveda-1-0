-- ============================================================
-- AYURVEDA 2.0 — Supabase schema
-- Run this ONCE in Supabase Studio → SQL Editor → New query.
-- ============================================================

-- 1) Responses table. One row per submission.
create table if not exists public.ayurveda_responses (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,              -- anonymous de-duplication token
  created_at timestamptz not null default now(),
  q1  text, q2  text, q3  text, q4  text, q5  text,
  q6  text, q7  text, q8  text, q9  text, q10 text,
  q11 text, q12 text, q13 text, q14 text, q15 text
);

-- 2) Row Level Security: anyone can INSERT, nobody can SELECT directly.
alter table public.ayurveda_responses enable row level security;

drop policy if exists "anon may insert responses" on public.ayurveda_responses;
create policy "anon may insert responses"
  on public.ayurveda_responses
  for insert
  to anon, authenticated
  with check (true);
-- No SELECT policy → individual responses are never publicly exposed.

-- 3) Admin password config (NOT publicly readable).
create table if not exists public.ayurveda_admin_config (
  id int primary key default 1 check (id = 1),
  password text not null
);
alter table public.ayurveda_admin_config enable row level security;
-- No policies → only Postgres/service role can read it.

-- ★★★ SET YOUR ADMIN PASSWORD HERE, then click Run ★★★
insert into public.ayurveda_admin_config (id, password)
values (1, 'change-me-now')
on conflict (id) do update set password = excluded.password;

-- 4) Password-guarded RPC used by the admin dashboard (#/admin).
create or replace function public.ayurveda_get_results(p_password text)
returns setof public.ayurveda_responses
language plpgsql
security definer
set search_path = public
as $$
declare
  pw text;
begin
  select password into pw from public.ayurveda_admin_config where id = 1;
  if pw is null or p_password is distinct from pw then
    raise exception 'INVALID_ADMIN_PASSWORD';
  end if;
  return query select * from public.ayurveda_responses order by created_at desc;
end;
$$;

revoke all on function public.ayurveda_get_results(text) from public;
grant execute on function public.ayurveda_get_results(text) to anon, authenticated;

-- Optional index for faster admin ordering
create index if not exists ayurveda_responses_created_idx
  on public.ayurveda_responses (created_at desc);
