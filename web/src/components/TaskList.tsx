import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";

export async function TaskList() {
  const supabase = await createClient();
  let tasks: Task[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    tasks = (data as Task[] | null) ?? [];
  }

  if (tasks.length === 0) {
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
      {tasks.map((task) => (
        <li
          key={task.id}
          className="bg-surface-container-high p-6 rounded-[var(--radius-card)]"
        >
          <h4 className="text-lg font-semibold text-on-surface mb-2">{task.title}</h4>
          {task.notes ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {task.notes}
            </p>
          ) : null}
          {task.due_date ? (
            <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">
              Due {new Date(task.due_date).toLocaleDateString()}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
