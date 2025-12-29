# Story 7.2: Dev-Pulse Visualization

Status: done

## Story

As a Developer,
I want to see a "dev-pulse" visualization of my coding activity,
So that I can quickly assess my coding health over different time periods.

## Acceptance Criteria

1. **Given** a user has GitHub contribution data (cached or live)
2. **When** viewing their profile
3. **Then** display a "Dev-Pulse" visualization with:
   - **Weekly Pulse**: Activity chart for last 7 days
   - **Monthly Pulse**: Activity trend for last 30 days
   - **Yearly Pulse**: Activity overview for last 12 months
4. **And** user can toggle between timeframes via tabs/buttons
5. **And** the visualization uses a "heartbeat" or "pulse" aesthetic
6. **And** colors match the cyberpunk theme (green primary, cyan accents)
7. **Given** user has no GitHub data
8. **Then** show placeholder with connect GitHub CTA

## Tasks/Subtasks

- [ ] Add `DevPulseData` type in `src/features/profiles/types.ts` <!-- id: 1 -->
- [ ] Implement `processDevPulseData()` utility to aggregate contribution data <!-- id: 2 -->
- [ ] Create `DevPulse` component with tab navigation <!-- id: 3 -->
- [ ] Implement SVG-based pulse/wave line chart <!-- id: 4 -->
- [ ] Add animated pulse glow effect on the line <!-- id: 5 -->
- [ ] Integrate into `ProfileDetails` component <!-- id: 6 -->
- [ ] Integrate into `PublicProfileDetails` component <!-- id: 7 -->
- [ ] Test responsiveness on mobile <!-- id: 8 -->

## Technical Requirements

### Database Schema (Existing)

Uses the same `contribution_stats` JSONB column from Story 7.1:

```sql
contribution_stats JSONB
-- Contains 52 weeks of contribution data with daily breakdowns
-- {
--   "weeks": [{
--     "contributionDays": [
--       {"date": "2024-12-22", "color": "#ebedf0", "contributionCount": 0},
--       ...
--     ]
--   }, ...]
-- }
```

### Type Definition (`types.ts`)

```typescript
export type DevPulseDataPoint = {
  label: string;    // Date string or week label
  count: number;    // Contribution count
};

export type DevPulseData = {
  weekly: DevPulseDataPoint[];   // Last 7 days, daily
  monthly: DevPulseDataPoint[];  // Last 30 days, daily
  yearly: DevPulseDataPoint[];   // Last 52 weeks, weekly aggregates
};
```

### Data Processing

```typescript
function processDevPulseData(weeks: GithubContributionWeek[]): DevPulseData {
  const allDays = weeks.flatMap(week => week.contributionDays);
  
  // Weekly: last 7 days
  const weekly = allDays.slice(-7).map(day => ({
    label: new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
    count: day.contributionCount
  }));
  
  // Monthly: last 30 days
  const monthly = allDays.slice(-30).map(day => ({
    label: new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    count: day.contributionCount
  }));
  
  // Yearly: aggregate by week
  const yearly = weeks.map((week, i) => ({
    label: `W${i + 1}`,
    count: week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0)
  }));
  
  return { weekly, monthly, yearly };
}
```

### Component Design

```
┌─────────────────────────────────────────────────┐
│  Dev-Pulse                                      │
│  ┌───────┬──────────┬─────────┐                │
│  │ Week  │  Month   │  Year   │  (tabs)        │
│  └───────┴──────────┴─────────┘                │
│                                                 │
│     ╱╲      ╱╲╱╲                               │
│    ╱  ╲    ╱    ╲     ╱╲                       │
│   ╱    ╲──╱      ╲───╱  ╲───                   │
│  ──                          ───────           │
│  Mon Tue Wed Thu Fri Sat Sun                   │
└─────────────────────────────────────────────────┘
```

### SVG Implementation

```tsx
// Simple SVG path approach (no external library needed)
function PulseLine({ data }: { data: DevPulseDataPoint[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const width = 300;
  const height = 80;
  
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.count / maxCount) * height * 0.8
  }));
  
  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <path
        d={pathD}
        fill="none"
        stroke="url(#pulseGradient)"
        strokeWidth="2"
        className="animate-pulse-glow"
      />
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

### Animation CSS

```css
@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8)); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

## Architecture Compliance

- **Component Location**: `src/features/profiles/components/dev-pulse.tsx`
- **Data Source**: Reuse `contribution_stats` from profiles table (no additional API calls)
- **No External Chart Library**: Use native SVG for lightweight implementation
- **State Management**: Local `useState` for active tab

## Dev Notes

- **Performance**: Process data client-side from already-fetched contribution stats
- SVG viewBox should be responsive
- Ensure accessibility: add ARIA labels for chart
- Consider smooth Bezier curves instead of straight lines for aesthetic

### References

- [Story 7.1: Profile Contribution Stats](docs/stories/7-1-profile-contribution-stats.md)
- [SVG Path Animation Techniques](https://css-tricks.com/svg-line-animation-works/)
- Database column: `profiles.contribution_stats` (JSONB)
