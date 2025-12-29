-- ============================================
-- COMPANIES & JOBS SCHEMA MIGRATION (Consolidated & Idempotent)
-- Epic 9: Jobs Platform V2
-- Story 9.1 & 9.2
-- Includes fixes for RLS recursion and race conditions via RPC
-- ============================================

-- 1. Create companies table (if not exists)
create table if not exists "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "logo_url" text,
    "website_url" text,
    "linkedin_url" text,
    "twitter_url" text,
    "description" text,
    "size" text,
    "industry" text,
    "location" text,
    "is_verified" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    constraint "companies_pkey" primary key ("id"),
    constraint "companies_slug_key" unique ("slug")
);

-- 2. Create company_members table (if not exists)
create table if not exists "public"."company_members" (
    "company_id" uuid not null,
    "user_id" uuid not null,
    "role" text not null check (role in ('owner', 'admin', 'member')),
    "created_at" timestamp with time zone default now(),
    constraint "company_members_pkey" primary key ("company_id", "user_id"),
    constraint "company_members_company_id_fkey" foreign key ("company_id") references "public"."companies" ("id") on delete cascade,
    constraint "company_members_user_id_fkey" foreign key ("user_id") references "public"."profiles" ("id") on delete cascade
);

-- 3. Update jobs table (safely add columns)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'company_id') then
        alter table "public"."jobs" add column "company_id" uuid references "public"."companies" ("id") on delete set null;
        create index "jobs_company_id_idx" on "public"."jobs" ("company_id");
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'job_type') then
        alter table "public"."jobs" add column "job_type" text check (job_type in ('internal', 'external')) default 'external';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'application_url') then
        alter table "public"."jobs" add column "application_url" text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'application_method') then
        alter table "public"."jobs" add column "application_method" text check (application_method in ('url', 'email', 'internal_form')) default 'url';
    end if;
end $$;

-- 4. Enable RLS (idempotent, harmless to run multiple times)
alter table "public"."companies" enable row level security;
alter table "public"."company_members" enable row level security;

-- 5. RLS Policies

-- Helper macro to safely drop policies before creating them to avoid "policy already exists" errors
-- We will just use DROP IF EXISTS for clarity

-- Companies Policies

drop policy if exists "Public can view companies" on "public"."companies";
create policy "Public can view companies" on "public"."companies" for select using (true);

drop policy if exists "Authenticated users can create companies" on "public"."companies";
create policy "Authenticated users can create companies" on "public"."companies" for insert to authenticated with check (true);

drop policy if exists "Members can update their company" on "public"."companies";
create policy "Members can update their company" on "public"."companies" for update to authenticated using (
    exists (
        select 1 from "public"."company_members"
        where "company_members"."company_id" = "companies"."id"
        and "company_members"."user_id" = auth.uid()
        and "company_members"."role" in ('owner', 'admin')
    )
);

drop policy if exists "Owners can delete their company" on "public"."companies";
create policy "Owners can delete their company" on "public"."companies" for delete to authenticated using (
    exists (
        select 1 from "public"."company_members"
        where "company_members"."company_id" = "companies"."id"
        and "company_members"."user_id" = auth.uid()
        and "company_members"."role" = 'owner'
    )
);

-- Company Members Policies

-- Drop the old problematic recursive policy if it exists
drop policy if exists "Members can view their company members" on "public"."company_members";

-- 5.1 Simple View Policy (Non-recursive)
drop policy if exists "Users can view their own membership" on "public"."company_members";
create policy "Users can view their own membership" on "public"."company_members" for select to authenticated using (
    user_id = auth.uid()
);

-- Admins/Owners can manage members
drop policy if exists "Admins can manage members" on "public"."company_members";
create policy "Admins can manage members" on "public"."company_members" for all to authenticated using (
    exists (
        select 1 from "public"."company_members" cm
        where cm."company_id" = "company_members"."company_id"
        and cm."user_id" = auth.uid()
        and cm."role" in ('owner', 'admin')
    )
);

-- Jobs Policies

drop policy if exists "Members can create jobs" on "public"."jobs";
create policy "Members can create jobs" on "public"."jobs" for insert to authenticated with check (
    "company_id" is not null and exists (
        select 1 from "public"."company_members"
        where "company_members"."company_id" = "jobs"."company_id"
        and "company_members"."user_id" = auth.uid()
        and "company_members"."role" in ('owner', 'admin')
    )
);

drop policy if exists "Members can update their company jobs" on "public"."jobs";
create policy "Members can update their company jobs" on "public"."jobs" for update to authenticated using (
    "company_id" is not null and exists (
        select 1 from "public"."company_members"
        where "company_members"."company_id" = "jobs"."company_id"
        and "company_members"."user_id" = auth.uid()
        and "company_members"."role" in ('owner', 'admin')
    )
);

-- Grant permissions (safe to re-run)
grant select, insert, update, delete on "public"."companies" to "authenticated";
grant select, insert, update, delete on "public"."company_members" to "authenticated";
grant select, insert, update, delete on "public"."jobs" to "authenticated";


-- 6. RPC Function for Atomic Registration (Story 9.2 Fix)
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
