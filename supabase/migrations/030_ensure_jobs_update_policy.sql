-- Ensure UPDATE policy exists for jobs table
-- This allows company owners and admins to update their jobs

DROP POLICY IF EXISTS "Members can update their company jobs" ON jobs;

CREATE POLICY "Members can update their company jobs" 
ON jobs 
FOR UPDATE 
TO authenticated 
USING (
    company_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM company_members
        WHERE company_members.company_id = jobs.company_id
        AND company_members.user_id = auth.uid()
        AND company_members.role IN ('owner', 'admin')
    )
)
WITH CHECK (
    company_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM company_members
        WHERE company_members.company_id = jobs.company_id
        AND company_members.user_id = auth.uid()
        AND company_members.role IN ('owner', 'admin')
    )
);
