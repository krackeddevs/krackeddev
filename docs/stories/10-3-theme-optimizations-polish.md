# Story 10.3: Phase 3 - Black & White Mode & Polish

Status: backlog
priority: good-to-have
assignee: antique_gravity
epic: 10
depends_on: 10-2-refactor-hardcoded-colors

## Story

As a User,
I want a High Contrast Black & White mode and a polished theme experience,
So that I can use the platform comfortably regardless of my visual preferences or needs.

## Acceptance Criteria

1. **Given** the user selects "Black & White" mode
2. **Then** the interface should be strictly grayscale (No color information used for state)
3. **And** contrast ratios must meet WCAG AA (4.5:1 for normal text)
4. **And** focus indicators must be clearly visible
5. **Given** the theme toggle is used
6. **Then** animations between themes should be smooth
7. **And** all theme-specific assets (like scanlines) should adapt appropriately

## Tasks/Subtasks

- [ ] Define B&W Mode CSS variables (High Contrast) <!-- id: 1 -->
- [ ] Implement `ThemeAwareImage` component for grayscale assets <!-- id: 2 -->
- [ ] Add "Black & White" option to public Theme Toggle <!-- id: 3 -->
- [ ] **Implementation of Theme-Specific Grid Backgrounds**:
    - Dark: Standardized Neon Grid (from Phase 1)
    - Light: Gray/Subtle scanlines
    - B&W: High contrast monochrome scanlines
- [ ] Optimize glow effects for B&W (high contrast, no blur) <!-- id: 4 -->
- [ ] Conduct Accessibility Audit (axe-core) on all modes <!-- id: 5 -->
- [ ] Implement "reduced motion" support for theme transitions <!-- id: 6 -->
- [ ] Final UI Polish & Visual QA <!-- id: 7 -->

## Technical Requirements

### Grid Background Implementation

The current grid/scanline effect is a CSS gradient on `body`. We will themify it using a new CSS variable `--grid-background`.

**Globals.css**:

```css
:root {
  /* Light Mode Grid */
  --grid-background: 
    linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.05) 50%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.03));
}

.dark {
  /* Dark Mode Grid (Current Green) */
  --grid-background: 
    linear-gradient(rgba(0, 20, 0, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(21, 128, 61, 0.03), rgba(21, 128, 61, 0.01), rgba(21, 128, 61, 0.03));
}

.blackwhite {
  /* B&W High Contrast Grid */
  --grid-background: 
    linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.1) 50%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.05));
}

body {
  background-image: var(--grid-background);
}
```

### Theme-Specific Animations

**File**: `src/app/globals.css`

```css
/* Dark Mode - Keep existing neon glow */
.dark .animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px var(--neon-primary), 0 0 10px var(--neon-primary);
  }
  100% {
    box-shadow: 0 0 20px var(--neon-primary), 0 0 40px var(--neon-primary);
  }
}

/* Light Mode - Subtle shadow pulse */
.light .animate-glow {
  animation: glow-light 2s ease-in-out infinite alternate;
}

@keyframes glow-light {
  0% {
    box-shadow: 0 2px 8px rgba(21, 128, 61, 0.1);
  }
  100% {
    box-shadow: 0 4px 16px rgba(21, 128, 61, 0.2);
  }
}

/* Black & White Mode - High contrast pulse */
.blackwhite .animate-glow {
  animation: glow-bw 2s ease-in-out infinite alternate;
}

@keyframes glow-bw {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  }
}
```

### Scanline Effects

```css
/* Dark Mode - Green tinted scanlines */
.dark body {
  background-image:
    linear-gradient(rgba(0, 20, 0, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(21, 128, 61, 0.03), rgba(21, 128, 61, 0.01), rgba(21, 128, 61, 0.03));
  background-size: 100% 2px, 3px 100%;
}

/* Light Mode - Subtle gray scanlines */
.light body {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.02) 50%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.005), rgba(0, 0, 0, 0.01));
  background-size: 100% 2px, 3px 100%;
}

/* Black & White Mode - High contrast scanlines */
.blackwhite body {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 50%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.02));
  background-size: 100% 2px, 3px 100%;
}
```

### Theme-Aware Image Filters

**File**: `src/components/theme-aware-image.tsx`

```tsx
"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeAwareImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}

export function ThemeAwareImage({ src, alt, className, ...props }: ThemeAwareImageProps) {
  const { theme } = useTheme();

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        className,
        theme === "blackwhite" && "grayscale contrast-125",
        theme === "light" && "brightness-105"
      )}
      {...props}
    />
  );
}
```

### Theme Transition Animation

