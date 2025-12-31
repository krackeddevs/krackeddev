-- Add tracking columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_xp_grant_date DATE;

-- Create xp_events table
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'daily_login',
    'github_contribution',
    'bounty_submission',
    'bounty_win',
    'streak_milestone',
    'profile_completion',
    'manual_adjustment'
  )),
  xp_amount INTEGER NOT NULL CHECK (xp_amount >= 0),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS xp_events_user_id_created_at_idx 
ON public.xp_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS xp_events_event_type_idx 
ON public.xp_events(event_type);

-- Enable RLS
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own XP events
DROP POLICY IF EXISTS "Users can view their own XP events" ON public.xp_events;
CREATE POLICY "Users can view their own XP events"
ON public.xp_events
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only system can insert XP events (server actions)
-- We allow INSERT with true, but rely on backend logic/triggers or just use access control.
-- Actually, for "System can insert", usually we restrict to service_role or use a security definer function.
-- But the story says: "System can insert XP events... WITH CHECK (true); -- Server actions will handle authorization"
-- This allows ANY authenticated user to insert if they can call the API.
-- However, we typically restrict direct table insertion and use RPC or Server Actions with strict validation.
-- Since the story explicitly provides this policy, I will use it BUT I will add a comment warning or refine it if possible.
-- Wait, if `xp_events` is inserted via Server Action (which runs as user), this policy allows it.
-- But it also allows a user to `supabase.from('xp_events').insert(...)` from client if they know the schema.
-- This might be a security risk if not guarded.
-- The story says: "No UPDATE or DELETE policies ... Immutable audit trail"
-- I'll follow the story exactly as instructed by the `dev` agent rules (Story is authority).

DROP POLICY IF EXISTS "System can insert XP events" ON public.xp_events;
CREATE POLICY "System can insert XP events"
ON public.xp_events
FOR INSERT
WITH CHECK (true); 

-- Policy: Admins can view all XP events
DROP POLICY IF EXISTS "Admins can view all XP events" ON public.xp_events;
CREATE POLICY "Admins can view all XP events"
ON public.xp_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add comments
COMMENT ON TABLE public.xp_events IS 'Immutable audit trail of all XP-earning events for gamification system';
COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of user''s most recent login';
COMMENT ON COLUMN public.profiles.last_xp_grant_date IS 'Date of last daily XP grant to prevent duplicates';
