-- Add unique constraint to enforce 1 submission per user per bounty (MVP constraint)
-- Story 5.2: Submission Flow
-- NOTE: This migration is now consolidated into 003_create_bounty_submissions_table.sql
--       Kept for historical reference (already applied to production)

-- Add the unique constraint (idempotent)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_user_bounty_submission'
  ) THEN
    ALTER TABLE public.bounty_submissions
      ADD CONSTRAINT unique_user_bounty_submission UNIQUE (bounty_slug, user_id);
  END IF;
END $$;

-- Comment explaining the constraint
COMMENT ON CONSTRAINT unique_user_bounty_submission ON public.bounty_submissions 
  IS 'MVP constraint: Each user can only submit one solution per bounty';
