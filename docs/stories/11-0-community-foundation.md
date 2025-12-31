# Story 11.0: Community Platform Foundation

**As a** Developer
**I want to** establish the foundational layout and theme structure for the Community Platform
**So that** all subsequent features (Chat, Q&A) have a consistent look and feel that matches the existing application.

## Context
The Community Platform requires a cohesive interface that integrates seamlessly with the rest of KrackedDev. This story focuses on setting up the shared layout, navigation, and ensuring strict adherence to the existing Light, Dark, and Monochrome themes.

## Acceptance Criteria

### Layout & Navigation
- [x] **Community Layout**: Create `src/app/community/layout.tsx`.
    - Must wrap all community routes.
    - Must include the standard application Navbar and Footer.
    - Must provide a container for the "Townhall Chat" overlay (Story 11.1).
- [x] **Unified Community Hub**:
    - **Navigation Update**: Repoint the main "Community" button (Navbar/FloatingNav) from `/members` to `/community`.
    - **CommunitySubNav**: Implement a tabbed navigation bar available on all `/community/*` routes.
        - **Townhall**: Links to `/community` (Home/Feed).
        - **Q&A**: Links to `/community/questions`.
        - **Members**: Links to `/members` (Integration of existing route).
        - **Leaderboard**: Links to `/leaderboard` (Integration of existing route).
    - **Redirect**: Ensure `/community` renders the Townhall/Feed by default.
    - **UI Standardization**: The layout layout MUST follow the established pattern used in `/companies`, `/bounties`, and `/jobs` (Standard PageHeader, Breadcrumbs, Container spacing).

### Theme Standardization
- [x] **Theme Support**:
    - Ensure all new components support `light`, `dark`, and `monochrome` themes.
    - Use existing CSS variables/Tailwind utility classes for colors (e.g., `bg-background`, `text-foreground`).
    - **Monochrome Specifics**: strict grayscale, high contrast borders.
- [x] **UI Components**:
    - Standardize specific "Community" UI elements (Buttons, Cards, Inputs) to match the core design system.

### Responsive Design
- [x] **Mobile Layout**:
    - Ensure the layout is fully responsive.
    - Floating elements (like Chat) must have mobile-specific behavior (e.g., full screen vs overlay).

---

## Tasks/Subtasks

### Task 1: Route & Layout Setup
- [x] Create `/community` route group.
- [x] Implement `layout.tsx` with standard Navbar/Footer integration.
- [x] Add "Community" to the main navigation menu `src/config/navigation.ts` (or equivalent).

### Task 2: Sub-Navigation Component
- [x] Build `CommunitySubNav` component.
- [x] Implement active state logic (highlight current tab).
- [x] Ensure responsive design (scrollable horizontal list on mobile).

### Task 3: Theme Validation
- [x] Create a "Theme Test Page" (temporary) in `/community/test-theme`.
- [x] Verify buttons, cards, and text against all 3 themes.
- [x] Fix any discrepancies in `globals.css` if community-specific variables are needed.

## Testing & Definition of Done
- [x] **Unit Tests**: N/A (Layout Check).
- [x] **Integration Tests**: Verify Navigation links work.
- [x] **Visual Tests**: Check against Light, Dark, Monochrome themes.
- [x] **Accessibility**: Ensure tabs are keyboard navigable.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `community_nav_click`: Label which tab was clicked (Townhall/Q&A/Members).
    - `community_visit`: Page view on `/community` root.

---

## Technical Notes
- **Theme Provider**: Use `src/components/providers/theme-provider.tsx`. Do NOT introduce a new provider.
- **CSS Variables**: Rely on `globals.css`. Do not hardcode hex values.
- **Structure**: Put shared components in `src/features/community/components/shared`.
