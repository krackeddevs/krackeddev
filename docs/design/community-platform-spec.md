# Design Spec: Community Platform & Townhall Chat

**Status:** Draft
**Date:** 2025-12-26
**Related Documents:** `docs/brd.md`, `docs/prd.md`

## 1. Overview & Vision
To transition from a "Marketplace" to a "Guild", Kracked Devs needs permanent spaces for interaction. We are introducing two distinct communication channels:
1.  **Townhall Chat (Synchronous):** A live, "in-game" chat overlay for casual banter, "GM" (Good Morning) rituals, and real-time hype.
2.  **Community Q&A (Asynchronous):** A structured, specialized forum (Stack Overflow style) for technical help, building the "Knowledge Base" of the Malaysian tech ecosystem.

### 1.1 Navigation Strategy (Unified Hub)
To avoid fragmentation, all social features will be grouped under a single `/community` hub.
- **Entry Point:** The "Community" button on the Navbar/Landing Page points to `/community`.
- **Sub-Navigation:** A tabbed interface connects the pillars:
  - **Townhall:** (`/community`) - The real-time feed/lobby.
  - **Q&A:** (`/community/questions`) - The knowledge base.
  - **Members:** (`/members`) - The existing directory.
  - **Leaderboard:** (`/leaderboard`) - The existing ranking page.

## 2. Feature 1: Townhall Chat (The "Vibe")
> "The heartbeat of Santan Island."

### 2.1 Core Experience
*   **Location:** Floating overlay on the bottom-right (or left) of the web app, and integrated into the "Santan Island" game UI.
*   **Channels:**
    *   `#general`: Global chat.
    *   `#bounty-hunting`: Discussing active bounties.
    *   `#looking-for-group`: Finding team members.
*   **Real-time:** Powered by **Supabase Realtime** (Broadcast/Presence).

### 2.2 Technical Specs
*   **Database:** `messages` table (ephemeral-ish history, maybe 7 days retention for performance, or partitioned).
*   **Auth:** Links to Supabase `auth.users`.
*   **Rate Limiting:** Mandatory to prevent spam (e.g., 1 message per 2 seconds).

## 3. Feature 2: Community Q&A (The "Utility")
> "The Malaysian Stack Overflow."

### 3.1 Core Experience
*   **Location:** `/community` or `/questions`.
*   **Structure:**
    *   **Questions:** The root entity. Must have Title, Body, Tags.
    *   **Answers:** Flat list (sorted by votes). One can be "Accepted".
    *   **Comments:** Nested usage for clarification only.
*   **Gamification (The Integrator):**
    *   Answers are the primary source of **XP** outside of Bounties.
    *   Accepted Answer = Large XP Boost.

### 3.2 Database Schema (Proposed)
```sql
-- Questions Table
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  body text not null, -- Markdown
  author_id uuid references public.profiles(id),
  tags text[],
  accepted_answer_id uuid, -- Self-reference (nullable)
  created_at timestamptz default now(),
  upvotes int default 0,
  view_count int default 0
);

-- Answers Table
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id),
  body text not null,
  author_id uuid references public.profiles(id),
  is_accepted boolean default false,
  created_at timestamptz default now(),
  upvotes int default 0
);
```

### 3.3 UX/UI Needs
*   **Rich Text Editor:** Markdown support (Bold, Code Blocks at minimum).
*   **Tagging System:** Auto-complete tags (`react`, `nextjs`, `supabase`).
*   **Search:** Ideally full-text search (Postgres `tsvector`) so people don't ask duplicates.

## 4. Implementation Strategy (The "How")

### Phase 1: The "Townhall" (Quick Win)
*   **Effort:** Low (2-3 Days).
*   **Why:** Immediately makes the site feel "alive" even with low traffic.
*   **Tech:** `useSubscription` hook from Supabase UI.

### Phase 2: The "Forum" (Deep Value)
*   **Effort:** Medium (1 Sprint).
*   **Why:** Long-tail SEO and Expert Verification.
*   **Tech:** Standard CRUD pages (`/community/new`, `/community/[slug]`).