```css
/* Smooth theme transitions */
* {
  transition: 
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Disable transitions for elements that should change instantly */
.no-theme-transition,
.no-theme-transition * {
  transition: none !important;
}
```

### Theme Preview Component

**File**: `src/components/theme-preview.tsx`

```tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Contrast } from "lucide-react";

export function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "dark",
      name: "Dark Mode",
      icon: Moon,
      preview: "bg-zinc-900 border-green-500",
      description: "Cyberpunk green on dark",
    },
    {
      id: "light",
      name: "Light Mode",
      icon: Sun,
      preview: "bg-white border-green-700",
      description: "Clean and bright",
    },
    {
      id: "blackwhite",
      name: "Black & White",
      icon: Contrast,
      preview: "bg-black border-white",
      description: "High contrast grayscale",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative p-6 border-2 rounded-lg transition-all",
              "hover:scale-105 hover:shadow-lg",
              isActive
                ? "border-primary bg-primary/10 shadow-[0_0_20px_var(--neon-primary)]"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={cn("w-16 h-16 rounded-lg border-2 flex items-center justify-center", t.preview)}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold font-mono">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

### Toast Notification Theming

**File**: `src/lib/toast.ts`

Update toast styles to be theme-aware:

```typescript
import { toast as sonnerToast } from "sonner";
import { useTheme } from "next-themes";

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      className: "bg-primary/20 border-primary/50 text-primary-foreground",
    });
  },
  error: (message: string) => {
    sonnerToast.error(message, {
      className: "bg-destructive/20 border-destructive/50 text-destructive-foreground",
    });
  },
  info: (message: string) => {
    sonnerToast.info(message, {
      className: "bg-accent/20 border-accent/50 text-accent-foreground",
    });
  },
};
```

### Loading States

**File**: `src/components/theme-aware-spinner.tsx`

```tsx
"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeAwareSpinner({ className }: { className?: string }) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4",
        theme === "dark" && "border-green-500/20 border-t-green-500",
        theme === "light" && "border-green-700/20 border-t-green-700",
        theme === "blackwhite" && "border-white/20 border-t-white",
        className
      )}
    />
  );
}
```

### Black & White Mode Hover States

```css
/* Enhanced hover states for B&W mode */
.blackwhite .hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.blackwhite .hover-glow:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
}

/* Underline effect for links in B&W */
.blackwhite a:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
```

## Architecture Compliance

- **Performance**: CSS-only animations, no JavaScript
- **Accessibility**: Maintains contrast ratios in all themes
- **Consistency**: Theme-aware components follow same patterns
- **Maintainability**: Centralized theme logic

## Testing Strategy

### Visual Polish Checklist

**Dark Mode**:
- [ ] Neon glow effects are vibrant
- [ ] Scanlines are subtle but visible
- [ ] Animations feel cyberpunk-themed
- [ ] Contrast is comfortable for extended viewing

**Light Mode**:
- [ ] No harsh glows or shadows
- [ ] Text is crisp and readable
- [ ] Animations are subtle and professional
- [ ] Background is not blindingly white

**Black & White Mode**:
- [ ] Visual hierarchy maintained through contrast
- [ ] Hover states are obvious
- [ ] No color information is lost
- [ ] Grayscale gradients are smooth

### Animation Performance

```javascript
// Test animation frame rate
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Animation frame time:', entry.duration);
  }
});
observer.observe({ entryTypes: ['measure'] });
```

### User Preference Testing

- [ ] Test with users who prefer high contrast
- [ ] Test with users sensitive to bright screens
- [ ] Gather feedback on theme aesthetics
- [ ] A/B test default theme selection

## Performance Considerations

- All animations use CSS transforms (GPU accelerated)
- Theme transitions use CSS variables (no re-render)
- Image filters applied via CSS (no canvas manipulation)
- Minimal JavaScript for theme logic

## Dev Notes

- Consider adding a "System" theme option that follows OS preference
- May want to add theme-specific sound effects (optional)
- Consider saving theme preference to user profile (not just localStorage)
- Future: Add custom theme builder for power users

## Accessibility Enhancements

- Add keyboard shortcuts for theme switching (e.g., Ctrl+Shift+T)
- Announce theme changes to screen readers
- Ensure focus indicators are visible in all themes
- Test with color blindness simulators

## References

- [Framer Motion Theming](https://www.framer.com/motion/)
- [CSS Animation Performance](https://web.dev/animations/)
- [Accessible Color Systems](https://stripe.com/blog/accessible-color-systems)
- Epic 10: Multi-Theme System
- Story 10.1: Theme Infrastructure & Provider Setup
- Story 10.2: Refactor Hardcoded Colors to CSS Variables
