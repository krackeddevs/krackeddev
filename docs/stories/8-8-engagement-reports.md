# Story 8.8: Engagement Reports & Surprises

Status: backlog
priority: nice-to-have
assignee: antique_gravity
epic: 8
story_points: 5

## Story

As a Developer,
I want to receive regular progress reports and occasional surprises,
So that I stay engaged long-term and feel rewarded for my activity.

## Acceptance Criteria

1. **Given** it's Monday morning
2. **When** the weekly digest runs
3. **Then** I receive an email with my XP summary
4. **And** the email shows my weekly XP gained, rank change, and highlights
5. **Given** I complete a month of activity
6. **When** the month ends
7. **Then** I receive a monthly progress report
8. **Given** I perform an action
9. **When** the RNG triggers (1% chance)
10. **Then** I receive a surprise XP drop with celebration
11. **Given** it's my account anniversary
12. **When** I log in that day
13. **Then** I receive a birthday XP bonus

## Tasks/Subtasks

- [ ] Create weekly digest email template <!-- id: 1 -->
- [ ] Create cron job for weekly digests <!-- id: 2 -->
- [ ] Create server action `generateWeeklyReport(userId)` <!-- id: 3 -->
- [ ] Integrate with email service (Resend/SendGrid) <!-- id: 4 -->
- [ ] Create monthly report generation logic <!-- id: 5 -->
- [ ] Create `SurpriseXPDrop` component <!-- id: 6 -->
- [ ] Implement RNG logic for random drops <!-- id: 7 -->
- [ ] Create birthday bonus detection <!-- id: 8 -->
- [ ] Add email preferences to settings <!-- id: 9 -->
- [ ] Create analytics dashboard for report engagement <!-- id: 10 -->

## Technical Requirements

### Weekly Digest Email

```typescript
// src/features/xp/services/weekly-digest.ts
interface WeeklyReport {
  username: string;
  weeklyXP: number;
  rankChange: number;
  currentRank: number;
  topActivities: Array<{
    type: string;
    xp: number;
    count: number;
  }>;
  streakInfo: {
    current: number;
    longest: number;
  };
}

export async function generateWeeklyReport(userId: string): Promise<WeeklyReport> {
  const supabase = await createServerClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Get weekly XP
  const { data: xpEvents } = await supabase
    .from('xp_events')
    .select('event_type, xp_amount')
    .eq('user_id', userId)
    .gte('created_at', oneWeekAgo.toISOString());
  
  const weeklyXP = xpEvents?.reduce((sum, e) => sum + e.xp_amount, 0) || 0;
  
  // Get top activities
  const activityMap = xpEvents?.reduce((map, e) => {
    if (!map[e.event_type]) {
      map[e.event_type] = { count: 0, xp: 0 };
    }
    map[e.event_type].count++;
    map[e.event_type].xp += e.xp_amount;
    return map;
  }, {} as Record<string, { count: number; xp: number}>);
  
  const topActivities = Object.entries(activityMap || {})
    .map(([type, stats]) => ({ type, ...stats }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3);
  
  // Get rank
  const rank = await getUserRank(userId);
  
  // Get streak info
  const streakInfo = await calculateStreak(userId);
  
  return {
    username: profile.username,
    weeklyXP,
    rankChange: rank.change,
    currentRank: rank.global_rank,
    topActivities,
    streakInfo,
  };
}

export async function sendWeeklyDigest(userId: string) {
  const report = await generateWeeklyReport(userId);
  const profile = await fetchProfile(userId);
  
  // Send email via Resend
  await resend.emails.send({
    from: 'KrackedDevs <noreply@krackeddevs.com>',
    to: profile.email,
    subject: `Your Weekly XP Report - Level ${profile.level}`,
    react: WeeklyDigestEmail(report),
  });
}
```

### Weekly Digest Email Template (React Email)

