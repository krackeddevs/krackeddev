# Story 8.3: Level Progression System

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 8

## Story

As a Developer,
I want to automatically level up when I reach XP thresholds,
So that my progress is visible and I feel a sense of achievement.

## Acceptance Criteria

1. **Given** I have 0-99 XP
2. **Then** I am level 1
3. **Given** I reach 100 XP
4. **Then** I automatically level up to level 2
5. **Given** I continue earning XP
6. **Then** my level increases according to the progression formula
7. **Given** the system calculates my next level threshold
8. **Then** it returns the correct XP amount needed
9. **Given** edge cases occur (max level, negative XP)
10. **Then** the system handles them gracefully

## Tasks/Subtasks

- [x] Implement `calculateLevelFromXP()` function <!-- id: 1 -->
- [x] Implement `calculateXPForNextLevel()` function <!-- id: 2 -->
- [x] Implement `getXPProgress()` server action <!-- id: 3 -->
- [x] Add level progression constants/config <!-- id: 4 -->
- [x] Handle max level cap (if defined) <!-- id: 5 -->
- [x] Add unit tests for level calculations <!-- id: 6 -->
- [x] Test edge cases (0 XP, max level, large numbers) <!-- id: 7 -->

## Technical Requirements

### Level Progression Formulas

#### Option 1: Linear Progression (Recommended for MVP)

```typescript
/**
 * Linear progression: Each level requires 100 XP more than the last.
 * Level 1: 0-99 XP
 * Level 2: 100-199 XP
 * Level 3: 200-299 XP
 * ...
 * Level N: (N-1)*100 to N*100-1 XP
 */
export const XP_CONFIG = {
  PROGRESSION_TYPE: 'linear' as const,
  XP_PER_LEVEL: 100,
  MAX_LEVEL: null // No cap
};

export function calculateLevelFromXP(xp: number): number {
  if (xp \u003c 0) return 1; // Protect against negative XP
  
  const level = Math.floor(xp / XP_CONFIG.XP_PER_LEVEL) + 1;
  
  if (XP_CONFIG.MAX_LEVEL \u0026\u0026 level \u003e XP_CONFIG.MAX_LEVEL) {
    return XP_CONFIG.MAX_LEVEL;
  }
  
  return level;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  if (XP_CONFIG.MAX_LEVEL \u0026\u0026 currentLevel \u003e= XP_CONFIG.MAX_LEVEL) {
    return Infinity; // No next level
  }
  
  return currentLevel * XP_CONFIG.XP_PER_LEVEL;
}
```

#### Option 2: Exponential Progression (Alternative)

```typescript
/**
 * Exponential progression: Each level requires level² * 100 XP.
 * Level 1: 0-99 XP (1² * 100 - 1)
 * Level 2: 100-399 XP (requires 2² * 100 = 400 total)
 * Level 3: 400-899 XP (requires 3² * 100 = 900 total)
 * ...
 */
export const XP_CONFIG = {
  PROGRESSION_TYPE: 'exponential' as const,
  BASE_MULTIPLIER: 100,
  MAX_LEVEL: 50
};

export function calculateLevelFromXP(xp: number): number {
  if (xp \u003c 0) return 1;
  
  let level = 1;
  let totalXPNeeded = 0;
  
  while (totalXPNeeded \u003c= xp) {
    level++;
    totalXPNeeded = (level * level) * XP_CONFIG.BASE_MULTIPLIER;
    
    if (XP_CONFIG.MAX_LEVEL \u0026\u0026 level \u003e XP_CONFIG.MAX_LEVEL) {
      return XP_CONFIG.MAX_LEVEL;
    }
  }
  
  return level - 1;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  if (XP_CONFIG.MAX_LEVEL \u0026\u0026 currentLevel \u003e= XP_CONFIG.MAX_LEVEL) {
    return Infinity;
  }
  
  const nextLevel = currentLevel + 1;
  return (nextLevel * nextLevel) * XP_CONFIG.BASE_MULTIPLIER;
}
```

### XP Progress Interface

```typescript
export interface XPProgress {
  currentXP: number;
  currentLevel: number;
  xpForCurrentLevel: number;  // XP at start of current level
  xpForNextLevel: number;     // XP needed to reach next level
  xpInCurrentLevel: number;   // XP earned in current level
  xpNeededForNext: number;    // XP remaining to next level
  progressPercentage: number; // 0-100%
}

/**
 * Calculate detailed XP progress for UI display.
 */
export function calculateXPProgress(totalXP: number): XPProgress {
  const currentLevel = calculateLevelFromXP(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * XP_CONFIG.XP_PER_LEVEL;
  const xpForNextLevel = currentLevel * XP_CONFIG.XP_PER_LEVEL;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - totalXP;
  const progressPercentage = (xpInCurrentLevel / XP_CONFIG.XP_PER_LEVEL) * 100;
  
  return {
    currentXP: totalXP,
    currentLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercentage
  };
}
```

