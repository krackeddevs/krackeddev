# Story 8.6: Level-Based Visual Rewards

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 8
story_points: 5

## Story

As a Developer,
I want my profile to reflect my level with visual rewards,
So that I feel proud of my progress and others recognize my achievements.

## Acceptance Criteria

1. **Given** I reach a new level tier (every 10 levels)
2. **When** I view my profile
3. **Then** my profile border/frame changes to reflect my tier
4. **And** my level badge has a unique visual style for my tier
5. **Given** I'm Level 1-9 (Bronze tier)
6. **Then** my border is copper/bronze colored
7. **Given** I'm Level 10-24 (Silver tier)
8. **Then** my border is silver colored with subtle glow
9. **Given** I'm Level 25-49 (Gold tier)
10. **Then** my border is gold colored with animated glow
11. **Given** I'm Level 50+ (Platinum tier)
12. **Then** my border is platinum with cyberpunk animations
13. **Given** I comment or interact anywhere
14. **Then** my level badge appears next to my username

## Tasks/Subtasks

- [ ] Define tier system and level thresholds <!-- id: 1 -->
- [ ] Create `getTierFromLevel()` utility function <!-- id: 2 -->
- [ ] Design tier-based CSS classes and animations <!-- id: 3 -->
- [ ] Create `ProfileBorder` component <!-- id: 4 -->
- [ ] Create `LevelBadge` component with tier variants <!-- id: 5 -->
- [ ] Update `ProfileDetails` to use ProfileBorder <!-- id: 6 -->
- [ ] Update `MiniProfile` to show level badge <!-- id: 7 -->
- [ ] Add level badge to comments/posts <!-- id: 8 -->
- [ ] Create cyberpunk terminal-style animations <!-- id: 9 -->
- [ ] Add to style guide documentation <!-- id: 10 -->

## Technical Requirements

###Tier System

```typescript
// src/features/profiles/utils/tier-system.ts
export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite';

export interface TierConfig {
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  glowColor: string;
  animation: string;
  icon: string;
}

export const TIER_CONFIG: Record<UserTier, TierConfig> = {
  bronze: {
    name: 'Script Kiddie',
    minLevel: 1,
    maxLevel: 9,
    color: '#CD7F32',
    glowColor: '#CD7F32',
    animation: 'none',
    icon: '🥉'
  },
  silver: {
    name: 'Code Ninja',
    minLevel: 10,
    maxLevel: 24,
    color: '#C0C0C0',
    glowColor: '#E8E8E8',
    animation: 'pulse',
    icon: '🥈'
  },
  gold: {
    name: 'Elite Hacker',
    minLevel: 25,
    maxLevel: 49,
    color: '#FFD700',
    glowColor: '#FFA500',
    animation: 'glow',
    icon: '🥇'
  },
  platinum: {
    name: 'Digital Overlord',
    minLevel: 50,
    maxLevel: 99,
    color: '#E5E4E2',
    glowColor: '#00FFFF',
    animation: 'cyberpunk',
    icon: '👑'
  },
  elite: {
    name: 'Matrix Architect',
    minLevel: 100,
    maxLevel: 999,
    color: '#FF00FF',
    glowColor: '#00FF00',
    animation: 'matrix',
    icon: '⚡'
  }
};

export function getTierFromLevel(level: number): UserTier {
  if (level >= 100) return 'elite';
  if (level >= 50) return 'platinum';
  if (level >= 25) return 'gold';
  if (level >= 10) return 'silver';
  return 'bronze';
}

export function getTierConfig(level: number): TierConfig {
  const tier = getTierFromLevel(level);
  return TIER_CONFIG[tier];
}
```

### CSS Animations

```css
/* src/app/globals.css */

/* Pulse animation for silver */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px var(--tier-glow-color); }
  50% { box-shadow: 0 0 20px var(--tier-glow-color); }
}

/* Glow animation for gold */
@keyframes tier-glow {
  0% { box-shadow: 0 0 15px var(--tier-glow-color); }
  50% { box-shadow: 0 0 30px var(--tier-glow-color), 0 0 40px var(--tier-color); }
  100% { box-shadow: 0 0 15px var(--tier-glow-color); }
}

/* Cyberpunk animation for platinum */
@keyframes cyberpunk-border {
  0%, 100% { 
    box-shadow: 
      0 0 20px var(--tier-glow-color),
      inset 0 0 20px var(--tier-glow-color);
    border-color: var(--tier-color);
  }
  50% { 
    box-shadow: 
      0 0 40px var(--tier-glow-color),
      inset 0 0 30px var(--tier-glow-color);
    border-color: var(--tier-glow-color);
  }
}

/* Matrix rain for elite */
@keyframes matrix-rain {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

.tier-bronze { border: 2px solid #CD7F32; }
.tier-silver { 
  border: 2px solid #C0C0C0;
  animation: pulse-glow 2s ease-in-out infinite;
}
.tier-gold { 
  border: 2px solid #FFD700;
  animation: tier-glow 3s ease-in-out infinite;
}
.tier-platinum { 
  border: 2px solid #E5E4E2;
  animation: cyberpunk-border 4s ease-in-out infinite;
}
.tier-elite { 
  border: 2px solid #FF00FF;
  animation: cyberpunk-border 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
```

