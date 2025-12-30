# STORY-9.5: Public Company Profile

**As a** Job Seeker
**I want to** view a specific company's profile page
**So that** I can see all their open roles and learn about their culture.

## Acceptance Criteria
- [ ] **Route**: `/companies/[slug]`.
- [ ] **Header**: Large Logo, Banner (optional), Name, Links, "Verified" badge.
- [ ] **Content**:
    - "About Us" text.
    - "Size", "Location", "Industry" tags.
- [ ] **Jobs List**:
    - Automatically list all `is_active=true` jobs linked to this `company_id`.
- [ ] **SEO**:
    - Dynamic Title/Meta tags based on Company Name.
