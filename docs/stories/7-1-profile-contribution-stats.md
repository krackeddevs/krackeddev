# Story 7.1: Profile Contribution Stats

Status: done
priority: high
assignee: antique_gravity

## Story

As a Developer,
I want to see my contribution streaks and weekly activity on my profile,
So that I can track my coding consistency and showcase my dedication.

## Acceptance Criteria

1. **Given** a user has connected their GitHub account
2. **When** viewing their profile (`/profile/view`) or public profile (`/u/[username]`)
3. **Then** display "Current Streak" (consecutive days with contributions)
4. **And** display "Longest Streak" (all-time record of consecutive contribution days)
5. **And** display "Contributions This Week" (Monday-Sunday count)
6. **And** use cyberpunk-themed visual indicators (green glow for active streaks)
7. **Given** a user has NOT connected GitHub
8. **Then** show graceful fallback message with option to connect

## Tasks/Subtasks

- [ ] Add `ContributionStats` type in `src/features/profiles/types.ts` <!-- id: 1 -->
- [ ] Implement `calculateContributionStats()` utility function <!-- id: 2 -->
- [ ] Create `fetchContributionStats` action using cached `contribution_stats` column <!-- id: 3 -->
- [ ] Create `ContributionStats` component in `src/features/profiles/components/contribution-stats.tsx` <!-- id: 4 -->
- [ ] Integrate into `ProfileDetails` component <!-- id: 5 -->
- [ ] Integrate into `PublicProfileDetails` component <!-- id: 6 -->
- [ ] Add unit tests for streak calculation edge cases <!-- id: 7 -->

## Technical Requirements

### Database Schema (Existing)

The `profiles` table already has a `contribution_stats` JSONB column that caches GitHub contribution data:

```sql
contribution_stats JSONB
-- Example structure:
-- {
--   "weeks": [{
--     "contributionDays": [
--       {"date": "2024-12-22", "color": "#ebedf0", "contributionCount": 0},
--       {"date": "2024-12-23", "color": "#9be9a8", "contributionCount": 5},
--       ...
--     ]
--   }, ...]
-- }
```

This data is synced when `portfolio_synced_at` is updated.

### Type Definition (`types.ts`)

```typescript
export type ContributionStats = {
  currentStreak: number;      // Consecutive days with contributions, counting backwards from today
  longestStreak: number;      // All-time record of consecutive contribution days
  contributionsThisWeek: number;  // Monday-Sunday of current week
  lastContributionDate: string | null;  // ISO date of most recent contribution
};
```

### Data Source Strategy

| Context | Data Source | Notes |
|:--------|:------------|:------|
| Own Profile (logged in) | Live GitHub API via `fetchGithubStats` | Real-time data |
| Public Profile View | Cached `contribution_stats` from DB | No API call needed |
| Mini Profile on Landing | Cached from DB | Fast loading |

### Streak Calculation Logic

```typescript
function calculateContributionStats(weeks: GithubContributionWeek[]): ContributionStats {
  // Flatten all days from weeks array
  const allDays = weeks.flatMap(week => week.contributionDays);
  
  // Sort by date descending
  allDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate current streak (count from today/yesterday backwards)
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  // ... logic to count consecutive days
  
  // Calculate longest streak (scan all days)
  let longestStreak = 0;
  let tempStreak = 0;
  // ... logic to find max consecutive days
  
  // Calculate this week (filter current week)
  const weekStart = getMonday(new Date());
  const contributionsThisWeek = allDays
    .filter(day => new Date(day.date) >= weekStart)
    .reduce((sum, day) => sum + day.contributionCount, 0);
  
  return { currentStreak, longestStreak, contributionsThisWeek, lastContributionDate };
}
```

### Component Design

```
┌─────────────────────────────────────────────────┐
│  Contribution Stats                             │
├───────────────┬───────────────┬─────────────────┤
│  🔥 12        │  🏆 45        │  📊 23          │
│  Current      │  Longest      │  This Week      │
│  Streak       │  Streak       │                 │
└───────────────┴───────────────┴─────────────────┘
```

- Use 3-column card layout for stats
- Flame emoji 🔥 for active streaks (> 0)
- Animated counter on load (count up effect)
- Cyberpunk glow effect for non-zero values

## Architecture Compliance

- **Server Actions**: `fetchContributionStats(userId)` in `src/features/profiles/actions.ts`
- **Database**: Read from `profiles.contribution_stats` JSONB column
- **Feature Sliced**: Component in `src/features/profiles/components/`
- **Type Safety**: Use TypeScript interfaces, no `any` types

## Dev Notes

- **Performance Win**: Using cached `contribution_stats` avoids GitHub API rate limits for public profiles
- Timezone consideration: Use UTC for consistency with GitHub API
- Edge cases to test: 
  - No contributions ever (`contribution_stats` is null)
  - Single day contribution
  - Broken streak (missed yesterday)
  - Weekend contributions

### References

- [GitHub GraphQL API - Contribution Calendar](https://docs.github.com/en/graphql/reference/queries#user)
- [Story 3.2: GitHub Stats Integration](docs/stories/3-2-github-stats-integration.md)
- Database column: `profiles.contribution_stats` (JSONB)
