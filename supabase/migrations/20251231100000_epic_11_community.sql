-- ==========================================
-- EPIC 11: Community Platform Migration
-- Consolidates:
-- - Messages (Chat)
-- - Questions & Answers (Q&A)
-- - Community Bucket (Storage)
-- - Comments (Discussions)
-- ==========================================

-- 1. MESSAGES TABLE
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    channel_id text not null default 'general',
    user_id uuid references public.profiles(id) not null,
    content text not null,
    created_at timestamptz default now() not null,
    is_deleted boolean default false not null
);

-- RLS Policies for Messages
alter table public.messages enable row level security;

create policy "Messages are viewable by everyone"
    on public.messages for select
    using (true);

create policy "Authenticated users can insert messages"
    on public.messages for insert
    with check (auth.uid() = user_id);

-- Indexes for Messages
create index if not exists messages_channel_id_created_at_idx on public.messages (channel_id, created_at desc);

-- Realtime for Messages
alter publication supabase_realtime add table public.messages;


-- 2. QUESTIONS & ANSWERS
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
    accepted_answer_id uuid,
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

-- Add foreign key for accepted_answer_id (circular dependency solution)
alter table public.questions 
drop constraint if exists fk_accepted_answer;

alter table public.questions 
add constraint fk_accepted_answer
foreign key (accepted_answer_id) references public.answers(id) on delete set null;

-- Indexes for Q&A
create index if not exists idx_questions_slug on public.questions(slug);
create index if not exists idx_questions_author_id on public.questions(author_id);
create index if not exists idx_questions_tags on public.questions using gin(tags);
create index if not exists idx_questions_search_vector on public.questions using gin(search_vector);

create index if not exists idx_answers_question_id on public.answers(question_id);
create index if not exists idx_answers_author_id on public.answers(author_id);

-- RLS Policies for Q&A
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

-- RPC for View Count
create or replace function public.increment_question_view(question_id uuid)
returns void as $$
begin
  update public.questions
  set view_count = view_count + 1
  where id = question_id;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_question_view(uuid) to anon, authenticated, service_role;


-- 3. COMMUNITY BUCKET
insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'community-images' );

drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'community-images' AND auth.role() = 'authenticated' );

drop policy if exists "Users can update own images" on storage.objects;
create policy "Users can update own images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'community-images' AND owner = auth.uid() );

drop policy if exists "Users can delete own images" on storage.objects;
create policy "Users can delete own images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'community-images' AND owner = auth.uid() );


-- 4. COMMENTS TABLE
create table if not exists comments (
    id uuid default gen_random_uuid() primary key,
    body text not null check (length(body) >= 5),
    author_id uuid not null references public.profiles(id) on delete cascade,
    question_id uuid references questions(id) on delete cascade,
    answer_id uuid references answers(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint comment_target_check check (
        (question_id is not null) or (answer_id is not null)
    )
);

-- RLS Policies for Comments
alter table comments enable row level security;

create policy "Public can view comments"
  on comments for select
  using ( true );

create policy "Authenticated users can create comments"
  on comments for insert
  to authenticated
  with check ( auth.uid() = author_id );

create policy "Users can update own comments"
  on comments for update
  to authenticated
  using ( auth.uid() = author_id );

create policy "Users can delete own comments"
  on comments for delete
  to authenticated
  using ( auth.uid() = author_id );
