# Story 11.2: Community Q&A Listing & Details

**As a** Developer
**I want to** browse questions and view detailed discussions
**So that** I can find answers to my technical problems or help others.

## Context
The core of the knowledge base is the "Stack Overflow-style" Q&A forum. This story covers the read-only aspects: listing questions, filtering/sorting, and viewing the question detail page with answers.

## Acceptance Criteria

### UI Components
- [ ] **QuestionsList Page** (`/community`):
    - Layout: Sidebar (filters) + Main Content (list) + Right Rail (stats/hot topics).
    - **Filter Bar**: "Newest", "Top Voted", "Unanswered".
    - **Search Input**: Keyword search.
    - **Question Card**:
        - Title (clickable).
        - Excerpt (first 100 chars).
        - Tags (badges).
        - Stats: Votes, Answers, Views.
        - Author info + Timestamp.
- [ ] **QuestionDetail Page** (`/community/question/[slug]`):
    - **Question Block**: Full body markdown, voting controls (left), author card (bottom).
    - **Answers List**: Sorted by Accepted -> Votes -> Highest.
    - **Answer Block**: Body markdown, voting usage, author card.

### Database Schema
- [ ] **Create `questions` table**:
    - `id`, `title`, `slug` (unique), `body`, `author_id`, `tags` (array), `upvotes`, `view_count`, `accepted_answer_id`.
- [ ] **Create `answers` table**:
    - `id`, `question_id`, `body`, `author_id`, `is_accepted`, `upvotes`.
- [ ] **Indices**:
    - `slug` (for lookup).
    - `tags` (GIN index for array filtering).

### Server Actions
- [ ] `getQuestions(filter, page)`: Fetch paginated list.
- [ ] `getQuestionBySlug(slug)`: Fetch single question with answers.
- [ ] `incrementViewCount(questionId)`: Atomic increment + dedupe logic (cookie/IP).

---

## Tasks/Subtasks

### Task 1: Database Setup
- [ ] Create migration for `questions` and `answers` tables.
- [ ] Seed dummy data for testing layout.

### Task 2: Listing Page UI
- [ ] Implement `QuestionsList` component with data fetching.
- [ ] Implement `QuestionCard` component.
- [ ] Implement `FilterBar` logic (update URL params).
- [ ] Build Search input (debounce -> URL update).

### Task 3: Detail Page UI
- [ ] Implement Dynamic Route `[slug]/page.tsx`.
- [ ] Build `QuestionDetail` layout with sidebar.
- [ ] Implement `VotingControl` component (visual stub for now).

## Testing & Definition of Done
- [ ] **Unit Tests**: Test `QuestionCard` component.
- [ ] **Integration Tests**: Verify database fetching for List and Detail views.
- [ ] **SEO**: Verify Meta Tags are present on detail page.
- [ ] **a11y**: Ensure filter buttons are accessible.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `qa_list_view`: (track sort_order).
    - `qa_search`: (track query_string, result_count).
    - `qa_question_view`: (track question_id, author_id).
    - `qa_filter_click`: (track tag_filter).

---

## Architectural Constraints & Performance
- **Search Strategy**: MVP uses ILIKE or `websearch_to_tsquery`. If `questions` table > 10k rows, migrate to dedicated Search Service or pre-computed `tsvector` column.
- **Caching**: Question Detail page is high-read. Ensure Next.js `ISR` (Incremental Static Regeneration) or aggressive caching headers `Cache-Control: public, max-age=60` are utilized.

## UX & UI Refinements
- **Empty States**: If search returns 0 results, show "No questions found" with a "Ask a Question" CTA.
- **Skeleton Screens**: Use skeleton loaders for the Question List while fetching.
- **Sticky Filters**: Keep the filter bar available while scrolling on desktop.

## Technical Notes
- **SEO**: The Question Detail page MUST be server-rendered for Google indexing. Use `generateMetadata` to set dynamic title/description.
- **Markdown**: Use `react-markdown` with `rehype-highlight` or `shiki` for code coloring.