### Server Action

Add to `src/features/profiles/actions.ts`:

```typescript
import { calculateXPProgress } from './xp-system';

export async function fetchXPProgress(): Promise\u003c{
  data?: XPProgress;
  error?: string;
}\u003e {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return { error: "Failed to fetch XP data" };
  }

  const progress = calculateXPProgress(profile.xp || 0);
  
  return { data: progress };
}
```

### Level Progression Reference Table

| Level | Total XP (Linear) | Total XP (Exponential) | XP for Next Level |
|:------|:------------------|:-----------------------|:------------------|
| 1     | 0-99              | 0-99                   | 100               |
| 2     | 100-199           | 100-399                | 100 (L) / 300 (E) |
| 3     | 200-299           | 400-899                | 100 (L) / 500 (E) |
| 5     | 400-499           | 2,500-2,999            | 100 (L) / 500 (E) |
| 10    | 900-999           | 10,000-11,999          | 100 (L) / 2,000 (E)|
| 20    | 1,900-1,999       | 40,000-43,999          | 100 (L) / 4,000 (E)|
| 50    | 4,900-4,999       | 250,000-259,999        | 100 (L) / 10,000 (E)|

## Testing Strategy

### Unit Tests

```typescript
describe('calculateLevelFromXP', () =\u003e {
  it('should return level 1 for 0-99 XP', () =\u003e {
    expect(calculateLevelFromXP(0)).toBe(1);
    expect(calculateLevelFromXP(50)).toBe(1);
    expect(calculateLevelFromXP(99)).toBe(1);
  });
  
  it('should return level 2 for 100-199 XP', () =\u003e {
    expect(calculateLevelFromXP(100)).toBe(2);
    expect(calculateLevelFromXP(150)).toBe(2);
    expect(calculateLevelFromXP(199)).toBe(2);
  });
  
  it('should handle negative XP gracefully', () =\u003e {
    expect(calculateLevelFromXP(-100)).toBe(1);
  });
  
  it('should respect max level cap', () =\u003e {
    // If MAX_LEVEL = 50
    expect(calculateLevelFromXP(10000)).toBe(50);
  });
});

describe('calculateXPForNextLevel', () =\u003e {
  it('should return correct XP for next level', () =\u003e {
    expect(calculateXPForNextLevel(1)).toBe(100);
    expect(calculateXPForNextLevel(2)).toBe(200);
    expect(calculateXPForNextLevel(10)).toBe(1000);
  });
  
  it('should return Infinity at max level', () =\u003e {
    // If MAX_LEVEL = 50
    expect(calculateXPForNextLevel(50)).toBe(Infinity);
  });
});

describe('calculateXPProgress', () =\u003e {
  it('should calculate progress correctly', () =\u003e {
    const progress = calculateXPProgress(150);
    expect(progress.currentLevel).toBe(2);
    expect(progress.xpInCurrentLevel).toBe(50);
    expect(progress.progressPercentage).toBe(50);
  });
});
```

### Integration Tests

```typescript
describe('Level progression integration', () =\u003e {
  it('should level up when XP threshold is reached', async () =\u003e {
    // Set user to 95 XP (level 1)
    const result = await grantXP('user-123', 'daily_login', 10);
    expect(result.newLevel).toBe(2);
    expect(result.leveledUp).toBe(true);
  });
  
  it('should not level up below threshold', async () =\u003e {
    // Set user to 90 XP
    const result = await grantXP('user-123', 'daily_login', 5);
    expect(result.leveledUp).toBe(false);
    expect(result.newLevel).toBe(1);
  });
});
```

## Architecture Compliance

- **Pure Functions**: Level calculations are deterministic and side-effect free
- **Type Safety**: All functions use TypeScript for compile-time checks
- **Configuration**: XP progression config is centralized and easily adjustable
- **Testability**: Pure functions enable comprehensive unit testing

## Performance Considerations

- Level calculations are O(1) for linear progression
- Exponential calculations may be O(log n) but cached in database
- No database queries needed for pure calculation functions
- Profile updates are atomic with xp_events creation

## Dev Notes

- **Decision Required**: Choose linear vs exponential progression
  - Linear: Predictable, fair for casual players
  - Exponential: Rewards dedicated players, creates prestige for high levels
- Max level cap prevents overflow and defines endgame
- Level is always stored in database for performance (no recalculation)
- Frontend can call `fetchXPProgress()` for real-time progress bar

## References

- Story 8.2: XP Earning Events \u0026 Logic
- Story 8.4: XP UI Components
- Epic 8: Player XP and Leveling System
