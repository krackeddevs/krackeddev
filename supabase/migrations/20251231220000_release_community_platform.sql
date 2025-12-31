-- ==============================================================================
-- RELEASE: COMMUNITY PLATFORM & XP SYSTEM
-- Conbined Migration: Epic 11 + Epic 8
-- Order of Operations:
-- 1. Community Schema (Messages, Questions, Answers, Comments, Buckets)
-- 2. XP System (XP Events, Profile Columns, Triggers)
-- 3. Gamification Logic (XP Types, Accepted Answers, Voting)
-- 4. Moderation System (Flags, Status Columns, RLS)
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: EPIC 11 COMMUNITY SCHEMA
-- ==============================================================================

-- 1.1 MESSAGES TABLE
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

drop policy if exists "Messages are viewable by everyone" on public.messages;
create policy "Messages are viewable by everyone"
    on public.messages for select
    using (true);

drop policy if exists "Authenticated users can insert messages" on public.messages;
create policy "Authenticated users can insert messages"
    on public.messages for insert
    with check (auth.uid() = user_id);

-- Indexes for Messages
create index if not exists messages_channel_id_created_at_idx on public.messages (channel_id, created_at desc);

-- Realtime for Messages
alter publication supabase_realtime add table public.messages;


-- 1.2 QUESTIONS & ANSWERS
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
drop policy if exists "Questions are viewable by everyone" on public.questions;
create policy "Questions are viewable by everyone" 
on public.questions for select 
using (true);

drop policy if exists "Users can insert their own questions" on public.questions;
create policy "Users can insert their own questions" 
on public.questions for insert 
with check (auth.uid() = author_id);

drop policy if exists "Users can update their own questions" on public.questions;
create policy "Users can update their own questions" 
on public.questions for update 
using (auth.uid() = author_id);

-- Answers Policies
drop policy if exists "Answers are viewable by everyone" on public.answers;
create policy "Answers are viewable by everyone" 
on public.answers for select 
using (true);

drop policy if exists "Users can insert their own answers" on public.answers;
create policy "Users can insert their own answers" 
on public.answers for insert 
with check (auth.uid() = author_id);

drop policy if exists "Users can update their own answers" on public.answers;
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


-- 1.3 COMMUNITY BUCKET
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


-- 1.4 COMMENTS TABLE
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

drop policy if exists "Public can view comments" on comments;
create policy "Public can view comments"
  on comments for select
  using ( true );

drop policy if exists "Authenticated users can create comments" on comments;
create policy "Authenticated users can create comments"
  on comments for insert
  to authenticated
  with check ( auth.uid() = author_id );

drop policy if exists "Users can update own comments" on comments;
create policy "Users can update own comments"
  on comments for update
  to authenticated
  using ( auth.uid() = author_id );

drop policy if exists "Users can delete own comments" on comments;
create policy "Users can delete own comments"
  on comments for delete
  to authenticated
  using ( auth.uid() = author_id );


-- ==============================================================================
-- SECTION 2: EPIC 8 XP SYSTEM
-- ==============================================================================

-- 2.1 PROFILE UPDATES
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_xp_grant_date DATE;

COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of user''s most recent login';
COMMENT ON COLUMN public.profiles.last_xp_grant_date IS 'Date of last daily XP grant to prevent duplicates';


-- 2.2 XP EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'daily_login',
    'github_contribution',
    'bounty_submission',
    'bounty_win',
    'streak_milestone',
    'profile_completion',
    'manual_adjustment',
    -- Includes Community Events here to avoid double-alter
    'ask_question',
    'answer_question',
    'answer_accepted',
    'upvote_received'
  )),
  xp_amount INTEGER NOT NULL CHECK (xp_amount >= 0),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.xp_events IS 'Immutable audit trail of all XP-earning events for gamification system';


-- 2.3 INDEXES
CREATE INDEX IF NOT EXISTS xp_events_user_id_created_at_idx 
ON public.xp_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS xp_events_event_type_idx 
ON public.xp_events(event_type);

CREATE INDEX IF NOT EXISTS profiles_xp_level_idx ON profiles(xp DESC, level DESC);
CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events(created_at DESC);


