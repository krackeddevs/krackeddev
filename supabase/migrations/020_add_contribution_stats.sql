-- Migration: Add contribution_stats column to profiles table
-- This column stores cached GitHub contribution calendar data to improve performance
-- and enable streak calculations without repeated API calls
-- NOTE: This migration is now consolidated into 001_create_profiles_table.sql
--       Kept for historical reference (already applied to production)

-- Add contribution_stats column as JSONB to store the GitHub contribution calendar
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS contribution_stats jsonb NULL;

-- Add a comment to document the column's purpose
COMMENT ON COLUMN public.profiles.contribution_stats IS 'Cached GitHub contribution calendar data in JSONB format. Contains totalContributions and weeks array for streak calculations.';

-- Create an index on contribution_stats for faster JSONB queries (optional, for future optimization)
CREATE INDEX IF NOT EXISTS profiles_contribution_stats_idx 
ON public.profiles 
USING gin (contribution_stats);
