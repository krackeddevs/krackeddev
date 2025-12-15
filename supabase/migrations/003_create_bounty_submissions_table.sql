-- Create bounty_submissions table (user PR submissions for bounties)

CREATE TABLE IF NOT EXISTS public.bounty_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Bounty information (the bounties themselves currently live in-code)
  bounty_slug TEXT NOT NULL,
  bounty_title TEXT NOT NULL,
  bounty_reward INTEGER NOT NULL,

  -- User information
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Submission details
  pull_request_url TEXT NOT NULL,
  notes TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Admin review
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_pr_url CHECK (pull_request_url ~ '^https://github\\.com/[\\w-]+/[\\w.-]+/pull/\\d+$')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_user_id ON public.bounty_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_reviewed_by ON public.bounty_submissions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_bounty_slug ON public.bounty_submissions(bounty_slug);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_status ON public.bounty_submissions(status);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_created_at ON public.bounty_submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bounty_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
  -- SELECT: allow anyone to view submissions (public bounty board)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bounty_submissions'
      AND policyname = 'Users can view all submissions'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view all submissions" ON public.bounty_submissions FOR SELECT USING (true)';
  END IF;
END;
$$;

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.bounty_submissions;
CREATE POLICY "Users can insert their own submissions"
  ON public.bounty_submissions
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own pending submissions" ON public.bounty_submissions;
CREATE POLICY "Users can update their own pending submissions"
  ON public.bounty_submissions
  FOR UPDATE
  USING ((select auth.uid()) = user_id AND status = 'pending')
  WITH CHECK ((select auth.uid()) = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users can delete their own pending submissions" ON public.bounty_submissions;
CREATE POLICY "Users can delete their own pending submissions"
  ON public.bounty_submissions
  FOR DELETE
  USING ((select auth.uid()) = user_id AND status = 'pending');

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.update_bounty_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_bounty_submissions_updated_at ON public.bounty_submissions;
CREATE TRIGGER update_bounty_submissions_updated_at
  BEFORE UPDATE ON public.bounty_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bounty_submissions_updated_at();

-- Comments
COMMENT ON TABLE public.bounty_submissions IS 'Stores user submissions (GitHub PRs) for code bounties';
COMMENT ON COLUMN public.bounty_submissions.bounty_slug IS 'URL slug identifier for the bounty';
COMMENT ON COLUMN public.bounty_submissions.status IS 'Submission status: pending, approved, or rejected';
COMMENT ON COLUMN public.bounty_submissions.pull_request_url IS 'GitHub pull request URL for the submission';

