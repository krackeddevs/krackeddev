-- Add social media link columns to profiles
-- This is non-breaking - all fields are nullable
-- NOTE: This migration is now consolidated into 001_create_profiles_table.sql
--       Kept for historical reference (already applied to production)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS x_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url text;

-- Create indexes for commonly queried social fields (optional, for future lookups)
CREATE INDEX IF NOT EXISTS profiles_x_url_idx ON public.profiles USING btree (x_url) WHERE x_url IS NOT NULL;
