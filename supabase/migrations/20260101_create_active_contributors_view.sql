-- Performance Optimization: Materialized View for Active Contributors
-- Migration: create_active_contributors_view
-- Created: 2026-01-01
-- Purpose: Eliminate N+1 query problem by pre-aggregating contributor activity scores

-- =============================================================================
-- DROP EXISTING VIEW IF EXISTS (for migrations)
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS active_contributors_mv CASCADE;

-- =============================================================================
-- CREATE MATERIALIZED VIEW
-- =============================================================================

CREATE MATERIALIZED VIEW active_contributors_mv AS
SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.level,
    p.developer_role,
    p.contribution_stats,
    
    -- Community activity scores (last 30 days)
    COALESCE(COUNT(DISTINCT q.id), 0) AS questions_count,
    COALESCE(COUNT(DISTINCT a.id), 0) AS answers_count,
    COALESCE(COUNT(DISTINCT CASE WHEN a.is_accepted = true THEN a.id END), 0) AS accepted_answers_count,
    COALESCE(COUNT(DISTINCT v.id), 0) AS upvotes_count,
    COALESCE(COUNT(DISTINCT c.id), 0) AS comments_count,
    
    -- Calculated scores
    (COALESCE(COUNT(DISTINCT q.id), 0) * 2) AS questions_score,
    (COALESCE(COUNT(DISTINCT a.id), 0) * 3) AS answers_score,
    (COALESCE(COUNT(DISTINCT CASE WHEN a.is_accepted = true THEN a.id END), 0) * 5) AS accepted_score,
    COALESCE(COUNT(DISTINCT v.id), 0) AS upvotes_score,
    COALESCE(COUNT(DISTINCT c.id), 0) AS comments_score,
    
    -- Total community score
    (
        (COALESCE(COUNT(DISTINCT q.id), 0) * 2) +
        (COALESCE(COUNT(DISTINCT a.id), 0) * 3) +
        (COALESCE(COUNT(DISTINCT CASE WHEN a.is_accepted = true THEN a.id END), 0) * 5) +
        COALESCE(COUNT(DISTINCT v.id), 0) +
        COALESCE(COUNT(DISTINCT c.id), 0)
    ) AS community_score,
    
    -- Timestamp for cache invalidation
    NOW() AS last_updated

FROM profiles p

-- LEFT JOIN to include users even if they have no activity
LEFT JOIN questions q ON q.author_id = p.id 
    AND q.created_at >= NOW() - INTERVAL '30 days'
    
LEFT JOIN answers a ON a.author_id = p.id 
    AND a.created_at >= NOW() - INTERVAL '30 days'
    
LEFT JOIN votes v ON v.user_id = p.id 
    AND v.vote_type = 'upvote' 
    AND v.created_at >= NOW() - INTERVAL '30 days'
    
LEFT JOIN comments c ON c.author_id = p.id 
    AND c.created_at >= NOW() - INTERVAL '30 days'

-- Only include users with contribution stats
WHERE p.contribution_stats IS NOT NULL

-- Group by all profile fields
GROUP BY 
    p.id, 
    p.username, 
    p.avatar_url, 
    p.level, 
    p.developer_role, 
    p.contribution_stats;

-- =============================================================================
-- CREATE INDEXES ON MATERIALIZED VIEW
-- =============================================================================

-- Primary index on user ID for fast lookups
CREATE UNIQUE INDEX idx_active_contributors_mv_id ON active_contributors_mv(id);

-- Index for sorting by community score
CREATE INDEX idx_active_contributors_mv_community_score 
ON active_contributors_mv(community_score DESC);

-- Composite index for filtering and sorting
CREATE INDEX idx_active_contributors_mv_composite 
ON active_contributors_mv(community_score DESC, level DESC, username);

-- =============================================================================
-- CREATE FUNCTION TO REFRESH VIEW
-- =============================================================================

CREATE OR REPLACE FUNCTION refresh_active_contributors()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY active_contributors_mv;
END;
$$;

-- =============================================================================
-- SCHEDULE AUTOMATIC REFRESH (Optional - requires pg_cron extension)
-- =============================================================================

-- Note: This requires the pg_cron extension to be enabled in Supabase
-- You can enable it in the Supabase dashboard under Database > Extensions
-- Then run: SELECT cron.schedule('refresh-active-contributors', '*/5 * * * *', 'SELECT refresh_active_contributors();');

-- For manual refresh, run: SELECT refresh_active_contributors();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant SELECT permission to authenticated users
GRANT SELECT ON active_contributors_mv TO authenticated;
GRANT SELECT ON active_contributors_mv TO anon;

-- Grant EXECUTE permission on refresh function to service role only
GRANT EXECUTE ON FUNCTION refresh_active_contributors() TO service_role;

-- =============================================================================
-- INITIAL REFRESH
-- =============================================================================

REFRESH MATERIALIZED VIEW active_contributors_mv;
