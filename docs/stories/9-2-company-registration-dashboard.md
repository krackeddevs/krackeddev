# STORY-9.2: Company Registration & Dashboard

**As a** Hiring Manager
**I want to** register my company and access a dashboard
**So that** I can manage my company profile and job listings.

## Acceptance Criteria
- [x] **Registration Page** (`/hire/register`):
    - Form to enter Company Name, Website, Size.
    - Creates a new `company` record.
    - Adds current user as 'owner' in `company_members`.
    - Redirects to Dashboard.
- [x] **Company Dashboard** (`/dashboard/company`):
    - Layout with sidebar/tabs: "Overview", "Edit Profile", "Jobs", "Settings".
- [x] **Edit Profile Tab**:
    - Upload Logo (Supabase Storage bucket `company-logos`).
    - Edit Name, Description, Links.
    - Save changes updates DB.
- [x] **Navigation**:
    - Add "Hiring?" link in main nav or user dropdown for easy access.
