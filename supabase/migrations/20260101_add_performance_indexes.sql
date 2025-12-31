-- Performance Optimization: Add indexes for faster queries
-- Migration: add_performance_indexes
-- Created: 2026-01-01

-- =============================================================================
-- PROFILES TABLE INDEXES
-- =============================================================================

-- Index for filtering by status (used in many queries)
CREATE INDEX IF NOT EXISTS idx_profiles_status 
ON profiles(status) 
WHERE status = 'active';

-- Index for onboarding completed filter
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed) 
WHERE onboarding_completed = true;

-- Index for XP-based leaderboard ordering (descending)
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc 
ON profiles(xp DESC NULLS LAST);

-- Index for recently joined members
CREATE INDEX IF NOT EXISTS idx_profiles_created_at 
ON profiles(created_at DESC);

-- Composite index for active users leaderboard (most common query)
CREATE INDEX IF NOT EXISTS idx_profiles_active_xp 
ON profiles(status, xp DESC) 
WHERE status = 'active' AND onboarding_completed = true;

-- Index for level-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_level 
ON profiles(level DESC);

-- Index for contribution stats queries (not null filter)
CREATE INDEX IF NOT EXISTS idx_profiles_contribution_stats 
ON profiles(id) 
WHERE contribution_stats IS NOT NULL;

-- =============================================================================
-- BOUNTY SUBMISSIONS TABLE INDEXES
-- =============================================================================

-- Composite index for user submissions by status
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_user_status 
ON bounty_submissions(user_id, status);

-- Index for approved submissions (used in leaderboard calculations)
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_status_approved 
ON bounty_submissions(status, user_id, bounty_reward) 
WHERE status = 'approved';

-- Index for recent submissions
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_created_at 
ON bounty_submissions(created_at DESC);

-- =============================================================================
-- COMMUNITY FEATURES INDEXES
-- =============================================================================

-- Questions by author and date
CREATE INDEX IF NOT EXISTS idx_questions_author_created 
ON questions(author_id, created_at DESC);

-- Answers by author and date
CREATE INDEX IF NOT EXISTS idx_answers_author_created 
ON answers(author_id, created_at DESC);

-- Answers with acceptance status
CREATE INDEX IF NOT EXISTS idx_answers_accepted 
ON answers(author_id, is_accepted, created_at DESC);

-- Votes by user and type
CREATE INDEX IF NOT EXISTS idx_votes_user_type 
ON votes(user_id, vote_type, created_at DESC);

-- Comments by author
CREATE INDEX IF NOT EXISTS idx_comments_author_created 
ON comments(author_id, created_at DESC);

-- =============================================================================
-- XP EVENTS TABLE INDEXES
-- =============================================================================

-- Index for user XP history
CREATE INDEX IF NOT EXISTS idx_xp_events_user_created 
ON xp_events(user_id, created_at DESC);

-- Index for event type analytics
CREATE INDEX IF NOT EXISTS idx_xp_events_type 
ON xp_events(event_type, created_at DESC);

-- =============================================================================
-- VERIFY INDEXES CREATED
-- =============================================================================

-- You can verify the indexes by running:
-- SELECT schemaname, tablename, indexname 
-- FROM pg_indexes 
-- WHERE tablename IN ('profiles', 'bounty_submissions', 'questions', 'answers', 'votes', 'comments', 'xp_events')
-- ORDER BY tablename, indexname;

