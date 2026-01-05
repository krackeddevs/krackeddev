-- Update status constraint for bounty_inquiries to include 'approved'
ALTER TABLE "public"."bounty_inquiries" 
    DROP CONSTRAINT IF EXISTS "bounty_inquiries_status_check";

ALTER TABLE "public"."bounty_inquiries"
    ADD CONSTRAINT "bounty_inquiries_status_check" 
    CHECK (status IN ('new', 'contacted', 'closed', 'approved', 'rejected'));
