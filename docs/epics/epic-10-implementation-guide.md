# Epic 10: Multi-Theme System - Quick Start Guide

## Overview

This guide will help you implement the Multi-Theme System (Dark, Light, Black & White modes) for the Kracked Devs platform.

## Prerequisites

- Node.js and npm installed
- Project running locally
- Familiarity with Next.js and Tailwind CSS

## Implementation Steps

### Phase 1: Infrastructure Setup (Story 10.1) - 3-4 hours

#### Step 1: Install Dependencies

```bash
cd /Users/fadlikhalid/Documents/Work/krackeddev/repo/krackeddev
npm install next-themes
```

#### Step 2: Create Theme Provider

Create `src/components/providers/theme-provider.tsx`:

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### Step 3: Update Root Layout

Modify `src/app/layout.tsx`:

```tsx
// Add import
import { ThemeProvider } from "@/components/providers/theme-provider";

// Update return statement
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
        {/* Rest of your providers */}
      </ThemeProvider>
    </body>
  </html>
);
```

#### Step 4: Add CSS Variables

Add to `src/app/globals.css` (after existing .dark class):

```css
/* Black & White Mode */
.blackwhite {
  --background: oklch(0 0 0);
  --foreground: oklch(1 0 0);
  --card: oklch(0.1 0 0);
  --card-foreground: oklch(1 0 0);
  --popover: oklch(0.1 0 0);
  --popover-foreground: oklch(1 0 0);
  --primary: oklch(1 0 0);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.15 0 0);
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.2 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --accent: oklch(0.15 0 0);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.5 0 0);
  --border: oklch(0.3 0 0);
  --input: oklch(0.2 0 0);
  --ring: oklch(0.5 0 0);
  
  --neon-primary: #ffffff;
  --neon-secondary: #cccccc;
  --neon-accent: #aaaaaa;
  --neon-cyan: #888888;
  --scanline-color: rgba(255, 255, 255, 0.03);
}
```

#### Step 5: Create Theme Toggle Component

Create `src/components/theme-toggle.tsx`:

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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

#### Step 6: Add Theme Toggle to Navbar

Update `src/components/Navbar.tsx` to include the ThemeToggle component:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

// Add in your navbar JSX, near other action buttons
<ThemeToggle />
```

#### Step 7: Test Phase 1

```bash
npm run dev
```

**Verify**:
- [ ] Theme toggle appears in navbar
- [ ] Can switch between Dark, Light, and Black & White
- [ ] Theme persists on page refresh
- [ ] No console errors or hydration warnings

---

### Phase 2: Refactor Hardcoded Colors (Story 10.2) - 6-8 hours

#### Step 1: Find All Hardcoded Colors

```bash
# Search for hardcoded green classes
grep -r "bg-green-" src/ --include="*.tsx" --include="*.ts"
grep -r "text-green-" src/ --include="*.tsx" --include="*.ts"
grep -r "border-green-" src/ --include="*.tsx" --include="*.ts"
```

#### Step 2: Refactoring Pattern

**Before**:
```tsx
<div className="bg-green-500/20 text-green-400 border-green-500/30">
  Active
</div>
```

**After**:
```tsx
<div className="bg-primary/20 text-primary border-primary/30">
  Active
</div>
```

#### Step 3: Priority Order

1. **Landing Page** (highest visibility)
   - `src/features/landingpage/components/job-preview.tsx`
   - `src/features/landingpage/components/navigation-hub.tsx`
   - `src/features/landingpage/components/brand-cta.tsx`

2. **Admin Dashboard**
   - `src/features/admin-dashboard/components/admin-sidebar.tsx`
   - `src/features/admin-dashboard/layouts/admin-layout.tsx`

3. **Bounty Board**
   - `src/features/bounty-board/components/bounty-card.tsx`
   - `src/features/bounty-board/types.ts`

4. **Remaining Components**
   - Profile pages
   - Authentication modals
   - Toasts and notifications

#### Step 4: Test Each Component

After refactoring each file:
1. Switch to Dark mode - verify it looks correct
2. Switch to Light mode - verify it looks correct
3. Switch to Black & White - verify it looks correct
4. Take screenshots for comparison

---

### Phase 3: Theme-Specific Optimizations (Story 10.3) - 3-4 hours

#### Step 1: Add Theme-Specific Animations

Add to `src/app/globals.css`:

```css
/* Theme-specific glow animations */
.dark .animate-glow {
  animation: glow-dark 2s ease-in-out infinite alternate;
}

