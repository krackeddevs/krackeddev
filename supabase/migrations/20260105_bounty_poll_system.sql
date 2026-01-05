-- Migration: Bounty Poll System
-- Created: 2026-01-05
-- Description: Complete bounty-centered poll system for community voting on next bounties

-- ============================================================================
-- TABLES
-- ============================================================================

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    description TEXT,
    end_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create poll_options table with bounty proposal fields
CREATE TABLE IF NOT EXISTS poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IS NULL OR difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    estimated_reward INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create poll_votes table
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(poll_id, user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status);
CREATE INDEX IF NOT EXISTS idx_polls_end_at ON polls(end_at);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Anyone can view polls"
    ON polls FOR SELECT
    USING (true);

CREATE POLICY "Admins can create polls"
    ON polls FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update polls"
    ON polls FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Poll options policies
CREATE POLICY "Anyone can view poll options"
    ON poll_options FOR SELECT
    USING (true);

CREATE POLICY "Admins can create poll options"
    ON poll_options FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Poll votes policies
CREATE POLICY "Users can view their own votes"
    ON poll_votes FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can vote"
    ON poll_votes FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_id
            AND polls.status = 'active'
            AND polls.end_at > now()
        )
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE polls IS 'Community polls for voting on bounty proposals';
COMMENT ON TABLE poll_options IS 'Bounty proposal options for each poll';
COMMENT ON TABLE poll_votes IS 'User votes on poll options';

COMMENT ON COLUMN poll_options.difficulty IS 'Bounty difficulty level: beginner, intermediate, advanced, or expert';
COMMENT ON COLUMN poll_options.description IS 'Detailed description of the bounty proposal';
COMMENT ON COLUMN poll_options.requirements IS 'Array of key requirements/deliverables for the bounty';
COMMENT ON COLUMN poll_options.estimated_reward IS 'Estimated reward amount in RM (Malaysian Ringgit)';