### ProfileBorder Component

```typescript
// src/features/profiles/components/profile-border.tsx
interface ProfileBorderProps {
  level: number;
  children: React.ReactNode;
  className?: string;
}

export function ProfileBorder({ level, children, className }: ProfileBorderProps) {
  const tierConfig = getTierConfig(level);
  const tier = getTierFromLevel(level);
  
  return (
    <div
      className={cn(
        `tier-${tier}`,
        'rounded-lg p-1 relative',
        className
      )}
      style={{
        '--tier-color': tierConfig.color,
        '--tier-glow-color': tierConfig.glowColor,
      } as React.CSSProperties}
    >
      {/* Matrix rain effect for elite tier */}
      {tier === 'elite' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <MatrixRainEffect />
        </div>
      )}
      
      {children}
    </div>
  );
}
```

### LevelBadge Component

```typescript
// src/features/profiles/components/level-badge.tsx
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
}

export function LevelBadge({ level, size = 'md', showTier = false }: LevelBadgeProps) {
  const tierConfig = getTierConfig(level);
  const tier = getTierFromLevel(level);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };
  
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          `tier-badge tier-${tier}`,
          'rounded-full font-bold',
          sizeClasses[size]
        )}
        style={{
          backgroundColor: `${tierConfig.color}20`,
          borderColor: tierConfig.color,
          color: tierConfig.color,
        }}
      >
        {tierConfig.icon} Lv.{level}
      </span>
      
      {showTier && (
        <span className="text-xs text-muted-foreground">
          {tierConfig.name}
        </span>
      )}
    </div>
  );
}
```

### Terminal-Style Level Up Notification

```typescript
// src/features/profiles/components/level-up-toast.tsx
export function showLevelUpToast(newLevel: number) {
  const tierConfig = getTierConfig(newLevel);
  const tier = getTierFromLevel(newLevel);
  
  toast.custom((t) => (
    <div className="bg-black border-2 border-green-500 text-green-500 font-mono p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="h-4 w-4" />
        <span className="font-bold">SYSTEM NOTIFICATION</span>
      </div>
      <div className="space-y-1">
        <div>> LEVEL_UP_DETECTED</div>
        <div>> CURRENT_LEVEL: <span className="text-yellow-400">{newLevel}</span></div>
        <div>> TIER_STATUS: <span style={{color: tierConfig.color}}>{tierConfig.name.toUpperCase()}</span></div>
        {getTierFromLevel(newLevel) !== getTierFromLevel(newLevel - 1) && (
          <div className="text-cyan-400">> ⚡ TIER_UPGRADE_UNLOCKED</div>
        )}
        <div>> ACCESS_GRANTED: <span className="text-white">New visual rewards available</span></div>
      </div>
    </div>
  ), {
    duration: 5000,
  });
}
```

## Architecture Compliance

- **Theme System**: CSS variables for tier colors
- **Reusability**: Tier system used across profile, comments, posts
- **Performance**: CSS animations (GPU accelerated)
- **Accessibility**: ARIA labels for tier information
- **Responsive**: Works on mobile and desktop

## Testing Strategy

### Visual Regression Tests
- Screenshot tests for each tier
- Animation playback tests
- Border rendering on different screen sizes

### Unit Tests
```typescript
describe('getTierFromLevel', () => {
  it('returns bronze for level 1-9', () => {
    expect(getTierFromLevel(1)).toBe('bronze');
    expect(getTierFromLevel(9)).toBe('bronze');
  });
  
  it('returns elite for level 100+', () => {
    expect(getTierFromLevel(100)).toBe('elite');
  });
});
```

### Manual Testing
- Verify each tier renders correctly
- Test animations on different browsers
- Check performance with multiple badges on page
- Verify terminal-style notification styling

## Dev Notes

- Consider allowing users to hide tier if they prefer minimal profile
- Add confetti effect for tier upgrades (10→11, 25→26, etc.)
- Future: Custom tier skins/themes marketplace
- Future: Animated tier transitions on level-up

## References

- [CSS Box-Shadow tricks](https://css-tricks.com/snippets/css/glowing-blue-neon-text-effect/)
- [Framer Motion](https://www.framer.com/motion/) for advanced animations
- Epic 8: Player XP and Leveling System
