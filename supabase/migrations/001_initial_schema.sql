create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  filename text not null,
  file_type text not null,
  file_size bigint,
  storage_path text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  topic text,
  difficulty text not null default 'mixed',
  question_count integer not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  difficulty text not null,
  topic text,
  source_page integer,
  source_section text
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null default 0,
  percentage numeric(5,2) not null default 0,
  time_taken_seconds integer,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer integer,
  is_correct boolean not null default false
);

alter table public.documents enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;

create policy "documents owner access" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quizzes owner access" on public.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "questions through owned quiz" on public.questions for select using (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = auth.uid()));
create policy "attempts owner access" on public.attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "answers through owned attempt" on public.answers for all using (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = auth.uid()));
