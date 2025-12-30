# Story 10.2: Phase 2 - Light Mode & Component Refactoring

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 10
depends_on: 10-1-theme-infrastructure-provider

## Story

As a Developer,
I want to define the Light Mode theme and refactor all remaining components to use theme-aware variables,
So that the application supports a functional and readable Light Mode.

## Acceptance Criteria

1. **Given** the user switches to Light Mode
2. **Then** the background should be white/off-white and text dark
3. **And** all green accents should be adjusted for contrast against white
4. **Given** I visit the Dashboard, Admin Panel, and Bounties pages
5. **Then** all hardcoded colors (bg-black, bg-green) must be replaced with variables
6. **And** there should be no unreadable text (white text on white background)
7. **And** visual hierarchy is maintained in Light Mode

## Tasks/Subtasks

- [ ] Define Light Mode CSS variables in `globals.css` <!-- id: 1 -->
- [ ] Implement Theme Toggle UI (visible for testing) <!-- id: 2 -->
- [ ] Audit & Refactor: Dashboard Components (`src/features/dashboard/*`) <!-- id: 3 -->
- [ ] Audit & Refactor: Admin Components (`src/features/admin-dashboard/*`) <!-- id: 4 -->
- [ ] Audit & Refactor: Bounty Board (`src/features/bounty-board/*`) <!-- id: 5 -->
- [ ] Audit & Refactor: Profile Pages (`src/features/profiles/*`) <!-- id: 6 -->
- [ ] Audit & Refactor: Authentication Modals <!-- id: 7 -->
- [ ] Verify functionality and contrast in Light Mode <!-- id: 8 -->
- [ ] Fix any visual regressions in Dark Mode caused by refactoring <!-- id: 9 -->

## Refactoring Inventory (Light Mode Compatibility)

*Note: Page backgrounds should already be standardized to `bg-background` (Black) from Phase 1. This phase focuses on ensuring they look correct when `bg-background` switches to White.*

Verify and refactor foreground elements on:

- [ ] **Landing Page** (`/`): Hero, Stats, Job Preview
- [ ] **Authentication**: Login/Register Modals
- [ ] **Developer Dashboard** (`/dashboard`): Stats cards, Sidebar
- [ ] **Bounties** (`/code`): List view, Detail view, Submission form
- [ ] **Admin Panel** (`/admin`): Sidebar, Tables, Forms
- [ ] **Companies** (`/companies`): List view, Detail view
- [ ] **Jobs** (`/jobs`): Job board, Application modal
- [ ] **Profile** (`/profile/[username]`): Heatmap, Stats
- [ ] **Static Pages**: Privacy, Terms

## Technical Requirements

### Files Requiring Refactoring (50+ instances)

Based on codebase audit, these files contain hardcoded green colors:

**High Priority (Landing Page & Core)**:
- `src/features/landingpage/components/job-preview.tsx`
- `src/features/landingpage/components/navigation-hub.tsx`
- `src/features/landingpage/components/brand-cta.tsx`
- `src/features/landingpage/components/community-map.tsx`
- `src/components/ManifestoModal.tsx`
- `src/components/PageHero.tsx`

**Admin Dashboard**:
- `src/features/admin-dashboard/components/admin-sidebar.tsx`
- `src/features/admin-dashboard/layouts/admin-layout.tsx`
- `src/features/admin-dashboard/components/submission-review.tsx`
- `src/features/admin-dashboard/components/manual-completion-form.tsx`

**Bounty Board**:
- `src/features/bounty-board/components/bounty-card.tsx`
- `src/features/bounty-board/types.ts`
- `src/app/code/bounty/[slug]/BountyDetailClient.tsx`

**Other Components**:
- `src/lib/toast.ts`
- `src/components/game/MobileControls.tsx`
- `src/features/auth/components/auth-modal.tsx`

### Color Mapping Strategy

Create semantic color tokens that map to theme-aware CSS variables:

**File**: `src/lib/theme-colors.ts`

```typescript
/**
 * Semantic color mappings for theme-aware components
 * These map to CSS variables that change based on active theme
 */
export const themeColors = {
  // Primary accent (green in dark/light, white in B&W)
  accent: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    hover: "hover:bg-primary/20 hover:border-primary",
  },
  
  // Success states (green in dark/light, light gray in B&W)
  success: {
    bg: "bg-green-500/20 dark:bg-green-500/20 blackwhite:bg-white/20",
    border: "border-green-500/30 dark:border-green-500/30 blackwhite:border-white/30",
    text: "text-green-400 dark:text-green-400 blackwhite:text-white",
  },
  
  // Active/Selected states
  active: {
    bg: "bg-accent",
    text: "text-accent-foreground",
  },
  
  // Neon glow effects
  glow: {
    shadow: "shadow-[0_0_20px_var(--neon-primary)]",
    border: "border-[var(--neon-primary)]",
  },
} as const;
```

### Refactoring Pattern Examples

#### Before (Hardcoded):
```tsx
<div className="bg-green-500/20 text-green-400 border-green-500/30">
  Active
</div>
```

