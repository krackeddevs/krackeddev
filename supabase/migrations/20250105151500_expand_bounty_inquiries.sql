-- Migration: Expand bounty_inquiries to match bounties table for easy conversion
-- Added: title, estimated_budget (RM), skills, difficulty, deadline, project_type

ALTER TABLE "public"."bounty_inquiries"
    ADD COLUMN IF NOT EXISTS "title" text,
    ADD COLUMN IF NOT EXISTS "estimated_budget" numeric, -- In RM as requested
    ADD COLUMN IF NOT EXISTS "skills" text[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS "difficulty" text DEFAULT 'intermediate',
    ADD COLUMN IF NOT EXISTS "deadline" timestamp with time zone,
    ADD COLUMN IF NOT EXISTS "project_type" text DEFAULT 'bounty';

-- Add check constraint for difficulty to match bounties table
DO $$ BEGIN
    ALTER TABLE "public"."bounty_inquiries"
        ADD CONSTRAINT "check_inquiry_difficulty" 
        CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
