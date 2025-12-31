-- Add index for leaderboard queries
CREATE INDEX IF NOT EXISTS profiles_xp_level_idx ON profiles(xp DESC, level DESC);

-- Add index for weekly XP aggregation
CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events(created_at DESC);

-- Function for weekly leaderboard
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
$$ LANGUAGE plpgsql;
