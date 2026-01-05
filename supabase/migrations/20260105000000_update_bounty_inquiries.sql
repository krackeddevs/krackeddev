-- Add user_id and submitter_type to bounty_inquiries
ALTER TABLE public.bounty_inquiries
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS submitter_type text CHECK (submitter_type IN ('individual', 'company'));

-- Create index for user_id to speed up lookups for dashboard
CREATE INDEX IF NOT EXISTS idx_bounty_inquiries_user_id ON public.bounty_inquiries(user_id);
