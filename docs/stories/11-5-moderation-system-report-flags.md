# Story 11.5: Moderation System (Report & Flags)

**As a** Trusted User (Lvl 20+)
**I want to** flag inappropriate content
**So that** the community remains safe and professional.

## Context
As the community grows, spam and toxicity are inevitable. We need a distributed moderation system where trusted community members act as the first line of defense, and Admins have the final say.

## Acceptance Criteria

### Flagging UI
- [ ] **Report Action**:
    - "Flag" icon on every chat message, question, and answer.
    - Clicking opens a modal: "Why are you flagging this?" (Spam, Harassment, Incorrect, Other).
    - Optimistic hide: If user flags it, hide it *for them* immediately.
- [ ] **Auto-Mod Logic**:
    - If Content receives > 3 unique flags -> Temporarily Hide (Status: `under_review`).
    - If Flagger Rep >= Lvl 20 -> Count as 3 flags (Instant Hide).

### Admin Dashboard
- [ ] **Moderation Queue**:
    - New tab in Admin Panel.
    - List all `flagged` content.
    - Filter by: Type (Chat/Q/A), Reason, Date.
- [ ] **Review Actions**:
    - **Keep**: Clears flags, restores visibility.
    - **Delete**: Permanently removes content.
    - **Ban User**: Deletes content AND bans the author.

### Database Schema
- [ ] **Create `content_flags` table**:
    - `id`, `flagger_id`, `resource_id`, `resource_type` ('chat', 'question', 'answer'), `reason`, `status`.
- [ ] **Update Content Tables**:
    - Add `moderation_status` column ('published', 'flagged', 'hidden', 'deleted') to `messages`, `questions`, `answers`.
    - **RLS Policy**: Update `SELECT` policies for all content tables to exclude `status = 'hidden'` unless `auth.uid() = author_id` OR `auth.jwt() ->> 'role' = 'admin'`.

---

## Tasks/Subtasks

### Task 1: Database Logic
- [ ] Create `content_flags` table.
- [ ] Add `moderation_status` columns.
- [ ] Create `flag_content` server action.
    - Include logic to check Flagger's Level.
    - Trigger "Hide" update if threshold met.

### Task 2: UI Implementation
- [ ] Create `FlagModal` component.
- [ ] Add entry points (Flag Icon) to `ChatMessage`, `QuestionCard`, `AnswerItem`.

### Task 3: Admin Dashboard
- [ ] Create `ModerationQueue` table view.
- [ ] Implement `resolveFlag` action (Keep/Delete/Ban).

## Testing & Definition of Done
- [ ] **Unit Tests**: Test `Auto-Mod` threshold logic.
- [ ] **Integration Tests**: Flag content -> Verify it appears in Admin Queue.
- [ ] **Permissions**: Verify normal user cannot access Admin Queue.
- [ ] **E2E**: Report -> Hide -> Admin Restore.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `mod_flag_created`: (track reason, resource_type).
    - `mod_content_hidden`: (track resource_id, trigger_type='auto'|'manual').
    - `mod_admin_action`: (track action_type, admin_id).

---

## Technical Notes
- **Privacy**: Flagger identity should be hidden from the content author.
- **Abuse Prevention**: Rate limit flagging (max 10/day for non-admins).
- **Hard Delete vs Soft Delete**: Always Soft Delete (`deleted_at`) for audit trails.
