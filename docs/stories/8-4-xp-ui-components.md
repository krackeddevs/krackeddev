# Story 8.4: XP UI Components

- **Status**: Complete
- **Priority**: High
- **Estimation**: 3 days
epic: 8

## Story

As a Developer,
I want to see my XP progress, level, and recent XP activity in a visually engaging way,
So that I feel motivated to continue earning XP and leveling up.

## Acceptance Criteria

1. **Given** I view my profile
2. **Then** I see an XP progress bar showing progress to next level
3. **And** my current level is displayed prominently
4. **Given** I earn XP from any activity
5. **When** I level up
6. **Then** a celebratory toast notification appears
7. **Given** I want to see my XP history
8. **Then** I can view a feed of recent XP-earning events
9. **Given** all UI components are rendered
10. **Then** they use cyberpunk-themed styling consistent with the site

## Tasks/Subtasks

- [x] Create `<XPProgressBar />` component <!-- id: 1 -->
- [x] Create `<LevelBadge />` component <!-- id: 2 -->
- [x] Create `<XPHistory />` component <!-- id: 3 -->
- [x] Create `<LevelUpToast />` component <!-- id: 4 -->
- [x] Add XP event icons and styling <!-- id: 5 -->
- [x] Integrate progress bar into ProfileDetails <!-- id: 6 -->
- [x] Integrate into MiniProfile on landing page <!-- id: 7 -->
- [x] Add responsive design for mobile <!-- id: 8 -->
- [x] Test across browsers and devices <!-- id: 9 -->

## Technical Requirements

### Component 1: XP Progress Bar

**Path**: `src/features/profiles/components/xp-progress-bar.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchXPProgress } from "../actions";
import { XPProgress } from "../xp-system";

interface XPProgressBarProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function XPProgressBar({ showDetails = false, compact = false }: XPProgressBarProps) {
  const [progress, setProgress] = useState\u003cXPProgress | null\u003e(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =\u003e {
    fetchXPProgress().then(({ data }) =\u003e {
      if (data) setProgress(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return \u003cdiv className="animate-pulse h-16 bg-gray-800 rounded-lg" /\u003e;
  }

  if (!progress) return null;

  return (
    \u003cdiv className="xp-progress-container"\u003e
      {/* Level Badge */}
      \u003cdiv className="flex items-center gap-4 mb-2"\u003e
        \u003cdiv className="level-badge text-2xl font-bold text-cyan-400"\u003e
          Level {progress.currentLevel}
        \u003c/div\u003e
        {showDetails \u0026\u0026 (
          \u003cdiv className="text-sm text-gray-400"\u003e
            {progress.xpInCurrentLevel} / {progress.xpForNextLevel - progress.xpForCurrentLevel} XP
          \u003c/div\u003e
        )}
      \u003c/div\u003e

      {/* Progress Bar */}
      \u003cdiv className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-cyan-900"\u003e
        \u003cdiv
          className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transition-all duration-500 glow-effect"
          style={{ width: `${progress.progressPercentage}%` }}
        /\u003e
      \u003c/div\u003e

      {showDetails \u0026\u0026 (
        \u003cdiv className="text-xs text-gray-500 mt-1"\u003e
          {progress.xpNeededForNext} XP to next level
        \u003c/div\u003e
      )}
    \u003c/div\u003e
  );
}
```

### Component 2: Level Badge

**Path**: `src/features/profiles/components/level-badge.tsx`

```tsx
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function LevelBadge({ level, size = 'md', showLabel = true }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    \u003cdiv className="flex items-center gap-2"\u003e
      \u003cdiv
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white border-2 border-cyan-400 neon-glow`}
      \u003e
        {level}
      \u003c/div\u003e
      {showLabel \u0026\u0026 \u003cspan className="text-sm text-gray-400"\u003eLVL\u003c/span\u003e}
    \u003c/div\u003e
  );
}
```

### Component 3: XP History

**Path**: `src/features/profiles/components/xp-history.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserXPHistory } from "../actions";
import { XPEvent } from "../types";

const EVENT_ICONS = {
  daily_login: "🎯",
  github_contribution: "💻",
  bounty_submission: "📝",
  bounty_win: "🏆",
  streak_milestone: "🔥",
  profile_completion: "✅",
  manual_adjustment: "⚙️"
};

const EVENT_LABELS = {
  daily_login: "Daily Login",
  github_contribution: "GitHub Contribution",
  bounty_submission: "Bounty Submitted",
  bounty_win: "Bounty Won",
  streak_milestone: "Streak Milestone",
  profile_completion: "Profile Completed",
  manual_adjustment: "Manual Adjustment"
};

