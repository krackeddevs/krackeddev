#!/bin/bash
# Script to refresh the active_contributors materialized view
# This should be run periodically (e.g., every 5 minutes via cron)

set -e

echo "🔄 Refreshing active_contributors materialized view..."

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Get Supabase connection string
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set"
    exit 1
fi

# Extract database connection details
PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co|\1|')
DB_URL="postgresql://postgres.${PROJECT_REF}:${SUPABASE_SERVICE_KEY}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

echo "📊 Connecting to database..."

# Run the refresh function
psql "$DB_URL" -c "SELECT refresh_active_contributors();" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Materialized view refreshed successfully!"
    echo "⏰ Last refreshed: $(date)"
else
    echo "❌ Failed to refresh materialized view"
    exit 1
fi
