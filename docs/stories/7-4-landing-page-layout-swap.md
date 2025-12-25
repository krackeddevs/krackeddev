# Story 7.4: Landing Page Layout Swap

Status: done

## Story

As a User,
I want to see the Community Map prominently above the game area,
So that I can immediately see the community presence.

## Acceptance Criteria

1. **Given** a user views the landing page
2. **When** the parallax intro completes
3. **Then** the Community Map section should appear FIRST (top of main content) ✅
4. **And** the Townhall Game should appear BELOW the Community Map ✅
5. **And** all other sections maintain their relative order ✅
6. **And** scroll indicator functionality remains intact ✅
7. **And** mobile layout is consistent with desktop (same order) ✅
8. **And** no visual regressions on other sections ✅

## Tasks/Subtasks

- [x] Reorder sections in `src/features/landingpage/page.tsx` <!-- id: 1 -->
- [x] Adjust section heights for new layout <!-- id: 2 -->
- [x] Move scroll indicator to appropriate section <!-- id: 3 -->
- [x] Test scroll behavior <!-- id: 4 -->
- [x] Visual QA on desktop and mobile <!-- id: 5 -->
- [x] Take before/after screenshots for documentation <!-- id: 6 -->

## Technical Requirements

### Current Layout Order

1. ParallaxIntro
2. **Hero Section with TownhallV2 Game** (90vh)
3. **CommunityMap**
4. LiveStats
5. NavigationHub
6. JobPreview
7. BrandCTA

### New Layout Order

1. ParallaxIntro
2. **CommunityMap** (moved up) ✅
3. **TownhallV2 Game** (moved down, adjusted height to 70vh) ✅
4. LiveStats
5. NavigationHub
6. JobPreview
7. BrandCTA

### Code Changes

```diff
// src/features/landingpage/page.tsx

- {/* Hero Section with Game */}
- <section className="relative w-full h-[90vh] min-h-[600px]">
-     <TownhallV2 />
-     {/* Scroll Indicator */}
-     <div className="absolute bottom-4 ...">...</div>
- </section>
-
- {/* Community Map Section */}
- <section className="relative w-full bg-black border-t border-green-900/50">
-     <CommunityMap />
- </section>

+ {/* Community Map Section - Primary Visual (moved up per Story 7.4) */}
+ <section className="relative w-full bg-black">
+     <CommunityMap />
+     {/* Scroll Indicator moved here */}
+     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30">
+         <span className="text-green-400/70 text-xs font-mono mb-1">Scroll for more</span>
+         <ChevronDown className="w-6 h-6 text-green-400/70" />
+     </div>
+ </section>
+
+ {/* Game Section (moved below map per Story 7.4) */}
+ <section className="relative w-full h-[70vh] min-h-[500px] bg-black border-t border-green-900/50">
+     <TownhallV2 />
+ </section>
```

### Height Adjustments

| Section | Before | After |
|:--------|:-------|:------|
| TownhallV2 | `h-[90vh] min-h-[600px]` | `h-[70vh] min-h-[500px]` ✅ |
| CommunityMap | Auto | Auto (unchanged) |

## Architecture Compliance

- **File Modified**: `src/features/landingpage/page.tsx` ✅
- **No Logic Changes**: Pure layout reordering ✅
- **CSS Only**: No JavaScript logic changes required ✅

## Dev Notes

- This is a quick win, low complexity change
- Consider A/B testing feedback if stakeholders want to revert
- Take screenshots before implementing for comparison

### Verification Checklist

- [x] Community Map appears first after parallax
- [x] Game is visible below map
- [x] Scroll indicator works correctly
- [x] No horizontal overflow issues
- [x] Mobile viewport looks correct
- [x] Game controls remain functional
- [x] All navigation links still work

### References

- [src/features/landingpage/page.tsx](file:///Users/fadlikhalid/Documents/Work/krackeddev/repo/krackeddev/src/features/landingpage/page.tsx)
- [Story 2.1: Landing Page Refactor](docs/stories/2-1-landing-page-refactor.md)

## Dev Agent Record

### Agent Model Used
Antigravity

### Implementation Summary
- Swapped section order: Community Map now renders before TownhallV2 Game
- Moved scroll indicator from game section to map section
- Reduced game section height from 90vh to 70vh for better balance
- Build verified: ✅ Success

### Files Changed
- `src/features/landingpage/page.tsx`
