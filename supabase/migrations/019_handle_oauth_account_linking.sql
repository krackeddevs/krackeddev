-- ============================================
-- FIX: Handle OAuth account linking
-- When a user signs in with a different OAuth provider (e.g., GitHub after Google),
-- don't create a duplicate profile if the email already exists.
-- Run this in Supabase SQL Editor
-- ============================================

-- Update the handle_new_user function to skip profile creation if email exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip profile creation if email already exists (handles OAuth account linking)
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email) THEN
    RETURN NEW;
  END IF;

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

-- Note: This function now checks if a profile with the same email exists
-- before creating a new one. This handles the case where a user signs in
-- with different OAuth providers that share the same email.
