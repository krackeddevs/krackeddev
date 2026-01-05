-- Migration: Bounty Inquiry System & Ownership
-- Created: 2026-01-05
-- Description: Complete bounty inquiry system with user tracking, ownership, and submission management

-- ============================================================================
-- BOUNTY_INQUIRIES TABLE ENHANCEMENTS
-- ============================================================================

-- Add user tracking and submission type
ALTER TABLE public.bounty_inquiries
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS submitter_type text CHECK (submitter_type IN ('individual', 'company'));

-- Add additional bounty details fields
ALTER TABLE public.bounty_inquiries
ADD COLUMN IF NOT EXISTS repository_url text,
ADD COLUMN IF NOT EXISTS requirements text[],
ADD COLUMN IF NOT EXISTS long_description text;

-- Update status constraint to include approved/rejected states
ALTER TABLE public.bounty_inquiries 
    DROP CONSTRAINT IF EXISTS bounty_inquiries_status_check;

ALTER TABLE public.bounty_inquiries
    ADD CONSTRAINT bounty_inquiries_status_check 
    CHECK (status IN ('new', 'contacted', 'closed', 'approved', 'rejected'));

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_bounty_inquiries_user_id ON public.bounty_inquiries(user_id);

-- ============================================================================
-- BOUNTIES TABLE - OWNERSHIP & LINKING
-- ============================================================================

-- Add ownership columns
ALTER TABLE public.bounties
    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS inquiry_id uuid REFERENCES public.bounty_inquiries(id) ON DELETE SET NULL;

-- ============================================================================
-- RLS POLICIES - BOUNTY OWNERSHIP
-- ============================================================================

-- Enable RLS
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounty_submissions ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies
DROP POLICY IF EXISTS "Owners can update own bounties" ON public.bounties;
DROP POLICY IF EXISTS "Bounty Owners can update submissions" ON public.bounty_submissions;
DROP POLICY IF EXISTS "Bounty Owners can view submissions" ON public.bounty_submissions;

-- Policy: Owners can update their own bounties
CREATE POLICY "Owners can update own bounties"
    ON public.bounties
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Bounty owners can update submissions (review/approve)
CREATE POLICY "Bounty Owners can update submissions"
    ON public.bounty_submissions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bounties
            WHERE bounties.slug = bounty_submissions.bounty_slug
            AND bounties.user_id = auth.uid()
        )
    );

-- Policy: Bounty owners can view submissions
CREATE POLICY "Bounty Owners can view submissions"
    ON public.bounty_submissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bounties
            WHERE bounties.slug = bounty_submissions.bounty_slug
            AND bounties.user_id = auth.uid()
        )
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN bounty_inquiries.user_id IS 'User who submitted the inquiry (individual or company rep)';
COMMENT ON COLUMN bounty_inquiries.submitter_type IS 'Type of submitter: individual or company';
COMMENT ON COLUMN bounty_inquiries.repository_url IS 'Optional repository URL for the bounty';
COMMENT ON COLUMN bounty_inquiries.requirements IS 'Array of technical requirements';
COMMENT ON COLUMN bounty_inquiries.long_description IS 'Extended description for complex bounties';

COMMENT ON COLUMN bounties.user_id IS 'Owner of the bounty (can edit and review submissions)';
COMMENT ON COLUMN bounties.inquiry_id IS 'Original inquiry that led to this bounty (if applicable)';
