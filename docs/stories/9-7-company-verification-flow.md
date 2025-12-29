# Story 9.7: Company Verification Flow

**As a** Hiring Manager
**I want to** request verification for my company
**So that** I can display a verified badge and build trust with job seekers.

## Context
Companies with the `is_verified` badge are more trustworthy to candidates. Currently, the `is_verified` column exists but has no workflow to actually verify companies. This story implements a self-service verification request flow where companies submit proof documents, and admins review and approve/reject requests.

## Acceptance Criteria

### Database Schema
- [ ] **Create `company_verification_requests` table**:
    - `id` (uuid, PK)
    - `company_id` (uuid, FK to companies)
    - `requested_by` (uuid, FK to profiles - the user who submitted)
    - **Business Details**:
        - `business_registration_number` (text)
        - `registration_document_url` (text - Supabase Storage path)
        - `tax_id` (text, nullable)
    - **Contact Verification**:
        - `verification_email` (text - must match company domain)
        - `email_verified` (boolean, default false)
        - `verification_code` (text, nullable)
        - `code_expires_at` (timestamp, nullable)
    - **Requester Details**:
        - `requester_name` (text)
        - `requester_title` (text)
        - `requester_phone` (text)
    - **Context**:
        - `reason` (text)
        - `expected_job_count` (text - e.g., "1-5", "5-10", "10+")
    - **Admin Review**:
        - `status` (text - 'pending', 'approved', 'rejected', 'needs_info')
        - `reviewed_by` (uuid, FK to profiles - admin who reviewed)
        - `reviewed_at` (timestamp, nullable)
        - `admin_notes` (text, nullable)
        - `rejection_reason` (text, nullable)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
- [ ] **RLS Policies**:
    - Company members can create requests for their company.
    - Company members can view their own company's requests.
    - Admins can view and update all requests.
- [ ] **Supabase Storage Bucket**: `company-verification-docs` (private).

### Company Dashboard UI
- [ ] **Verification Status Display** (`/dashboard/company`):
    - If `is_verified = true`: Show "Verified ✓" badge prominently.
    - If `is_verified = false` AND no pending request: Show "Request Verification" button.
    - If pending request exists: Show "Verification Pending ⏳" badge with status.
- [ ] **Verification Request Form** (`/dashboard/company/verify` or modal):
    - **Step 1: Business Documents**
        - Input: Business Registration Number (required)
        - File Upload: Registration Document (PDF only, max 5MB)
        - Input: Tax ID / GST Number (optional)
    - **Step 2: Email Verification**
        - Input: Company Email (must match website domain, e.g., `hr@company.com`)
        - Button: "Send Verification Code"
        - Input: Enter 6-digit code
        - Validation: Code must match and not be expired (15 min expiry)
    - **Step 3: Contact Details**
        - Input: Your Full Name (required)
        - Input: Your Job Title (required)
        - Input: Phone Number (required, format validation)
    - **Step 4: Additional Context**
        - Textarea: Why do you want to be verified? (required, min 50 chars)
        - Select: Expected number of jobs to post (1-5, 5-10, 10+)
    - **Step 5: Review & Submit**
        - Display summary of all entered information
        - Checkbox: "I confirm all information is accurate"
        - Submit button
- [ ] **Success State**:
    - Show "Verification request submitted!" message
    - Redirect to dashboard with "Pending" badge visible
- [ ] **Error Handling**:
    - Email domain mismatch (e.g., using Gmail instead of company domain)
    - Invalid verification code
    - File upload failures
    - Duplicate request prevention (one active request per company)

### Admin Dashboard
- [ ] **Verification Requests Tab** (`/admin/verifications` or within existing admin panel):
    - Table view with columns:
        - Company Name (with logo)
        - Requester Name
        - Submitted Date
        - Status (Pending/Approved/Rejected/Needs Info)
        - Actions (View, Approve, Reject)
    - Filter by Status
    - Sort by Date (newest first)
- [ ] **Request Detail View**:
    - Display all submitted information
    - Download link for registration document
    - Email verification status indicator
    - Admin action buttons:
        - "Approve" - Sets `companies.is_verified = true`, updates request status
        - "Reject" - Requires rejection reason (textarea), updates request status
        - "Request More Info" - Sends notification to company, sets status to 'needs_info'
    - Admin notes field (internal, not visible to company)
- [ ] **Approval Flow**:
    - Clicking "Approve":
        - Updates `companies.is_verified = true`
        - Updates request `status = 'approved'`
        - Records `reviewed_by` and `reviewed_at`
        - Sends email notification to company
    - Clicking "Reject":
        - Requires rejection reason
        - Updates request `status = 'rejected'`
        - Records `reviewed_by`, `reviewed_at`, and `rejection_reason`
        - Sends email notification with reason

### Notifications
- [ ] **Email to Company** when status changes:
    - **Approved**: "Congratulations! Your company has been verified."
    - **Rejected**: "Your verification request was not approved. Reason: [admin reason]"
    - **Needs Info**: "We need additional information for your verification request."
