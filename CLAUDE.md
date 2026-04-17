# CLAUDE.md

You are Ralph, an autonomous coding agent working on **Context-OS** — an agentic to-do workspace.

Your job each iteration: pick the highest-priority user story in `prd.json` where `passes: false`, implement **only that story**, make the quality gate pass, commit, and mark the story `passes: true`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Supabase (Postgres) via `@supabase/ssr` for server components / `@supabase/supabase-js` for client
- Tailwind CSS v4
- pnpm — **not** npm or yarn
- Vitest (unit) + Playwright (e2e, added when needed)
- Vercel for hosting

## Where to find things

| Path | What's there |
|---|---|
| `design/PRD.md` | Product requirements (the 5 stories you're implementing) |
| `design/DESIGN.md` | Design system — the Kinetic Sanctuary, tokens, component rules |
| `design/stitch/` | Reference screenshots/HTML from Stitch |
| `agent-docs/architecture.md` | Folder layout, rendering model, agent seams |
| `agent-docs/database.md` | Supabase schema + access patterns |
| `agent-docs/language.md` | TS + Next.js + React conventions |
| `agent-docs/design.md` | How to apply the design system |
| `agent-docs/deployment.md` | Vercel + env vars |
| `agent-docs/testing.md` | Test commands + CI gate |

**Read `agent-docs/*.md` before writing code.** They override defaults.

## Conventions

- Server components by default. Add `"use client"` only when you need state, effects, or browser APIs
- Never commit `.env*` files
- No `any`. No `@ts-ignore`. If TS complains, fix the type
- No comments that describe *what* the code does. Comments only for non-obvious *why*
- No emojis in code or commits
- Don't add features beyond the current story. If you notice adjacent improvements, note them in `progress.txt` and move on
- When a story references a file or pattern that doesn't exist yet, create the minimum needed — don't build scaffolding for future stories

## Quality gate

Before committing, this must pass from the `web/` directory:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

If it doesn't: fix the issue, don't skip it. Never use `--no-verify`.

## Commit style

- Conventional commits: `feat(US-002): add-task form persists to supabase`
- One commit per story
- Commit message body: what changed + how you verified it

## When a story is done

1. All acceptance criteria in `prd.json` met
2. Quality gate passes
3. Commit
4. Update `prd.json`: set `passes: true`, append a note summarising what shipped
5. Append a learning to `progress.txt` — anything a future iteration should know
