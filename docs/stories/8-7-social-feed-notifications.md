# Story 8.7: Social Feed & Notifications

Status: backlog
priority: good-to-have
assignee: antique_gravity
epic: 8
story_points: 8

## Story

As a Developer,
I want to see community activity and receive notifications about my progress,
So that I stay engaged and motivated to continue earning XP.

## Acceptance Criteria

1. **Given** someone levels up
2. **When** I visit the homepage
3. **Then** I see their level-up in the activity feed
4. **Given** I just leveled up
5. **When** the system detects my level increase
6. **Then** I receive a browser push notification
7. **Given** my streak is about to break (no activity in 6+ days)
8. **When** I log in
9. **Then** I see a warning notification
10. **Given** I'm 50 XP or less from next level
11. **When** I view my profile
12. **Then** I see a "Close to level up!" notification

## Tasks/Subtasks

- [ ] Create `LevelUpFeed` component for homepage <!-- id: 1 -->
- [ ] Create server action `fetchRecentLevelUps(limit)` <!-- id: 2 -->
- [ ] Set up browser push notification permissions <!-- id: 3 -->
- [ ] Create `sendLevelUpNotification()` function <!-- id: 4 -->
- [ ] Create `StreakWarning` component <!-- id: 5 -->
- [ ] Create `calculateStreakRisk()` utility <!-- id: 6 -->
- [ ] Create `CloseToLevelUp` badge component <!-- id: 7 -->
- [ ] Add notification preferences to user settings <!-- id: 8 -->
- [ ] Implement browser notification API integration <!-- id: 9 -->
- [ ] Add analytics tracking for notification engagement <!-- id: 10 -->

## Technical Requirements

### Level-Up Feed

```typescript
// src/features/xp/actions/feed.ts
export async function fetchRecentLevelUps(limit: number = 10) {
  const supabase = await createClient();
  
  // Find users who leveled up recently (last 7 days)
  const { data, error } = await supabase
    .from('xp_events')
    .select(`
      user_id,
      created_at,
      metadata,
      profiles:user_id (
        username,
        avatar_url,
        level
      )
    `)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return data;
}
```

### LevelUpFeed Component

```typescript
// src/features/xp/components/level-up-feed.tsx
export async function LevelUpFeed() {
  const levelUps = await fetchRecentLevelUps(10);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-400" />
        Recent Level Ups
      </h3>
      <div className="space-y-3">
        {levelUps.map((event) => (
          <div key={event.id} className="flex items-center gap-3 text-sm">
            <Avatar className="h-8 w-8">
              <AvatarImage src={event.profiles.avatar_url} />
              <AvatarFallback>{event.profiles.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link href={`/u/${event.profiles.username}`} className="font-semibold hover:underline">
                {event.profiles.username}
              </Link>
              <span className="text-muted-foreground"> reached </span>
              <span className="font-bold text-primary">Level {event.profiles.level}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

### Browser Push Notifications

```typescript
// src/features/xp/utils/notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export async function sendLevelUpNotification(level: number, tier: string) {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) return;
  
  new Notification('🎉 Level Up!', {
    body: `You've reached Level ${level} - ${tier}!`,
    icon: '/icons/level-up.png',
    badge: '/icons/badge.png',
    tag: 'level-up',
    requireInteraction: true,
  });
}
```

### Streak Warning

```typescript
// src/features/xp/components/streak-warning.tsx
export async function StreakWarning({ userId }: { userId: string }) {
  const profile = await fetchProfile(userId);
  
  if (!profile.last_login_at) return null;
  
  const daysSinceLogin = differenceInDays(new Date(), new Date(profile.last_login_at));
  
  // Show warning if 6+ days since last login
  if (daysSinceLogin < 6) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Streak at Risk! ⚠️</AlertTitle>
      <AlertDescription>
        You haven't logged in for {daysSinceLogin} days. 
        Your streak will reset if you don't log in by tomorrow!
      </AlertDescription>
    </Alert>
  );
}
```

### Close to Level Up Badge

```typescript
// src/features/xp/components/close-to-level-up.tsx
interface CloseToLevelUpProps {
  currentXP: number;
  currentLevel: number;
}

export function CloseToLevelUp({ currentXP, currentLevel }: CloseToLevelUpProps) {
  const xpForNext = getXPForLevel(currentLevel + 1);
  const xpNeeded = xpForNext - currentXP;
  
  // Only show if within 50 XP
  if (xpNeeded > 50) return null;
  
  return (
    <Alert className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50">
      <Sparkles className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">So Close!</AlertTitle>
      <AlertDescription>
        Only <strong>{xpNeeded} XP</strong> until Level {currentLevel + 1}!
      </AlertDescription>
    </Alert>
  );
}
```

### Notification Preferences

```typescript
// src/features/settings/components/notification-settings.tsx
export function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    levelUp: true,
    streakWarning: true,
    weeklyReport: true,
    leaderboardChange: false,
  });
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="levelUp">Level Up Notifications</Label>
            <p className="text-sm text-muted-foreground">Get notified when you level up</p>
          </div>
          <Switch 
            id="levelUp"
            checked={preferences.levelUp}
            onCheckedChange={(checked) => 
              setPreferences({...preferences, levelUp: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="streakWarning">Streak Warnings</Label>
            <p className="text-sm text-muted-foreground">Warning before streak resets</p>
          </div>
          <Switch 
            id="streakWarning"
            checked={preferences.streakWarning}
            onCheckedChange={(checked) => 
              setPreferences({...preferences, streakWarning: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="weeklyReport">Weekly XP Report</Label>
            <p className="text-sm text-muted-foreground">Weekly progress summary</p>
          </div>
          <Switch 
            id="weeklyReport"
            checked={preferences.weeklyReport}
            onCheckedChange={(checked) => 
              setPreferences({...preferences, weeklyReport: checked})
            }
          />
        </div>
      </div>
    </Card>
  );
}
```

## Architecture Compliance

- **Permissions**: Request notification permissions on user action
- **Preferences**: Stored in user settings (database)
- **Rate Limiting**: Max 5 notifications per day
- **Opt-Out**: Easy to disable via settings
- **Performance**: Feed cached for 5 minutes

## Testing Strategy

### Manual Testing
- Request notification permissions
- Trigger level-up notification
- Test streak warning at different day thresholds
- Toggle notification preferences

### Unit Tests
```typescript
describe('calculateStreakRisk', () => {
  it('returns no risk if logged in today', () => {
    const risk = calculateStreakRisk(new Date());
    expect(risk).toBe('none');
  });
  
  it('returns high risk if 6 days since login', () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const risk = calculateStreakRisk(sixDaysAgo);
    expect(risk).toBe('high');
  });
});
```

## Dev Notes

- Consider in-app notifications system like Discord
- Add sound effect for level-up notification
- Future: Email digest option
- Future: Mobile push notifications via PWA

## References

- [Web Push Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Service Worker for PWA](https://web.dev/learn/pwa/service-workers)
- Epic 8: Player XP and Leveling System
