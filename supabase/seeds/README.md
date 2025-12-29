# Production Seed Data

## ⚠️ DO NOT RUN ON FRESH INSTALLS

This directory contains production-specific seed data that should **only** be run when restoring production data.

## Files

| File | Purpose | Dependencies |
|:-----|:--------|:-------------|
| `001_production_bounties.sql` | Initial bounty records | Migration 007 (bounties table) |
| `002_production_bounty_details.sql` | Bounty details and winner info | 001_production_bounties.sql |
| `003_production_winners.sql` | Link winners to profiles + create submissions | Production user profiles (specific UUIDs) |

## Why Separate?

These files contain:
- Hardcoded production user UUIDs
- Production-specific bounty details
- Winner information

Running these on a **fresh database will FAIL** because:
- User UUIDs won't exist
- Foreign key constraints will be violated

## When to Use

### Fresh Install (Development/Testing)
❌ **DO NOT RUN** - Let app create bounties dynamically

### Production Restore
✅ **Run after migrations** in this order:
1. Run all migrations (001-021)
2. Restore production profiles table
3. Run `001_production_bounties.sql`
4. Run `002_production_bounty_details.sql`
5. Run `003_production_winners.sql`

## Manual Execution

```bash
# After running all migrations
psql $DATABASE_URL -f supabase/seeds/001_production_bounties.sql
psql $DATABASE_URL -f supabase/seeds/002_production_bounty_details.sql
psql $DATABASE_URL -f supabase/seeds/003_production_winners.sql
```

Or via Supabase SQL Editor:
1. Copy file contents
2. Paste into SQL Editor
3. Execute
