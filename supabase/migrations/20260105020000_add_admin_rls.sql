-- Allow Admins to View and Update ALL Inquiries
-- Corrected: Uses 'role' column (enum) instead of 'is_admin'

-- Policy for Viewing (SELECT)
CREATE POLICY "Admins can view all inquiries"
    ON "public"."bounty_inquiries"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy for Updating (UPDATE)
CREATE POLICY "Admins can update all inquiries"
    ON "public"."bounty_inquiries"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
