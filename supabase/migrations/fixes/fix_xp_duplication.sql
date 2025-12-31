-- Fix XP event duplication by adding unique indices on JSONB metadata fields

-- 1. Daily Login: Ensure only one 'daily_login' event per user per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_daily_login 
ON xp_events (user_id, (metadata->>'date')) 
WHERE event_type = 'daily_login';

-- 2. Streak Milestones: Ensure only one event per user per streak length
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_streak_milestone 
ON xp_events (user_id, (metadata->>'streak_length')) 
WHERE event_type = 'streak_milestone';

-- 3. GitHub Contributions: Ensure only one event per user per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_github_contribution 
ON xp_events (user_id, (metadata->>'date')) 
WHERE event_type = 'github_contribution';

-- 4. Bounty Submissions: Ensure only one submission XP per bounty slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_bounty_submission 
ON xp_events (user_id, (metadata->>'bounty_slug')) 
WHERE event_type = 'bounty_submission';

-- 5. Bounty Wins: Ensure only one win XP per bounty slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_bounty_win 
ON xp_events (user_id, (metadata->>'bounty_slug')) 
WHERE event_type = 'bounty_win';
