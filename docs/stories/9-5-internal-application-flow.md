# Story 9.5: Internal Application Flow (ATS Lite)

**As a** Job Seeker & Hiring Manager
**I want to** apply directly on the platform and view applicants
**So that** the hiring process is streamlined within KrackedDevs.

## Context
Currently, jobs can only accept applications via external URL or email (mailto). We want to allow candidates to apply directly on the platform ("Internal" application method) and allow employers to review these applications in their dashboard.

## Acceptance Criteria
- [ ] **Database Schema**:
    - [ ] Create `job_applications` table.
        - `id` (uuid)
        - `jobId` (FK to jobs)
        - `userId` (FK to profiles - candidate)
        - `resumeUrl` (text)
        - `coverLetter` (text)
        - `status` (enum: 'new', 'reviewing', 'shortlisted', 'rejected', 'hired')
        - `createdAt` / `updatedAt`
    - [ ] Policies (RLS):
        - Candidates can create applications.
        - Candidates can view *their own* applications.
        - Employers (Company Members) can view applications for *their company's* jobs.
- [ ] **Candidate UI**:
    - [ ] "Apply Now" Button opens a modal for Internal jobs.
    - [ ] Modal contains:
        - Upload Resume (PDF only, max 5MB).
        - Cover Letter (Text area).
        - Submit button.
    - [ ] Success state: "Application Submitted".
    - [ ] Prevent duplicate applications for the same job.
- [ ] **Candidate Dashboard**:
    - [ ] Route: `/dashboard/applications`
    - [ ] Table of applied jobs with columns: Job Title, Company, Date Applied, Status.
- [ ] **Employer UI (Dashboard)**:
    - [ ] New Tab: "Applicants" (or "Applications").
    - [ ] List of applications grouped by Job or a flat list.
    - [ ] View Application Detail (Resume download, Cover letter).
    - [ ] Change Status (New -> Reviewing -> etc.).

## Technical Notes
- Use Supabase Storage for Resumes (Bucket: `resumes` private bucket).
- Reuse `FileUploader` component if possible, or adapt for PDF.
- Ensure RLS for Storage allows Company Members to download resumes.
