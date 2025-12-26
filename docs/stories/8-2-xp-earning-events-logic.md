# Story 8.2: XP Earning Events & Logic

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 8

## Story

As a Developer,
I want to earn XP from daily logins, GitHub contributions, and bounty activities,
So that I'm rewarded for consistent engagement and platform participation.

## Acceptance Criteria

1. **Given** I log in for the first time today
2. **When** my profile loads
3. **Then** I earn 10 XP for daily login
4. **And** `last_login_at` and `last_xp_grant_date` are updated
5. **Given** I log in again the same day
6. **Then** I do NOT earn additional login XP
7. **Given** I have GitHub contributions today
8. **When** my contribution stats sync
9. **Then** I earn 5 XP per day with contributions
10. **Given** I submit a bounty
11. **Then** I earn 20 XP
12. **Given** my bounty submission is approved
13. **Then** I earn 50+ XP based on bounty value
14. **Given** I reach a streak milestone (7/30/90 days)
15. **Then** I earn bonus XP (50/200/500 respectively)

## Tasks/Subtasks

- [ ] Create `src/features/profiles/xp-system.ts` module <!-- id: 1 -->
- [ ] Implement `grantXP()` core function <!-- id: 2 -->
- [ ] Implement `checkAndGrantDailyLoginXP()` <!-- id: 3 -->
- [ ] Implement `checkAndGrantStreakBonuses()` <!-- id: 4 -->
- [ ] Implement `checkAndGrantContributionXP()` for GitHub contributions <!-- id: 5 -->
- [ ] Integrate into `fetchContributionStats()` for automatic sync <!-- id: 6 -->
- [ ] Integrate XP into `getProfile()` action for daily login <!-- id: 7 -->
- [ ] Integrate XP into bounty submission action <!-- id: 8 -->
- [ ] Integrate XP into bounty approval action <!-- id: 9 -->
- [ ] Add unit tests for all XP granting functions <!-- id: 10 -->
- [ ] Add integration tests for duplicate prevention <!-- id: 11 -->

## Technical Requirements

### Core Module: `src/features/profiles/xp-system.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export type XPEventType = 
  | 'daily_login'
  | 'github_contribution'
  | 'bounty_submission'
  | 'bounty_win'
  | 'streak_milestone'
  | 'profile_completion'
  | 'manual_adjustment';

export interface XPGrantResult {
  success: boolean;
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  xpGained: number;
  error?: string;
}

/**
 * Grant XP to a user and create an xp_event record.
 * Updates user's xp and level in profiles table.
 */
export async function grantXP(
  userId: string,
  eventType: XPEventType,
  amount: number,
  metadata: Record\u003cstring, any\u003e = {}
): Promise\u003cXPGrantResult\u003e {
  const supabase = await createClient();
  
  // 1. Fetch current user stats
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .single();
    
  if (profileError || !profile) {
    return { 
      success: false, 
      newXP: 0, 
      newLevel: 1, 
      leveledUp: false, 
      xpGained: 0,
      error: 'User not found' 
    };
  }
  
  // 2. Calculate new XP and level
  const currentXP = profile.xp || 0;
  const currentLevel = profile.level || 1;
  const newXP = currentXP + amount;
  const newLevel = calculateLevelFromXP(newXP);
  const leveledUp = newLevel \u003e currentLevel;
  
  // 3. Create xp_event record
  const { error: eventError } = await supabase
    .from('xp_events')
    .insert({
      user_id: userId,
      event_type: eventType,
      xp_amount: amount,
      metadata
    });
    
  if (eventError) {
    console.error('Failed to create xp_event:', eventError);
    return { 
      success: false, 
      newXP: currentXP, 
      newLevel: currentLevel, 
      leveledUp: false, 
      xpGained: 0,
      error: 'Failed to record XP event' 
    };
  }
  
  // 4. Update user's xp and level
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ xp: newXP, level: newLevel })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Failed to update profile XP:', updateError);
    return { 
      success: false, 
      newXP: currentXP, 
      newLevel: currentLevel, 
      leveledUp: false, 
      xpGained: 0,
      error: 'Failed to update profile' 
    };
  }
  
  return {
    success: true,
    newXP,
    newLevel,
    leveledUp,
    xpGained: amount
  };
}

