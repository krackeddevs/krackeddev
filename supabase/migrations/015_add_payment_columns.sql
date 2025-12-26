-- Add payment tracking columns to bounty_submissions
-- Story 5.3: Verification Logic
-- NOTE: Payment columns now consolidated into 003_create_bounty_submissions_table.sql
--       Admin RLS policy in this file is still active and not duplicated
--       Kept for historical reference (already applied to production)

-- Add payment columns
ALTER TABLE public.bounty_submissions
  ADD COLUMN IF NOT EXISTS payment_ref TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Add admin RLS policy for updating submissions (approve/reject/payment)
DROP POLICY IF EXISTS "Admins can update all submissions" ON public.bounty_submissions;
CREATE POLICY "Admins can update all submissions"
  ON public.bounty_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Comments
COMMENT ON COLUMN public.bounty_submissions.payment_ref IS 'Transaction reference for payment (manual entry)';
COMMENT ON COLUMN public.bounty_submissions.paid_at IS 'Timestamp when payment was marked as complete';
