-- ============================================
-- FIX: Username fallback for Google OAuth users
-- This fixes the issue where Google OAuth users get NULL usernames
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Backfill existing users with NULL usernames
-- Uses email prefix + first 4 chars of UUID for uniqueness
UPDATE public.profiles
SET username = LOWER(
  REGEXP_REPLACE(
    SPLIT_PART(email, '@', 1),
    '[^a-zA-Z0-9]',
    '',
    'g'
  ) || '_' || SUBSTRING(id::text, 1, 4)
)
WHERE username IS NULL AND email IS NOT NULL;

-- Step 2: Update the handle_new_user function to include fallback
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    email,
    provider,
    github_url
  )
  VALUES (
    NEW.id,
    -- Priority: GitHub username > preferred_username > email prefix with UUID suffix
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username',
      LOWER(
        REGEXP_REPLACE(
          SPLIT_PART(NEW.email, '@', 1),
          '[^a-zA-Z0-9]',
          '',
          'g'
        ) || '_' || SUBSTRING(NEW.id::text, 1, 4)
      )
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.raw_app_meta_data->>'provider',
    CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'github' 
      THEN 'https://github.com/' || (NEW.raw_user_meta_data->>'user_name')
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger already exists, updating the function is sufficient
-- The trigger will use the new function definition automatically

-- Step 3: Fix any duplicate usernames (append suffix)
WITH duplicates AS (
  SELECT id, username, ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at) as rn
  FROM profiles
  WHERE username IN (
    SELECT username FROM profiles WHERE username IS NOT NULL GROUP BY username HAVING COUNT(*) > 1
  )
)
UPDATE profiles p
SET username = d.username || '_' || d.rn
FROM duplicates d
WHERE p.id = d.id AND d.rn > 1;

-- Step 4: Add unique constraint to prevent future duplicates (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_username') THEN
    ALTER TABLE profiles ADD CONSTRAINT unique_username UNIQUE (username);
  END IF;
END $$;
