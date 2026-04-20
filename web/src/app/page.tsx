import { AddTaskForm } from "@/components/AddTaskForm";
import { SuggestedNext } from "@/components/SuggestedNext";
import { TaskList } from "@/components/TaskList";

export default function TodayPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant mb-3">
          Today
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-on-surface leading-tight">
          What needs doing today?
        </h2>
      </div>

      <SuggestedNext />

      <div className="mb-12">
        <AddTaskForm />
      </div>

      <section>
        <h3 className="text-xl font-bold tracking-tight mb-6">Today&apos;s tasks</h3>
        <TaskList />
      </section>
    </div>
  );
}