-- 2.4 XP EVENTS RLS POLICIES
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own XP events" ON public.xp_events;
CREATE POLICY "Users can view their own XP events"
ON public.xp_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert XP events" ON public.xp_events;
CREATE POLICY "System can insert XP events"
ON public.xp_events FOR INSERT WITH CHECK (true); 

DROP POLICY IF EXISTS "Admins can view all XP events" ON public.xp_events;
CREATE POLICY "Admins can view all XP events"
ON public.xp_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 2.5 LEADERBOARD FUNCTION
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_count INT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  level INT,
  developer_role TEXT,
  stack TEXT[],
  weekly_xp BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.level,
    p.developer_role,
    p.stack,
    COALESCE(SUM(xe.xp_amount), 0) AS weekly_xp,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(xe.xp_amount), 0) DESC) AS rank
  FROM profiles p
  LEFT JOIN xp_events xe ON p.id = xe.user_id
    AND xe.created_at >= NOW() - INTERVAL '7 days'
  GROUP BY p.id, p.username, p.avatar_url, p.level, p.developer_role, p.stack
  ORDER BY weekly_xp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION get_weekly_leaderboard(INT) TO anon, authenticated, service_role;


-- 2.6 XP SYNC TRIGGER
CREATE OR REPLACE FUNCTION update_profile_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's total XP by summing all their events
  IF (TG_OP = 'INSERT') THEN
    UPDATE profiles
    SET xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = NEW.user_id),
        level = 1 + floor(sqrt((SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = NEW.user_id)) / 10)::INT
    WHERE id = NEW.user_id;
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE profiles
    SET xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = OLD.user_id),
        level = 1 + floor(sqrt((SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = OLD.user_id)) / 10)::INT
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_xp_event_change ON xp_events;
CREATE TRIGGER on_xp_event_change
AFTER INSERT OR DELETE ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profile_xp();


-- 2.7 DATA REPAIR
UPDATE profiles p
SET 
  xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id),
  level = 1 + floor(sqrt(
      (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id)
    ) / 10)::INT;


-- ==============================================================================
-- SECTION 3: EPIC 11.4 GAMIFICATION LOGIC
-- ==============================================================================

-- 3.1 UNIQUE ACCEPTED ANSWER
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_accepted_answer_per_question 
ON public.answers(question_id) 
WHERE is_accepted = true;


-- 3.2 AWARD XP FUNCTION (Secure RPC)
-- This function allows the system (via RLS or trusted backend) to award XP
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_event_type TEXT,
  p_amount INT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID AS $$
