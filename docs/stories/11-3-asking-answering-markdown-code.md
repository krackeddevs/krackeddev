# Story 11.3: Asking & Answering (Markdown + Code)

**As a** Developer
**I want to** post questions and answers using rich text and code blocks
**So that** I can communicate technical concepts clearly.

## Context
Since this is a developer community, standard text inputs aren't enough. We need a robust Markdown editor that supports syntax-highlighted code blocks, inline code, bold/italics, and lists. We also need server-side sanitization to prevent XSS.

## Acceptance Criteria

### Editor Component
- [ ] **RichTextEditor UI**:
    - **Stack Overflow Experience**: Editor must support split-pane (Write/Preview) or WYSIWYG Markdown.
    - **Code Snippets**:
        - Support GFM (GitHub Flavored Markdown) fenced code blocks (```js).
        - Syntax Highlighting in Preview mode (using `rehype-highlight` or `prism`).
    - **Image Uploading**:
        - **Drag & Drop**: Users can drag images directly into the text area.
        - **Paste Support**: Users can paste screenshots from clipboard.
        - **Storage**: Auto-upload to Supabase bucket `community-images` and insert markdown `![alt](url)`.
    - **URL Sharing**: Auto-linkify URLs.
- [ ] **Validation**:
    - Title: Required, Min 15 chars, Max 150 chars.
    - Body: Required, Min 30 chars.
    - **UI Standardization**: The "Ask Question" form page MUST use the standard form layout (centered max-width container) used in `/post-bounty` or `/settings`.

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
- **Security (XSS Prevention)**:
    - **Input Sanitization**: MUST use `isomorphic-dompurify` on the **Server Side** (in the Server Action) before saving `body` to the database. Never trust client input.
    - **Output Sanitization**: Double-check sanitization on render (React usually handles this, but `dangerouslySetInnerHTML` for markdown requires care).
- **Code Highlighting**: Use `react-syntax-highlighter` or `shiki` for production-grade highlighting.
- **Storage Policy**: `community-images` bucket RLS:
    - INSERT: Authenticated Users only.
    - SELECT: Public.
    - MAX FILE SIZE: 5MB per image to prevent abuse.