/**
 * Check if user qualifies for daily login XP and grant if eligible.
 */
export async function checkAndGrantDailyLoginXP(
  userId: string
): Promise\u003cXPGrantResult | null\u003e {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_xp_grant_date')
    .eq('id', userId)
    .single();
    
  if (!profile) return null;
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastGrantDate = profile.last_xp_grant_date;
  
  // Only grant if different day
  if (lastGrantDate === today) {
    return null; // Already granted today
  }
  
  // Update last_login_at and last_xp_grant_date
  await supabase
    .from('profiles')
    .update({
      last_login_at: new Date().toISOString(),
      last_xp_grant_date: today
    })
    .eq('id', userId);
  
  // Grant daily login XP
  return await grantXP(userId, 'daily_login', 10, { date: today });
}

/**
 * Check if user reached new streak milestones and grant bonuses.
 */
export async function checkAndGrantStreakBonuses(
  userId: string,
  currentStreak: number
): Promise\u003cXPGrantResult[]\u003e {
  const supabase = await createClient();
  const results: XPGrantResult[] = [];
  
  // Define milestones
  const milestones = [
    { days: 7, xp: 50, tier: 'bronze' },
    { days: 30, xp: 200, tier: 'silver' },
    { days: 90, xp: 500, tier: 'gold' }
  ];
  
  for (const milestone of milestones) {
    if (currentStreak \u003e= milestone.days) {
      // Check if already awarded this milestone
      const { data: existing } = await supabase
        .from('xp_events')
        .select('id')
        .eq('user_id', userId)
        .eq('event_type', 'streak_milestone')
        .contains('metadata', { streak_length: milestone.days })
        .limit(1);
      
      if (!existing || existing.length === 0) {
        // Grant milestone bonus
        const result = await grantXP(
          userId,
          'streak_milestone',
          milestone.xp,
          {
            streak_length: milestone.days,
            milestone_tier: milestone.tier
          }
        );
        results.push(result);
      }
    }
  }
  
  return results;
}

/**
 * Check for new GitHub contribution days and grant XP.
 * Leverages existing GitHub sync mechanism from Epic 7.
 */
export async function checkAndGrantContributionXP(
  userId: string,
  contributionStats: GithubContributionCalendar | null
): Promise<XPGrantResult[]> {
  if (!contributionStats || !contributionStats.weeks) {
    return [];
  }

  const supabase = await createClient();
  const results: XPGrantResult[] = [];
  
  // 1. Get last XP grant date for contributions
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_xp_grant_date')
    .eq('id', userId)
    .single();
  
  const lastGrantDate = profile?.last_xp_grant_date 
    ? new Date(profile.last_xp_grant_date) 
    : null;
  
  // 2. Flatten all contribution days from GitHub calendar
  const allDays = contributionStats.weeks
    .flatMap(week => week.contributionDays)
    .filter(day => day.contributionCount > 0); // Only days with contributions
  
  // 3. Filter for days AFTER last grant (to avoid duplicates)
  const newContributionDays = allDays.filter(day => {
    if (!lastGrantDate) return true; // Grant for all if never granted before
    return new Date(day.date) > lastGrantDate;
  });
  
  // 4. Grant XP for each new contribution day (5 XP per day)
  for (const day of newContributionDays) {
    const result = await grantXP(
      userId, 
      'github_contribution', 
      XP_RATES.GITHUB_CONTRIBUTION_PER_DAY, 
      {
        date: day.date,
        contribution_count: day.contributionCount
      }
    );
    results.push(result);
  }
  
  return results;
}

