-- Add winner columns and additional fields to bounties table
-- Then re-seed with complete data matching src/lib/bounty/data.ts

-- Step 1: Add missing columns
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

-- Step 2: Update existing bounties with complete data
-- Bounty 1: Kracked Devs Landing Page (Completed)
UPDATE public.bounties SET
  long_description = E'## Bounty Description\n\nCreate a creative, standout landing page design for "Kracked Devs" – a vibrant developer community dedicated to leveling up skills, tackling bounties, and building epic projects together.\n\n## What We''re Looking For\n\n- Creative and unique design concept\n- Modern, developer-focused aesthetic\n- Clear value proposition for the community\n- Responsive design for all devices\n- Engaging visuals and animations\n\n## How to Submit\n\nSubmit mockups, code, links, or previews in the comments of the bounty post. The most creative and coolest concept wins!\n\n## Judging Criteria\n\n- Creativity and originality\n- Visual appeal and design quality\n- User experience and usability\n- Technical implementation (if code is provided)\n- Alignment with Kracked Devs brand and mission',
  difficulty = 'beginner',
  requirements = ARRAY['Create a standout landing page design', 'Make it creative and visually appealing', 'Submit via X post reply with mockups/code/links'],
  repository_url = 'https://github.com/solahidris/krackeddev',
  bounty_post_url = 'https://x.com/masterofnone/status/1992362597862240318',
  submission_post_url = 'https://x.com/masterofnone/status/1992914421883248878',
  deadline = '2025-11-23 21:00:00+08',
  completed_at = '2025-11-23 21:00:00+08',
  winner_name = 'Zafran Udin',
  winner_x_handle = 'zafranudin_z',
  winner_x_url = 'https://x.com/zafranudin_z'
WHERE slug = 'kracked-devs-landing-page';

-- Bounty 2: Gamified Tech Job Board (Completed)
UPDATE public.bounties SET
  long_description = E'## Bounty Description\n\nThe @KrackedDev community has voted for a "Gamified Tech Job Board" theme. Build something epic – implement gamification features into a tech job board.\n\n## Features to Implement\n\n- **Points System** - Earn points for various activities\n- **Badges** - Achievement badges for milestones\n- **Leaderboards** - Rankings for job applications, postings, or hires\n- **Gamification Elements** - Make job hunting fun and engaging\n\n## Technical Requirements\n\n- Contribute directly to the repo via Pull Request\n- Follow the existing codebase patterns (Next.js App Router, Tailwind, TypeScript)\n- Make it creative, functional, and standout!\n\n## How to Submit\n\n1. Fork the repository\n2. Implement your gamification features\n3. Submit a Pull Request to the main repo\n4. Share your PR link on X tagging @KrackedDevs',
  difficulty = 'intermediate',
  requirements = ARRAY['Implement gamification features (points, badges, leaderboards)', 'Submit via Pull Request to the repo', 'Make it creative and functional', 'Follow existing codebase patterns'],
  repository_url = 'https://github.com/solahidris/krackeddev',
  bounty_post_url = 'https://x.com/solahidris_/status/1993586176419414145',
  submission_post_url = 'https://x.com/iffathaikal1/status/1995088727497158927',
  deadline = '2025-11-30 23:59:59+08',
  completed_at = '2025-11-30 23:59:59+08',
  winner_name = 'Iffat Haikal',
  winner_x_handle = 'iffathaikal1',
  winner_x_url = 'https://x.com/iffathaikal1',
  winner_submission_url = 'https://x.com/iffathaikal1/status/1995088727497158927'
WHERE slug = 'gamified-tech-job-board';

-- Bounty 3: GitHub Profile Widget (Completed)
UPDATE public.bounties SET
  long_description = E'## Bounty Description\n\nNew day, new bounty! Build a customizable GitHub widget for Kracked Devs profiles.\n\n## Features Required\n\n- **OAuth to GitHub** - Secure authentication flow\n- **Fetch & Render Contribution Graph** - Display the user''s GitHub contribution data\n- **In-Profile Editor** with:\n  - Themes (Colors, Size, Layout, Shapes)\n  - Live Preview\n- **Output** - Embeddable component on the Kracked Devs Profile\n\nShip something you''d use on your own profile! Make it creative, functional, and impressive.\n\n## How to Submit\n\nReply to the bounty post with:\n1. **Screen Recording** (3–5 min) showing:\n   - GitHub connect flow\n   - Contribution graph rendering\n   - Editing features in action\n2. **Public Repo Link** with README and setup instructions\n3. Tag @KrackedDevs\n\n## Bonus Points\n\n- Live demo URL\n- Short bullets on stack/features used',
  difficulty = 'advanced',
  requirements = ARRAY['Implement GitHub OAuth authentication', 'Fetch and render GitHub contribution graph', 'Build in-profile editor with themes and live preview', 'Create embeddable component for profiles', 'Submit with screen recording and public repo'],
  repository_url = 'https://github.com/solahidris/krackeddev',
  bounty_post_url = 'https://x.com/KrackedDevs/status/1996442362634174677',
  submission_post_url = 'https://x.com/masterofnone/status/1997925687320342770',
  deadline = '2025-12-07 23:59:00+08',
  completed_at = '2025-12-07 23:59:00+08',
  winner_name = 'Akmal Alif',
  winner_x_handle = '4kmal4lif',
  winner_x_url = 'https://x.com/4kmal4lif'
WHERE slug = 'github-profile-widget';

-- Bounty 4: Viral Food Directory (Active)
UPDATE public.bounties SET
  long_description = E'## Bounty Description\n\nCreate a map-first web app to discover viral food spots, powered by reviews from Google plus one other source (e.g. Yelp, TripAdvisor, Foursquare).\n\n## Must-Have Features\n\n### Map & List View\n- Interactive map with pins for food spots\n- Synced list view that updates with map interactions\n\n### Place Page\nEach place should display:\n- Name and address\n- Tags/categories\n- Must-try item recommendation\n- Operating hours\n- Price range\n- Photos\n\n### Search & Filters\n- "Near me" location-based search\n- "Open now" filter\n- Category filters (e.g., cafe, restaurant, street food)\n- Price range filter\n\n### Discovery Features\n- Show distance from user\n- Simple "Trending" sort algorithm\n- Aggregate rating combining Google + one extra review source\n\n## Technical Requirements\n\n- Build a functional web app (any stack welcome)\n- Integrate Google Places/Maps API\n- Integrate at least one additional review source API\n- Mobile-responsive design\n\n## How to Submit\n\n1. Deploy a live demo\n2. Create a public repository with clear README\n3. Reply to the bounty post on X with your links\n4. Tag @KrackedDevs',
  difficulty = 'advanced',
  requirements = ARRAY['Map with pins + synced list view', 'Place page with name, address, tags, must-try item, hours, price, and photo', 'Search and filters (near me, open now, category, price)', 'Show distance and simple Trending sort', 'Aggregate rating using Google + one extra review source', 'Live demo + public repo + short README'],
  repository_url = 'https://github.com/solahidris/krackeddev',
  bounty_post_url = 'https://x.com/KrackedDevs',
  deadline = '2025-12-17 23:59:00+08',
  rarity = 'normal'
WHERE slug = 'viral-food-directory-map';

-- Add check constraint for difficulty (optional)
-- ALTER TABLE public.bounties ADD CONSTRAINT bounties_difficulty_check 
--   CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert'));

-- Add check constraint for rarity (optional)
-- ALTER TABLE public.bounties ADD CONSTRAINT bounties_rarity_check 
--   CHECK (rarity IN ('normal', 'rare'));
