# Story 8.1: XP Tracking Infrastructure

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 8

## Story

As a Platform Administrator,
I want a robust XP tracking database infrastructure,
So that all XP events are recorded immutably and users' progress is accurately maintained.

## Acceptance Criteria

1. **Given** the migration runs successfully
2. **When** the database is inspected
3. **Then** `xp_events` table exists with proper schema
4. **And** `profiles` table has `last_login_at` and `last_xp_grant_date` columns
5. **And** RLS policies prevent unauthorized access to XP data
6. **And** Indexes are created for performance optimization
7. **Given** an XP event is created
8. **Then** it cannot be modified or deleted (immutable audit trail)

## Tasks/Subtasks

- [ ] Create migration `021_add_xp_tracking.sql` <!-- id: 1 -->
- [ ] Add `xp_events` table with all required columns <!-- id: 2 -->
- [ ] Add `last_login_at` and `last_xp_grant_date` to profiles <!-- id: 3 -->
- [ ] Create indexes on `xp_events(user_id, created_at)` <!-- id: 4 -->
- [ ] Add RLS policies for xp_events table <!-- id: 5 -->
- [ ] Test migration locally with supabase <!-- id: 6 -->
- [ ] Verify no breaking changes to existing queries <!-- id: 7 -->

## Technical Requirements

### Migration File: `021_add_xp_tracking.sql`

```sql
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
  xp_amount INTEGER NOT NULL CHECK (xp_amount \u003e= 0),
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
CREATE POLICY "Users can view their own XP events"
ON public.xp_events
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only system can insert XP events (server actions)
CREATE POLICY "System can insert XP events"
ON public.xp_events
FOR INSERT
WITH CHECK (true); -- Server actions will handle authorization

-- Policy: Admins can view all XP events
CREATE POLICY "Admins can view all XP events"
ON public.xp_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: No updates or deletes (immutable audit trail)
-- (No UPDATE or DELETE policies = not allowed by default)

-- Add comments
COMMENT ON TABLE public.xp_events IS 'Immutable audit trail of all XP-earning events for gamification system';
COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of user''s most recent login';
COMMENT ON COLUMN public.profiles.last_xp_grant_date IS 'Date of last daily XP grant to prevent duplicates';
```

### Database Schema Diagram

```
┌─────────────────────────────────────────┐
│  profiles                                │
├─────────────────────────────────────────┤
│  id (UUID) PK                            │
│  username                                │
│  level (INT) DEFAULT 1                   │
│  xp (INT) DEFAULT 0                      │
│  last_login_at (TIMESTAMPTZ) ← NEW      │
│  last_xp_grant_date (DATE) ← NEW        │
│  ...                                     │
└────────┬────────────────────────────────┘
         │
         │ 1:N
         │
┌────────▼────────────────────────────────┐
│  xp_events ← NEW TABLE                  │
├─────────────────────────────────────────┤
│  id (UUID) PK                            │
│  user_id (UUID) FK → profiles.id        │
│  event_type (TEXT)                       │
│  xp_amount (INT)                         │
│  metadata (JSONB)                        │
│  created_at (TIMESTAMPTZ)                │
└─────────────────────────────────────────┘
```

### Event Type Enum

Valid `event_type` values:
- `daily_login`: First login of the day
- `github_contribution`: GitHub activity detected
- `bounty_submission`: User submitted to a bounty
- `bounty_win`: User won a bounty
- `streak_milestone`: Achieved streak milestone (7/30/90 days)
- `profile_completion`: Completed profile setup
- `manual_adjustment`: Admin manual correction

### Metadata Examples

```json
// daily_login
{ "login_method": "github", "consecutive_days": 5 }

// github_contribution
{ "contribution_count": 12, "date": "2024-12-25" }

// bounty_win
{ "bounty_id": "uuid", "bounty_value": 500, "bonus_xp": 25 }

// streak_milestone
{ "streak_length": 30, "milestone_tier": "gold" }
```

## Architecture Compliance

- **Database**: Postgres with RLS enabled
- **Migration**: Sequential numbering (021)
- **Immutability**: No UPDATE/DELETE policies on xp_events
- **Performance**: Proper indexing for foreign keys and date ranges
- **Security**: RLS enforces user-level and admin-level access

## Testing Strategy

### Migration Testing

```bash
# Local Supabase environment
supabase db reset
supabase migration up
supabase db query "SELECT * FROM xp_events LIMIT 1;"
```

### Validation Queries

```sql
-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('last_login_at', 'last_xp_grant_date');

-- Verify xp_events table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'xp_events';

-- Verify indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'xp_events';

-- Verify RLS policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'xp_events';
```

### Edge Cases to Test

- Migration runs on database with existing profiles
- Re-running migration (idempotent)
- Constraint validation (invalid event_type fails)
- Negative XP amount rejected
- Cascade delete (deleting profile deletes xp_events)

## Performance Considerations

- Index on `(user_id, created_at DESC)` enables fast user history queries
- Index on `event_type` enables analytics queries
- JSONB metadata allows flexible data without schema changes
- Partitioning by month could be added later for scale

## Dev Notes

- No backfill needed - start tracking from migration date forward
- `last_xp_grant_date` is DATE type (not TIMESTAMPTZ) for simple day comparison
- `xp_events` is append-only for audit compliance
- Future: Add `xp_events_summary` materialized view for analytics

## References

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL CHECK Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- Epic 8: Player XP and Leveling System