## 5. Risks & Mitigation
*   **Empty Forum Problem:** A Q&A site with no answers is depressing.
    *   *Mitigation:* "Seed" content. The founding team must manually ask and answer the first 50 questions.
    *   *Mitigation:* AI Bot (The "Oracle") can provide initial answers to basic questions to keep the loop moving.
*   **Spam:**
    *   *Mitigation:* Only users with verify GitHub accounts (older than 3 months?) can post? Or perhaps manual approval for first post.

## 6. Strategic Analysis (Build vs Buy)

### 6.1 Feature Analysis

| Feature | Pros | Cons |
| :--- | :--- | :--- |
| **Townhall Chat** | Makes site feel "alive" (FOMO); Instant help from peers; "Global" connection. | Hard to moderate; Content is ephemeral (lost); Can distract from Bounties. |
| **Community Q&A** | High SEO value (Google Indexing); Expert Verification (XP Proof); Permanent Knowledge Base. | "Empty Restaurant" syndrome (hard to start); Slower feedback loop than chat. |

### 6.2 Implementation Analysis: Self-Build vs 3rd Party

#### Option A: 3rd Party (Discourse / Discord Widget)
*   **Pros:**
    *   Feature rich out of the box (Threads, Badges, Search).
    *   Zero coding required.
*   **Cons:**
    *   **Data Silo:** XP earned on Discord cannot easily trigger a Rank Up on KrackedDev.
    *   **UX Friction:** Users have to log in deeply again or context switch.
    *   **Cost:** Discourse hosting is ~$20-100/mo.
    *   **Theming:** Hard to make look like "Cyberpunk".

#### Option B: Self-Build (Supabase + Next.js) *[RECOMMENDED]*
*   **Pros:**
    *   **Unified XP:** An Accepted Answer instantly triggers the `increment_xp` DB function.
    *   **Unified Look:** Uses the exact same UI/CSS components.
    *   **Free Hosting:** Runs on existing Vercel/Supabase tiers.
*   **Cons:**
    *   **Maintenance:** We have to build features like "Edit", "Delete", "Search" manually.
    *   **Complexity:** Managing Rich Text Editors can be tricky.

**Verdict:** For a Gamified Platform, **Integration > Features**. The value of KrackedDev is the **Profile Rank**. Therefore, we must own the data source (Build).

## 7. Cost Analysis (Long-Term)

### 7.1 Infrastructure Stack
*   **Frontend/Hosting:** Vercel (Pro Plan)
*   **Backend/Database:** Supabase (Pro Plan)

### 7.2 Total Cost of Ownership (Estimated)
*Assumption: 10,000 MAU types, 500 Concurrent Realtime Users.*

| Service | Item | Estimated Usage | Cost (Monthly) | Risk Factor |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel** | Hosting (Pro) | 1 Developer Seat | $20.00 | Low |
| **Vercel** | Bandwidth | ~100GB (Text/HTML) | $0.00 (1TB Included) | Medium (Images) |
| **Vercel** | Invocations | ~5M Calls | $0.00 (10M Included) | Low |
| **Supabase** | Database (Pro) | 8GB Storage | $25.00 | Low |
| **Supabase** | Realtime | 500 Peak Connections | $0.00 (500 Included) | High (Viral Success) |
| **Supabase** | Storage | 50GB (Images) | ~$1.25 | Low |
| **TOTAL** | | | **~$46.25 / month** | |

### 7.3 Scaling Risks & "Success Tax"

#### Risk A: Supabase Realtime (Townhall)
*   **Metric:** Peak Concurrent Connections (people online at the exact same second).
*   **Limit:** 500 included.
*   **Overage Cost:** +$10 per 1,000 extra users.
*   **Scenario:** If we hit 1,500 concurrents (massive success), bill increases by $10.
*   **Mitigation:** `useSubscription` should lazy-load. Disconnect socket on tab blur.

#### Risk B: Vercel Image Optimization
*   **Metric:** Source Images Optimized.
*   **Limit:** 5,000 images included.
*   **Danger:** If every user uploads a new avatar daily, we hit this.
*   **Mitigation:** Do NOT use `next/image` optimization for user uploads. Use Supabase Storage transformation (faster/cheaper) or Cloudinary.

