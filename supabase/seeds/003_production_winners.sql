-- ============================================
-- PRODUCTION SEED DATA - WINNER LINKS
-- DO NOT RUN ON FRESH INSTALLS
-- This file contains production-specific winner linking from migration 017
-- Requires: Specific production user UUIDs to exist in profiles table
-- ============================================

-- Link existing winners to their profiles (from migration 017)

-- Bounty 1: Kracked Devs Landing Page → Zafranudin Zafrin
UPDATE public.bounties 
SET winner_user_id = 'bc2af229-85b4-4992-a3d1-034b317e289f'
WHERE slug = 'kracked-devs-landing-page';

-- Bounty 2: Gamified Tech Job Board → Iffat Haikal
UPDATE public.bounties 
SET winner_user_id = '4096edcf-6eca-43df-93d9-d5bfe969fa65'
WHERE slug = 'gamified-tech-job-board';

-- Bounty 3: GitHub Profile Widget → Akmal Alif
UPDATE public.bounties 
SET winner_user_id = '349b6157-2831-4c79-917c-5d8a708c6af0'
WHERE slug = 'github-profile-widget';

-- Bounty 4: Viral Food Directory → Akmal Alif
UPDATE public.bounties 
SET winner_user_id = '349b6157-2831-4c79-917c-5d8a708c6af0'
WHERE slug = 'viral-food-directory-map';

-- Create approved bounty_submissions for winners

-- Submission 1: Kracked Devs Landing Page - Zafranudin Zafrin
INSERT INTO public.bounty_submissions (
  bounty_slug, bounty_title, bounty_reward, user_id, 
  pull_request_url, status, paid_at, notes
) VALUES (
  'kracked-devs-landing-page',
  'Kracked Devs Landing Page',
  100,
  'bc2af229-85b4-4992-a3d1-034b317e289f',
  'https://x.com/masterofnone/status/1992914421883248878',
  'approved',
  '2025-11-23 21:00:00+08',
  'Legacy bounty winner - migrated from text data'
) ON CONFLICT DO NOTHING;

-- Submission 2: Gamified Tech Job Board - Iffat Haikal
INSERT INTO public.bounty_submissions (
  bounty_slug, bounty_title, bounty_reward, user_id, 
  pull_request_url, status, paid_at, notes
) VALUES (
  'gamified-tech-job-board',
  'Build a Gamified Tech Job Board for Kracked Devs',
  150,
  '4096edcf-6eca-43df-93d9-d5bfe969fa65',
  'https://x.com/iffathaikal1/status/1995088727497158927',
  'approved',
  '2025-11-30 23:59:59+08',
  'Legacy bounty winner - migrated from text data'
) ON CONFLICT DO NOTHING;

-- Submission 3: GitHub Profile Widget - Akmal Alif
INSERT INTO public.bounty_submissions (
  bounty_slug, bounty_title, bounty_reward, user_id, 
  pull_request_url, status, paid_at, notes
) VALUES (
  'github-profile-widget',
  'Build a Kracked Devs Profile GitHub Widget',
  150,
  '349b6157-2831-4c79-917c-5d8a708c6af0',
  'https://x.com/masterofnone/status/1997925687320342770',
  'approved',
  '2025-12-07 23:59:00+08',
  'Legacy bounty winner - migrated from text data'
) ON CONFLICT DO NOTHING;

-- Submission 4: Viral Food Directory - Akmal Alif
INSERT INTO public.bounty_submissions (
  bounty_slug, bounty_title, bounty_reward, user_id, 
  pull_request_url, status, paid_at, notes
) VALUES (
  'viral-food-directory-map',
  'Viral Food Directory (Map Edition)',
  200,
  '349b6157-2831-4c79-917c-5d8a708c6af0',
  'https://krekfood.vercel.app/',
  'approved',
  '2025-12-20 16:48:03+08',
  'Legacy bounty winner - migrated from text data'
) ON CONFLICT DO NOTHING;
