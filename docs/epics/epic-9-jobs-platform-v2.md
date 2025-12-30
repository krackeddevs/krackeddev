# EPIC-9: Jobs Platform V2

**Goal:** Upgrade the Jobs functionality from a simple scraped-only list to a full-featured Platform-Native Job Board where companies can be created, managed, and can post their own jobs.

- **Scope:** Companies Schema, Company Dashboard, Job Creation/Management, Public Company Profiles, New Jobs Listing UI.
- **Value:** Enables B2B revenue (companies paying for posts), improves data structure, and allows for "Verify Owner" workflows.
- **Complexity:** High (New Entity "Company", Role-based access for Companies, multi-step forms).

## User Stories Breakdown

### STORY-9.1: Companies Schema & Migration

**As a** Developer
**I want to** implement the database schema for Companies and relation to Jobs
**So that** we can support native company profiles and linked job postings.

**Acceptance Criteria:**
- [x] Create `companies` table (id, name, logo, website, description, size, industry, location).
- [x] Create `company_members` table (user_id, company_id, role) OR simple `owner_id` on companies (Decision: Owner ID for MVP, Members table for V2. Let's go with **Members Table** to future proof, or at least a distinct relationship). *Let's stick to simple `owner_id` on `companies` for speed if MVP, but the user mentioned specific roles. Let's do `company_members` to be safe.*
- [x] Update `jobs` table:
    - [x] Add `company_id` (FK to companies).
    - [x] Add `job_type` enum ('internal', 'external/scraped').
    - [x] Add `application_method` (url vs internal).
- [x] Run migration.
- [x] Seed dummy companies for testing.

### STORY-9.2: Company Registration & Dashboard

**As a** Hiring Manager
**I want to** register my company and access a dashboard
**So that** I can manage my company profile and job listings.

**Acceptance Criteria:**
- [x] Route `/hire/register`: Form to create a new Company.
- [x] Auto-assign creator as "Owner".
- [x] Route `/dashboard/company`: Dashboard for company owners.
- [x] "Edit Company Profile" tab (Upload logo, edit description, social links).
- [x] "My Listings" tab (Table of active/inactive jobs).

### STORY-9.3: Native Job Posting Flow

**As a** Hiring Manager
**I want to** post a new job opening
**So that** candidates can apply.

**Acceptance Criteria:**
- [x] "Post a Job" button in Company Dashboard.
- [x] Job Form:
    - [x] Title, Location, Remote/Hybrid, Type (Full-time, Contract).
    - [x] Description (Rich Text or Markdown).
    - [x] Salary Range.
    - [x] Application Link (or Email).
- [x] Validation: All required fields.
- [x] Creating the job links it to the `company_id`.
- [x] Job appears immediately in "My Listings".

### STORY-9.4: Public Jobs Page Redesign

**As a** Job Seeker
**I want to** browse jobs with the new high-fidelity design
**So that** I can easily find relevant positions and view company details.

**Acceptance Criteria:**
- [x] Implement new `/jobs` UI per Figma (Grid/List toggle, filters on left/top).
- [x] "Company Card" design for jobs linked to internal companies (showing verified logo).
- [x] Fallback design for "External/Scraped" jobs.
- [x] Filter by: Remote, Salary, Contract Type.
- [x] Search by Title/Company.

### STORY-9.5: Internal Application Flow (ATS Lite)

**As a** Job Seeker & Hiring Manager
**I want to** apply directly on the platform and view applicants
**So that** the hiring process is streamlined within KrackedDevs.

**Acceptance Criteria:**
- [ ] Database: `job_applications` table (resume, cover letter, status).
- [ ] UI: "Apply Now" modal for Internal jobs.
- [ ] Dashboard: "Applicants" tab in Company Dashboard.
- [ ] Status Management: Accept/Reject applicants.

### STORY-9.6: Public Company Profile

**As a** Job Seeker
**I want to** view a specific company's profile page
**So that** I can see all their open roles and learn about their culture.

**Acceptance Criteria:**
- [ ] Route `/companies/[slug]` or `/companies/[id]`.
- [ ] Display Company Header (Logo, Name, Website, Socials).
- [ ] "About" section.
- [ ] List of "Active Jobs" by this company.

### STORY-9.7: Company Verification Flow

**As a** Hiring Manager
**I want to** request verification for my company
**So that** I can display a verified badge and build trust with job seekers.

**Acceptance Criteria:**
- [ ] Database: `company_verification_requests` table with business docs, email verification, and admin review fields.
- [ ] UI: Multi-step verification request wizard in Company Dashboard.
- [ ] Email Verification: Domain-matched email with 6-digit code.
- [ ] Admin Panel: Review interface to approve/reject requests.
- [ ] Notifications: Email alerts on status changes.
- [ ] Verified Badge: Display on company profile and job listings after approval.

