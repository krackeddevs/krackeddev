# Story 11.1: Townhall Chat UI & Realtime

**As a** User
**I want to** communicate with other developers in a real-time floating chat
**So that** I feel connected to the active community ("Santan Island Vibe").

## Context
Central to the "Guild" vision is a sense of presence. The Townhall Chat is a persistent, global overlay that allows users to chat regardless of which page they are on. It uses Supabase Realtime for instant communication and presence tracking.

## Acceptance Criteria

### Component Architecture
- [x] **ChatOverlay Component**:
    - Floating widget fixed to bottom-right (collapsible).
    - Persists across route navigation (in RootLayout).
    - Collapsed state shows "Online: X" count and "Chat" label.
    - Expanded state shows Header, Channel Tabs, Message List, Input Area.
- [x] **Channel System**:
    - Tabs for `#general` (default), `#bounty-hunting`, `#looking-for-group`.
    - Active tab state persistence.
- [x] **Message List**:
    - Auto-scroll to bottom on new message.
    - "New messages" indicator if scrolled up.
    - Infinite scroll for history (fetch prev 20 messages).
- [x] **Message Bubble**:
    - Author Avatar, Username, Timestamp (relative).
    - Special badging for "Admin" or "Moderator".
    - Own messages right-aligned (or distinct bg), others left-aligned.

### Realtime Logic
- [x] **Supabase Subscription**:
    - Subscribe to `messages` table changes (INSERT).
    - Broadcaster presence tracking (online users count).
- [x] **Optimistic UI**:
    - Append message immediately to local state on send.
    - Append message immediately to local state on send.
    - Show error/retry option if send fails.
- [x] **Connection State Handling**:
    - Show visual indicator if disconnected (e.g., "Generic 'Offline' badge").
    - Auto-reconnect logic (Surprise Realtime handles this, but UI must reflect state).
    - Handle "Replay" of missed messages on reconnect.

### Database Schema
- [x] **Create `messages` table**:
    - `id` (uuid, PK)
    - `channel_id` (text, e.g., 'general')
    - `user_id` (uuid, FK to profiles)
    - `content` (text)
    - `created_at` (timestamptz)
    - `is_deleted` (boolean)
- [x] **RLS Policies**:
    - INSERT: Authenticated users only.
    - SELECT: Authenticated users only.
- [x] **Indexes**:
    - `channel_id`, `created_at` (for fast sorting/filtering).

---

## Tasks/Subtasks

### Task 1: Database & Backend
- [x] Create `messages` table migration with RLS.
- [x] Create `getChannelMessages` server action (fetch last 50).
- [x] Create `sendMessage` server action with Rate Limiting logic (Redis/KV or DB timestamp check).

### Task 2: UI Implementation
- [x] Create `ChatOverlay` shell (open/close animation).
- [x] Implement `MessageList` with virtual scrolling/pagination.
- [x] Build `MessageInput` with emoji picker (optional) and send button.
- [x] Implement Presence hook (`usePresence`) to show online count.

### Task 3: Integration
- [x] Connect `useSubscription` to listening for new inserts.
- [x] Handle "System Messages" (e.g., "Welcome to Santan Island").

## Testing & Definition of Done
- [x] **Unit Tests**: Test `MessageBubble` rendering.
- [x] **Integration Tests**: Mock Supabase Realtime and verify message list update.
- [x] **E2E**: Verify full chat flow (Send -> Receive).
- [x] **Mobile**: Verify overlay behavior on small screens.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `chat_opened`: when overlay is expanded.
    - `chat_message_sent`: (track channel_id).
    - `chat_channel_switch`: (track new channel).
    - `chat_error`: (track error type, e.g. "Rate Limit Hit").

---

## Architectural Constraints & Performance
- **Message Retention**: To anticipate scale, designed for eventual partition or archive. For MVP, Soft Delete is fine, but consider Cron Job to archive messages > 90 days if table exceeds 100k rows.
- **Connection Limits**: Supabase Realtime has concurrent connection limits. Monitor `realtime_connections` metric.
- **Client State**: Limit `messages` array in client memory to last 100 items to prevent DOM bloat.

## UX & UI Refinements
- **Mobile Gestures**: Must support swipe-down to close the chat overlay on mobile devices.
- **Micro-interactions**: Subtle "slide-in" animation for new messages.
- **Empty States**: Friendly "Be the first to say hello!" message for empty channels.

## Technical Notes
- **Rate Limit**: 1 message per 2 seconds. Enforce largely on client, rigidly on server.
- **Presence**: Use Supabase `presence` state, sync "user_id" and "username".
- **Mobile**: On mobile, the chat should probably open as a full-screen drawer rather than a small popup.
