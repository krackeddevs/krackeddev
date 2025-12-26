-- Add status column to profiles table if it doesn't exist
-- NOTE: This migration is now consolidated into 001_create_profiles_table.sql
--       Kept for historical reference (already applied to production)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN status text NOT NULL DEFAULT 'active';

        ALTER TABLE public.profiles 
        ADD CONSTRAINT check_status 
        CHECK (status IN ('active', 'banned'));
    END IF;
END $$;
