-- Force recalculation of XP and Level for all users based on xp_events
-- This fixes discrepancies where profiles.xp might have desynced from the actual event history

WITH calculated_xp AS (
    SELECT 
        user_id, 
        COALESCE(SUM(xp_amount), 0) as total_xp
    FROM xp_events
    GROUP BY user_id
)
UPDATE profiles p
SET 
    xp = cx.total_xp,
    level = 1 + floor(sqrt(cx.total_xp) / 10)::INT
FROM calculated_xp cx
WHERE p.id = cx.user_id;
