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
