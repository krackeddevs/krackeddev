-- 1. TRIGGER: Keep profiles.xp in sync with xp_events
-- This ensures that any INSERT or DELETE on xp_events automatically updates the user's total XP and Level.

CREATE OR REPLACE FUNCTION update_profile_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's total XP by summing all their events
  IF (TG_OP = 'INSERT') THEN
    UPDATE profiles
    SET xp = (
      SELECT COALESCE(SUM(xp_amount), 0)
      FROM xp_events
      WHERE user_id = NEW.user_id
    ),
    -- Simple level calculation: 1 + floor(sqrt(xp) / 10)
    level = 1 + floor(sqrt(
      (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = NEW.user_id)
    ) / 10)::INT
    WHERE id = NEW.user_id;
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE profiles
    SET xp = (
      SELECT COALESCE(SUM(xp_amount), 0)
      FROM xp_events
      WHERE user_id = OLD.user_id
    ),
    level = 1 + floor(sqrt(
      (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = OLD.user_id)
    ) / 10)::INT
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow safe re-run
DROP TRIGGER IF EXISTS on_xp_event_change ON xp_events;

CREATE TRIGGER on_xp_event_change
AFTER INSERT OR DELETE ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profile_xp();

-- 2. ONE-TIME FIX: Recalculate everyone's XP right now
-- This fixes the current bad data where Weekly > All Time
UPDATE profiles p
SET 
  xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id),
  level = 1 + floor(sqrt(
      (SELECT COALESCE(SUM(xp_amount), 0) FROM xp_events WHERE user_id = p.id)
    ) / 10)::INT;
