# Story 8.5: Leaderboards & Rankings

Status: backlog
priority: must-have
assignee: antique_gravity
epic: 8
story_points: 8

## Story

As a Developer,
I want to see how I rank against other community members,
So that I'm motivated to level up and compete with peers.

## Acceptance Criteria

1. **Given** I visit the leaderboard page
2. **When** the page loads
3. **Then** I see the top 100 users ranked by XP
4. **And** I see my own rank highlighted
5. **Given** I'm viewing the leaderboard
6. **When** I switch between tabs (Week, All-Time, By Skill)
7. **Then** the rankings update accordingly
8. **And** Data loads within 2 seconds
9. **Given** I'm logged in
10. **When** I view my profile
11. **Then** I see a "Your Rank" widget showing my global position
12. **And** The widget updates when my rank changes

## Tasks/Subtasks

- [ ] Create `/leaderboard` page route <!-- id: 1 -->
- [ ] Create server action `fetchLeaderboard(timeframe, skill?)` <!-- id: 2 -->
- [ ] Build `LeaderboardTable` component <!-- id: 3 -->
- [ ] Build `LeaderboardTabs` component (Week/All-Time/Skills) <!-- id: 4 -->
- [ ] Create `YourRankWidget` component for profile <!-- id: 5 -->
- [ ] Add database indexes for leaderboard queries <!-- id: 6 -->
- [ ] Implement caching strategy (15-min cache) <!-- id: 7 -->
- [ ] Add pagination for leaderboards (top 100 per page) <!-- id: 8 -->
- [ ] Style with cyberpunk theme <!-- id: 9 -->
- [ ] Add unit tests for ranking logic <!-- id: 10 -->

## Technical Requirements

### Database Queries

#### All-Time Leaderboard
```typescript
export async function fetchLeaderboard(
  timeframe: 'week' | 'all-time' = 'all-time',
  skill?: string,
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('profiles')
    .select('id, username, avatar_url, level, xp, developer_role, stack')
    .order('xp', { ascending: false })
    .limit(limit);
  
  if (skill) {
    query = query.contains('stack', [skill]);
  }
  
  const { data, error } = await query;
  
  // Add rank numbers
  return data?.map((entry, index) => ({
    ...entry,
    rank: index + 1
  })) || [];
}
```

#### Weekly Leaderboard
```typescript
export async function fetchWeeklyLeaderboard(limit: number = 100) {
  const supabase = await createClient();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  // Aggregate XP from last 7 days
  const { data, error } = await supabase
    .rpc('get_weekly_leaderboard', { limit_count: limit });
  
  return data;
}
```

#### Database Function (Postgres)
```sql
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_count INT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  level INT,
  weekly_xp BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.level,
    COALESCE(SUM(xe.xp_amount), 0) AS weekly_xp,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(xe.xp_amount), 0) DESC) AS rank
  FROM profiles p
  LEFT JOIN xp_events xe ON p.id = xe.user_id
    AND xe.created_at >= NOW() - INTERVAL '7 days'
  GROUP BY p.id, p.username, p.avatar_url, p.level
  ORDER BY weekly_xp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### UI Components

#### LeaderboardPage
```typescript
// src/app/leaderboard/page.tsx
export default async function LeaderboardPage() {
  const { data: allTimeData } = await fetchLeaderboard('all-time');
  const { data: weeklyData } = await fetchWeeklyLeaderboard();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 neon-text">Leaderboard</h1>
      <LeaderboardTabs 
        allTimeData={allTimeData}
        weeklyData={weeklyData}
      />
    </div>
  );
}
```

#### LeaderboardTable Component
```typescript
interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ data, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {data.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border",
            entry.id === currentUserId && "bg-primary/10 border-primary"
          )}
        >
          {/* Rank */}
          <div className="text-2xl font-bold w-12 text-center">
            {entry.rank <= 3 ? (
              <span className="text-yellow-400">🏆</span>
            ) : (
              `#${entry.rank}`
            )}
          </div>
          
          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={entry.avatar_url} />
            <AvatarFallback>{entry.username?.[0]}</AvatarFallback>
          </Avatar>
          
          {/* User info */}
          <div className="flex-1">
            <Link href={`/u/${entry.username}`} className="font-semibold hover:underline">
              {entry.username}
            </Link>
            <div className="text-sm text-muted-foreground">{entry.developer_role}</div>
          </div>
          
          {/* Level & XP */}
          <div className="text-right">
            <div className="text-lg font-bold">Level {entry.level}</div>
            <div className="text-sm text-muted-foreground">{entry.xp.toLocaleString()} XP</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### YourRankWidget
```typescript
export async function YourRankWidget({ userId }: { userId: string }) {
  const rank = await getUserRank(userId);
  
  if (!rank) return null;
  
  return (
    <Card className="p-6 border-primary/20">
      <h3 className="text-lg font-semibold mb-2">Your Rank</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-primary">#{rank.global_rank}</span>
        <span className="text-muted-foreground">/ {rank.total_users}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Top {Math.round((rank.global_rank / rank.total_users) * 100)}% globally
      </p>
      <Button variant="outline" className="mt-4 w-full" asChild>
        <Link href="/leaderboard">View Full Leaderboard</Link>
      </Button>
    </Card>
  );
}
```

### Performance Optimizations

#### Caching Strategy
```typescript
// Cache for 15 minutes using React cache
import { unstable_cache } from 'next/cache';

export const getCachedLeaderboard = unstable_cache(
  async (timeframe: 'week' | 'all-time') => {
    return await fetchLeaderboard(timeframe);
  },
  ['leaderboard'],
  { revalidate: 900 } // 15 minutes
);
```

#### Database Indexes
```sql
-- Add index for leaderboard queries
CREATE INDEX IF NOT EXISTS profiles_xp_level_idx ON profiles(xp DESC, level DESC);

-- Add index for weekly XP aggregation
CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events(created_at DESC);
```

## Architecture Compliance

- **Server Components**: Leaderboard page uses RSC for SEO
- **Caching**: 15-min cache to reduce DB load
- **Pagination**: Top 100 per page to limit data transfer
- **RLS**: Ranks visible to all (public data)
- **Performance**: Indexed queries, materialized views for scale

## Testing Strategy

### Unit Tests
```typescript
describe('fetchLeaderboard', () => {
  it('should return top 100 users by XP', async () => {
    const data = await fetchLeaderboard('all-time', undefined, 100);
    expect(data).toHaveLength(100);
    expect(data[0].xp >= data[1].xp).toBe(true);
  });
  
  it('should filter by skill', async () => {
    const data = await fetchLeaderboard('all-time', 'react');
    expect(data.every(u => u.stack?.includes('react'))).toBe(true);
  });
});
```

### Manual Testing
- View leaderboard as logged-out user
- View leaderboard as logged-in user (see your rank highlighted)
- Switch between Weekly/All-Time tabs
- Filter by different skills
- Check performance with 1000+ users

## Dev Notes

- Consider weekly snapshot materialized view for scale
- Add "Rising Stars" section for users with biggest weekly XP gains
- Future: Add country/city filters
- Future: Add team/company leaderboards

## References

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [PostgreSQL Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- Epic 8: Player XP and Leveling System
