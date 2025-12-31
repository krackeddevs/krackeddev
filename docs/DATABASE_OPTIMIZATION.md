# Performance Optimization: Database Setup

## Running the Migrations

The performance optimization includes two SQL migrations:

1. **Performance Indexes** (`20260101_add_performance_indexes.sql`)
2. **Active Contributors View** (`20260101_create_active_contributors_view.sql`)

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file
4. Run them in order (indexes first, then view)

### Option 2: Via Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/fadlikhalid/Documents/Work/krackeddev/repo/krackeddev

# Run migrations
supabase db push
```

### Option 3: Via psql (Direct Connection)

```bash
# Connect to your Supabase database
psql "postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Then run each migration file
\i supabase/migrations/20260101_add_performance_indexes.sql
\i supabase/migrations/20260101_create_active_contributors_view.sql
```

---

## Refreshing the Materialized View

The `active_contributors_mv` materialized view needs periodic refreshing to stay current.

### Manual Refresh

Via SQL Editor in Supabase Dashboard:
```sql
SELECT refresh_active_contributors();
```

Via script:
```bash
chmod +x scripts/refresh-contributors-view.sh
./scripts/refresh-contributors-view.sh
```

### Automated Refresh (Recommended)

Set up a cron job to refresh every 5 minutes:

1. Enable `pg_cron` extension in Supabase Dashboard (Database > Extensions)
2. Run this SQL:

```sql
SELECT cron.schedule(
    'refresh-active-contributors',
    '*/5 * * * *',  -- Every 5 minutes
    $$SELECT refresh_active_contributors();$$
);
```

---

## Verifying the Optimizations

### 1. Check Indexes Were Created

```sql
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename IN ('profiles', 'bounty_submissions', 'questions', 'answers', 'votes', 'comments', 'xp_events')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

You should see ~15 new indexes.

### 2. Verify Materialized View

```sql
-- Check if view exists and has data
SELECT COUNT(*) AS total_contributors 
FROM active_contributors_mv;

-- View sample data
SELECT username, community_score, level 
FROM active_contributors_mv 
ORDER BY community_score DESC 
LIMIT 10;
```

### 3. Test Query Performance

Before optimization (will fail since view doesn't exist in old code):
```sql
EXPLAIN ANALYZE 
SELECT * FROM profiles WHERE contribution_stats IS NOT NULL;
-- This would trigger N+1 queries in the old code
```

After optimization:
```sql
EXPLAIN ANALYZE 
SELECT * FROM active_contributors_mv 
ORDER BY community_score DESC 
LIMIT 30;
-- Should complete in <100ms
```

---

## Troubleshooting

### Error: "relation active_contributors_mv does not exist"

- Make sure you ran the `20260101_create_active_contributors_view.sql` migration
- Check if the view was created: `SELECT * FROM pg_matviews WHERE matviewname = 'active_contributors_mv';`

### Error: "permission denied for function refresh_active_contributors"

- Make sure you're using the service role key, not the anon key
- Check permissions: `GRANT EXECUTE ON FUNCTION refresh_active_contributors() TO service_role;`

### Slow View Refresh

- This is expected on first refresh with many users
- Future refreshes will be faster due to CONCURRENTLY option
- Consider running during off-peak hours

---

## Performance Metrics to Monitor

After deploying these optimizations, monitor:

1. **Database Query Count**
   - Before: 1200+ queries on leaderboard load
   - After: <5 queries

2. **Response Time**
   - Active Contributors tab: 10-20s → <1s
   - Leaderboard page: 5-15s → <2s

3. **Database Load**
   - Check CPU usage in Supabase Dashboard
   - Should see significant reduction in peak load

---

## Next Steps

After verifying the database optimizations work:

1. Deploy the updated `next.config.ts` for image optimization
2. Deploy the updated `actions.ts` with the new `fetchActiveContributors` function
3. Test in production
4. Monitor performance metrics
5. Set up automated materialized view refresh
