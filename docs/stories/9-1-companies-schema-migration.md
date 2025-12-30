# STORY-9.1: Companies Schema & Migration

**As a** Developer
**I want to** implement the database schema for Companies and relation to Jobs
**So that** we can support native company profiles and linked job postings.

## Acceptance Criteria
- [x] Create `companies` table:
    - `id` (uuid, primary key)
    - `name` (text, not null)
    - `slug` (text, unique, not null)
    - `logo_url` (text)
    - `website_url` (text)
    - `linkedin_url` (text)
    - `twitter_url` (text)
    - `description` (text)
    - `size` (text - e.g. "1-10", "11-50")
    - `industry` (text)
    - `location` (text)
    - `is_verified` (boolean, default false)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
- [x] Create `company_members` table:
    - `company_id` (uuid, fk companies)
    - `user_id` (uuid, fk profiles)
    - `role` (text - 'owner', 'admin', 'member')
    - Primary Key (company_id, user_id)
- [x] Update `jobs` table:
    - Add `company_id` (uuid, fk companies, nullable to support legacy scraped jobs)
    - Add `job_type` (text/enum - 'internal', 'external')
    - Add `application_url` (text)
    - Add `application_method` (text - 'url', 'email', 'internal_form')
- [x] RLS Policies:
    - Companies are viewable by public.
    - Company Members can update their own company.
    - Jobs linked to a company can only be updated by that company's members.
- [x] Migration script created and applied.