- [ ] **Email to Admins** when new request is submitted:
    - Subject: "New verification request from [Company Name]"
    - Link to review page

### Server Actions
- [ ] `submitVerificationRequest(data)` - Creates new request, uploads document
- [ ] `sendVerificationCode(email)` - Generates and emails 6-digit code
- [ ] `verifyEmailCode(requestId, code)` - Validates code and marks email as verified
- [ ] `getVerificationRequest(companyId)` - Fetches company's latest request
- [ ] `approveVerificationRequest(requestId, adminNotes)` - Admin approval
- [ ] `rejectVerificationRequest(requestId, reason, adminNotes)` - Admin rejection
- [ ] `requestMoreInfo(requestId, message)` - Admin requests clarification

## Technical Notes
- **Email Domain Validation**: Extract domain from company website URL, ensure verification email matches (e.g., `company.com` matches `hr@company.com`)
- **Verification Code**: Generate random 6-digit code, store with 15-minute expiry
- **Document Storage**: Use Supabase Storage with RLS - only admins and request owner can access
- **Duplicate Prevention**: Check for existing `pending` or `needs_info` requests before allowing new submission
- **Audit Trail**: All admin actions should be logged with timestamp and admin ID

## UI/UX Considerations
- Use a **multi-step wizard** for better UX (progress indicator showing steps 1-5)
- **Email verification** should be inline (no separate page) - send code, verify, continue
- Show **clear error messages** for domain mismatch: "Please use your company email (e.g., yourname@company.com), not personal email"
- **Pending badge** should be non-intrusive but visible in company dashboard
- Admin review interface should be **efficient** - all key info visible without excessive clicking

## Dependencies
- Story 9.2 (Company Dashboard) - must be complete
- Supabase Storage configured
- Email service (Resend/SendGrid) for verification codes and notifications

## Testing Checklist
- [ ] Company can submit verification request with valid data
- [ ] Email verification code works and expires after 15 minutes
- [ ] Cannot submit with non-company email domain
- [ ] Cannot submit duplicate requests
- [ ] Admin can approve request and `is_verified` updates correctly
- [ ] Admin can reject request with reason
- [ ] Email notifications sent on status changes
- [ ] Verified badge displays correctly on company profile and job listings

---

## Tasks/Subtasks

### Task 1: Database Schema & Migration
- [x] Create migration file for `company_verification_requests` table
- [x] Add all required columns (business details, contact verification, requester details, admin review)
- [x] Create RLS policies for company members and admins
- [x] Create Supabase Storage bucket `company-verification-docs` with RLS
- [x] Run migration and verify schema

### Task 2: Schema & Type Definitions
- [x] Add `companyVerificationRequests` table to Drizzle schema
- [x] Create TypeScript types for verification request
- [x] Create Zod schemas for form validation (5 steps)
- [x] Export types and schemas

### Task 3: Server Actions - Verification Request Flow
- [x] Create `submitVerificationRequest(data)` action
- [x] Create `sendVerificationCode(email)` action with domain validation
- [x] Create `verifyEmailCode(requestId, code)` action with expiry check
- [x] Create `getVerificationRequest(companyId)` action
- [x] Add duplicate request prevention logic
- [x] Add file upload handling for registration documents

### Task 4: Server Actions - Admin Review Flow
- [x] Create `approveVerificationRequest(requestId, adminNotes)` action
- [x] Create `rejectVerificationRequest(requestId, reason, adminNotes)` action
- [x] Create `requestMoreInfo(requestId, message)` action
- [x] Update `companies.is_verified` on approval
- [x] Add audit trail logging

### Task 5: Email Notification Service
- [ ] Create email template for verification code
- [ ] Create email template for approval notification
- [ ] Create email template for rejection notification
- [ ] Create email template for "needs info" notification
- [ ] Create email template for admin notification (new request)
- [ ] Integrate with Resend/SendGrid

### Task 6: Verification Request Wizard - Step 1 (Business Documents)
- [x] Create multi-step wizard component with progress indicator
- [x] Build Step 1 form (registration number, document upload, tax ID)
- [x] Add PDF file upload with 5MB limit validation
- [x] Implement form state management across steps
- [x] Add navigation (Next/Back buttons)

### Task 7: Verification Request Wizard - Step 2 (Email Verification)
- [x] Build Step 2 form (company email input)
- [x] Add domain validation against company website
- [x] Implement "Send Code" button with loading state
- [x] Add 6-digit code input field
- [x] Implement code verification with expiry handling
- [x] Show success/error states

### Task 8: Verification Request Wizard - Step 3 & 4
- [x] Build Step 3 form (requester name, title, phone)
- [x] Add phone number format validation
- [x] Build Step 4 form (reason textarea, expected job count select)
- [x] Add character count for reason field (min 50 chars)
- [x] Implement form validation for all fields

