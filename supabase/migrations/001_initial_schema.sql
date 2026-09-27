create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', college text not null default '',
  student_id text not null default '', department text not null default '',
  course text not null default '', semester text not null default '',
  profile_photo text, theme text not null default 'system' check (theme in ('system','light','dark')),
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  slug text not null unique, created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null, file_type text not null, file_size bigint,
  storage_path text, extracted_text text, created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null default 'Untitled Quiz', topic text,
  subject text not null default 'General', difficulty text not null default 'mixed',
  mode text not null default 'exam',
  question_count integer not null default 10 check (question_count > 0 and question_count <= 100),
  source_filename text, created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null, options jsonb not null,
  correct_answer integer not null check (correct_answer between 0 and 3),
  explanation text not null default '', difficulty text not null default 'mixed',
  topic text, source_page integer, source_section text,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  started_at timestamptz not null default now(), completed_at timestamptz,
  score integer not null default 0, percentage numeric(5,2) not null default 0,
  correct_answers integer not null default 0, wrong_answers integer not null default 0,
  unanswered integer not null default 0, time_taken_seconds integer,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer integer, is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  created_at timestamptz not null default now(), unique(user_id, quiz_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, body text not null, type text not null default 'general',
  read_at timestamptz, created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.documents enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;
alter table public.saved_quizzes enable row level security;
alter table public.notifications enable row level security;

revoke all on public.profiles, public.subjects, public.documents, public.quizzes, public.questions, public.attempts, public.answers, public.saved_quizzes, public.notifications from anon;
grant select, insert, update, delete on public.profiles, public.documents, public.quizzes, public.questions, public.attempts, public.answers, public.saved_quizzes, public.notifications to authenticated;
grant select on public.subjects to authenticated;

drop policy if exists "profiles owner select" on public.profiles;
drop policy if exists "profiles owner insert" on public.profiles;
drop policy if exists "profiles owner update" on public.profiles;
drop policy if exists "profiles owner delete" on public.profiles;
create policy "profiles owner select" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles owner insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles owner update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles owner delete" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

drop policy if exists "subjects authenticated read" on public.subjects;
create policy "subjects authenticated read" on public.subjects for select to authenticated using (true);

drop policy if exists "documents owner access" on public.documents;
create policy "documents owner access" on public.documents for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "quizzes owner access" on public.quizzes;
create policy "quizzes owner access" on public.quizzes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "questions owner select" on public.questions;
drop policy if exists "questions owner insert" on public.questions;
drop policy if exists "questions owner update" on public.questions;
drop policy if exists "questions owner delete" on public.questions;
create policy "questions owner select" on public.questions for select to authenticated using (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = (select auth.uid())));
create policy "questions owner insert" on public.questions for insert to authenticated with check (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = (select auth.uid())));
create policy "questions owner update" on public.questions for update to authenticated using (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = (select auth.uid()))) with check (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = (select auth.uid())));
create policy "questions owner delete" on public.questions for delete to authenticated using (exists (select 1 from public.quizzes q where q.id = questions.quiz_id and q.user_id = (select auth.uid())));

drop policy if exists "attempts owner access" on public.attempts;
create policy "attempts owner access" on public.attempts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "answers owner select" on public.answers;
drop policy if exists "answers owner insert" on public.answers;
drop policy if exists "answers owner update" on public.answers;
drop policy if exists "answers owner delete" on public.answers;
create policy "answers owner select" on public.answers for select to authenticated using (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = (select auth.uid())));
create policy "answers owner insert" on public.answers for insert to authenticated with check (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = (select auth.uid())));
create policy "answers owner update" on public.answers for update to authenticated using (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = (select auth.uid()))) with check (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = (select auth.uid())));
create policy "answers owner delete" on public.answers for delete to authenticated using (exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.user_id = (select auth.uid())));

drop policy if exists "saved owner access" on public.saved_quizzes;
create policy "saved owner access" on public.saved_quizzes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "notifications owner access" on public.notifications;
create policy "notifications owner access" on public.notifications for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index if not exists profiles_updated_at_idx on public.profiles(updated_at);
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists quizzes_user_id_created_at_idx on public.quizzes(user_id, created_at desc);
create index if not exists quizzes_subject_id_idx on public.quizzes(subject_id);
create index if not exists questions_quiz_id_idx on public.questions(quiz_id);
create index if not exists attempts_user_id_created_at_idx on public.attempts(user_id, created_at desc);
create index if not exists attempts_quiz_id_idx on public.attempts(quiz_id);
create index if not exists answers_attempt_id_idx on public.answers(attempt_id);
create index if not exists saved_quizzes_user_id_idx on public.saved_quizzes(user_id);
create index if not exists notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, college, course, semester, department, student_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name',''),
    coalesce(new.raw_user_meta_data ->> 'college',''),
    coalesce(new.raw_user_meta_data ->> 'course',''),
    coalesce(new.raw_user_meta_data ->> 'semester',''),
    coalesce(new.raw_user_meta_data ->> 'department',''),
    coalesce(new.raw_user_meta_data ->> 'student_id','')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();

insert into public.subjects (name, slug) values
('DSA','dsa'),('DBMS','dbms'),('Operating Systems','operating-systems'),
('Computer Networks','computer-networks'),('Java','java'),('Python','python'),
('Software Engineering','software-engineering'),('Aptitude','aptitude')
on conflict (slug) do nothing;
