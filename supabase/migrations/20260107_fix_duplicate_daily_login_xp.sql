-- Fix duplicate daily login XP issue
-- Step 1: Clean up existing duplicates
-- Step 2: Add unique constraint to prevent future duplicates

-- STEP 1: Remove duplicate daily_login events
-- Keep only the first (earliest) daily login event for each user per day
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, metadata->>'date' 
            ORDER BY created_at ASC, id ASC
        ) as rn
    FROM xp_events
    WHERE event_type = 'daily_login'
)
DELETE FROM xp_events
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- STEP 2: Recalculate correct XP totals for affected users
UPDATE profiles p
SET xp = (
    SELECT COALESCE(SUM(xp_amount), 0)
    FROM xp_events
    WHERE user_id = p.id
)
WHERE id IN (
    SELECT DISTINCT user_id 
    FROM xp_events 
    WHERE event_type = 'daily_login'
);

-- STEP 3: Recalculate levels based on corrected XP
-- Using the formula: Level = floor(sqrt(XP / 100)) + 1
UPDATE profiles
SET level = GREATEST(1, LEAST(100, FLOOR(SQRT(xp / 100.0)) + 1))
WHERE id IN (
    SELECT DISTINCT user_id 
    FROM xp_events 
    WHERE event_type = 'daily_login'
);

-- STEP 4: Create unique index to prevent future duplicates
-- This prevents race conditions where multiple requests grant XP for the same day
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_daily_login_unique
ON xp_events (user_id, (metadata->>'date'))
WHERE event_type = 'daily_login';
