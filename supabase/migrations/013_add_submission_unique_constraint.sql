-- Add unique constraint to enforce 1 submission per user per bounty (MVP constraint)
-- Story 5.2: Submission Flow

-- Add the unique constraint
ALTER TABLE public.bounty_submissions
  ADD CONSTRAINT unique_user_bounty_submission UNIQUE (bounty_slug, user_id);

-- Comment explaining the constraint
COMMENT ON CONSTRAINT unique_user_bounty_submission ON public.bounty_submissions 
  IS 'MVP constraint: Each user can only submit one solution per bounty';
