-- Add banner_url field to companies table
-- This supports the banner image feature for public company profiles (Story 9.5)

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS banner_url TEXT;

COMMENT ON COLUMN public.companies.banner_url IS 'URL to company banner image (optional, displayed on public profile)';
