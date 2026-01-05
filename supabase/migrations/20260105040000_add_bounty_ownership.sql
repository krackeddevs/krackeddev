-- 1. Add Ownership Columns to Bounties Table
ALTER TABLE "public"."bounties"
    ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES "public"."profiles"("id") ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS "inquiry_id" uuid REFERENCES "public"."bounty_inquiries"("id") ON DELETE SET NULL;

-- 2. Enable RLS
ALTER TABLE "public"."bounties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bounty_submissions" ENABLE ROW LEVEL SECURITY;

-- 3. Cleanup existing policies to avoid duplicates on re-run
DROP POLICY IF EXISTS "Owners can update own bounties" ON "public"."bounties";
DROP POLICY IF EXISTS "Bounty Owners can update submissions" ON "public"."bounty_submissions";
DROP POLICY IF EXISTS "Bounty Owners can view submissions" ON "public"."bounty_submissions";

-- 4. Policy: Owners can UPDATE their own bounties
CREATE POLICY "Owners can update own bounties"
    ON "public"."bounties"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Owners can Review Submissions
-- Fixed: Uses 'bounty_slug' to match current schema
CREATE POLICY "Bounty Owners can update submissions"
    ON "public"."bounty_submissions"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bounties
            WHERE bounties.slug = bounty_submissions.bounty_slug
            AND bounties.user_id = auth.uid()
        )
    );

-- 6. Policy: Bounty Owners can View Submissions
CREATE POLICY "Bounty Owners can view submissions"
    ON "public"."bounty_submissions"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bounties
            WHERE bounties.slug = bounty_submissions.bounty_slug
            AND bounties.user_id = auth.uid()
        )
    );
