# STORY-9.4: Public Jobs Page Redesign

**As a** Job Seeker
**I want to** browse jobs with the new high-fidelity design
**So that** I can easily find relevant positions and view company details.

## Acceptance Criteria
- [ ] **UI Implementation**: match Figma design (https://www.figma.com/design/JHLYWcDHOzfY5Ji1mVeMtB/Kracked-Devs?node-id=10-11228).
    - Modern Card Layout.
    - Sidebar Filters (Remote, Tech Stack, Salary).
- [ ] **Data Integration**:
    - Fetch jobs from `jobs` table (both internal and external).
    - For Internal jobs: Show Company Logo and Name from `companies` relation.
    - For External jobs: Show `company` text and `company_logo` text/url as fallback.
- [ ] **Interactivity**:
    - Clicking a job opens details (modal or dedicated page - TBD, stick to current pattern).
    - "Verified" badge for Internal Companies.
