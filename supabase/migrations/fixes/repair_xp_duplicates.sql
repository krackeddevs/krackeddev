-- DATA CLEANUP SCRIPT: Remove existing duplicates first

-- 1. Daily Login Duplicates
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, (metadata->>'date')
           ORDER BY created_at ASC
         ) as row_num
  FROM xp_events
  WHERE event_type = 'daily_login'
)
DELETE FROM xp_events
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);

-- 2. Streak Milestone Duplicates
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, (metadata->>'streak_length')
           ORDER BY created_at ASC
         ) as row_num
  FROM xp_events
  WHERE event_type = 'streak_milestone'
)
DELETE FROM xp_events
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);

-- 3. GitHub Contribution Duplicates
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, (metadata->>'date')
           ORDER BY created_at ASC
         ) as row_num
  FROM xp_events
  WHERE event_type = 'github_contribution'
)
DELETE FROM xp_events
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);

-- 4. Bounty Submission Duplicates
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, (metadata->>'bounty_slug')
           ORDER BY created_at ASC
         ) as row_num
  FROM xp_events
  WHERE event_type = 'bounty_submission'
)
DELETE FROM xp_events
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);

-- 5. Bounty Win Duplicates
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, (metadata->>'bounty_slug')
           ORDER BY created_at ASC
         ) as row_num
  FROM xp_events
  WHERE event_type = 'bounty_win'
)
DELETE FROM xp_events
WHERE id IN (SELECT id FROM duplicates WHERE row_num > 1);


-- NOW CREATE THE UNIQUE INDICES (Safe to run now)

-- 1. Daily Login
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_daily_login 
ON xp_events (user_id, (metadata->>'date')) 
WHERE event_type = 'daily_login';

-- 2. Streak Milestones
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_streak_milestone 
ON xp_events (user_id, (metadata->>'streak_length')) 
WHERE event_type = 'streak_milestone';

-- 3. GitHub Contributions
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_github_contribution 
ON xp_events (user_id, (metadata->>'date')) 
WHERE event_type = 'github_contribution';

-- 4. Bounty Submissions
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_bounty_submission 
ON xp_events (user_id, (metadata->>'bounty_slug')) 
WHERE event_type = 'bounty_submission';

-- 5. Bounty Wins
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique_bounty_win 
ON xp_events (user_id, (metadata->>'bounty_slug')) 
WHERE event_type = 'bounty_win';