#### After (Theme-aware):
```tsx
<div className="bg-primary/20 text-primary border-primary/30">
  Active
</div>
```

#### Before (Complex):
```tsx
<Button className="bg-green-600 hover:bg-green-500 text-white">
  Submit
</Button>
```

#### After (Theme-aware):
```tsx
<Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
  Submit
</Button>
```

### Component-Specific Refactoring

#### Landing Page - Brand CTA

**File**: `src/features/landingpage/components/brand-cta.tsx`

```tsx
// Before
<span className="text-green-500 bg-green-500/10 px-2">TALENT?</span>

// After
<span className="text-primary bg-primary/10 px-2">TALENT?</span>
```

#### Admin Sidebar

**File**: `src/features/admin-dashboard/components/admin-sidebar.tsx`

```tsx
// Before
className="hover:bg-green-500/10 hover:text-green-400 hover:border-green-500"

// After
className="hover:bg-primary/10 hover:text-primary hover:border-primary"
```

#### Bounty Card

**File**: `src/features/bounty-board/components/bounty-card.tsx`

```tsx
// Before
className={`${isCompleted ? "bg-green-500 text-black" : "bg-yellow-500 text-black"}`}

// After
className={`${isCompleted ? "bg-primary text-primary-foreground" : "bg-yellow-500 text-black"}`}
```

### Toast Notifications

**File**: `src/lib/toast.ts`

```typescript
// Before
className: "bg-green-900/90 border-green-500/50 text-green-100"

// After
className: "bg-primary/20 border-primary/50 text-primary-foreground"
```

### Globals.css Updates

Add utility classes for common patterns:

```css
/* Theme-aware utilities */
.neon-border {
  border: 1px solid var(--neon-primary);
  box-shadow: 0 0 10px var(--neon-primary);
}

.neon-glow {
  box-shadow: 0 0 20px var(--neon-primary);
}

.neon-text {
  color: var(--neon-primary);
  text-shadow: 0 0 8px var(--neon-primary);
}

/* Black & White mode specific adjustments */
.blackwhite .neon-border {
  border-color: var(--foreground);
  box-shadow: 0 0 10px var(--foreground);
}

.blackwhite .neon-glow {
  box-shadow: 0 0 20px var(--foreground);
}
```

## Architecture Compliance

- **Consistency**: All color references use CSS variables or Tailwind theme tokens
- **Maintainability**: Single source of truth for theme colors
- **Performance**: No runtime color calculations
- **Accessibility**: Contrast ratios verified for all themes

## Testing Strategy

### Visual Testing Checklist

For each theme (Dark, Light, Black & White), verify:

**Landing Page**:
- [ ] Hero section maintains visual hierarchy
- [ ] Navigation cards are clearly distinguishable
- [ ] Brand CTA stands out appropriately
- [ ] Job preview cards are readable
- [ ] Community map markers are visible

**Admin Dashboard**:
- [ ] Sidebar navigation is clear
- [ ] Active states are obvious
- [ ] Form inputs are readable
- [ ] Action buttons are distinguishable

**Bounty Board**:
- [ ] Bounty cards maintain hierarchy
- [ ] Status badges are clear
- [ ] Difficulty levels are distinguishable
- [ ] Submission states are obvious

**Profile Pages**:
- [ ] Stats cards are readable
- [ ] GitHub contribution graph adapts
- [ ] Badges and achievements are visible

### Automated Testing

```typescript
// Test: All hardcoded green classes removed
describe('Theme Color Refactoring', () => {
  it('should not contain hardcoded bg-green classes', () => {
    const components = getAllComponentFiles();
    components.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/bg-green-\d{3}/);
      expect(content).not.toMatch(/text-green-\d{3}/);
      expect(content).not.toMatch(/border-green-\d{3}/);
    });
  });
});
```

### Contrast Ratio Verification

Use browser DevTools or automated tools to verify WCAG AA compliance:

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Performance Considerations

- CSS variable updates are instant (no re-render)
- No JavaScript color calculations
- Tailwind purges unused color classes
- Minimal bundle size impact

## Migration Strategy

1. **Phase 1**: Refactor landing page (highest visibility)
2. **Phase 2**: Refactor admin dashboard
3. **Phase 3**: Refactor bounty board
4. **Phase 4**: Refactor remaining components
5. **Phase 5**: Final visual QA across all themes

## Dev Notes

- Use find/replace carefully - some green colors may be intentional (e.g., success states)
- Test each component individually before moving to next
- Keep screenshots of before/after for comparison
- Consider creating a visual regression test suite
- Document any intentional color deviations

## Edge Cases

- **Gradient backgrounds**: May need theme-specific gradients
- **Image overlays**: Ensure readability in all themes
- **Third-party components**: May need custom theme overrides
- **SVG icons**: May need fill/stroke color updates

## References

- [Tailwind CSS Theming](https://tailwindcss.com/docs/theme)
- [CSS Variables Best Practices](https://web.dev/css-variables/)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- Epic 10: Multi-Theme System
- Story 10.1: Theme Infrastructure & Provider Setup
