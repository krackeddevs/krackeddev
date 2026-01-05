-- 1. Add missing core columns (user_id, submitter_type) if they don't exist
ALTER TABLE "public"."bounty_inquiries"
    ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS "submitter_type" text DEFAULT 'individual';

-- 2. Fix RLS: Allow users to view their own inquiries
-- Now that user_id exists, this policy will work
DROP POLICY IF EXISTS "Users can view own inquiries" ON "public"."bounty_inquiries";
CREATE POLICY "Users can view own inquiries"
    ON "public"."bounty_inquiries"
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- 3. Expand Schema: Add fields to match main bounties table
ALTER TABLE "public"."bounty_inquiries"
    ADD COLUMN IF NOT EXISTS "title" text,
    ADD COLUMN IF NOT EXISTS "estimated_budget" numeric, -- Storing as numeric for RM
    ADD COLUMN IF NOT EXISTS "skills" text[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS "difficulty" text DEFAULT 'intermediate',
    ADD COLUMN IF NOT EXISTS "deadline" timestamp with time zone,
    ADD COLUMN IF NOT EXISTS "project_type" text DEFAULT 'bounty';

-- Add check constraint for difficulty
DO $$ BEGIN
    ALTER TABLE "public"."bounty_inquiries"
        ADD CONSTRAINT "check_inquiry_difficulty" 
        CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
