-- FINAL FIX for Infinite Recursion
-- We generally avoid querying the same table in RLS, but for "Admins managing members" it's necessary.
-- The solution is to use a SECURITY DEFINER function to perform the check.
-- This function runs with elevated privileges and bypasses RLS, avoiding the recursion loop.

-- 1. Create the helper function
CREATE OR REPLACE FUNCTION public.check_is_admin_of_company(_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_id = _company_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_is_admin_of_company TO authenticated;

-- 2. Drop the recursive policies
-- Drop both potentially problematic policies to be safe
DROP POLICY IF EXISTS "Admins can manage members" ON "public"."company_members";
DROP POLICY IF EXISTS "Members can view their company members" ON "public"."company_members";

-- 3. Re-create "Admins can manage members" using the safe function
CREATE POLICY "Admins can manage members"
ON "public"."company_members"
FOR ALL
TO authenticated
USING (
    public.check_is_admin_of_company(company_id)
);

-- Note: We rely on the previously created "Users can view their own membership" policy for SELECT access.
-- That policy is simple `user_id = auth.uid()` and is NOT recursive.
