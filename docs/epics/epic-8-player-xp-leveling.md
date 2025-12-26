# Epic 8: Player XP and Leveling System

**Status**: backlog  
**Priority**: high  
**Owner**: antique_gravity

## Epic Goal

Implement a gamified progression system where players earn XP from various activities (daily logins, GitHub contributions, bounty submissions, and wins) and level up based on accumulated experience, enhancing engagement and rewarding consistent participation.

## Business Value

- **Engagement**: Encourages daily login and platform interaction
- **Retention**: Rewards consistent GitHub contributions and platform activity
- **Gamification**: Makes the developer community more engaging and fun
- **Progress Visibility**: Users can track their growth and achievements
- **Competition**: Enables future leaderboards and competitive features

## User Stories

### Story 8.1: XP Tracking Infrastructure
**Priority**: must-have  
**Estimate**: 5 points

Set up database tables, columns, and core infrastructure for tracking XP events and user progression.

**Acceptance Criteria**:
- Migration creates `xp_events` table with RLS policies
- Add `last_login_at` and `last_xp_grant_date` to profiles table
- XP events are immutable and auditable
- Profiles table properly indexes level and xp columns

---

### Story 8.2: XP Earning Events & Logic
**Priority**: must-have  
**Estimate**: 8 points

Implement core XP earning mechanics for daily login, contributions, bounty activities, and streak milestones.

**Acceptance Criteria**:
- Users earn 10 XP for first login each day
- Users earn 5 XP per day with GitHub contributions
- Bounty submission grants 20 XP
- Bounty wins grant 50+ XP based on value
- Streak milestones award bonus XP (7/30/90 days)
- No duplicate XP for same activity on same day

---

### Story 8.3: Level Progression System
**Priority**: must-have  
**Estimate**: 5 points

Implement level calculation logic and automatic level-up when XP thresholds are reached.

**Acceptance Criteria**:
- Level progression follows defined formula (linear or exponential)
- Users automatically level up when reaching XP threshold
- Level and XP properly update in profiles table
- System handles edge cases (max level, negative XP protection)

---

### Story 8.4: XP UI Components
**Priority**: must-have  
**Estimate**: 8 points

Create UI components to display XP progress, level badges, XP history, and level-up celebrations.

**Acceptance Criteria**:
- XP progress bar shows current level and progress to next level
- Level badge displays prominently on profile
- XP history feed shows recent XP events
- Level-up toast notification celebrates achievements
- Cyberpunk-themed styling throughout

---

## Technical Architecture

### Database Schema

```sql
-- xp_events table
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  xp_amount INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- profiles table additions
ALTER TABLE profiles 
  ADD COLUMN last_login_at TIMESTAMPTZ,
  ADD COLUMN last_xp_grant_date DATE;
```

### XP Event Types

- `daily_login`: First login of the day (10 XP)
- `github_contribution`: Daily contribution activity (5 XP)
- `bounty_submission`: Submitted a bounty (20 XP)
- `bounty_win`: Won a bounty (50+ XP)
- `streak_milestone`: Achieved streak milestone (50-500 XP)
- `profile_completion`: Completed profile setup (30 XP one-time)
- `manual_adjustment`: Admin correction

### Level Progression Formula

**Option 1 - Linear** (Recommended for MVP):
```
XP for level N = 100 * N
Total XP to reach level N = 100 + 200 + 300 + ... + (N * 100)
```

**Option 2 - Exponential**:
```
XP for level N = N² * 100
```

### Integration Points

- **Auth Flow**: Check daily login on profile load
- **Contribution System**: Award XP from GitHub stats refresh
- **Bounty System**: Award XP on submission/approval
- **Profile System**: Display XP progress and level

## Dependencies

- Existing profiles table with `level` and `xp` columns ✅
- Contribution stats system (Epic 7) ✅
- Bounty submission system (Epic 5) ✅

## Success Metrics

- [ ] 80%+ of active users gain XP in first week
- [ ] Average daily XP earned per active user \u003e 15 XP
- [ ] Users with 7+ day streaks increase by 30%
- [ ] Profile view time increases (users check XP progress)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|:-----|:-------|:-----------|
| XP inflation | High | Cap daily XP from contributions, implement cooldowns |
| Retroactive XP calculation | Medium | Start fresh, no historical backfill initially |
| Performance with many events | Medium | Index xp_events properly, paginate history |
| Exploits (gaming the system) | High | Rate limit XP events, validate all grants server-side |

## Out of Scope

- Public leaderboards (future epic)
- XP decay for inactivity
- XP trading or transfers
- Retroactive XP for historical contributions
- Social sharing of level-ups

## Definition of Done

- [ ] All 4 stories completed and merged
- [ ] Database migrations applied successfully
- [ ] Unit tests for XP calculation logic \u003e 90% coverage
- [ ] Integration tests for all XP event types
- [ ] UI components tested across devices
- [ ] Performance tested with 1000+ XP events per user
- [ ] Documentation updated (README, API docs)
- [ ] No critical or high severity bugs
