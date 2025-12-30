# Epic 11: Community Platform

**Goal:** Transform KrackedDevs from a transactional marketplace into a sticky "Guild" by introducing synchronous (Chat) and asynchronous (Q&A/Forum) communication layers, underpinned by a gamified reputation system.

- **Scope:** Townhall Chat, Q&A Knowledge Base, XP/Reputation System, content moderation.
- **Value:** Increases user retention, builds a searchable knowledge base (SEO), and provides "proof of expertise" for developers.
- **Complexity:** High (Realtime sockets, Gamification logic, Content safety).

## Strategic Context
Currently, KrackedDevs is a "single-player" experience (find job -> submit). Epic 11 introduces "multi-player" features to solve the "Empty Restaurant" problem and create a sense of belonging ("Santan Island Vibe").

## Requirements Coverage
| Requirement | Description | Coverage |
| :--- | :--- | :--- |
| **FR-CHAT-01 to 05** | Realtime Townhall Chat | Story 11.1 |
| **FR-QA-01 to 07** | Q&A Forum & Knowledge Base | Story 11.2, 11.3 |
| **FR-COMM-01 to 02** | Gamification & XP Logic | Story 11.4 |
| **FR-MOD-01 to 05** | Trust & Safety (Moderation) | Story 11.5 |
| **NFR-COMM-01 to 06** | Performance & Scale | Distributed across Stories |

## Story Breakdown

### STORY-11.0: Community Platform Foundation
**Goal:** Establish the shared layout, navigation, and theme infrastructure for the `/community` route.
- **Key Deliverable:** `/community` layout with standardized sub-nav and responsive container.

### STORY-11.1: Townhall Chat UI & Realtime
**Goal:** Create a persistent, floating chat overlay for global community interaction.
- **Key Deliverable:** Floating Chat Widget with Supabase Realtime subscription.

### STORY-11.2: Community Q&A Listing & Details
**Goal:** Implement the "Read" experience for the knowledge base (Listing, Filtering, Details).
- **Key Deliverable:** `QuestionsList` and `QuestionDetail` pages following standard UI patterns.

### STORY-11.3: Asking & Answering (Markdown + Code)
**Goal:** Enable rich technical communication with Markdown and Syntax Highlighting.
- **Key Deliverable:** Rich Text Editor with code block support and server-side sanitization.

### STORY-11.4: Accepted Answer Logic & Gamification
**Goal:** Connect community actions to the XP/Reputation engine.
- **Key Deliverable:** `award_xp` database function and "Accept Answer" workflow.

### STORY-11.5: Moderation System (Report & Flags)
**Goal:** Decentralized moderation system to keep the community safe.
- **Key Deliverable:** Reporting UI and Admin Moderation Queue.
