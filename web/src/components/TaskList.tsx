import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";

export async function TaskList() {
  const supabase = await createClient();
  let tasks: Task[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    tasks = (data as Task[] | null) ?? [];
  }

  const topLevel = tasks.filter((t) => t.parent_id === null);
  const childrenByParent = new Map<string, Task[]>();
  for (const task of tasks) {
    if (task.parent_id !== null) {
      const bucket = childrenByParent.get(task.parent_id) ?? [];
      bucket.push(task);
      childrenByParent.set(task.parent_id, bucket);
    }
  }

  if (topLevel.length === 0) {
    return (
      <div className="bg-surface-container rounded-[var(--radius-card)] py-16 px-8 text-center">
        <p className="text-on-surface-variant">
          No tasks yet. Add your first one above.
        </p>
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
