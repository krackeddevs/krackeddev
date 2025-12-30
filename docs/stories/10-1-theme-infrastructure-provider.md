# Story 10.1: Phase 1 - Infrastructure & Dark Mode Baseline

Status: ready-for-dev
priority: must-have
assignee: antique_gravity
epic: 10

## Story

As a Developer,
I want to establish the basic theme infrastructure and ensure the current Dark Mode is preserved using CSS variables,
So that we have a stable baseline before introducing new themes.

## Acceptance Criteria

1. **Given** the `next-themes` provider is installed
2. **When** the application loads
3. **Then** the default theme should be "dark"
4. **And** the background color must be **Pure Black (#000000)** (Standardized from Landing Page)
5. **And** the global background grid must match the **Neon Green Grid** from the Landing Page
6. **Given** global CSS variables are defined for Dark Mode
7. **When** I inspect the root element
8. **Then** I should see the variable definitions mapped to the current hardcoded values
9. **And** the `krackeddev-theme` localStorage key is created

## Tasks/Subtasks

- [ ] Install `next-themes` package & Create `ThemeProvider` <!-- id: 1 -->
- [ ] Integrate ThemeProvider into `layout.tsx` <!-- id: 2 -->
- [ ] **Standardization**: Define `bg-black` and Neon Grid in `globals.css` as default Dark Mode <!-- id: 3 -->
- [ ] Refactor `Navbar.tsx` to use new variables (Proof of Concept) <!-- id: 4 -->
- [ ] Refactor `PageHero.tsx` to use new variables (Proof of Concept) <!-- id: 5 -->
- [ ] Verify Landing Page looks exactly the same as before (No visual regressions) <!-- id: 6 -->
- [ ] Commit baseline infrastructure <!-- id: 7 -->

## Refactoring Inventory (Standardization Checklist)

The following pages currently use `bg-gray-900` or other variants and **MUST** be standardized to `bg-black` (Default Dark Mode) in this story:

- [ ] **Bounty Board** (`src/app/code/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Bounty Details** (`src/app/code/bounty/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Members Page** (`src/app/members/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Public Profile** (`src/app/profile/[username]/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Leaderboard** (`src/app/leaderboard/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Internship** (`src/app/internship/page.tsx`) - Convert `bg-gray-900` to `bg-background`
- [ ] **Auth Components** (`LoginModal`, `ForgotPassword`) - Convert `bg-[#0a0f0a]` to `bg-card` or `bg-background`

*Note: Dashboard, Companies, Jobs, and Post Bounty already align with `bg-black` and will just need variable verification.*

## Technical Requirements

### Package Installation

```bash
npm install next-themes
```

### ThemeProvider Component

**File**: `src/components/providers/theme-provider.tsx`

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Root Layout Integration

**File**: `src/app/layout.tsx`

Update the layout to include ThemeProvider:

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-mono antialiased flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "light", "blackwhite"]}
          storageKey="krackeddev-theme"
        >
          <ParallaxProvider>
            <SupabaseProvider>
              {/* ... rest of providers */}
            </SupabaseProvider>
          </ParallaxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### CSS Variables for All Themes

**File**: `src/app/globals.css`

Add new theme definitions:

```css
/* Light Mode - Already partially defined in :root */
:root {
  /* Keep existing light mode variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... existing variables */
}

/* Dark Mode - Current default */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  
  /* Neon colors for dark mode */
  --neon-primary: #15803d;
  --neon-secondary: #15803d;
  --neon-accent: #15803d;
  --neon-cyan: #15803d;
  --scanline-color: rgba(21, 128, 61, 0.05);
}

/* Black & White Mode - New */
.blackwhite {
  --background: oklch(0 0 0); /* Pure black */
  --foreground: oklch(1 0 0); /* Pure white */
  --card: oklch(0.1 0 0); /* Very dark gray */
  --card-foreground: oklch(1 0 0);
  --popover: oklch(0.1 0 0);
  --popover-foreground: oklch(1 0 0);
  --primary: oklch(1 0 0); /* White */
  --primary-foreground: oklch(0 0 0); /* Black */
  --secondary: oklch(0.15 0 0); /* Dark gray */
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.2 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --accent: oklch(0.15 0 0);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.5 0 0); /* Mid gray for destructive */
  --border: oklch(0.3 0 0);
  --input: oklch(0.2 0 0);
  --ring: oklch(0.5 0 0);
  
  /* Grayscale "neon" effects */
  --neon-primary: #ffffff;
  --neon-secondary: #cccccc;
  --neon-accent: #aaaaaa;
  --neon-cyan: #888888;
  --scanline-color: rgba(255, 255, 255, 0.03);
}
```

### Theme Toggle Component

**File**: `src/components/theme-toggle.tsx`

```tsx
"use client";

import * as React from "react";
import { Moon, Sun, Contrast } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border border-neon-primary/30 hover:border-neon-primary hover:bg-neon-primary/10"
        >
          {theme === "dark" && <Moon className="h-5 w-5" />}
          {theme === "light" && <Sun className="h-5 w-5" />}
          {theme === "blackwhite" && <Contrast className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-mono">
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blackwhite")}>
          <Contrast className="mr-2 h-4 w-4" />
          <span>Black & White</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Architecture Compliance

- **Component Structure**: Feature-sliced design with providers in `src/components/providers/`
- **State Management**: Uses `next-themes` for theme state with localStorage persistence
- **Styling**: CSS variables approach for maximum flexibility
- **Naming Convention**: kebab-case for all files
- **SSR Compatibility**: `suppressHydrationWarning` prevents hydration mismatches

## Testing Strategy

### Manual Testing Checklist

- [ ] Theme toggle appears in navbar
- [ ] Clicking toggle shows all three theme options
- [ ] Selecting "Dark" applies dark theme immediately
- [ ] Selecting "Light" applies light theme immediately
- [ ] Selecting "Black & White" applies grayscale theme immediately
- [ ] Refresh page - theme persists
- [ ] Clear localStorage - defaults to dark theme
- [ ] Check localStorage key `krackeddev-theme` stores correct value

### Browser DevTools Testing

```javascript
// Test localStorage persistence
localStorage.getItem('krackeddev-theme') // Should return: "dark", "light", or "blackwhite"

// Test theme class on html element
document.documentElement.classList // Should contain theme class
```

### Visual Regression Testing

- Compare screenshots of key pages in all three themes
- Verify contrast ratios meet WCAG AA standards
- Ensure all interactive elements are visible in each theme

## Performance Considerations

- `next-themes` adds minimal bundle size (~2KB gzipped)
- Theme switching is instant (CSS variable updates)
- No flash of unstyled content (FOUC) with `suppressHydrationWarning`
- localStorage read happens once on mount

## Dev Notes

- The `suppressHydrationWarning` on `<html>` is required to prevent hydration errors
- Theme provider must wrap all other providers to ensure theme is available everywhere
- CSS variables cascade automatically - no need to update every component
- Future: Consider adding theme-specific animations or transitions

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [OKLCH Color Space](https://oklch.com/)
- Epic 10: Multi-Theme System
