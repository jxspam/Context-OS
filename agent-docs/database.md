# Database

Supabase (managed Postgres). Hosted free tier. All schema changes go through migrations in `web/supabase/migrations/`.

## Schema

### `tasks`

```sql
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  notes       text,
  due_date    timestamptz,
  status      text not null default 'open' check (status in ('open', 'done')),
  parent_id   uuid references public.tasks(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index tasks_parent_id_idx on public.tasks(parent_id);
create index tasks_due_date_idx  on public.tasks(due_date);
```

Keep it this simple. Don't add columns until a story asks for them.

## Access patterns

Use `@supabase/ssr` — **not** the legacy `@supabase/auth-helpers-nextjs`.

### Server client (`src/lib/supabase/server.ts`)

Called from server components and server actions. Reads cookies for future auth; today it's effectively anonymous. Use `createServerClient` with `cookies()` from `next/headers`.

### Browser client (`src/lib/supabase/client.ts`)

Only inside `"use client"` components. Uses `createBrowserClient`. Almost nothing should use this — if you find yourself reaching for it, check whether a server component + server action does the job instead.

## Migrations

- One migration file per story that touches schema
- Name: `NNN_short_description.sql` where `NNN` is next sequential (001, 002…)
- Always reversible in theory (though we don't write `down` migrations — Supabase branching handles that)
- Apply locally with `supabase db push`
- Apply to hosted project: `supabase link --project-ref <ref>` then `supabase db push`

## What not to do

- No raw SQL in server actions. Always go through the Supabase client.
- No RLS policies yet (single-user, local demo). If you add auth, add policies at the same time.
- No seed data committed — empty DB is the default start state. The add-task flow is how you get rows.
