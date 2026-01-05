-- 1. Enable pg_cron (if not enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Update Constraints to allow 'expired' status (DB Level)
DO $$ BEGIN
    ALTER TABLE "public"."bounties" 
        DROP CONSTRAINT IF EXISTS "bounties_status_check";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

ALTER TABLE "public"."bounties"
    ADD CONSTRAINT "bounties_status_check" 
    CHECK (status IN ('open', 'active', 'claimed', 'completed', 'expired', 'closed'));


-- 3. Create the Expiration Function
CREATE OR REPLACE FUNCTION handle_bounty_expiration()
RETURNS void AS $$
BEGIN
    UPDATE public.bounties
    SET status = 'expired'
    WHERE status IN ('open', 'active') 
      AND deadline < NOW();
END;
$$ LANGUAGE plpgsql;


-- 4. Schedule the job (Run every midnight)
-- Fixed: Removed nested $$ quotes to prevent syntax error
DO $$
DECLARE
    row_count int;
BEGIN
    -- Check if job exists and unschedule by ID (safer)
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'auto-expire-bounties';
    
    -- Schedule the new job (Using simple single quotes for the command)
    PERFORM cron.schedule(
        'auto-expire-bounties',
        '0 0 * * *', 
        'SELECT handle_bounty_expiration()'
    );
END $$;
