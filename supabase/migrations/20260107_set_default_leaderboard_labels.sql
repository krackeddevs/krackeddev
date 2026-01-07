-- Set default leaderboard labels based on user roles
-- This ensures all existing users have the correct label

-- Update all admin users to [SYSTEM]
UPDATE profiles
SET leaderboard_label = '[SYSTEM]'
WHERE role = 'admin';

-- Update all non-admin users (user, staff, or any other role) to [RUNNER]
UPDATE profiles
SET leaderboard_label = '[RUNNER]'
WHERE role != 'admin' OR role IS NULL;

-- Optional: Update any staff users to [MOD] if you want to preserve that distinction
-- Uncomment the line below if needed:
-- UPDATE profiles SET leaderboard_label = '[MOD]' WHERE role = 'staff';
