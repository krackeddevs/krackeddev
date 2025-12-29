-- Migration: Add winner_user_id FK to bounties table and link existing winners
-- Run this in Supabase SQL Editor
-- NOTE: winner_user_id column and FK now consolidated into 007_create_bounties_tables.sql
--       Winner linking data moved to: supabase/seeds/003_production_winners.sql
--       Kept for historical reference (already applied to production)

-- This migration originally added FK column AND linked production winners
-- Column is now in migration 007 (consolidated)
-- Production winner linking moved to supabase/seeds/003_production_winners.sql

-- Add winner_user_id column with FK to profiles (now no-op since exists in 007)
ALTER TABLE public.bounties
  ADD COLUMN IF NOT EXISTS winner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create index for efficient lookups (now no-op since exists in 007)
CREATE INDEX IF NOT EXISTS idx_bounties_winner_user_id ON public.bounties(winner_user_id);

-- Production winner linking and submission data has been moved to:
-- supabase/seeds/003_production_winners.sql
-- Run that file manually if restoring production data (requires production user UUIDs)
