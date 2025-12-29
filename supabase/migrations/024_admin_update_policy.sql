-- Add RLS policy to allow admins to update any profile
-- This enables admin user management (ban/unban, role changes, etc.)

-- Drop existing policy if it exists (for idempotency)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Create policy for admin updates
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
