-- Consolidated Migration for Jobs, Companies, Applications, and Storage
-- Replaces migrations 021 through 032
-- FAIL-SAFE / IDEMPOTENT VERSION

-- ============================================
-- 1. ENUMS
-- ============================================

DO $$ BEGIN
    CREATE TYPE "public"."company_role" AS ENUM ('owner', 'admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ============================================
-- 2. TABLES (Safe Creation & Column Alignment)
-- ============================================

-- 2.1 COMPANIES
CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure all columns exist (idempotent updates)
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "logo_url" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "website_url" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "banner_url" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "size" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT false;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "industry" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "location" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "linkedin_url" text;
ALTER TABLE "public"."companies" ADD COLUMN IF NOT EXISTS "twitter_url" text;

-- Unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS "companies_slug_key" ON "public"."companies" ("slug");


-- 2.2 JOBS
CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" text NOT NULL PRIMARY KEY,
    "title" text NOT NULL,
    "company" text NOT NULL,
    "description" text NOT NULL,
    "location" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure all columns exist (idempotent updates)
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "company_logo" text;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "is_remote" boolean DEFAULT false;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "employment_type" text;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "source_url" text;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "source_site" text;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "posted_at" timestamp with time zone;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "scraped_at" timestamp with time zone DEFAULT now();
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "salary_min" integer;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "salary_max" integer;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "company_id" uuid REFERENCES "public"."companies" ("id") ON DELETE SET NULL;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "application_url" text;

-- Add columns with constraints safely
DO $$ BEGIN
    ALTER TABLE "public"."jobs" ADD COLUMN "job_type" text CHECK (job_type IN ('internal', 'external')) DEFAULT 'external';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "public"."jobs" ADD COLUMN "application_method" text CHECK (application_method IN ('url', 'email', 'internal_form')) DEFAULT 'url';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "jobs_company_idx" ON "public"."jobs" ("company");
CREATE INDEX IF NOT EXISTS "jobs_location_idx" ON "public"."jobs" ("location");
CREATE INDEX IF NOT EXISTS "jobs_is_active_idx" ON "public"."jobs" ("is_active");
CREATE INDEX IF NOT EXISTS "jobs_posted_at_idx" ON "public"."jobs" ("posted_at");
CREATE INDEX IF NOT EXISTS "jobs_company_id_idx" ON "public"."jobs" ("company_id");


-- 2.3 COMPANY MEMBERS
CREATE TABLE IF NOT EXISTS "public"."company_members" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "company_id" uuid NOT NULL REFERENCES "public"."companies" ("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "public"."profiles" ("id") ON DELETE CASCADE,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure role column with default
DO $$ BEGIN
    ALTER TABLE "public"."company_members" ADD COLUMN "role" "public"."company_role" DEFAULT 'member'::"public"."company_role" NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Prevent duplicate membership (Constraint)
DO $$ BEGIN
    ALTER TABLE "public"."company_members" ADD CONSTRAINT "company_members_company_id_user_id_key" UNIQUE ("company_id", "user_id");
EXCEPTION
    WHEN duplicate_table THEN null; -- constraint already exists
    WHEN OTHERS THEN null;
END $$;


-- 2.4 JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "job_id" text NOT NULL REFERENCES "public"."jobs" ("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "public"."profiles" ("id") ON DELETE CASCADE,
    "resume_url" text NOT NULL,
    "cover_letter" text,
    "status" text DEFAULT 'new'::text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "job_applications_job_id_idx" ON "public"."job_applications" ("job_id");
CREATE INDEX IF NOT EXISTS "job_applications_user_id_idx" ON "public"."job_applications" ("user_id");
CREATE INDEX IF NOT EXISTS "job_applications_status_idx" ON "public"."job_applications" ("status");


-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Function to safely check admin status without RLS recursion
CREATE OR REPLACE FUNCTION public.check_is_admin_of_company(_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_id = _company_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_is_admin_of_company TO authenticated;


-- RPC Function for Atomic Registration
CREATE OR REPLACE FUNCTION public.register_new_company(
    p_name text,
    p_slug text,
    p_size text,
    p_website_url text DEFAULT null
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Insert Company
    INSERT INTO public.companies (name, slug, size, website_url)
    VALUES (p_name, p_slug, p_size, p_website_url)
    RETURNING id INTO v_company_id;

    -- 2. Insert Member (Owner)
    INSERT INTO public.company_members (company_id, user_id, role)
    VALUES (v_company_id, v_user_id, 'owner');

    RETURN v_company_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_new_company TO authenticated;


-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) - Fail-Safe
-- ============================================

ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."company_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;

-- 4.1 COMPANIES POLICIES
DROP POLICY IF EXISTS "Public can view companies" ON "public"."companies";
CREATE POLICY "Public can view companies" ON "public"."companies" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create companies" ON "public"."companies";
CREATE POLICY "Authenticated users can create companies" ON "public"."companies" FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Members can update their company" ON "public"."companies";
CREATE POLICY "Members can update their company" ON "public"."companies" FOR UPDATE TO authenticated USING (
    public.check_is_admin_of_company(id)
);

DROP POLICY IF EXISTS "Owners can delete their company" ON "public"."companies";
CREATE POLICY "Owners can delete their company" ON "public"."companies" FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM "public"."company_members"
        WHERE "company_members"."company_id" = "companies"."id"
        AND "company_members"."user_id" = auth.uid()
        AND "company_members"."role" = 'owner'
    )
);


-- 4.2 COMPANY MEMBERS POLICIES
DROP POLICY IF EXISTS "Users can view their own membership" ON "public"."company_members";
CREATE POLICY "Users can view their own membership" ON "public"."company_members" FOR SELECT TO authenticated USING (
    user_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins can manage members" ON "public"."company_members";
CREATE POLICY "Admins can manage members" ON "public"."company_members" FOR ALL TO authenticated USING (
    public.check_is_admin_of_company(company_id)
);


-- 4.3 JOBS POLICIES
DROP POLICY IF EXISTS "Public can view active jobs" ON "public"."jobs";
CREATE POLICY "Public can view active jobs" ON "public"."jobs" FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "System Admins can manage jobs" ON "public"."jobs";
CREATE POLICY "System Admins can manage jobs" ON "public"."jobs" FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Members can view their company jobs" ON "public"."jobs";
CREATE POLICY "Members can view their company jobs" ON "public"."jobs" FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM "public"."company_members"
        WHERE "company_members"."company_id" = "jobs"."company_id"
        AND "company_members"."user_id" = auth.uid()
        AND "company_members"."role" IN ('owner', 'admin', 'member')
    )
);

DROP POLICY IF EXISTS "Members can create jobs" ON "public"."jobs";
CREATE POLICY "Members can create jobs" ON "public"."jobs" FOR INSERT TO authenticated WITH CHECK (
    "company_id" IS NOT NULL AND public.check_is_admin_of_company(company_id)
);

DROP POLICY IF EXISTS "Members can update their company jobs" ON "public"."jobs";
CREATE POLICY "Members can update their company jobs" ON "public"."jobs" FOR UPDATE TO authenticated USING (
    "company_id" IS NOT NULL AND public.check_is_admin_of_company(company_id)
);


-- 4.4 JOB APPLICATIONS POLICIES
DROP POLICY IF EXISTS "Candidates can create applications" ON "public"."job_applications";
CREATE POLICY "Candidates can create applications" ON "public"."job_applications" FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Candidates can view own applications" ON "public"."job_applications";
CREATE POLICY "Candidates can view own applications" ON "public"."job_applications" FOR SELECT TO authenticated USING (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Company members can view applications" ON "public"."job_applications";
CREATE POLICY "Company members can view applications" ON "public"."job_applications" FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.jobs j
        JOIN public.company_members cm ON j.company_id = cm.company_id
        WHERE j.id = job_applications.job_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin', 'member')
    )
);

DROP POLICY IF EXISTS "Company members can update status" ON "public"."job_applications";
CREATE POLICY "Company members can update status" ON "public"."job_applications" FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.jobs j
        JOIN public.company_members cm ON j.company_id = cm.company_id
        WHERE j.id = job_applications.job_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin')
    )
);


-- ============================================
-- 5. STORAGE
-- ============================================

-- 5.1 Company Logos Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('company_logos', 'company_logos', true)
ON CONFLICT (id) DO NOTHING;



DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
CREATE POLICY "Public can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'company_logos');

DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company_logos');


-- 5.2 Resumes Bucket (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own resumes" ON storage.objects;
CREATE POLICY "Users can upload own resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can read own resumes" ON storage.objects;
CREATE POLICY "Users can read own resumes" ON storage.objects FOR SELECT TO authenticated USING (
    bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Company members can read applicant resumes" ON storage.objects;
CREATE POLICY "Company members can read applicant resumes" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    JOIN company_members cm ON cm.company_id = j.company_id
    WHERE cm.user_id = auth.uid() 
    AND cm.role IN ('owner', 'admin', 'member')
    AND ja.resume_url = name
  )
);
