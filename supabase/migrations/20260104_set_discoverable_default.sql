-- Set is_discoverable to true for all existing active users
-- This ensures existing users appear in the member list after the filter was added
UPDATE profiles
SET is_discoverable = true
WHERE status = 'active'
  AND onboarding_completed = true
  AND is_discoverable = false;
