-- Seed Bounties Table with Mock Data matching src/lib/bounty/data.ts

INSERT INTO public.bounties (id, slug, title, description, reward_amount, status, type, skills, company_name, created_at, updated_at)
VALUES
    -- 1. Completed: Landing Page
    (
        '11111111-1111-1111-1111-111111111111',
        'kracked-devs-landing-page',
        'Kracked Devs Landing Page',
        'Create a creative, standout landing page design for Kracked Devs – a vibrant developer community.',
        100,
        'completed',
        'bounty',
        ARRAY['design', 'landing-page', 'ui', 'frontend', 'creative'],
        'Kracked Devs',
        '2025-11-20 10:00:00+00',
        NOW()
    ),
    -- 2. Completed: Job Board
    (
        '22222222-2222-2222-2222-222222222222',
        'gamified-tech-job-board',
        'Build a Gamified Tech Job Board for Kracked Devs',
        'Implement gamification features into a tech job board – points, badges, leaderboards for job applications, postings, or hires.',
        150,
        'completed',
        'bounty',
        ARRAY['gamification', 'job-board', 'nextjs', 'typescript', 'fullstack'],
        'Kracked Devs',
        '2025-11-24 10:00:00+00',
        NOW()
    ),
    -- 3. Completed: GitHub Widget
    (
        '33333333-3333-3333-3333-333333333333',
        'github-profile-widget',
        'Build a Kracked Devs Profile GitHub Widget',
        'Build a customizable GitHub widget for Kracked Devs profiles with OAuth, contribution graph, themes, and live preview.',
        150,
        'completed',
        'bounty',
        ARRAY['github', 'oauth', 'widget', 'react', 'api'],
        'Kracked Devs',
        '2025-12-01 10:00:00+00',
        NOW()
    ),
    -- 4. Active: Food Map
    (
        '44444444-4444-4444-4444-444444444444',
        'viral-food-directory-map',
        'Viral Food Directory (Map Edition)',
        'Build a map-first web app to discover viral food spots, powered by reviews from Google plus one other source.',
        200,
        'open',
        'bounty',
        ARRAY['maps', 'food', 'react', 'google-places'],
        'Kracked Devs',
        '2025-12-12 10:00:00+00',
        NOW()
    )
ON CONFLICT (slug) DO NOTHING;