While Vercel is more expensive than a raw VPS ($5/mo), the **DevOps savings** justify the cost. Managing WebSocket servers, Redis, and Postgres backups manually would cost >5 hours of engineering time/month ($500+ value). The $46/mo infrastructure cost is efficient for a platform of this scale.

## 8. Success Metrics & KPIs
> "If you can't measure it, you can't improve it."

### 8.1 Primary Metrics (North Star)
*   **Platform Retention:** % of users who return to Townhall/Q&A within 7 days.
*   **Knowledge Velocity:** Average time from "Question Asked" to "Accepted Answer".
*   **Community Health:** Ratio of Active Contributors (Answerers) to Passive Consumers (Viewers) — Target > 1:10.

### 8.2 Operational Metrics
*   **Engagement:** Daily Active Users (DAU) in Townhall vs. Total DAU.
*   **Content Volume:** Questions asked / week.
*   **Resolution Rate:** % of questions with at least one answer; % of questions with an Accepted Answer.
*   **Vibe Check:** Avg. messages per active Townhall user per session.

## 9. Gamification Economics (The "Engine")
> Connecting the "Vibe" to the "Systems". This economy must be balanced to prevent inflation.

### 9.1 XP Table (Proposed)
| Action | Actor | XP Reward | Limit |
| :--- | :--- | :--- | :--- |
| **Ask Question** | Asker | +10 XP | Max 3/day (Prevent spam) |
| **Post Answer** | Answerer | +20 XP | Max 5/day |
| **Get Upvoted** | Answerer/Asker | +5 XP | No limit |
| **Answer Accepted** | Answerer | +100 XP | No limit (High value) |
| **Accept an Answer** | Asker | +20 XP | Incentivize closing loops |

### 9.2 Reputation Tiers & Privileges
XP is not just vanity; it unlocks moderation powers to scale the community without more staff.

*   **Lvl 0 (Newbie):** Can Ask, Answer, Chat in #general.
*   **Lvl 5 (Regular):** Can Chat in #bounty-hunting.
*   **Lvl 10 (Trusted):** Can Downvote (content quality control).
*   **Lvl 20 (Sheriff):** Can Flag messages for review; "Trusted" badge in chat.
*   **Lvl 50 (Elder):** Can edit others' tags (taxonomy cleanup).

## 10. Moderation & Safety Strategy
> "Safety is a feature, not an afterthought."

### 10.1 Automated Defenses
*   **Profanity Filter:** Block list for common slurs in English/Malay using simple regex or 3rd party lib (`bad-words`).
*   **Rate Limiting:**
    *   *Chat:* 1 msg / 2 seconds burst catch.
    *   *Forum:* 1 question / 5 mins for new accounts.
*   **Shadowban:** If a user is flagged by system, their messages are only visible to them.

### 10.2 Community Moderation
*   **Report System:** "Flag" button on every message/question. 3 Flags = Auto-hide logic (pending Admin review).
*   **Trusted Users:** Lvl 20+ users' reports carry 3x weight.

### 10.3 Admin Tools
*   **Admin Panel:** New tab "Moderation Queue" to see flagged items.
*   **Actions:** Warn, Timeout (24h ban), Perma-Ban.
*   **Audit Log:** Record all mod actions for accountability.

## 11. Launch & Rollout Strategy
> "Start small, scale fast."

### 11.1 Phase A: Alpha (The "Founding 50")
*   **Access:** Invite-only for top 50 existing leaderboard users.
*   **Goal:** Seed the Q&A with high-quality content. The "Empty Restaurant" problem must be solved *before* public doors open.
*   **Incentive:** "Founding Member" badge for Alpha participants.

### 11.2 Phase B: Soft Launch (Beta)
*   **Access:** Open to all logged-in users.
*   **Promotion:** In-app toast notification only. No external blast.
*   **Goal:** Stress test Supabase Realtime limits and moderation flow.

### 11.3 Phase C: Public Launch
*   **Event:** "Townhall Grand Opening" event (Synchronous time, e.g., Friday 8 PM).
*   **Promotion:** Email blast (Brevo), Social Media.
*   **Feature:** Global leaderboard reset or "Season 1" start to hype the new XP sources.