BEGIN
  -- Insert event (Trigger will auto-update profile XP/Level)
  INSERT INTO public.xp_events (user_id, event_type, xp_amount, metadata)
  VALUES (p_user_id, p_event_type, p_amount, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION award_xp(UUID, TEXT, INT, JSONB) TO authenticated, service_role;


-- 3.3 TOGGLE ACCEPTED ANSWER RPC
CREATE OR REPLACE FUNCTION toggle_accepted_answer(
  p_question_id UUID,
  p_answer_id UUID
) RETURNS VOID AS $$
DECLARE
  v_question_author_id UUID;
  v_answer_author_id UUID;
  v_old_accepted_answer_id UUID;
  v_is_already_accepted BOOLEAN;
BEGIN
  -- 1. Verify User is Question Author
  SELECT author_id INTO v_question_author_id FROM public.questions WHERE id = p_question_id;
  
  IF v_question_author_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized. Only question author can accept answers.';
  END IF;

  -- 2. Get Answer details
  SELECT author_id, is_accepted INTO v_answer_author_id, v_is_already_accepted 
  FROM public.answers WHERE id = p_answer_id;

  IF v_answer_author_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot accept your own answer.';
  END IF;

  -- 3. Logic Switch
  IF v_is_already_accepted THEN
    -- UNACCEPT
    UPDATE public.answers SET is_accepted = false WHERE id = p_answer_id;
    UPDATE public.questions SET accepted_answer_id = NULL WHERE id = p_question_id;
    
  ELSE
    -- ACCEPT:
    -- A. Unaccept any existing answer for this question
    UPDATE public.answers SET is_accepted = false WHERE question_id = p_question_id AND is_accepted = true;
    
    -- B. Accept new answer
    UPDATE public.answers SET is_accepted = true, updated_at = NOW() WHERE id = p_answer_id;
    UPDATE public.questions SET accepted_answer_id = p_answer_id WHERE id = p_question_id;

    -- C. Award XP to Answer Author (+100 XP)
    PERFORM award_xp(
      v_answer_author_id, 
      'answer_accepted', 
      100, 
      jsonb_build_object('question_id', p_question_id, 'answer_id', p_answer_id, 'role', 'answerer')
    );

    -- D. Award XP to Question Author (+20 XP for closing the loop)
    PERFORM award_xp(
      v_question_author_id, 
      'answer_accepted', 
      20, 
      jsonb_build_object('question_id', p_question_id, 'answer_id', p_answer_id, 'role', 'asker')
    );
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION toggle_accepted_answer(UUID, UUID) TO authenticated, service_role;


-- 3.4 VOTING SYSTEM
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: A vote must belong to EITHER a question OR an answer
    CONSTRAINT vote_target_check CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL)
    ),
    
    -- Constraint: One vote per user per resource
    CONSTRAINT unique_vote_question UNIQUE (user_id, question_id),
    CONSTRAINT unique_vote_answer UNIQUE (user_id, answer_id)
);

-- RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

drop policy if exists "Users can view all votes" on public.votes;
CREATE POLICY "Users can view all votes" ON public.votes FOR SELECT USING (true);

drop policy if exists "Users can manage their own votes" on public.votes;
CREATE POLICY "Users can manage their own votes" ON public.votes FOR ALL USING (auth.uid() = user_id);

-- RPC to Handle Voting
CREATE OR REPLACE FUNCTION handle_vote(
    p_user_id UUID,
    p_resource_id UUID,
    p_resource_type TEXT, -- 'question' or 'answer'
    p_direction TEXT -- 'up' or 'down'
) RETURNS VOID AS $$
DECLARE
    v_existing_vote_type TEXT;
    v_target_author_id UUID;
    v_xp_amount INT;
BEGIN
    -- 1. Check for existing vote
    IF p_resource_type = 'question' THEN
        SELECT vote_type INTO v_existing_vote_type FROM votes WHERE user_id = p_user_id AND question_id = p_resource_id;
        SELECT author_id INTO v_target_author_id FROM questions WHERE id = p_resource_id;
    ELSIF p_resource_type = 'answer' THEN
        SELECT vote_type INTO v_existing_vote_type FROM votes WHERE user_id = p_user_id AND answer_id = p_resource_id;
        SELECT author_id INTO v_target_author_id FROM answers WHERE id = p_resource_id;
    END IF;

    IF v_target_author_id = p_user_id THEN
        RAISE EXCEPTION 'Cannot vote on your own content.';
    END IF;

    -- 2. Logic
    IF v_existing_vote_type IS NOT NULL THEN
        -- Vote exists
        IF v_existing_vote_type = p_direction THEN
            -- Same direction -> Toggle OFF (Remove vote)
            IF p_resource_type = 'question' THEN
                DELETE FROM votes WHERE user_id = p_user_id AND question_id = p_resource_id;
                UPDATE questions SET upvotes = upvotes - (CASE WHEN p_direction = 'up' THEN 1 ELSE 0 END) WHERE id = p_resource_id;
            ELSE
                DELETE FROM votes WHERE user_id = p_user_id AND answer_id = p_resource_id;
                UPDATE answers SET upvotes = upvotes - (CASE WHEN p_direction = 'up' THEN 1 ELSE 0 END) WHERE id = p_resource_id;
            END IF;
        ELSE
            -- Switch direction (Up -> Down or Down -> Up)
             IF p_resource_type = 'question' THEN
                UPDATE votes SET vote_type = p_direction WHERE user_id = p_user_id AND question_id = p_resource_id;
             ELSE
                UPDATE votes SET vote_type = p_direction WHERE user_id = p_user_id AND answer_id = p_resource_id;
             END IF;
        END IF;
    ELSE
        -- New Vote
        IF p_resource_type = 'question' THEN
            INSERT INTO votes (user_id, question_id, vote_type) VALUES (p_user_id, p_resource_id, p_direction);
            IF p_direction = 'up' THEN
                UPDATE questions SET upvotes = upvotes + 1 WHERE id = p_resource_id;
                -- Award XP to Author
                PERFORM award_xp(v_target_author_id, 'upvote_received', 5, jsonb_build_object('source_user', p_user_id, 'question_id', p_resource_id));
            END IF;
        ELSE
            INSERT INTO votes (user_id, answer_id, vote_type) VALUES (p_user_id, p_resource_id, p_direction);
             IF p_direction = 'up' THEN
                UPDATE answers SET upvotes = upvotes + 1 WHERE id = p_resource_id;
                -- Award XP to Author
                PERFORM award_xp(v_target_author_id, 'upvote_received', 5, jsonb_build_object('source_user', p_user_id, 'answer_id', p_resource_id));
            END IF;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION handle_vote(UUID, UUID, TEXT, TEXT) TO authenticated, service_role;