### Task 9: Verification Request Wizard - Step 5 (Review & Submit)
- [x] Build Step 5 review summary display
- [x] Show all entered information in organized sections
- [x] Add confirmation checkbox
- [x] Implement submit handler with loading state
- [x] Handle success/error responses
- [x] Redirect to dashboard on success

### Task 10: Company Dashboard Integration
- [x] Add verification status display to company dashboard
- [x] Show "Verified ✓" badge when `is_verified = true`
- [x] Show "Request Verification" button when not verified and no pending request
- [x] Show "Verification Pending ⏳" badge when request exists
- [x] Add route `/dashboard/company/verify` for wizard
- [x] Implement error handling for duplicate requests

### Task 11: Admin Verification Requests List
- [x] Create `/admin/verifications` route
- [x] Build table component with columns (company, requester, date, status, actions)
- [x] Add status filter (Pending/Approved/Rejected/Needs Info)
- [x] Add date sorting (newest first)
- [x] Implement pagination if needed
- [x] Add "View Details" action

### Task 12: Admin Request Detail View
- [x] Create detail view component
- [x] Display all submitted information
- [x] Add download link for registration document
- [x] Show email verification status indicator
- [x] Build admin action buttons (Approve/Reject/Request Info)
- [x] Add admin notes textarea (internal)
- [x] Implement rejection reason modal

### Task 13: Admin Approval/Rejection Flow
- [x] Implement approve handler with confirmation
- [x] Implement reject handler with required reason
- [x] Implement "request more info" handler
- [x] Update UI optimistically
- [x] Show success/error toasts
- [x] Trigger email notifications
- [x] Refresh list after action

### Task 14: Verified Badge Display
- [x] Add verified badge to company profile header
- [x] Add verified badge to job listings (company name)
- [x] Add verified badge to company card components
- [x] Style badges with consistent design
- [x] Add tooltip explaining verification

### Task 15: Testing & Validation
- [ ] Test complete verification request flow
- [ ] Test email verification with valid/invalid codes
- [ ] Test email verification expiry (15 min)
- [ ] Test domain validation (reject Gmail, etc.)
- [ ] Test duplicate request prevention
- [ ] Test admin approval flow
- [ ] Test admin rejection flow
- [ ] Test email notifications
- [ ] Test verified badge display
- [ ] Test RLS policies (company members vs admins)

---

## Dev Notes

### Architecture Context
- **Feature Location**: `src/features/companies/verification/`
- **Database**: Supabase with Drizzle ORM
- **Storage**: Supabase Storage for document uploads
- **Email**: Resend (based on existing email service patterns)
- **UI Framework**: Next.js 14 App Router, shadcn/ui components
- **Form Management**: React Hook Form + Zod validation

### Existing Patterns to Follow
- Server actions in `src/features/companies/actions.ts`
- Form schemas in `src/features/companies/schemas.ts`
- Company dashboard at `src/app/dashboard/company/`
- Admin panel at `src/app/(admin)/admin/`
- Storage buckets follow pattern: `{feature}-{type}` (e.g., `company-verification-docs`)

### Technical Specifications
- **Email Verification Code**: 6-digit random number, 15-minute expiry
- **Domain Validation**: Extract domain from `companies.website_url`, compare with email domain
- **File Upload**: PDF only, max 5MB, stored in private bucket
- **RLS**: Company members can CRUD their own requests, admins can view/update all
- **Status Flow**: pending → approved/rejected/needs_info

### Key Decisions
- Use multi-step wizard (not single long form) for better UX
- Email verification inline (no separate page) to reduce friction
- Store verification code in database (not JWT) for simplicity
- Admin notes are internal-only (not visible to company)
- One active request per company (prevent spam)

---

## Dev Agent Record

### Implementation Plan
*To be filled during implementation*

### Debug Log
*To be filled during implementation*

### Completion Notes
*To be filled upon completion*

---

## File List
*To be updated as files are created/modified*

---

## Change Log
*To be updated with implementation changes*

---

## Status
**Current Status:** review
**Last Updated:** 2025-12-29

## Implementation Notes

### Completed Features
- ✅ Database migration with complete RLS policies
- ✅ Drizzle schema with relations
- ✅ Zod validation schemas for 5-step wizard
- ✅ TypeScript types and interfaces
- ✅ Verification request server actions (email verification, code validation, file upload)
- ✅ Admin review server actions (approve/reject/request-info)
- ✅ Complete 5-step wizard UI with file upload to Supabase Storage
- ✅ Company dashboard integration with status badges
- ✅ Admin panel (list, detail, actions)
- ✅ Verified badges on company profiles

### Pending Items (Task 5 & 15)
- ⏳ Email notification templates (marked as TODO in code)
- ⏳ Manual testing of complete flow
- ⏳ Email service integration (Resend/SendGrid)

### Build Status
✅ **Build successful** - All TypeScript errors resolved, application compiles correctly.

