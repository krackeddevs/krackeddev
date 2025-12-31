-- Create comments table
create table if not exists comments (
    id uuid default gen_random_uuid() primary key,
    body text not null check (length(body) >= 5),
    author_id uuid not null references auth.users(id) on delete cascade,
    question_id uuid references questions(id) on delete cascade,
    answer_id uuid references answers(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure comment belongs to EITHER a question OR an answer, but can be extensible
    -- For now, let's just allow both or either, but typically strictly one.
    -- Let's enforce it belongs to at least one.
    constraint comment_target_check check (
        (question_id is not null) or (answer_id is not null)
    )
);

-- RLS Policies
alter table comments enable row level security;

-- Policy: Public can view comments
create policy "Public can view comments"
  on comments for select
  using ( true );

-- Policy: Authenticated users can create comments
create policy "Authenticated users can create comments"
  on comments for insert
  to authenticated
  with check ( auth.uid() = author_id );

-- Policy: Users can update own comments
create policy "Users can update own comments"
  on comments for update
  to authenticated
  using ( auth.uid() = author_id );

-- Policy: Users can delete own comments
create policy "Users can delete own comments"
  on comments for delete
  to authenticated
  using ( auth.uid() = author_id );

-- Not adding triggers for updated_at for brevity, can be added later if needed.
