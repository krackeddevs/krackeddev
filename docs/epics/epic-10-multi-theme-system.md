# Epic 10: Multi-Theme System

**Status**: Backlog  
**Priority**: High  
**Complexity**: Medium-High  
**Estimated Effort**: 12-16 hours

## Overview

Implement a comprehensive theming system that supports three distinct visual modes: Dark (current default), Light, and Black & White. This epic addresses stakeholder requirements for improved accessibility and user choice while maintaining the cyberpunk aesthetic of the platform.

## Business Value

- **Accessibility**: Provides options for users with different visual preferences and needs
- **User Experience**: Allows users to choose themes based on environment (bright office vs. dark room)
- **Professional Appeal**: Light mode may appeal to corporate users during business hours
- **Inclusivity**: Black & White mode serves users with color vision deficiencies
- **Brand Differentiation**: Demonstrates attention to user needs and modern UX standards

## Technical Approach & Phased Rollout

We will implement this system in **3 Strict Phases** to ensure stability.

### Phase 1: Infrastructure & Dark Mode Baseline
**Goal:** Install theming engine and refactor hardcoded colors to CSS variables without changing the visual appearance (Dark Mode remains default).
- Install `next-themes` & create `ThemeProvider`.
- Define CSS variable structure in `globals.css` (Dark Mode default).
- Refactor core structure (`layout.tsx`, `Navbar.tsx`) to use variables.
- **Verification:** Ensure site looks identical to current production.

### Phase 2: Light Mode Implementation
**Goal:** Define the "Light" variable set and refactor all remaining components to ensure readability.
- Define `.light` class variables (White background, Dark text, Emerald primary).
- Iterate through all pages (Landing, Dashboard, Admin, Bounties) to replace hardcoded colors.
- Verify Light Mode readability and contrast.

### Phase 3: Black & White Mode (Accessibility)
**Goal:** High contrast, strict grayscale.
- Define `.blackwhite` class variables.
- Add theme toggle visibility.
- Polish animations and assets for grayscale.

## Stories Breakdown

### Story 10.1: Phase 1 - Infrastructure & Dark Mode Baseline
**Status**: Ready for Dev
**Deliverables**:
- Infrastructure setup (`next-themes`, `ThemeProvider`).
- CSS Variables definition (Dark Mode = Default).
- Core component refactoring (Landing Page, Navbar).
- Verification that "Dark Mode" matches current production.

### Story 10.2: Phase 2 - Light Mode & Component Refactoring
**Status**: Backlog (Depends on 10.1)
**Deliverables**:
- Light Mode CSS variables definition.
- Full component audit & refactor (Dashboard, Admin, Bounties).
- Light Mode verification across all pages.

### Story 10.3: Phase 3 - Black & White Mode & Polish
**Status**: Backlog (Depends on 10.2)
**Deliverables**:
- Black & White CSS variables (High Contrast).
- Theme Toggle UI implementation.
- Theme-specific asset polish (Grayscale images).
- Final Accessibility Audit (WCAG AA).

## Theme Specifications

### Dark Mode (Current Default)
- Background: `oklch(0.145 0 0)` - Very dark gray
- Foreground: `oklch(0.985 0 0)` - Off-white
- Primary: Green neon (`#15803d`)
- Aesthetic: Cyberpunk, Matrix-inspired

### Light Mode
- Background: `oklch(1 0 0)` - Pure white
- Foreground: `oklch(0.145 0 0)` - Very dark gray
- Primary: Dark green (`#15803d`)
- Aesthetic: Clean, professional, bright

### Black & White Mode
- Background: `oklch(0 0 0)` - Pure black
- Foreground: `oklch(1 0 0)` - Pure white
- Primary: White (`#ffffff`)
- Aesthetic: High contrast, minimalist, accessible

## Accessibility Compliance

All themes will meet **WCAG 2.1 Level AA** standards:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum
- **Focus indicators**: Visible in all themes
- **Color independence**: Information not conveyed by color alone

## Testing Strategy

### Manual Testing
- [ ] Visual inspection of all pages in each theme
- [ ] Theme toggle functionality
- [ ] localStorage persistence
- [ ] No hydration errors
- [ ] Mobile responsiveness

### Automated Testing
- [ ] Contrast ratio verification (axe DevTools)
- [ ] Visual regression tests (screenshots)
- [ ] Component unit tests for theme awareness
- [ ] E2E tests for theme switching

### User Testing
- [ ] Gather feedback from 5-10 users per theme
- [ ] Test with users who have color vision deficiencies
- [ ] Verify comfort for extended viewing sessions

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Visual regressions during refactoring | High | Medium | Incremental refactoring, screenshot comparison |
| Performance impact from CSS transitions | Low | Low | Use GPU-accelerated properties only |
| Hardcoded colors missed in audit | Medium | Medium | Automated grep search, thorough code review |
| Theme not persisting correctly | Medium | Low | Comprehensive localStorage testing |
| Accessibility failures | High | Low | Use automated tools, manual verification |

## Success Metrics

- ✅ All 50+ files refactored without visual regressions
- ✅ Theme switching < 100ms perceived latency
- ✅ 100% WCAG AA compliance across all themes
- ✅ Zero hydration errors or console warnings
- ✅ Positive user feedback (>80% satisfaction)
- ✅ Theme preference persists across sessions

## Future Enhancements (Out of Scope)

- Custom theme builder for power users
- System theme auto-detection
- Theme-specific sound effects
- Animated theme transitions (fade/slide)
- Per-page theme overrides
- Scheduled theme switching (day/night)

## Dependencies

### External
- `next-themes@^0.2.1` (to be installed)

### Internal
- No breaking changes to existing components
- Compatible with current Tailwind CSS v4 setup
- Works with existing CSS variable system

## Timeline

**Estimated Duration**: 2-3 days (full-time)

- **Day 1 Morning**: Story 10.1 - Infrastructure setup
- **Day 1 Afternoon**: Story 10.2 - Start refactoring (Landing page)
- **Day 2 Full Day**: Story 10.2 - Continue refactoring (Admin, Bounty, Profiles)
- **Day 3 Morning**: Story 10.2 - Complete refactoring, testing
- **Day 3 Afternoon**: Story 10.3 - Optimizations and polish

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS Theming](https://tailwindcss.com/docs/theme)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Related Documentation

- `docs/stories/10-1-theme-infrastructure-provider.md`
- `docs/stories/10-2-refactor-hardcoded-colors.md`
- `docs/stories/10-3-theme-optimizations-polish.md`
- `docs/epics.md` (Epic 10 section)
- `docs/sprint-status.yaml` (Epic 10 tracking)
