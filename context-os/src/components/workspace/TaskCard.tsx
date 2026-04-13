"use client";

import { motion } from "framer-motion";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: "Design" | "Meeting" | "Content" | "Admin" | "Research";
  icon: string;
}

const categoryColors: Record<Task["category"], string> = {
  Design: "text-primary-container",
  Meeting: "text-tertiary",
  Content: "text-primary",
  Admin: "text-secondary",
  Research: "text-tertiary-container",
};

export function TaskCard({
  task,
  index,
}: {
  task: Task;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-surface-container-high p-6 rounded-3xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-10">
        <span
          className={`bg-surface-container-highest p-2 rounded-xl ${categoryColors[task.category]}`}
        >
          <span className="material-symbols-outlined">{task.icon}</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-tighter bg-on-surface/5 px-2 py-1 rounded-md text-on-surface-variant">
          {task.category}
        </span>
      </div>

      <h5 className="text-lg font-semibold mb-2 group-hover:text-primary-container transition-colors">
        {task.title}
      </h5>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {task.description}
      </p>
    </motion.div>
  );
}
