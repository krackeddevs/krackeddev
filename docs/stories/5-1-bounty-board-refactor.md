# Story 5.1: Bounty Board Refactor

Status: ready-for-dev

## Story

As a Developer,
I want to refactor the current "Jobs" page into a "Bounty Board" feature,
So that it aligns with the domain language and new architecture.

## Acceptance Criteria

1. **Given** the existing `src/app/jobs` page
2. **When** I refactor it
3. **Then** the logic should move to `src/features/bounty-board`
4. **And** the UI should display the list of active bounties (FR8)
5. **And** clicking a bounty should show details (FR10) forcing login if guest (FR9)
6. **And** the UI must be updated to be cleaner/more organized with improved card design (Grid/List toggle optional)
7. **And** the term "Job" in the UI can remain if preferred, but backend/code should use "Bounty"

## Technical Requirements

- **Module**: `src/features/bounty-board`
- **Components**: `BountyList`, `BountyCard`, `BountyDetail`.
- **Filtering**: Filter by Tag/Stack.

## Architecture Compliance

- **File Structure**:
    - `src/features/bounty-board/components/board.tsx`
    - `src/features/bounty-board/page.tsx`
- **Server Actions**: `fetchActiveBounties(filters)`.
- **Barrel Files**: Ensure `index.ts` exists in `src/features/bounty-board` and exports public components.
- **Type Safety**: Use generated Supabase types from `src/types/supabase.ts`.

## Dev Notes

- **Refactoring**: Existing `src/app/jobs` is a starting point, but needs visual polish. Focus on:
    - Consistency with Shadcn cards.
    - Better spacing/typography (cleaner layout).
    - Clear distinction between "Tags" and "Metadata".

### References

- [FR8: Active Bounty List](docs/prd.md#functional-requirements)

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
