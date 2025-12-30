# Implementation Plan - Company Registration & Dashboard (Story 9.2)

## Goal
Enable users to register a company and access a dedicated dashboard for managing their company profile and jobs.

## User Review Required
> [!IMPORTANT]
> This requires creating a new bucket `company-logos` in Supabase Storage if it doesn't exist.
> I will assume I can create the UI and logic, but the actual bucket creation might need manual intervention or a seed script if I cannot run admin commands.

## Proposed Changes

### Feature: Companies (`src/features/companies`)
#### [NEW] Server Actions (`actions.ts`)
- `registerCompany(data: CompanyRegistrationInput)`
    - Creates company, adds user as owner.
- `updateCompany(id: string, data: CompanyUpdateInput)`
    - Updates company details.
- `getCompanyByUserId(userId: string)`
    - Fetches the company where user is an owner/admin.

#### [NEW] Components
- `RegistrationForm` (`components/registration-form.tsx`)
    - Fields: Name, Website, Size (Select).
    - Zod schema validation.
- `CompanyDashboardLayout` (`components/dashboard/layout.tsx`)
    - Sidebar navigation (Overview, Edit Profile, Jobs).
- `EditCompanyForm` (`components/dashboard/edit-profile-form.tsx`)
    - Logo upload (using existing upload component or new one).
    - Fields: Name, Description, Website, Socials.

### Pages (`src/app`)
#### [NEW] Registration Page (`src/app/hire/register/page.tsx`)
- Protected route (middleware check or inline auth check).
- Renders `RegistrationForm`.

#### [NEW] Dashboard Pages (`src/app/dashboard/company/...`)
- `layout.tsx`: Wraps with `CompanyDashboardLayout`.
- `page.tsx`: "Overview" - stats or welcome message.
- `profile/page.tsx`: Renders `EditCompanyForm`.
- `jobs/page.tsx`: Placeholder for now (Story 9.3).

### Global Changes
#### [MODIFY] Navigation (`src/components/navbar.tsx`)
- Add "Hiring?" link (visible to authenticated users? or everyone).
    - If user has a company -> Dashboard.
    - If not -> Registration.

## Verification Plan

### Automated Tests
- Test `registerCompany` action (mock DB).
- Test form validation logic.

### Manual Verification
1.  Go to `/hire/register`.
2.  Register "Acme Corp".
3.  Verify redirection to `/dashboard/company`.
4.  Go to Edit Profile, upload logo, change name.
5.  Save and refresh.
