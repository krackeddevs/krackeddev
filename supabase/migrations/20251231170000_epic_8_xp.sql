-- ==========================================
-- EPIC 8: XP System & Leaderboards Migration
-- Consolidates:
-- - User Stats Columns (profiles)
-- - XP Events Table
-- - Leaderboard Logic & RPCs
-- - XP Consistency Triggers
-- ==========================================

-- 1. PROFILE UPDATES
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_xp_grant_date DATE;

COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of user''s most recent login';
COMMENT ON COLUMN public.profiles.last_xp_grant_date IS 'Date of last daily XP grant to prevent duplicates';


-- 2. XP EVENTS TABLE
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

COMMENT ON TABLE public.xp_events IS 'Immutable audit trail of all XP-earning events for gamification system';


-- 3. INDEXES
CREATE INDEX IF NOT EXISTS xp_events_user_id_created_at_idx 
ON public.xp_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS xp_events_event_type_idx 
ON public.xp_events(event_type);

CREATE INDEX IF NOT EXISTS profiles_xp_level_idx ON profiles(xp DESC, level DESC);
CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events(created_at DESC);


-- 4. XP EVENTS RLS POLICIES
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own XP events" ON public.xp_events;
CREATE POLICY "Users can view their own XP events"
ON public.xp_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert XP events" ON public.xp_events;
CREATE POLICY "System can insert XP events"
ON public.xp_events FOR INSERT WITH CHECK (true); 

DROP POLICY IF EXISTS "Admins can view all XP events" ON public.xp_events;
CREATE POLICY "Admins can view all XP events"
ON public.xp_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 5. LEADERBOARD FUNCTION
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_count INT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  level INT,
  developer_role TEXT,
  stack TEXT[],
  weekly_xp BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.level,
    p.developer_role,
    p.stack,
    COALESCE(SUM(xe.xp_amount), 0) AS weekly_xp,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(xe.xp_amount), 0) DESC) AS rank
  FROM profiles p
  LEFT JOIN xp_events xe ON p.id = xe.user_id
    AND xe.created_at >= NOW() - INTERVAL '7 days'
  GROUP BY p.id, p.username, p.avatar_url, p.level, p.developer_role, p.stack
  ORDER BY weekly_xp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION get_weekly_leaderboard(INT) TO anon, authenticated, service_role;


-- 6. XP SYNC TRIGGER
CREATE OR REPLACE FUNCTION update_profile_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's total XP by summing all their events
  IF (TG_OP = 'INSERT') THEN
    UPDATE profiles
    SET xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = NEW.user_id),
        level = 1 + floor(sqrt((SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = NEW.user_id)) / 10)::INT
    WHERE id = NEW.user_id;
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE profiles
    SET xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = OLD.user_id),
        level = 1 + floor(sqrt((SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = OLD.user_id)) / 10)::INT
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_xp_event_change ON xp_events;
CREATE TRIGGER on_xp_event_change
AFTER INSERT OR DELETE ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profile_xp();


-- 7. ONE-TIME DATA REPAIR
-- Recalculate everyone's XP to be safe
UPDATE profiles p
SET 
  xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id),
  level = 1 + floor(sqrt(
      (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id)
    ) / 10)::INT;
