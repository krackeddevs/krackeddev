-- NOTE: profiles and page_views tables already exist in Supabase
-- Only creating the new jobs table

CREATE TABLE IF NOT EXISTS "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"company_logo" text,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"is_remote" boolean DEFAULT false,
	"employment_type" text,
	"source_url" text,
	"source_site" text,
	"posted_at" timestamp with time zone,
	"scraped_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_company_idx" ON "jobs" USING btree ("company");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_location_idx" ON "jobs" USING btree ("location");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_is_active_idx" ON "jobs" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_posted_at_idx" ON "jobs" USING btree ("posted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_source_site_idx" ON "jobs" USING btree ("source_site");