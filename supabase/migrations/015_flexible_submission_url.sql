-- Allow any valid HTTPS URL for bounty submissions (not just GitHub PR URLs)
-- This enables users to submit Vercel deployments, portfolio links, or any demo URL
-- NOTE: This flexible URL constraint is now consolidated into 003_create_bounty_submissions_table.sql
--       Kept for historical reference (already applied to production)

-- Drop the strict GitHub PR constraint
ALTER TABLE public.bounty_submissions DROP CONSTRAINT IF EXISTS valid_pr_url;

-- Add flexible HTTPS URL constraint (idempotent)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_submission_url'
  ) THEN
    ALTER TABLE public.bounty_submissions
      ADD CONSTRAINT valid_submission_url 
      CHECK (pull_request_url ~ '^https://[a-zA-Z0-9][-a-zA-Z0-9]*(\\.[a-zA-Z0-9][-a-zA-Z0-9]*)+(/.*)?$');
  END IF;
END $$;

-- Note: This constraint still requires:
-- - https:// protocol (no http://)
-- - Valid domain format (e.g., github.com, vercel.app, etc.)
-- - Optional path after domain
