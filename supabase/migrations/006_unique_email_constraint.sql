-- ============================================
-- ADD UNIQUE EMAIL CONSTRAINT TO PROFILES
-- Prevents duplicate profiles for same email
-- ============================================

-- Step 1: Clean up any existing duplicates by keeping the oldest profile for each email
-- This deletes newer duplicates while keeping the original
DELETE FROM public.profiles p1
USING public.profiles p2
WHERE p1.email = p2.email
  AND p1.email IS NOT NULL
  AND p1.created_at > p2.created_at;

-- Step 2: Add unique constraint on email (partial index - only non-null emails)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique 
ON public.profiles(email) 
WHERE email IS NOT NULL;

-- Step 3: Update handle_new_user to use upsert instead of insert
-- This prevents errors if profile somehow already exists
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
    github_url,
    role,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.raw_app_meta_data->>'provider',
    CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'github' 
      THEN 'https://github.com/' || (NEW.raw_user_meta_data->>'user_name')
      ELSE NULL
    END,
    'user',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
