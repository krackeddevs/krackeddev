-- Verification Queries for Performance Optimizations
-- Run these in Supabase SQL Editor to verify everything is working

-- =============================================================================
-- 1. VERIFY INDEXES WERE CREATED
-- =============================================================================
SELECT 
    schemaname, 
    tablename, 
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexname LIKE 'idx_%'
  AND tablename IN ('profiles', 'bounty_submissions', 'questions', 'answers', 'votes', 'comments', 'xp_events')
ORDER BY tablename, indexname;

-- Expected: Should see ~15 new indexes

-- =============================================================================
-- 2. VERIFY MATERIALIZED VIEW EXISTS AND HAS DATA
-- =============================================================================
SELECT 
    schemaname,
    matviewname,
    hasindexes,
    ispopulated
FROM pg_matviews 
WHERE matviewname = 'active_contributors_mv';

-- Expected: ispopulated = true

-- =============================================================================
-- 3. CHECK MATERIALIZED VIEW DATA
-- =============================================================================
SELECT COUNT(*) AS total_contributors 
FROM active_contributors_mv;

-- Expected: Should match the number of users with contribution_stats

-- =============================================================================
-- 4. SAMPLE TOP CONTRIBUTORS
-- =============================================================================
SELECT 
    username,
    level,
    community_score,
    questions_count,
    answers_count,
    accepted_answers_count,
    upvotes_count,
    comments_count
FROM active_contributors_mv 
ORDER BY community_score DESC 
LIMIT 10;

-- =============================================================================
-- 5. TEST QUERY PERFORMANCE
-- =============================================================================
EXPLAIN ANALYZE 
SELECT * 
FROM active_contributors_mv 
ORDER BY community_score DESC 
LIMIT 30;

-- Expected: Execution time < 100ms (vs 10,000-20,000ms before)

-- =============================================================================
-- 6. VERIFY REFRESH FUNCTION
-- =============================================================================
SELECT refresh_active_contributors();

-- Expected: Success message

-- =============================================================================
-- 7. CHECK LAST UPDATE TIME
-- =============================================================================
SELECT 
    username,
    community_score,
    last_updated
FROM active_contributors_mv 
ORDER BY community_score DESC 
LIMIT 5;

-- The last_updated should show the most recent refresh time
