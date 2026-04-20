import Link from "next/link";
import type { Task } from "@/lib/types";
import { AddSubtaskForm } from "./AddSubtaskForm";

export function TaskCard({
  task,
  subtasks,
}: {
  task: Task;
  subtasks: Task[];
}) {
  return (
    <li className="bg-surface-container-high p-6 rounded-[var(--radius-card)]">
      <h4 className="text-lg font-semibold text-on-surface mb-2">
        <Link
          href={`/focus/${task.id}`}
          className="hover:text-primary transition-colors"
        >
          {task.title}
        </Link>
      </h4>
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

      {subtasks.length > 0 ? (
        <ul
          aria-label="Sub-tasks"
          className="mt-5 bg-surface-container-highest rounded-[var(--radius-card)] p-4 space-y-2"
        >
          {subtasks.map((sub) => (
            <li
              key={sub.id}
              className="text-sm text-on-surface leading-relaxed"
            >
              {sub.title}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        <AddSubtaskForm parentId={task.id} />
      </div>
    </li>
  );
}