export function XPHistory() {
  const [events, setEvents] = useState\u003cXPEvent[]\u003e([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =\u003e {
    fetchUserXPHistory(20).then(({ data }) =\u003e {
      if (data) setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return \u003cdiv\u003eLoading XP history...\u003c/div\u003e;
  }

  return (
    \u003cdiv className="xp-history max-h-96 overflow-y-auto"\u003e
      \u003ch3 className="text-lg font-bold text-cyan-400 mb-4"\u003eRecent Activity\u003c/h3\u003e
      \u003cdiv className="space-y-2"\u003e
        {events.map((event) =\u003e (
          \u003cdiv
            key={event.id}
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-700 transition-colors"
          \u003e
            \u003cdiv className="flex items-center gap-3"\u003e
              \u003cspan className="text-2xl"\u003e{EVENT_ICONS[event.eventType]}\u003c/span\u003e
              \u003cdiv\u003e
                \u003cdiv className="text-sm font-medium text-white"\u003e
                  {EVENT_LABELS[event.eventType]}
                \u003c/div\u003e
                \u003cdiv className="text-xs text-gray-500"\u003e
                  {new Date(event.createdAt).toLocaleDateString()}
                \u003c/div\u003e
              \u003c/div\u003e
            \u003c/div\u003e
            \u003cdiv className="text-cyan-400 font-bold"\u003e+{event.xpAmount} XP\u003c/div\u003e
          \u003c/div\u003e
        ))}
      \u003c/div\u003e
    \u003c/div\u003e
  );
}
```

### Component 4: Level Up Toast

**Path**: `src/features/profiles/components/level-up-toast.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface LevelUpToastProps {
  newLevel: number;
  onShow?: () =\u003e void;
}

export function showLevelUpToast(newLevel: number) {
  toast(\u003cdiv className="flex items-center gap-3"\u003e
    \u003cspan className="text-3xl"\u003e🎉\u003c/span\u003e
    \u003cdiv\u003e
      \u003cdiv className="font-bold text-cyan-400"\u003eLevel Up!\u003c/div\u003e
      \u003cdiv className="text-sm"\u003eYou've reached Level {newLevel}\u003c/div\u003e
    \u003c/div\u003e
  \u003c/div\u003e, {
    duration: 5000,
    className: 'level-up-toast',
  });
}
```

### Integration: ProfileDetails

```tsx
// In src/features/profiles/components/profile-details.tsx
import { XPProgressBar } from './xp-progress-bar';
import { LevelBadge } from './level-badge';

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    \u003cdiv\u003e
      {/* Existing profile content */}
      
      {/* Add XP Section */}
      \u003csection className="xp-section mt-6"\u003e
        \u003cXPProgressBar showDetails={true} /\u003e
      \u003c/section\u003e
      
      {/* ... rest of profile */}
    \u003c/div\u003e
  );
}
```

### Integration: MiniProfile

```tsx
// In src/features/landingpage/components/mini-profile.tsx
import { LevelBadge } from '@/features/profiles/components/level-badge';

export function MiniProfile({ data }: MiniProfileProps) {
  return (
    \u003cdiv\u003e
      \u003cLevelBadge level={data.level} size="sm" /\u003e
      {/* ... rest of mini profile */}
    \u003c/div\u003e
  );
}
```

### Styling (Cyberpunk Theme)

```css
/* Add to globals.css or component CSS module */
.xp-progress-container {
  @apply relative;
}

.glow-effect {
  box-shadow: 
    0 0 10px rgba(34, 211, 238, 0.5),
    0 0 20px rgba(34, 211, 238, 0.3),
    inset 0 0 10px rgba(34, 211, 238, 0.2);
}

.neon-glow {
  box-shadow: 
    0 0 5px rgba(34, 211, 238, 0.8),
    0 0 10px rgba(34, 211, 238, 0.5);
}

.level-up-toast {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  border: 1px solid #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
}

/* Animated counter effect */
@keyframes countUp {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.xp-amount {
  animation: countUp 0.5s ease-out;
}
```

## Server Actions

Add to `src/features/profiles/actions.ts`:

```typescript
import { XPEvent } from './types';

export async function fetchUserXPHistory(
  limit: number = 20
): Promise\u003c{ data?: XPEvent[]; error?: string }\u003e {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from('xp_events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  return { data: data as XPEvent[] };
}
```

## Testing Strategy

### Visual Testing Checklist

- [ ] XP progress bar displays correctly on profile
- [ ] Level badge visible in mini profile
- [ ] Progress bar fills accurately (0%, 50%, 99%)
- [ ] Level up toast appears and dismisses
- [ ] XP history scrolls smoothly
- [ ] Cyberpunk glow effects render properly
- [ ] Responsive on mobile (320px width)
- [ ] Dark mode compatibility

### Component Tests

```tsx
describe('XPProgressBar', () =\u003e {
  it('renders progress correctly', () =\u003e {
    render(\u003cXPProgressBar /\u003e);
    expect(screen.getByText(/Level/i)).toBeInTheDocument();
  });
  
  it('shows details when prop is true', () =\u003e {
    render(\u003cXPProgressBar showDetails={true} /\u003e);
    expect(screen.getByText(/XP to next level/i)).toBeInTheDocument();
  });
});
```

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Architecture Compliance

- **Client Components**: Use `"use client"` for interactive components
- **Server Actions**: Fetch data via server actions, not API routes
- **Type Safety**: All props and data use TypeScript interfaces
- **Feature Sliced**: Components in `src/features/profiles/components/`
- **Reusability**: Components accept props for customization

## Performance Considerations

- Lazy load XP history (only when tab/section is visible)
- Cache XP progress data client-side
- Debounce progress bar animations
- Optimize re-renders with React.memo

## Accessibility

- Progress bar has `role="progressbar"` and `aria-valuenow`
- Level badge has descriptive `aria-label`
- Toast notifications use `aria-live` regions
- Keyboard navigation for XP history

## Dev Notes

- Use Shadcn UI components where applicable (Progress, Toast)
- Consistent color palette: cyan-400, purple-600, gray-800
- Animation duration \u003c 500ms for snappy feel
- Ensure toast doesn't block critical UI on mobile

## References

- Story 8.2: XP Earning Events \u0026 Logic
- Story 8.3: Level Progression System
- [Shadcn UI - Progress](https://ui.shadcn.com/docs/components/progress)
- [Shadcn UI - Toast](https://ui.shadcn.com/docs/components/toast)
