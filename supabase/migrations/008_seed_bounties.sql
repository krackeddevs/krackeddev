-- Seed Bounties Table with production data
-- This seed file includes all columns from the expanded schema (migration 010)

INSERT INTO public.bounties (
    id, slug, title, description, reward_amount, status, type, skills, 
    company_name, difficulty, deadline, requirements, repository_url, 
    long_description, created_at, updated_at
)
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
        'beginner',
        '2025-11-23 13:00:00+00',
        ARRAY[
            'Create a standout landing page design',
            'Make it creative and visually appealing',
            'Submit via X post reply with mockups/code/links'
        ],
        'https://github.com/solahidris/krackeddev',
        E'## Bounty Description\n\nCreate a creative, standout landing page design for "Kracked Devs" – a vibrant developer community dedicated to leveling up skills, tackling bounties, and building epic projects together.\n\n## What We''re Looking For\n\n- Creative and unique design concept\n- Modern, developer-focused aesthetic\n- Clear value proposition for the community\n- Responsive design for all devices\n- Engaging visuals and animations\n\n## How to Submit\n\nSubmit mockups, code, links, or previews in the comments of the bounty post. The most creative and coolest concept wins!\n\n## Judging Criteria\n\n- Creativity and originality\n- Visual appeal and design quality\n- User experience and usability\n- Technical implementation (if code is provided)\n- Alignment with Kracked Devs brand and mission',
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
        'intermediate',
        '2025-11-30 15:59:59+00',
        ARRAY[
            'Implement gamification features (points, badges, leaderboards)',
            'Submit via Pull Request to the repo',
            'Make it creative and functional',
            'Follow existing codebase patterns'
        ],
        'https://github.com/solahidris/krackeddev',
        E'## Bounty Description\n\nThe @KrackedDev community has voted for a "Gamified Tech Job Board" theme. Build something epic – implement gamification features into a tech job board.\n\n## Features to Implement\n\n- **Points System** - Earn points for various activities\n- **Badges** - Achievement badges for milestones\n- **Leaderboards** - Rankings for job applications, postings, or hires\n- **Gamification Elements** - Make job hunting fun and engaging\n\n## Technical Requirements\n\n- Contribute directly to the repo via Pull Request\n- Follow the existing codebase patterns (Next.js App Router, Tailwind, TypeScript)\n- Make it creative, functional, and standout!\n\n## How to Submit\n\n1. Fork the repository\n2. Implement your gamification features\n3. Submit a Pull Request to the main repo\n4. Share your PR link on X tagging @KrackedDevs',
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
        'advanced',
        '2025-12-07 15:59:00+00',
        ARRAY[
            'Implement GitHub OAuth authentication',
            'Fetch and render GitHub contribution graph',
            'Build in-profile editor with themes and live preview',
            'Create embeddable component for profiles',
            'Submit with screen recording and public repo'
        ],
        'https://github.com/solahidris/krackeddev',
        E'## Bounty Description\n\nNew day, new bounty! Build a customizable GitHub widget for Kracked Devs profiles.\n\n## Features Required\n\n- **OAuth to GitHub** - Secure authentication flow\n- **Fetch & Render Contribution Graph** - Display the user''s GitHub contribution data\n- **In-Profile Editor** with:\n  - Themes (Colors, Size, Layout, Shapes)\n  - Live Preview\n- **Output** - Embeddable component on the Kracked Devs Profile\n\nShip something you''d use on your own profile! Make it creative, functional, and impressive.\n\n## How to Submit\n\nReply to the bounty post with:\n1. **Screen Recording** (3–5 min) showing:\n   - GitHub connect flow\n   - Contribution graph rendering\n   - Editing features in action\n2. **Public Repo Link** with README and setup instructions\n3. Tag @KrackedDevs\n\n## Bonus Points\n\n- Live demo URL\n- Short bullets on stack/features used',
        '2025-12-01 10:00:00+00',
        NOW()
    ),
    -- 4. Open: Food Map
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
        'advanced',
        '2025-12-17 15:59:00+00',
        ARRAY[
            'Map with pins + synced list view',
            'Place page with name, address, tags, must-try item, hours, price, and photo',
            'Search and filters (near me, open now, category, price)',
            'Show distance and simple Trending sort',
            'Aggregate rating using Google + one extra review source',
            'Live demo + public repo + short README'
        ],
        'https://github.com/solahidris/krackeddev',
        E'## Bounty Description\n\nCreate a map-first web app to discover viral food spots, powered by reviews from Google plus one other source (e.g. Yelp, TripAdvisor, Foursquare).\n\n## Must-Have Features\n\n### Map & List View\n- Interactive map with pins for food spots\n- Synced list view that updates with map interactions\n\n### Place Page\nEach place should display:\n- Name and address\n- Tags/categories\n- Must-try item recommendation\n- Operating hours\n- Price range\n- Photos\n\n### Search & Filters\n- "Near me" location-based search\n- "Open now" filter\n- Category filters (e.g., cafe, restaurant, street food)\n- Price range filter\n\n### Discovery Features\n- Show distance from user\n- Simple "Trending" sort algorithm\n- Aggregate rating combining Google + one extra review source\n\n## Technical Requirements\n\n- Build a functional web app (any stack welcome)\n- Integrate Google Places/Maps API\n- Integrate at least one additional review source API\n- Mobile-responsive design\n\n## How to Submit\n\n1. Deploy a live demo\n2. Create a public repository with clear README\n3. Reply to the bounty post on X with your links\n4. Tag @KrackedDevs',
        '2025-12-12 10:00:00+00',
        NOW()
    )
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    reward_amount = EXCLUDED.reward_amount,
    status = EXCLUDED.status,
    type = EXCLUDED.type,
    skills = EXCLUDED.skills,
    company_name = EXCLUDED.company_name,
    difficulty = EXCLUDED.difficulty,
    deadline = EXCLUDED.deadline,
    requirements = EXCLUDED.requirements,
    repository_url = EXCLUDED.repository_url,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();