.light .animate-glow {
  animation: glow-light 2s ease-in-out infinite alternate;
}

.blackwhite .animate-glow {
  animation: glow-bw 2s ease-in-out infinite alternate;
}

@keyframes glow-dark {
  0% { box-shadow: 0 0 5px var(--neon-primary), 0 0 10px var(--neon-primary); }
  100% { box-shadow: 0 0 20px var(--neon-primary), 0 0 40px var(--neon-primary); }
}

@keyframes glow-light {
  0% { box-shadow: 0 2px 8px rgba(21, 128, 61, 0.1); }
  100% { box-shadow: 0 4px 16px rgba(21, 128, 61, 0.2); }
}

@keyframes glow-bw {
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
  100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
}
```

#### Step 2: Update Scanline Effects

```css
.dark body {
  background-image:
    linear-gradient(rgba(0, 20, 0, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(21, 128, 61, 0.03), rgba(21, 128, 61, 0.01), rgba(21, 128, 61, 0.03));
  background-size: 100% 2px, 3px 100%;
}

.light body {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.02) 50%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.005), rgba(0, 0, 0, 0.01));
  background-size: 100% 2px, 3px 100%;
}

.blackwhite body {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 50%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.02));
  background-size: 100% 2px, 3px 100%;
}
```

#### Step 3: Final Testing

- [ ] All pages tested in all three themes
- [ ] Animations work correctly in each theme
- [ ] Contrast ratios verified with axe DevTools
- [ ] User testing feedback collected
- [ ] Screenshots documented

---

## Troubleshooting

### Issue: Hydration Mismatch Error

**Solution**: Ensure `suppressHydrationWarning` is on `<html>` tag and ThemeToggle uses mounted state.

### Issue: Theme Not Persisting

**Solution**: Check localStorage key `krackeddev-theme` exists and ThemeProvider has correct `storageKey` prop.

### Issue: Colors Not Changing

**Solution**: Verify CSS variables are defined for all three theme classes (`:root`, `.dark`, `.blackwhite`).

### Issue: Visual Regressions

**Solution**: Compare before/after screenshots, ensure semantic color mapping is correct.

---

## Completion Checklist

### Story 10.1: Infrastructure
- [ ] `next-themes` installed
- [ ] ThemeProvider created and integrated
- [ ] CSS variables defined for all themes
- [ ] Theme toggle component created
- [ ] Theme toggle added to navbar
- [ ] Theme persists across sessions
- [ ] No hydration errors

### Story 10.2: Refactoring
- [ ] All landing page components refactored
- [ ] All admin dashboard components refactored
- [ ] All bounty board components refactored
- [ ] All profile components refactored
- [ ] Toast notifications updated
- [ ] No visual regressions
- [ ] All themes tested

### Story 10.3: Optimizations
- [ ] Theme-specific animations added
- [ ] Scanline effects optimized
- [ ] Image filters implemented
- [ ] Smooth transitions added
- [ ] WCAG AA compliance verified
- [ ] User testing completed

---

## Next Steps

After completing Epic 10:

1. **Update Documentation**: Add theme switching instructions to user docs
2. **Monitor Analytics**: Track which theme users prefer
3. **Gather Feedback**: Survey users about theme experience
4. **Consider Enhancements**: System theme detection, custom themes, etc.

---

## Support Resources

- **Story Files**: `docs/stories/10-*.md`
- **Epic Summary**: `docs/epics/epic-10-multi-theme-system.md`
- **Sprint Status**: `docs/sprint-status.yaml`
- **next-themes Docs**: https://github.com/pacocoursey/next-themes

---

**Good luck with the implementation! 🎨**
