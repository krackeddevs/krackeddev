-- Create questions table
create table if not exists public.questions (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    body text not null,
    author_id uuid not null references public.profiles(id) on delete cascade,
    tags text[] default array[]::text[],
    upvotes int default 0,
    view_count int default 0,
    accepted_answer_id uuid, -- Recursive reference, adds complexity. Can be null.
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    search_vector tsvector generated always as (
        setweight(to_tsvector('english', title), 'A') ||
        setweight(to_tsvector('english', body), 'B')
    ) stored
);

-- Create answers table
create table if not exists public.answers (
    id uuid default gen_random_uuid() primary key,
    question_id uuid not null references public.questions(id) on delete cascade,
    body text not null,
    author_id uuid not null references public.profiles(id) on delete cascade,
    is_accepted boolean default false,
    upvotes int default 0,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Add foreign key for accepted_answer_id AFTER answers table creation to avoid circular dependency issues during creation
alter table public.questions 
add constraint fk_accepted_answer
foreign key (accepted_answer_id) references public.answers(id) on delete set null;

-- Indexes
create index if not exists idx_questions_slug on public.questions(slug);
create index if not exists idx_questions_author_id on public.questions(author_id);
create index if not exists idx_questions_tags on public.questions using gin(tags);
create index if not exists idx_questions_search_vector on public.questions using gin(search_vector);

create index if not exists idx_answers_question_id on public.answers(question_id);
create index if not exists idx_answers_author_id on public.answers(author_id);

-- RLS Policies
alter table public.questions enable row level security;
alter table public.answers enable row level security;

-- Questions Policies
create policy "Questions are viewable by everyone" 
on public.questions for select 
using (true);

create policy "Users can insert their own questions" 
on public.questions for insert 
with check (auth.uid() = author_id);

create policy "Users can update their own questions" 
on public.questions for update 
using (auth.uid() = author_id);

-- Answers Policies
create policy "Answers are viewable by everyone" 
on public.answers for select 
using (true);

create policy "Users can insert their own answers" 
on public.answers for insert 
with check (auth.uid() = author_id);

create policy "Users can update their own answers" 
on public.answers for update 
using (auth.uid() = author_id);

-- Publication for Realtime (Optional, if we want live updates later)
alter publication supabase_realtime add table public.questions;
alter publication supabase_realtime add table public.answers;

-- RPC for View Count
create or replace function public.increment_question_view(question_id uuid)
returns void as $$
begin
  update public.questions
  set view_count = view_count + 1
  where id = question_id;
end;
$$ language plpgsql security definer;
