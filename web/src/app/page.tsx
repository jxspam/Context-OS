import { AddTaskForm } from "@/components/AddTaskForm";
import { SuggestedNext } from "@/components/SuggestedNext";
import { TaskList } from "@/components/TaskList";
import { parseFilter } from "@/lib/filters";

const HEADINGS = {
  today: {
    eyebrow: "Today",
    title: "What needs doing today?",
    section: "Today's tasks",
  },
  upcoming: {
    eyebrow: "Upcoming",
    title: "What's on the horizon?",
    section: "Upcoming tasks",
  },
  all: {
    eyebrow: "All tasks",
    title: "Everything in your workspace",
    section: "All tasks",
  },
} as const;

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter = parseFilter(rawFilter);
  const heading = HEADINGS[filter];

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant mb-3">
          {heading.eyebrow}
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-on-surface leading-tight">
          {heading.title}
        </h2>
      </div>

      {filter === "today" ? <SuggestedNext /> : null}

      <div className="mb-12">
        <AddTaskForm />
      </div>

      <section>
        <h3 className="text-xl font-bold tracking-tight mb-6">
          {heading.section}
        </h3>
        <TaskList filter={filter} />
      </section>
    </div>
  );
}
