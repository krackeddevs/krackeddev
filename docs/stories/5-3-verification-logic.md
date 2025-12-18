# Story 5.3: Verification Logic

Status: review

## Story

As an Admin,
I want to approve or reject submissions,
So that I can verify the quality of work.

## Acceptance Criteria

1. **Given** I am viewing a submission
2. **When** I click "Approve" or "Reject"
3. **Then** I must provide a comment
4. **And** the submission status should create (update to 'approved'/'rejected') (FR15)
5. **And** if approved, I should be able to mark it as "Paid" with a transaction reference (FR16)

## Technical Requirements

- **Server Action Location**: `src/features/bounty-board/actions.ts` — verification is bounty domain logic, called from admin dashboard UI
- **UI Location**: Admin Dashboard at `src/features/admin-dashboard/components/`
- **Table**: `bounty_submissions` (update status, add comment, add payment_ref)
- **Logic**: Transaction Reference is manual input string (no payment gateway integration for MVP)

## Architecture Compliance

- **Server Actions**: 
    - `reviewSubmission(submissionId, status, comment)` — for approve/reject
    - `markSubmissionPaid(submissionId, transactionRef)` — for payment tracking
- **Components**: Build in `src/features/admin-dashboard/components/submission-review.tsx`
- **Barrel Files**: Ensure `index.ts` exists in `src/features/admin-dashboard` and exports public components
- **Type Safety**: Use generated Supabase types from `src/types/supabase.ts`

## Dev Notes

- **Payouts**: Manual process for Phase 1. Just store the ref number; no payment gateway integration
- **Email Notifications**: Out of scope for MVP. Future enhancement: notify developer on approval/rejection
- **Audit Trail**: Record who reviewed and when (use `reviewed_by`, `reviewed_at` columns)

## Testing Requirements

- Unit test for `reviewSubmission` server action (approve/reject flows)
- Unit test for `markSubmissionPaid` server action
- Test that comment is required for both approve and reject
- Test transaction reference is required when marking as paid

## Execution Dependency

> **Requires:** Stories 5.1 and 5.2 must be completed first — this story uses the `bounty_submissions` table structure and shared types from the bounty-board feature.

### References

- [FR15: Verification](docs/prd.md#functional-requirements)
- [FR16: Mark as Paid](docs/prd.md#functional-requirements)

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
