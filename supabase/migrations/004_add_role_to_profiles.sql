-- ============================================
-- ADD ROLE COLUMN TO PROFILES TABLE
-- For RBAC compliance (admin/user roles)
-- Story 1.1 AC#4
-- NOTE: This migration is now consolidated into 001_create_profiles_table.sql
--       Kept for historical reference (already applied to production)
-- ============================================

-- Create enum type for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column with default 'user'
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user' NOT NULL;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Update handle_new_user function to include role
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
    role
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
    'user'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
