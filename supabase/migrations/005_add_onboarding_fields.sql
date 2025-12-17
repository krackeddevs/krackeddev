-- ============================================
-- ADD ONBOARDING FIELDS TO PROFILES TABLE
-- For Story 1.3: Onboarding Flow
-- ============================================

-- Add developer_role column (Junior, Mid, Senior, Lead, etc.)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS developer_role TEXT;

-- Add stack column (comma-separated or JSON array of technologies)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stack TEXT[];

-- Add location column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add onboarding_completed flag
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- Create index for onboarding queries
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx 
ON public.profiles(onboarding_completed);

-- Update handle_new_user function to include onboarding_completed = false
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
