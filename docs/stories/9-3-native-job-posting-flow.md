# STORY-9.3: Native Job Posting Flow

**As a** Hiring Manager
**I want to** post a new job opening
**So that** candidates can apply.

## Acceptance Criteria
- [ ] **Post Job Button**: Prominent in Company Dashboard.
- [ ] **Job Creation Wizard/Form**:
    - **Step 1: Basics** (Title, Type, Location, Remote boolean).
    - **Step 2: Details** (Salary Min/Max, Currency, Description).
    - **Step 3: Application** (Link to Apply OR Email).
- [ ] **Backend Logic**:
    - Insert into `jobs` table.
    - Set `company_id` to current user's company.
    - Set `job_type` = 'internal'.
    - `is_active` = true default.
- [ ] **Dashboard Listing**:
    - "Jobs" tab shows list of posted jobs.
    - Actions: Edit, Close (set is_active=false), Delete.
