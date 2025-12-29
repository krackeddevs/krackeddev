-- Add is_banned column to profiles table for user management
-- This provides a boolean flag for easier ban status checks

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Create index for faster lookups of banned users
CREATE INDEX IF NOT EXISTS profiles_is_banned_idx ON public.profiles(is_banned);

-- Update existing banned users (based on status column)
UPDATE public.profiles
SET is_banned = true
WHERE status = 'banned';

-- Create a trigger to keep is_banned in sync with status
CREATE OR REPLACE FUNCTION sync_is_banned_with_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When status changes to 'banned', set is_banned to true
  IF NEW.status = 'banned' THEN
    NEW.is_banned = true;
  -- When status changes to 'active', set is_banned to false
  ELSIF NEW.status = 'active' THEN
    NEW.is_banned = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_ban_status ON public.profiles;
CREATE TRIGGER sync_ban_status
  BEFORE UPDATE OF status ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_is_banned_with_status();

-- Also create a trigger to sync the other way (is_banned -> status)
CREATE OR REPLACE FUNCTION sync_status_with_is_banned()
RETURNS TRIGGER AS $$
BEGIN
  -- When is_banned changes to true, set status to 'banned'
  IF NEW.is_banned = true AND OLD.is_banned = false THEN
    NEW.status = 'banned';
  -- When is_banned changes to false, set status to 'active'
  ELSIF NEW.is_banned = false AND OLD.is_banned = true THEN
    NEW.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_status_from_ban ON public.profiles;
CREATE TRIGGER sync_status_from_ban
  BEFORE UPDATE OF is_banned ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_status_with_is_banned();
