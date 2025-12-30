# Story 11.3: Asking & Answering (Markdown + Code)

**As a** Developer
**I want to** post questions and answers using rich text and code blocks
**So that** I can communicate technical concepts clearly.

## Context
Since this is a developer community, standard text inputs aren't enough. We need a robust Markdown editor that supports syntax-highlighted code blocks, inline code, bold/italics, and lists. We also need server-side sanitization to prevent XSS.

## Acceptance Criteria

### Editor Component
- [ ] **RichTextEditor UI**:
    - Tabs: "Write" and "Preview".
    - Toolbar: Bold, Italic, Link, List, Code Block, Inline Code.
    - Drag-and-drop image upload (uploads to Supabase Storage -> inserts markdown link).
    - Code Block support: Auto-detect language or dropdown.
- [ ] **Preview Mode**:
    - Real-time rendering of the markdown.
    - Matches the final display output exactly.
- [ ] **Validation**:
    - Title: Required, Min 15 chars, Max 150 chars.
    - Body: Required, Min 30 chars.
    - Tags: Min 1, Max 5.

### Server Actions
- [ ] `createQuestion(data)`:
    - Input validation (Zod).
    - Sanitize HTML (DOMPurify or similar server-side ref).
    - Insert into `questions` table.
- [ ] `createAnswer(data)`:
    - Similar validation.
    - Insert into `answers` table.

### Tag Management
- [ ] **TagInput**:
    - Autocomplete from existing tags (fetch from DB).
    - Allow creating new tags (optional - maybe restrict to Lvl 5+ users later, for now allow all).
    - Max 5 tags per question.

---

## Tasks/Subtasks

### Task 1: Editor Implementation
- [ ] Research/Select library (recommend `react-markdown` + a simple textarea with toolbar helpers, OR a lightweight lib like `uiw/react-md-editor`).
- [ ] Create `MarkdownEditor` component.
- [ ] Implement Image Upload handler (upload to `community-images` bucket).

### Task 2: Form Logic
- [ ] Build "Ask Question" form (Title, Body, Tags).
- [ ] Build "Post Answer" form (Body only).
- [ ] Implement Zod schemas for validation.

### Task 3: Backend Logic
- [ ] Implement `createQuestion` server action.
- [ ] Implement `createAnswer` server action.
- [ ] Add `slug` generation logic (kebab-case title + random suffix if collision).
- [ ] Set up `community-images` storage bucket.

## Testing & Definition of Done
- [ ] **Unit Tests**: Test Markdown sanitation (prevent XSS).
- [ ] **Integration Tests**: Test Question creation flow (DB insert).
- [ ] **Visual Tests**: Verify syntax highlighting in Preview mode.
- [ ] **Security**: Upload malicious file and verify rejection.

## Analytics & Instrumentation
- [ ] **Track Events**:
    - `qa_ask_start`: Form opened.
    - `qa_question_posted`: (track question_id, tag_count).
    - `qa_answer_posted`: (track question_id, answer_id).
    - `qa_image_uploaded`: (track file_size).
    - `qa_validation_error`: (track field_name).

---

## UX & UI Refinements
- **Loading State**: Show a spinner/progress bar inside the text area while image is uploading. Disable "Submit" until upload completes.
- **Error States**: Inline validation errors (e.g., "Title is too short") should appear immediately on blur.

## Dev Implementation Notes
- **Storage RLS**: `community-images` bucket must have RLS: `SELECT` public, `INSERT` authenticated users only.
- **Sanitization Placement**: Run `DOMPurify` inside the Server Action *before* DB insertion to ensure data at rest is safe.
- **Library**: `react-markdown` v9+ requires `remark-gfm` for tables/strikethrough. Ensure this plugin is installed.

## Technical Notes
- **Sanitization**: CRITICAL. Use `isomorphic-dompurify` before saving or before rendering.
- **Code Highlighting**: `rehype-highlight` is standard with `react-markdown`. theme: `atom-one-dark` or similar.
- **Optimistic UI**: When posting an answer, append it to the list immediately while awaiting server response.
