-- ============================================
-- PROFILES TABLE FOR KRACKEDDEVS
-- Run this in Supabase SQL Editor
-- ============================================

-- Create enum type for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table with complete production schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  provider TEXT,
  github_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  role user_role NOT NULL DEFAULT 'user'::user_role,
  developer_role TEXT,
  stack TEXT[],
  location TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active'::text,
  x_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  is_discoverable BOOLEAN DEFAULT true,
  is_open_to_work BOOLEAN DEFAULT false,
  is_hiring BOOLEAN DEFAULT false,
  github_username TEXT,
  github_access_token TEXT,
  developer_score INTEGER DEFAULT 0,
  portfolio_synced_at TIMESTAMPTZ,
  contribution_stats JSONB,
  CONSTRAINT check_status CHECK (status IN ('active', 'banned'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx ON public.profiles(onboarding_completed);

-- Unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS unique_username ON public.profiles(username);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON public.profiles(email) WHERE email IS NOT NULL;

-- GIN index for JSONB contribution_stats queries
CREATE INDEX IF NOT EXISTS profiles_contribution_stats_idx ON public.profiles USING gin(contribution_stats);


-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (public)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
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
    'user'::user_role,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- OPTIONAL: Backfill existing users
-- Run this AFTER the above if you have existing users
-- ============================================
-- INSERT INTO public.profiles (id, username, full_name, avatar_url, email, provider, github_url)
-- SELECT 
--   id,
--   COALESCE(raw_user_meta_data->>'user_name', raw_user_meta_data->>'preferred_username'),
--   COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
--   raw_user_meta_data->>'avatar_url',
--   email,
--   raw_app_meta_data->>'provider',
--   CASE 
--     WHEN raw_app_meta_data->>'provider' = 'github' 
--     THEN 'https://github.com/' || (raw_user_meta_data->>'user_name')
--     ELSE NULL
--   END
-- FROM auth.users
-- ON CONFLICT (id) DO NOTHING;
