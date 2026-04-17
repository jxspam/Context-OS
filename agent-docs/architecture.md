# Architecture

## Folder layout

```
web/
├── src/
│   ├── app/                    Next.js App Router
│   │   ├── layout.tsx          root layout, loads fonts + globals
│   │   ├── page.tsx            today view (default filter)
│   │   ├── focus/[id]/page.tsx focus mode per task
│   │   └── actions.ts          server actions (create task, toggle status)
│   ├── components/             React components, one per file
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts       server-side client (cookies-aware)
│   │   │   └── client.ts       browser client (client components only)
│   │   └── types.ts            shared types (Task, Filter, etc.)
│   └── styles/globals.css      Tailwind entry
├── supabase/
│   └── migrations/             SQL migrations, numbered
├── public/
├── .env.local                  created by setup.sh — never commit
└── package.json
```

## Rendering model

- **Server components by default.** Data fetching happens on the server via the server Supabase client.
- **Client components** only for interactivity: the focus-mode timer, filter-nav highlight state, the add-task form (for optimistic UI).
- **Server actions** for mutations. Import with `"use server"` at the top of the file.

## Data flow

```
page.tsx  --(server)-->  supabase/server.ts  -->  Supabase
   |
   └──(server action)-->  actions.ts  -->  supabase/server.ts  -->  Supabase
                                |
                                └──> revalidatePath('/')
```

## Agent seams (for talk 3 — Ellie)

The app is built so an agent can slot in without restructuring. Leave these extension points clean:

- **Task decomposition** — when a task is created, an agent could suggest sub-tasks. The add-task server action is the right hook. Don't put agent calls inside this talk's code; just keep the action thin.
- **Suggested next task** — the today view could have a "what should I do next?" slot. Render a placeholder component (`<SuggestedNext />`) that returns `null` for now. Talk 3 replaces its implementation.

## What not to build here

- Auth — single-user for now, no login flow
- Real-time subscriptions — stale-while-revalidate via `revalidatePath` is enough
- Notifications / reminders — out of scope
- Drag-and-drop reordering — nice but not in the PRD
