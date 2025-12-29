-- Add winner columns and additional fields to bounties table
-- Then re-seed with complete data matching src/lib/bounty/data.ts
-- NOTE: Bounty columns now consolidated into 007_create_bounties_tables.sql
--       Seed data moved to: supabase/seeds/002_production_bounty_details.sql
--       Kept for historical reference (already applied to production)

-- This migration originally added columns AND seeded winner data
-- Columns are now in migration 007 (consolidated)
-- Seed data moved to supabase/seeds/002_production_bounty_details.sql

-- Schema changes (now no-op since columns exist in 007)
ALTER TABLE public.bounties
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'intermediate',
  ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS repository_url TEXT,
  ADD COLUMN IF NOT EXISTS bounty_post_url TEXT,
  ADD COLUMN IF NOT EXISTS submission_post_url TEXT,
  ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'normal',
  -- Winner columns
  ADD COLUMN IF NOT EXISTS winner_name TEXT,
  ADD COLUMN IF NOT EXISTS winner_x_handle TEXT,
  ADD COLUMN IF NOT EXISTS winner_x_url TEXT,
  ADD COLUMN IF NOT EXISTS winner_submission_url TEXT;

-- Production seed data has been moved to:
-- supabase/seeds/002_production_bounty_details.sql
-- Run that file manually if restoring production data
