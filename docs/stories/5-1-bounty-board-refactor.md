# Story 5.1: Bounty Board Refactor

Status: ready-for-dev

## Story

As a Developer,
I want to refactor the current Bounty Board page to follow Feature-Sliced Design,
So that it aligns with the project architecture patterns and improves maintainability.

## Acceptance Criteria

1. **Given** the existing `src/app/code/bounty` page and `src/lib/bounty` module
2. **When** I refactor to Feature-Sliced Design
3. **Then** the logic should move from `src/lib/bounty` to `src/features/bounty-board`
4. **And** inline components (BountyCard, filters) should be extracted to `src/features/bounty-board/components/`
5. **And** the UI should display the list of active bounties (FR8)
6. **And** clicking a bounty should show details (FR10), forcing login if guest (FR9)
7. **And** guest users who log in should be redirected back to the bounty they were viewing (via `?redirect=` query param)
8. **And** the UI polish should include:
    - Cleaner card design with improved spacing/typography
    - Empty state with "No bounties found" message and filter reset option
    - Rarity visual distinction (Normal vs Rare bounties)

## Technical Requirements

- **Module**: `src/features/bounty-board`
- **Components**: Extract `BountyCard`, `BountyFilters`, `BountyStats` from inline code
- **Filtering**: Filter by Difficulty and Status (already exists), add Tag/Stack filter
- **Data Migration**: Move types and data utilities from `src/lib/bounty/` to feature module

## Architecture Compliance

- **File Structure (List Page)**:
    - `src/features/bounty-board/components/bounty-card.tsx`
    - `src/features/bounty-board/components/bounty-filters.tsx`
    - `src/features/bounty-board/components/bounty-list.tsx`
    - `src/features/bounty-board/components/bounty-stats-bar.tsx`
- **File Structure (Detail Page)**:
    - `src/features/bounty-board/components/bounty-detail.tsx`
    - `src/features/bounty-board/components/submission-card.tsx`
    - `src/features/bounty-board/components/winner-display.tsx`
- **Shared Files**:
    - `src/features/bounty-board/types.ts`
    - `src/features/bounty-board/actions.ts`
    - `src/features/bounty-board/index.ts`
- **Server Actions**: `fetchActiveBounties(filters)`, `fetchBountyBySlug(slug)`
- **Barrel Files**: Ensure `index.ts` exports only public components
- **Type Safety**: Migrate types from `src/lib/bounty/types.ts` to feature module
- **Cleanup**: Deprecate `src/lib/bounty/` after migration; rename `@/styles/jobs.css` → `@/styles/bounty.css`

## Dev Notes

- **Current State**:
    - List page (`/code/bounty/page.tsx`): ~500 lines with inline components
    - Detail page (`/code/bounty/[slug]/page.tsx`): ~795 lines with inline components
    - Data imported from `@/lib/bounty` (currently static mock data with Supabase fallback)
- **List Page Refactoring**:
    - Extract inline `BountyCard` component (~100 lines)
    - Move filter logic to dedicated `BountyFilters` component
    - Extract stats bar to `BountyStatsBar` component
- **Detail Page Refactoring**:
    - Extract `BountyDetail` layout wrapper
    - Extract `SubmissionCard` for displaying past submissions
    - Extract `WinnerDisplay` for completed bounty trophy section
- **Design Consistency**:
    - Ensure consistency with Shadcn card patterns
    - Clear distinction between "Tags" (tech stack) and "Metadata" (difficulty, status, deadline)

## Testing Requirements

- Unit tests for extracted components (`BountyCard`, `BountyFilters`, `BountyStatsBar`)
- Integration test for `fetchActiveBounties` server action
- Verify hybrid data source (static + Supabase fallback) works after migration
- Test empty state renders correctly when no bounties match filters

## Execution Dependency

> **Note:** Stories 5.2 and 5.3 depend on this story completing first, as they use the extracted components and actions.

### References

- [FR8: Active Bounty List](docs/prd.md#functional-requirements)

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)