-- ==============================================================================
-- SECTION 4: EPIC 11.5 MODERATION SYSTEM
-- ==============================================================================

-- 4.1 CONTENT FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.content_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flagger_id UUID NOT NULL REFERENCES public.profiles(id),
    resource_id UUID NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('chat', 'question', 'answer')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_content_flags_resource ON public.content_flags(resource_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_content_flags_status ON public.content_flags(status);


-- 4.2 MODERATION STATUS COLUMNS
DO $$ 
BEGIN
    -- Messages
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'moderation_status') THEN
        ALTER TABLE public.messages ADD COLUMN moderation_status TEXT DEFAULT 'published' CHECK (moderation_status IN ('published', 'under_review', 'hidden', 'deleted'));
    END IF;

    -- Questions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'moderation_status') THEN
        ALTER TABLE public.questions ADD COLUMN moderation_status TEXT DEFAULT 'published' CHECK (moderation_status IN ('published', 'under_review', 'hidden', 'deleted'));
    END IF;

    -- Answers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'answers' AND column_name = 'moderation_status') THEN
        ALTER TABLE public.answers ADD COLUMN moderation_status TEXT DEFAULT 'published' CHECK (moderation_status IN ('published', 'under_review', 'hidden', 'deleted'));
    END IF;
END $$;


-- 4.3 MODERATION RLS
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all flags" ON public.content_flags;
CREATE POLICY "Admins can view all flags"
ON public.content_flags FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can create flags" ON public.content_flags;
CREATE POLICY "Users can create flags"
ON public.content_flags FOR INSERT
WITH CHECK (auth.uid() = flagger_id);


-- 4.4 UPDATE ACCESS RLS (Fixes from Epic 11.5 verification)

-- Messages
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
CREATE POLICY "Anyone can view messages"
ON public.messages FOR SELECT
USING (
  moderation_status = 'published' OR 
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update messages" ON public.messages;
CREATE POLICY "Admins can update messages"
ON public.messages FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Questions
DROP POLICY IF EXISTS "Public questions are viewable by everyone" ON public.questions;
CREATE POLICY "Public questions are viewable by everyone"
ON public.questions FOR SELECT
USING (
  moderation_status = 'published' OR 
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
CREATE POLICY "Admins can update questions"
ON public.questions FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Answers
DROP POLICY IF EXISTS "Public answers are viewable by everyone" ON public.answers;
CREATE POLICY "Public answers are viewable by everyone"
ON public.answers FOR SELECT
USING (
  moderation_status = 'published' OR 
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update answers" ON public.answers;
CREATE POLICY "Admins can update answers"
ON public.answers FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Content Flags Update
DROP POLICY IF EXISTS "Admins can update flags" ON public.content_flags;
CREATE POLICY "Admins can update flags"
ON public.content_flags FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles Update (for banning)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
ON public.profiles FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