```

### XP Rates Configuration

```typescript
export const XP_RATES = {
  DAILY_LOGIN: 10,
  GITHUB_CONTRIBUTION_PER_DAY: 5,
  BOUNTY_SUBMISSION: 20,
  BOUNTY_WIN_BASE: 50,
  PROFILE_COMPLETION: 30,
  STREAK_MILESTONES: {
    7: 50,   // 1 week
    30: 200, // 1 month
    90: 500  // 3 months
  }
} as const;

/**
 * Calculate bonus XP for bounty wins based on value.
 * Formula: base 50 XP + (bounty_value / 10) bonus
 */
export function calculateBountyWinXP(bountyValue: number): number {
  const base = XP_RATES.BOUNTY_WIN_BASE;
  const bonus = Math.floor(bountyValue / 10);
  return base + bonus;
}
```

### Integration Points

#### Daily Login (in `src/features/profiles/actions.ts`)

```typescript
export async function getProfile(): Promise\u003c{ data?: ProfileData; error?: string }\u003e {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check and grant daily login XP
  await checkAndGrantDailyLoginXP(user.id);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
```

#### Bounty Submission (in `src/features/bounty-board/actions.ts`)

```typescript
// After successful submission
await grantXP(userId, 'bounty_submission', XP_RATES.BOUNTY_SUBMISSION, {
  bounty_id: bounty.id,
  bounty_slug: bounty.slug
});
```

#### Bounty Win (in `src/features/bounty-board/actions.ts`)

```typescript
// After approving submission
const xpAmount = calculateBountyWinXP(submission.bounty_reward);
await grantXP(userId, 'bounty_win', xpAmount, {
  bounty_id: submission.bounty_id,
  bounty_value: submission.bounty_reward
});
```

## GitHub Contribution XP Integration

### Overview

GitHub contribution XP leverages the **existing sync mechanism from Epic 7** (Contribution Stats). No additional GitHub API calls are needed - we piggyback on the contribution stats refresh that already happens when users view their profiles.

### How It Works

#### 1. Data Source: Existing `contribution_stats` Column

The `profiles.contribution_stats` JSONB column already caches GitHub contribution calendar data:

```json
{
  "totalContributions": 1250,
  "weeks": [
    {
      "contributionDays": [
        { "date": "2024-12-23", "contributionCount": 5, "color": "#9be9a8" },
        { "date": "2024-12-24", "contributionCount": 0, "color": "#ebedf0" },
        { "date": "2024-12-25", "contributionCount": 12, "color": "#40c463" }
      ]
    }
  ]
}
```

#### 2. Sync Trigger: Profile View

When a user views their own profile, `fetchContributionStats()` refreshes GitHub data (if > 1 hour old):

```typescript
// In src/features/profiles/actions.ts (lines 428-488)
export async function fetchContributionStats(username: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch profile and cached contribution stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, contribution_stats, portfolio_synced_at")
    .eq("username", username)
    .single();
  
  let statsData = profile.contribution_stats;
  
  // If viewing OWN profile, refresh from GitHub API
  if (user && user.id === profile.id) {
    const lastSync = profile.portfolio_synced_at ? new Date(profile.portfolio_synced_at) : null;
    const now = new Date();
    const shouldRefresh = !statsData || !lastSync || (now.getTime() - lastSync.getTime() > 3600000); // 1 hour
    
    if (shouldRefresh) {
      // Fetch fresh data from GitHub GraphQL API
      const { data: liveData } = await fetchGithubStats();
      
      if (liveData && liveData.contributionCalendar) {
        const newStats = {
          totalContributions: liveData.totalContributions,
          weeks: liveData.contributionCalendar
        };
        
        // Update cached stats in database
        await supabase
          .from("profiles")
          .update({
            contribution_stats: newStats,
            portfolio_synced_at: new Date().toISOString()
          })
          .eq("id", user.id);
        
        statsData = newStats;
      }
    }
    
    // NEW: After syncing, grant XP for new contribution days
    await checkAndGrantContributionXP(user.id, statsData);
  }
  
  // Calculate and return contribution stats
  return { data: calculateContributionStats(statsData) };
}
```

#### 3. XP Grant Logic

After GitHub data syncs, `checkAndGrantContributionXP()` scans for new contribution days:

```typescript
// Pseudocode flow
1. Get user's last_xp_grant_date from database
2. Flatten all contribution days from GitHub calendar
3. Filter days that are AFTER last_xp_grant_date
4. For each new day with contributions:
   - Grant 5 XP
   - Record xp_event with date and contribution count
5. Update last_xp_grant_date to most recent contribution date
```

### Duplicate Prevention Strategy

**Method 1: Track Last Grant Date (Recommended)**

Use the `last_xp_grant_date` column to filter out already-processed days:

```typescript
// Only grant XP for days after this date
const newDays = allDays.filter(day => {
  return new Date(day.date) > new Date(lastGrantDate);
});
```

**Why this works:**
- Simple and efficient (one date comparison)
- No complex queries needed
- Handles edge cases (user doesn't visit for weeks)

**Method 2: Query xp_events Table (Alternative)**

Check if XP was already granted for a specific date:

```typescript
async function hasAlreadyGrantedXPForDate(userId: string, date: string) {
  const { data } = await supabase
    .from('xp_events')
    .select('id')
    .eq('user_id', userId)
    .eq('event_type', 'github_contribution')
    .contains('metadata', { date })
    .limit(1);
  
  return data && data.length > 0;
}
```

**Trade-off:** More precise but requires N queries (one per contribution day).

**Recommendation:** Use Method 1 (last_xp_grant_date) for performance.

### Implementation Flow Diagram

```
┌─────────────┐
│ User visits │
│   profile   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ fetchContributionStats()     │
│ - Check if > 1 hour old     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Fetch from GitHub API        │
│ (if refresh needed)          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Update contribution_stats    │
│ in database (JSONB)          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ checkAndGrantContributionXP()│
│ - Get last_xp_grant_date    │
│ - Filter new contribution   │
│   days since last grant     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ For each new day:            │
│ - grantXP(5 XP)             │
│ - Create xp_event record    │
│ - Update profile.xp         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Return contribution stats    │
│ + updated XP to frontend     │
└─────────────────────────────┘
```

### Example Scenario

**Day 1 (Dec 23, 2024):**
- User makes 5 GitHub commits
- User visits KrackedDevs profile → sync triggers
- `fetchGithubStats()` fetches contribution calendar
- `checkAndGrantContributionXP()` finds Dec 23 with 5 contributions
- System grants **5 XP** for Dec 23
- `last_xp_grant_date` = "2024-12-23"
- **XP Event Created:**
  ```json
  {
    "event_type": "github_contribution",
    "xp_amount": 5,
    "metadata": { "date": "2024-12-23", "contribution_count": 5 }
  }
  ```

**Day 2 (Dec 24, 2024):**
- User makes 3 commits
- User does **NOT** visit profile → no sync
- XP is **pending** (will be granted next time they visit)

**Day 3 (Dec 25, 2024):**
- User makes 12 commits
- User visits profile again → sync triggers
- GitHub API returns contribution data for Dec 24 and Dec 25
- `checkAndGrantContributionXP()` filters days after "2024-12-23"
- System grants **5 XP** for Dec 24 + **5 XP** for Dec 25 = **10 XP total**
- `last_xp_grant_date` = "2024-12-25"
- **Two XP Events Created**

**Result:** User earns **5 XP per day** they had contributions, regardless of how many commits (1 commit or 100 commits = same XP).

### Edge Cases Handled

1. **User doesn't visit profile for weeks:**
   - All pending contribution days processed on next visit
   - No XP lost (retroactive granting)

2. **User has no GitHub contributions:**
   - `checkAndGrantContributionXP()` returns empty array
   - No XP granted, no errors

3. **Sync fails (GitHub API error):**
   - XP granting skipped gracefully
   - Will retry on next profile visit

4. **First-time user (never granted XP before):**
   - `last_xp_grant_date` is NULL
   - All historical contributions in calendar granted (up to last year)
   - **Note:** May want to limit to last 30 days to avoid retroactive windfalls

### Preventing Retroactive XP Windfalls

**Problem:** New users might get massive XP if we grant for entire year of contributions.

**Solution:** Add date filter in `checkAndGrantContributionXP()`:

```typescript
// Only grant XP for contributions in last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const newContributionDays = allDays.filter(day => {
  const dayDate = new Date(day.date);
  
  // Must be after last grant AND within last 30 days
  if (lastGrantDate) {
    return dayDate > new Date(lastGrantDate);
  } else {
    // First time granting - limit to last 30 days
    return dayDate > thirtyDaysAgo;
  }
});
```

### Performance Considerations

- **No additional GitHub API calls** - uses existing sync mechanism
- **Efficient filtering** - single date comparison per day
- **Batch XP grants** - processes all pending days in one profile view
- **Rate limiting** - GitHub sync already throttled to 1 hour

### Future Enhancement: Scheduled Background Sync

For real-time XP (optional future feature):

```typescript
// Supabase Edge Function - runs daily at midnight
export async function syncAllUsersGitHubXP() {
  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .not('github_access_token', 'is', null);
  
  for (const user of users) {
    const stats = await fetchGithubStatsForUser(user.id);
    await checkAndGrantContributionXP(user.id, stats);
  }
}
```

**Trade-offs:**
- ✅ Real-time XP grants
- ❌ More complex infrastructure
- ❌ GitHub API rate limits (5000 requests/hour)

**Recommendation:** Stick with profile-view sync for MVP. Background sync can be added later if needed.

## Testing Strategy


### Unit Tests (`xp-system.test.ts`)

```typescript
describe('grantXP', () =\u003e {
  it('should grant XP and create event record', async () =\u003e {
    const result = await grantXP('user-123', 'daily_login', 10);
    expect(result.success).toBe(true);
    expect(result.xpGained).toBe(10);
  });
  
  it('should handle level up correctly', async () =\u003e {
    // Set user to 95 XP (5 away from level 2)
    const result = await grantXP('user-123', 'bounty_submission', 20);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
  });
});

