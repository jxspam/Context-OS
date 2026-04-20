import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";
import { matchesFilter, toISODate, type Filter } from "@/lib/filters";
import { TaskCard } from "./TaskCard";

const EMPTY_STATE: Record<Filter, string> = {
  today: "Nothing due today. Add one above.",
  upcoming: "No upcoming tasks.",
  all: "No tasks yet. Add your first one above.",
};

export async function TaskList({ filter }: { filter: Filter }) {
  const supabase = await createClient();
  let tasks: Task[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    tasks = (data as Task[] | null) ?? [];
  }

  const today = toISODate(new Date());
  const childrenByParent = new Map<string, Task[]>();
  for (const task of tasks) {
    if (task.parent_id !== null) {
      const bucket = childrenByParent.get(task.parent_id) ?? [];
      bucket.push(task);
      childrenByParent.set(task.parent_id, bucket);
    }
  }

  const topLevel = tasks
    .filter((t) => t.parent_id === null)
    .filter((t) => matchesFilter(t.due_date, filter, today));

  if (topLevel.length === 0) {
    return (
      <div className="bg-surface-container rounded-[var(--radius-card)] py-16 px-8 text-center">
        <p className="text-on-surface-variant">{EMPTY_STATE[filter]}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {topLevel.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          subtasks={childrenByParent.get(task.id) ?? []}
        />
      ))}
    </ul>
  );
}
