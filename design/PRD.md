# PRD — Context-OS (pruned for Ralph demo)

**Branch:** `buildclub/ralph` (the state we're building *toward*)
**Source:** originally full PRD from `buildclub/design`, trimmed for the live demo. Full version preserved on `buildclub/design`.

---

## What we're building

A single-user to-do workspace. Manual task entry, nested sub-tasks, a Today view, and a focus mode with a Pomodoro timer. Plus the DevOps plumbing to ship it.

This is deliberately narrow. Talk 3 (Ellie) adds the agentic layer on top — AI-driven decomposition, "do this next" suggestions — so every story here leaves clean seams.

## Stack

- Next.js 16 (App Router), TypeScript strict
- Supabase (hosted, free tier) via `@supabase/ssr`
- Tailwind v4
- pnpm

## Quality gate (must pass before each commit)

```bash
pnpm typecheck && pnpm lint && pnpm test
```

---

## User stories

### US-001 — Tasks schema in Supabase

**As a developer**, I need a `tasks` table so the app has somewhere to persist data.

**Acceptance criteria:**
- SQL migration at `web/supabase/migrations/001_tasks.sql` with columns: `id uuid PK`, `title text not null`, `notes text`, `due_date timestamptz`, `status text default 'open' check (status in ('open','done'))`, `parent_id uuid null references tasks(id) on delete cascade`, `created_at timestamptz default now()`
- Indexes on `parent_id` and `due_date`
- `supabase db push` applies cleanly against the linked project
- `pnpm typecheck` passes

**Priority:** 1 · **Passes:** false

---

### US-002 — Add a task

**As a user**, I want to add a top-level task with a title, optional notes, and an optional due date, so I can start capturing work.

**Acceptance criteria:**
- An "Add task" form is visible on the Today view
- Fields: title (required), notes (optional), due_date (optional date picker)
- Submit calls a server action that inserts into Supabase
- After submit, the row appears in the task list without a full page reload (use `revalidatePath`)
- Empty title is rejected client-side and server-side
- `pnpm typecheck && pnpm lint && pnpm test` passes

**Priority:** 2 · **Passes:** false

---

### US-003 — Sub-tasks

**As a user**, I want to attach sub-tasks to a parent task so I can break work down.

**Acceptance criteria:**
- Each task row has a "+ subtask" button
- Clicking it reveals an inline input; submitting creates a child task with `parent_id` set
- Sub-tasks render nested under their parent (one level deep is enough)
- Deleting a parent cascades to children (rely on the FK constraint)
- `pnpm typecheck && pnpm lint && pnpm test` passes

**Priority:** 3 · **Passes:** false

---

### US-004 — Left-nav filters

**As a user**, I want to switch between Today / Upcoming / All so I can focus on what's relevant.

**Acceptance criteria:**
- Left-nav has three items: **Today**, **Upcoming**, **All**
- Selection is reflected in the URL as `?filter=today|upcoming|all` (default: today)
- **Today**: tasks where `due_date::date = current_date`
- **Upcoming**: tasks where `due_date::date > current_date`
- **All**: every task, no date filter
- Active filter is visually highlighted
- `pnpm typecheck && pnpm lint && pnpm test` passes

**Priority:** 4 · **Passes:** false

---

### US-005 — Focus mode with Pomodoro

**As a user**, I want to click a task and enter a focused view with a 25-minute timer so I can actually do the work.

**Acceptance criteria:**
- Clicking a task title routes to `/focus/[id]`
- Focus view shows only the task title, notes, and a large 25:00 timer
- Controls: **Start** · **Pause** · **Reset**
- Timer ticks down every second; reaching 00:00 shows "Done — take a break" (no sound — keep it silent for the demo)
- Timer state is client-side only (no persistence)
- **ESC** or a visible "Back" button exits to the previous view
- `pnpm typecheck && pnpm lint && pnpm test` passes

**Priority:** 5 · **Passes:** false

---

### US-006 — CI and release workflows

**As a developer**, I want GitHub Actions workflows so the quality gate runs automatically and releases are reproducible.

**Acceptance criteria:**
- `.github/workflows/ci.yml` — on push to any branch and on PRs to `main`:
  - Runs on `ubuntu-latest`, Node 20, pnpm via corepack
  - Steps: checkout, install (`pnpm install --frozen-lockfile` in `web/`), `pnpm -C web typecheck`, `pnpm -C web lint`, `pnpm -C web test`
  - Skips gracefully if `web/package.json` doesn't exist yet
- `.github/workflows/release.yml` — on push of a tag matching `v*`:
  - Runs the same gate first
  - On success, uses `softprops/action-gh-release@v2` (or equivalent) to create a GitHub Release with auto-generated notes
- Both workflows pass on a trivial no-op PR against `main`
- `pnpm typecheck && pnpm lint && pnpm test` passes

**Priority:** 6 · **Passes:** false

---

## Branch name for Ralph to work on

`ralph/context-os-manual` — Ralph creates this when it starts.

## Out of scope (explicit)

- Authentication / multi-user
- Agent-assisted decomposition (talk 3)
- "Suggested next task" (talk 3)
- Notifications, reminders, real-time sync
- Drag-and-drop reordering
- Editing or deleting tasks after creation (beyond cascading sub-task deletion)
- Docker images, custom domains, or any deploy target other than Vercel
