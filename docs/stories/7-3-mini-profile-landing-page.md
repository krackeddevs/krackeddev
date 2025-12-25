# Story 7.3: Mini Profile on Landing Page

Status: backlog

## Story

As a Logged-in User,
I want to see my mini profile on the landing page,
So that I feel immediately recognized and can quickly access my profile.

## Acceptance Criteria

1. **Given** a user is logged in
2. **When** viewing the landing page
3. **Then** display a mini profile card showing:
   - User avatar
   - Username
   - Developer role/class
   - Quick stats (Bounties Won, Current Streak)
4. **And** clicking the card navigates to `/profile/view`
5. **Given** a user is NOT logged in
6. **Then** the mini profile card should NOT be visible
7. **And** the mini profile should be positioned accessibly (above navigation hub)
8. **And** the component should be mobile responsive

## Tasks/Subtasks

- [ ] Create `MiniProfile` component in `src/features/landingpage/components/mini-profile.tsx` <!-- id: 1 -->
- [ ] Fetch minimal user data from server component <!-- id: 2 -->
- [ ] Calculate quick stats (wins from bounty_submissions, streak from contribution_stats) <!-- id: 3 -->
- [ ] Add click navigation to full profile <!-- id: 4 -->
- [ ] Integrate into landing page layout conditionally <!-- id: 5 -->
- [ ] Style with cyberpunk theme (glow effects, dark card) <!-- id: 6 -->
- [ ] Test mobile responsiveness <!-- id: 7 -->
- [ ] Verify hidden state when logged out <!-- id: 8 -->

## Technical Requirements

### Database Queries

Fetch from `profiles` table (single query):

```sql
SELECT 
  avatar_url, 
  username, 
  developer_role,
  contribution_stats  -- For streak calculation
FROM profiles 
WHERE id = $user_id;
```

Plus bounty wins count:

```sql
SELECT COUNT(*) as wins 
FROM bounty_submissions 
WHERE user_id = $user_id AND status = 'approved';
```

### Component Props

```typescript
interface MiniProfileProps {
  avatarUrl: string | null;
  username: string | null;
  developerRole: string | null;
  bountiesWon: number;
  currentStreak: number;  // Calculated from contribution_stats
}
```

### Data Fetching

Create a new action `fetchMiniProfileData(userId)`:

```typescript
export async function fetchMiniProfileData(userId: string) {
  const supabase = await createClient();
  
  // Fetch profile with contribution_stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, username, developer_role, contribution_stats')
    .eq('id', userId)
    .single();
  
  // Fetch bounty wins count
  const { count: bountiesWon } = await supabase
    .from('bounty_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved');
  
  // Calculate streak from cached contribution_stats
  const currentStreak = calculateCurrentStreak(profile?.contribution_stats?.weeks || []);
  
  return {
    ...profile,
    bountiesWon: bountiesWon || 0,
    currentStreak
  };
}
```

### Component Design

```
┌──────────────────────────────────┐
│  [Avatar]  @username             │
│            Fullstack Developer   │
│  ──────────────────────────────  │
│  🏆 3 Wins    🔥 12 Day Streak   │
└──────────────────────────────────┘
```

### Styling

```tsx
<div className="
  bg-black/60 backdrop-blur-md 
  border border-green-500/30 
  rounded-lg p-4
  hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]
  transition-all duration-300
  cursor-pointer
">
  {/* Avatar with ring */}
  <div className="w-12 h-12 rounded-full ring-2 ring-green-500/50">
    <Image src={avatarUrl} ... />
  </div>
  
  {/* Stats row */}
  <div className="flex gap-4 text-xs font-mono">
    <span className="text-green-400">🏆 {bountiesWon} Wins</span>
    <span className="text-orange-400">🔥 {currentStreak} Streak</span>
  </div>
</div>
```

### Positioning

- Place as floating card on right side of viewport
- Or integrate above `NavigationHub` section
- Z-index: 30 (below modal overlays)
- Mobile: Full width, positioned below hero

## Architecture Compliance

- **Component Location**: `src/features/landingpage/components/mini-profile.tsx`
- **Server Component Data**: Pass data as props from `src/app/page.tsx`
- **Client Interactivity**: Use `"use client"` for click handler
- **Feature Boundaries**: Import types from `src/features/profiles/types.ts`
- **Database Access**: Use existing patterns from profiles actions

## Dev Notes

- **Performance**: Single query + count query (fast)
- **Cached Data**: Use `contribution_stats` from DB, no GitHub API call
- Consider skeleton loading state briefly
- Avatar fallback if null

### References

- [Story 7.1: Profile Contribution Stats](docs/stories/7-1-profile-contribution-stats.md)
- [src/features/landingpage/page.tsx](file:///Users/fadlikhalid/Documents/Work/krackeddev/repo/krackeddev/src/features/landingpage/page.tsx)
- Database columns: `profiles.contribution_stats`, `profiles.avatar_url`, `profiles.username`
