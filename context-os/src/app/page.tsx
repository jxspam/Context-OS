"use client";

import { useState, useCallback } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopNav } from "@/components/layout/TopNav";
import { ContextPanel } from "@/components/layout/ContextPanel";
import { SuggestedTaskHero } from "@/components/workspace/SuggestedTaskHero";
import { TaskCard, type Task } from "@/components/workspace/TaskCard";
import { AgenticInput } from "@/components/workspace/AgenticInput";

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Review component library",
    description:
      "Update the spacing tokens to reflect the new Sanctuary 'No-Line' philosophy.",
    category: "Design",
    icon: "edit_square",
  },
  {
    id: "2",
    title: "Sync with Engineering",
    description:
      "Discuss the Tailwind implementation of glassmorphism and ambient shadows.",
    category: "Meeting",
    icon: "groups",
  },
  {
    id: "3",
    title: "Draft Q3 Strategy",
    description:
      "Focus on user expansion and the new 'Context Bridge' feature set.",
    category: "Content",
    icon: "description",
  },
  {
    id: "4",
    title: "Clear primary inbox",
    description:
      "Sort priority requests and archive finalized project threads.",
    category: "Admin",
    icon: "mail",
  },
];

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const handleTasksGenerated = useCallback((newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
  }, []);

  return (
    <div className="h-full bg-surface">
      <SideNav />
      <TopNav />

      {/* Main Content Canvas */}
      <main className="ml-64 mr-80 pt-16 min-h-screen bg-surface p-10 flex flex-col">
        {/* Zen Header */}
        <div className="mb-12 mt-4 max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight text-on-surface leading-tight mb-2">
            Good morning, Julian.
          </h2>
          <p className="text-lg text-on-surface-variant/80">
            You have 3 focus hours scheduled for the &lsquo;Sanctuary
            Design&rsquo; project today.
          </p>
        </div>

        <SuggestedTaskHero />

        {/* Today's Tasks */}
        <section className="flex-grow">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold tracking-tight">
              Today&apos;s Tasks
            </h4>
            <div className="flex gap-2">
              <button className="bg-surface-container-highest px-3 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                All Tasks
              </button>
              <button className="px-3 py-1.5 rounded-full text-xs font-bold text-on-surface-variant/50 hover:bg-surface-container transition-colors">
                Completed
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </section>
      </main>

      <ContextPanel />
      <AgenticInput onTasksGenerated={handleTasksGenerated} />
    </div>
  );
}
