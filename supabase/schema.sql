-- CNIC-Based Patient Registration System (Augmentec) — Technology Assessment
-- Run this whole file once in a FRESH Supabase project's SQL editor
-- (Supabase dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- Already have this project deployed with the old `submission_type` column?
-- Don't run this file — run supabase/migration_002_dual_submission.sql instead,
-- it upgrades your existing table in place without losing data.

create extension if not exists "pgcrypto";

create table if not exists public.responses (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),

  -- Respondent information
  organization           text not null check (organization in ('SIUT', 'Augmentec')),
  respondent_name        text not null,
  role_designation       text,
  department_team        text,
  response_date          date not null default current_date,

  -- Which part(s) of the instrument this submission covers. Both can be
  -- true at once, so a respondent can fill Proctor's and RE-AIM together.
  covers_rollout          boolean not null default false,
  covers_evaluate_sustain boolean not null default false,
  checkpoint_month        text check (checkpoint_month in ('1', '3', '6', '12')),

  -- Likert answers keyed by question id, e.g. {"p1_acceptability": "A", ...}
  answers                jsonb not null default '{}'::jsonb,
  -- Free-text section comments keyed by comment id, e.g. {"p1_comments": "..."}
  comments               jsonb not null default '{}'::jsonb,
  -- Part V overall assessment: strengths, risks, safeguards, recommendation, specify
  overall                jsonb not null default '{}'::jsonb,

  constraint responses_covers_something check (covers_rollout or covers_evaluate_sustain),
  constraint responses_checkpoint_needs_eval check (checkpoint_month is null or covers_evaluate_sustain)
);

create index if not exists responses_covers_rollout_idx on public.responses (covers_rollout);
create index if not exists responses_covers_evaluate_sustain_idx on public.responses (covers_evaluate_sustain);
create index if not exists responses_organization_idx on public.responses (organization);
create index if not exists responses_created_at_idx on public.responses (created_at);

-- Row Level Security -----------------------------------------------------

alter table public.responses enable row level security;

-- Anyone with the public link can submit a response (no read access).
drop policy if exists "public can insert responses" on public.responses;
create policy "public can insert responses"
  on public.responses
  for insert
  to anon, authenticated
  with check (true);

-- Only a signed-in user (you) can read submissions, for the dashboard.
drop policy if exists "authenticated can read responses" on public.responses;
create policy "authenticated can read responses"
  on public.responses
  for select
  to authenticated
  using (true);

-- No update/delete policies are defined, so both are blocked for every role
-- by default under RLS.

-- After running this file:
-- 1. In Supabase: Authentication -> Providers -> Email -> turn OFF
--    "Allow new users to sign up".
-- 2. In Supabase: Authentication -> Users -> Add user -> create the one
--    account you'll use to sign in to /dashboard.
