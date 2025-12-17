# Story 2.2: Live Stats & CTA Integration

Status: done

## Story

As a Visitor,
I want to see live stats and clear Call-to-Actions for Brands,
So that I understand the platform's activity and know how to hire talent.

## Acceptance Criteria

1. **Given** I am on the landing page
2. **When** I scroll past the game hero
3. **Then** I should see a "Live Stats" section (FR-LAND-02)
4. **And** I should see a "Brand CTA" section inviting companies to post bounties (FR-LAND-04)
5. **And** these components must match the existing dark/CRT theme

## Technical Requirements

- **Module**: `src/features/landingpage`
- **Components**: `LiveStats`, `BrandCTA`.
- **Data Source**: Stats should be fetched via Server Action (can be cached/mocked initially if DB is empty).
- **Styling**: Tailwind CSS + matching "CRT" scanline aesthetic.

## Architecture Compliance

- **File Structure**:
    - `src/features/landingpage/components/live-stats.tsx`
    - `src/features/landingpage/components/brand-cta.tsx`
    - `src/features/landingpage/actions/get-landing-stats.ts`
- **Naming**: `kebab-case` filenames.
- **Barrel Files**: Ensure `index.ts` exists in `src/features/landingpage` and exports public components.

## Dev Notes

- **Stats to Display**: "Payout Volume", "Active Bounties", "Hunters".
- **Mocking**: Checked `bounties` table (missing), so mocked active bounties. Used `profiles` count for hunters.
- **Theme**: Reused `scanlines` and neon effects.

### References

- [FR-LAND-02: Live Stats](docs/prd.md#functional-requirements)
- [FR-LAND-04: Brand CTA](docs/prd.md#functional-requirements)

## Dev Agent Record

### Agent Model Used

Antigravity (System Generated)

### Completion Notes
- **Components**: Created `LiveStats` (client-side animation) and `BrandCTA` (static with hover effects).
- **Backend**: Implemented `getLandingStats` server action.
    - Used `profiles` count for "Active Agents".
    - Used `bounty_submissions` status='paid' sum for "Payout Volume".
    - Mocked "Live Missions" to 14 (table missing).
- **Post Bounty Page**: Created a dedicated `src/app/post-bounty/page.tsx` with a CRT-styled lead capture form.
- **Integration**: Added sections to `LandingPage` and linked CTA to `/post-bounty`.
- **Verification**: `npm run build` passed.

### File List
- `src/features/landingpage/components/live-stats.tsx`
- `src/features/landingpage/components/brand-cta.tsx`
- `src/features/landingpage/actions/get-landing-stats.ts`
- `src/features/landingpage/page.tsx`
- `src/app/post-bounty/page.tsx`
- `docs/design/story-2-2-ux-spec.md`
