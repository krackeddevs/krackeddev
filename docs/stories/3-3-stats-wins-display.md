# Story 3.3: Stats & Wins Display

Status: review

## Story

As a User,
I want to see my "Wins" and "Earnings" on my profile details page,
So that I can demonstrate my track record on the platform.

## Acceptance Criteria

1. **Given** a user has verified bounty wins
2. **When** any user views their **Profile Details** (`/profile/view`)
3. **Then** the "Wins" and "Earnings" counters should reflect the database values (FR5)
4. **And** this data should be displayed in the **Profile Details** view (NOT the Game Scene)
5. **And** these stats should be calculated from `bounty_submissions` (approved)

## Tasks/Subtasks

- [x] Define `BountyStats` type in `src/features/profiles/types.ts` <!-- id: 1 -->
- [x] Implement `fetchBountyStats` in `src/features/profiles/actions.ts` <!-- id: 2 -->
- [x] Create `BountyStats` component in `src/features/profiles/components/bounty-stats.tsx` <!-- id: 3 -->
- [x] Integrate `BountyStats` into `ProfileDetails` in `src/features/profiles/components/profile-details.tsx` <!-- id: 4 -->

## Technical Requirements

- **Module**: `src/features/profiles`
- **Location**: Display within `src/features/profiles/components/profile-details.tsx`
- **Database**: Aggregate query on `bounty_submissions` where `status = 'approved'`.
- **Components**: 
    - `src/features/profiles/components/bounty-stats.tsx`: Displays Wins and Earnings with Cyberpunk styling.

## Architecture Compliance

- **Server Actions**: `fetchBountyStats(userId)` in `src/features/profiles/actions.ts`
- **Separation**: These are React UI components for the Data View. Do not mix with Three.js/Canvas logic.
- **RLS**: Public read access allowed for these stats.
- **Type Safety**: Use generated Supabase types.

## Dev Notes

- **Refactor Update**: Aligned with Story 3.1 & 3.2. This data belongs on the `/profile/view` dashboard.
- **Visuals**: "Earnings" should be formatted as currency (e.g., RM 5,000).

### References

- [FR5: Developer Stats](docs/prd.md#functional-requirements)
- [Story 3.1: Profile Feature Refactor](docs/stories/3-1-profile-feature-refactor.md)

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
