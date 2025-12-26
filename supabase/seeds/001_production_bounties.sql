-- ============================================
-- PRODUCTION SEED DATA - BOUNTIES
-- DO NOT RUN ON FRESH INSTALLS
-- This file contains production-specific bounty data
-- ============================================

-- Insert initial bounties (from migration 008)
INSERT INTO public.bounties (title, slug, description, reward_amount, status, type, skills, company_name) VALUES
('Kracked Devs Landing Page', 'kracked-devs-landing-page', 'Create a creative landing page for Kracked Devs community', 100, 'completed', 'bounty', ARRAY['design', 'frontend'], 'Kracked Devs'),
('Build a Gamified Tech Job Board for Kracked Devs', 'gamified-tech-job-board', 'Implement gamification features into the tech job board', 150, 'completed', 'bounty', ARRAY['react', 'nextjs', 'gamification'], 'Kracked Devs'),
('Build a Kracked Devs Profile GitHub Widget', 'github-profile-widget', 'Create a customizable GitHub widget for profiles', 150, 'completed', 'bounty', ARRAY['react', 'github-api', 'oauth'], 'Kracked Devs'),
('Viral Food Directory (Map Edition)', 'viral-food-directory-map', 'Build a map-first web app to discover viral food spots', 200, 'open', 'bounty', ARRAY['maps', 'api-integration', 'nextjs'], 'Kracked Devs')
ON CONFLICT (slug) DO NOTHING;