```tsx
// src/emails/weekly-digest.tsx
import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

export function WeeklyDigestEmail({ report }: { report: WeeklyReport }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Weekly Progress Report
          </Text>
          
          <Section style={{ marginTop: '30px' }}>
            <Text style={{ fontSize: '18px' }}>Hey {report.username}! 👋</Text>
            <Text>Here's what you accomplished this week:</Text>
          </Section>
          
          <Section style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff00',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <Text style={{ fontSize: '16px', marginBottom: '10px' }}>
              🎯 <strong>XP Earned:</strong> {report.weeklyXP} XP
            </Text>
            <Text style={{ fontSize: '16px', marginBottom: '10px' }}>
              📊 <strong>Current Rank:</strong> #{report.currentRank}
              {report.rankChange !== 0 && (
                <span style={{ color: report.rankChange > 0 ? '#00ff00' : '#ff0000' }}>
                  {report.rankChange > 0 ? `↑ +${report.rankChange}` : `↓ ${report.rankChange}`}
                </span>
              )}
            </Text>
            <Text style={{ fontSize: '16px' }}>
              🔥 <strong>Current Streak:</strong> {report.streakInfo.current} days
            </Text>
          </Section>
          
          <Section style={{ marginTop: '30px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Top Activities
            </Text>
            {report.topActivities.map((activity, i) => (
              <Text key={i} style={{ fontSize: '14px' }}>
                {i + 1}. {activity.type}: {activity.xp} XP ({activity.count} times)
              </Text>
            ))}
          </Section>
          
          <Section style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="https://krackeddevs.com/leaderboard" style={{
              backgroundColor: '#00ff00',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              View Full Leaderboard
            </a>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Cron Job (Vercel Cron or Next.js API Route)

```typescript
// src/app/api/cron/weekly-digest/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const supabase = await createServerClient();
  
  // Get all users with email preferences enabled
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email_preferences->weeklyDigest', true);
  
  // Send digests
  const results = await Promise.allSettled(
    users.map(user => sendWeeklyDigest(user.id))
  );
  
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  
  return Response.json({ 
    message: `Sent ${succeeded}/${users.length} weekly digests` 
  });
}
```

### Surprise XP Drop

```typescript
// src/features/xp/utils/surprise-drop.ts
export async function checkForSurpriseDrop(userId: string) {
  // 1% chance of surprise drop
  const shouldDrop = Math.random() < 0.01;
  
  if (!shouldDrop) return null;
  
  // Random XP amount between 10-50
  const bonusXP = Math.floor(Math.random() * 40) + 10;
  
  // Grant XP
  await grantXP({
    userId,
    eventType: 'manual_adjustment',
    xpAmount: bonusXP,
    metadata: { reason: 'surprise_drop', lucky: true }
  });
  
  return bonusXP;
}

// Usage in any action
export async function submitBounty(data: BountySubmission) {
  // ... normal submission logic
  
  // Check for surprise drop
  const surprise = await checkForSurpriseDrop(data.userId);
  
  if (surprise) {
    toast.custom((t) => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg">
        <div className="text-white font-bold mb-2">🎁 Lucky Drop!</div>
        <div className="text-white">You found {surprise} bonus XP!</div>
      </div>
    ));
  }
}
```

### Birthday Bonus

```typescript
// src/features/xp/utils/birthday-bonus.ts
export async function checkBirthdayBonus(userId: string) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('id', userId)
    .single();
  
  const createdDate = new Date(profile.created_at);
  const today = new Date();
  
  // Check if same month and day
  const isBirthday = createdDate.getMonth() === today.getMonth() 
    && createdDate.getDate() === today.getDate();
  
  if (!isBirthday) return null;
  
  // Grant birthday XP (100 XP)
  await grantXP({
    userId,
    eventType: 'manual_adjustment',
    xpAmount: 100,
    metadata: { reason: 'account_anniversary', years: today.getFullYear() - createdDate.getFullYear() }
  });
  
  return 100;
}
```

## Architecture Compliance

- **Cron Jobs**: Use Vercel Cron or GitHub Actions
- **Email Service**: Resend or SendGrid
- **React Email**: For beautiful HTML emails
- **Rate Limiting**: Max 1 digest per week per user
- **Opt-In**: Users must enable email preferences

## Testing Strategy

### Manual Testing
- Trigger weekly digest manually
- Test surprise drop RNG
- Verify birthday bonus on anniversary date
- Check email rendering across clients

### Unit Tests
```typescript
describe('surprise drop', () => {
  it('returns XP 1% of the time', async () => {
    const results = await Promise.all(
      Array(1000).fill(0).map(() => checkForSurpriseDrop('user-id'))
    );
    const drops = results.filter(r => r !== null).length;
    expect(drops).toBeGreaterThan(0);
    expect(drops).toBeLessThan(30); // ~10 expected
  });
});
```

## Dev Notes

- Consider push notification alternative for mobile users
- Add "Share your report" social sharing feature
- Future: Monthly mega rewards for top gainers
- Future: Customizable digest frequency (weekly/biweekly)

## References

- [Resend](https://resend.com/docs/)
- [React Email](https://react.email/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- Epic 8: Player XP and Leveling System
