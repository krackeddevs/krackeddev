-- Fix the PR URL regex constraint to use POSIX syntax (PostgreSQL compatible)
-- The original used \w which doesn't work correctly in PostgreSQL regex

-- Drop the old constraint
ALTER TABLE public.bounty_submissions DROP CONSTRAINT IF EXISTS valid_pr_url;

-- Add new constraint with POSIX-compatible regex
-- [a-zA-Z0-9_-] instead of \w, and [a-zA-Z0-9_.-] for repo names
ALTER TABLE public.bounty_submissions
  ADD CONSTRAINT valid_pr_url 
  CHECK (pull_request_url ~ '^https://github\.com/[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+/pull/[0-9]+$');
