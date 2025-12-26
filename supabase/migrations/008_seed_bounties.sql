-- ============================================
-- MIGRATION 008: SEED BOUNTIES (SCHEMA ONLY)
-- Production seed data moved to: supabase/seeds/001_production_bounties.sql
-- ============================================

-- This migration file originally contained production bounty seed data.
-- To prevent FK errors on fresh installs, seed data has been moved to:
-- supabase/seeds/001_production_bounties.sql

-- For fresh installs: Schema is created by migration 007
-- For production restore: Run seed files manually after migrations

-- If you need to seed demo/test data for development, add it here:
-- INSERT INTO public.bounties (title, slug, description, ...) VALUES (...) ON CONFLICT (slug) DO NOTHING;
