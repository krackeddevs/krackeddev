# Story 11.4: Accepted Answer Logic & Gamification

**As a** User
**I want to** receive XP rewards for my contributions
**So that** I am motivated to provide high-quality answers.

## Context
Gamification is the engine of the "Guild". Users earn XP for valuable actions. The critical loop is Asking -> Answering -> Accepting. Accepted answers provide the most value to the knowledge base, so they are rewarded heavily.

## Acceptance Criteria

### Interaction Logic
- [ ] **Accept Answer**:
    - Only visible to the Question's Author.
    - Cannot accept own answer.
    - Toggle behavior (can un-accept if needed, but rarely).
    - Visual feedback: Green checkmark + "Accepted Answer" badge.
    - Pin accepted answer to top of list.
- [ ] **Voting**:
    - Upvote/Downvote buttons on Questions and Answers.
    - Prevent duplicate voting (toggle).
    - Optimistic UI update.

### Gamification Engine (XP)
- [ ] **XP Triggers**:
    - `Ask Question`: +10 XP (Limit 3/day).
    - `Answer Question`: +20 XP (Limit 5/day).
    - `Upvote Received`: +5 XP.
    - `Answer Accepted`: +100 XP (Author), +20 XP (Asker - for closing loop).
- [ ] **XP System**:
    - Centralized `award_xp(user_id, amount, reason)` database function.
    - Updates `profiles.xp` and `profiles.level` (if threshold crossed).
    - Logs transaction to `xp_history` table.
- [ ] **Notifications**:
    - Send notification when:
        - Your answer is accepted.
        - You receive an upvote (maybe batch these? "10 people upvoted...").

### Database Schema
- [ ] **Update `profiles`**:
    - Add `xp` (integer, default 0).
    - Add `level` (integer, default 0).
    - Add `reputation_tier` (text, computed).
- [ ] **Create `xp_ledger`**:
    - `id`, `user_id`, `amount`, `action_type`, `resource_id` (fk to question/answer), `created_at`.

---

## Tasks/Subtasks

### Task 1: Database Logic
- [ ] Create `xp_ledger` table.
- [ ] Add columns to `profiles`.
- [ ] Write PostgreSQL function `award_xp` to handle math + level calc safely.
- [ ] Write Trigger for `is_accepted` updates -> call `award_xp`.

### Task 2: Server Actions
- [ ] `acceptAnswer(questionId, answerId)`:
    - Validate user owns question.
    - Update DB.
    - Trigger notification.
- [ ] `vote(resourceId, type, direction)`:
    - Handle up/down/neutral toggle.

### Task 3: UI Updates
- [ ] Add "Mark as Accepted" button to `AnswerItem`.
- [ ] Display XP gain (Toast notification: "+100 XP!").
- [ ] Update Profile Level bar in Navbar/Profile.

## Testing & Definition of Done
- [ ] **Unit Tests**: Test `award_xp` logic (math correctness).
- [ ] **Integration Tests**: Verify DB limits (can't accept own answer).
- [ ] **E2E**: Full flow: Ask -> Answer -> Accept -> Check XP.
- [ ] **Security**: Try to trigger XP award via API without permission.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `xp_gain`: (track amount, source_type).
    - `answer_accepted`: (track question_id, answer_id, time_to_accept).
    - `vote_cast`: (track type, direction).
    - `level_up`: (track new_level).

---

## Architectural Constraints & Performance
- **Atomic Operations**: XP updates MUST happen via Postgres Functions (`increment_xp`) to guarantee atomicity. NEVER calculate new total in application code.
- **Idempotency**: API endpoints for `award_xp` must accept a unique `transaction_id` (or derive from resource_id + action) to prevent replay attacks or double-counting on network retries.

## UX & UI Refinements
- **Delight**: Use `canvas-confetti` when a user levels up or has an answer accepted.
- **Sound**: Optional subtle "ding" sound for XP gain (default off).
- **Feedback**: Immediate optimism on Upvote click (don't wait for server).

## Dev Implementation Notes
- **Function Security**: `award_xp` must be `SECURITY DEFINER` to allow writing to `profiles` (even if user can't update own profile directly via API).
- **Trigger Logic**: The trigger on `answers` table must check `OLD.is_accepted IS FALSE AND NEW.is_accepted IS TRUE` to prevent double-awarding on updates.

## Technical Notes
- **Security Check**: Ensure API endpoints for voting/accepting verify ownership rigorously.
- **Race Conditions**: Use database-level increments/functions for XP to avoid overwrite issues.
- **Level Curve**: Use a simple formula `Level = floor(sqrt(XP / 100))` or similar for now.