describe('checkAndGrantDailyLoginXP', () =\u003e {
  it('should grant XP on first login of day', async () =\u003e {
    const result = await checkAndGrantDailyLoginXP('user-123');
    expect(result).not.toBeNull();
    expect(result?.xpGained).toBe(10);
  });
  
  it('should not grant XP on second login same day', async () =\u003e {
    await checkAndGrantDailyLoginXP('user-123');
    const result = await checkAndGrantDailyLoginXP('user-123');
    expect(result).toBeNull();
  });
});
```

### Manual Testing

- Create new user, verify 0 XP initially
- Login → should gain 10 XP
- Login again same day → no additional XP
- Submit bounty → gain 20 XP
- Admin approves bounty → gain 50+ XP
- Check xp_events table for all records

## Architecture Compliance

- **Server Actions Only**: All XP granting happens server-side
- **Type Safety**: TypeScript interfaces for all XP types
- **Database Transactions**: XP events and profile updates are atomic
- **Feature Sliced**: XP system in `src/features/profiles/`
- **Validation**: Server-side checks prevent duplicate grants

## Dev Notes

- Daily login XP uses DATE comparison (not timestamp) to handle timezones
- Streak bonuses only granted once per milestone (idempotent)
- Bounty win XP scales with value to reward high-value bounties
- All XP calculations happen server-side to prevent tampering

## References

- Story 8.1: XP Tracking Infrastructure
- Story 8.3: Level Progression System
- Epic 8: Player XP and Leveling System
