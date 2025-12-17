# Story 1.4: Password Recovery

Status: complete

## Story

As a User,
I want to reset my password via email if I forget it,
So that I can regain access to my account.

## Acceptance Criteria

1. **Given** I am on the Login page
2. **When** I click "Forgot Password"
3. **Then** I should see a form to enter my email address
4. **When** I submit my email
5. **Then** I should receive a password reset link via email (Supabase Auth)
6. **When** I click the link
7. **Then** I should be taken to a page to enter a new password
8. **And** upon success, I should be able to login with the new password

## Technical Requirements

- **Module**: `src/features/auth`
- **Auth Provider**: Supabase Auth (`resetPasswordForEmail`).
- **Components**: `ForgotPasswordForm`, `UpdatePasswordForm`.
- **Routes**: `/auth/forgot-password`, `/auth/update-password` (or handle via query param on login).

## Architecture Compliance

- **File Structure**:
    - `src/features/auth/components/forgot-password-form.tsx`
    - `src/features/auth/components/update-password-form.tsx`
- **Type Safety**: Use generated Supabase types.

## Dev Notes

- **Supabase Template**: Ensure the "Reset Password" email template in Supabase Dashboard points to the correct redirect URL (e.g., `https://.../auth/callback?next=/auth/update-password`).

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
