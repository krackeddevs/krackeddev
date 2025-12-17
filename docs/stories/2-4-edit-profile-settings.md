# Story 2.4: Edit Profile Settings

Status: done

## Story

As a User,
I want to edit my profile details (Role, Stack, Location),
So that I can keep my information up to date.

## Acceptance Criteria

1. **Given** I am logged in
2. **When** I view my profile or settings
3. **Then** I should see an "Edit Profile" button
4. **When** I click it, a form should appear (modal or page) pre-filled with my current data
5. **Then** updates to Role, Stack, or Location should be saved to the database
6. **And** the UI should reflect the changes immediately

## Technical Requirements

- **Module**: `src/features/profiles` (or `settings`).
- **Components**: `EditProfileForm` (Resuse `OnboardingForm` logic/components if possible).
- **Database**: Update `public.profiles` table.

## Architecture Compliance

- **File Structure**:
    - `src/features/profiles/components/edit-profile-modal.tsx`
- **Server Actions**: `updateProfile(data)`.
- **Validation**: Re-use Zod schema from Onboarding.

## Dev Notes

- **Reuse**: This is essentially the same form as Onboarding (Story 1.3), just with pre-filled values. Refactor the form validation schema to be shared in `src/features/shared/schemas` or `src/features/profiles/schemas.ts`.

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
