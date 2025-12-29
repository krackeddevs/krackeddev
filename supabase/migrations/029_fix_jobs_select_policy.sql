-- Add missing SELECT policy for jobs table so company owners can view their jobs
-- This fixes the issue where getCompanyJobs returns empty array despite jobs existing

-- Drop old policy if exists
DROP POLICY IF EXISTS "Members can view their company jobs" ON "public"."jobs";

-- Create SELECT policy for company members to view jobs
CREATE POLICY "Members can view their company jobs" 
ON "public"."jobs" 
FOR SELECT 
TO authenticated 
USING (
    -- Allow if user is a member of the company that owns this job
    EXISTS (
        SELECT 1 FROM "public"."company_members"
        WHERE "company_members"."company_id" = "jobs"."company_id"
        AND "company_members"."user_id" = auth.uid()
        AND "company_members"."role" IN ('owner', 'admin', 'member')
    )
);
