"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "./TaskCard";

interface AgenticInputProps {
  onTasksGenerated: (tasks: Task[]) => void;
}

export function AgenticInput({ onTasksGenerated }: AgenticInputProps) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || isLoading) return;

      const prompt = value.trim();
      setValue("");
      setIsLoading(true);
      setStreamedText("");

      try {
        const res = await fetch("/api/agent/decompose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: prompt }),
        });

        if (!res.ok) throw new Error("Agent request failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;

          buffer += decoder.decode(chunk, { stream: true });
          setStreamedText(buffer);
        }

        const parsed = JSON.parse(buffer);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          onTasksGenerated(
            parsed.tasks.map(
              (
                t: {
                  title: string;
                  description: string;
                  category: string;
                },
                i: number,
              ) => ({
                id: `generated-${Date.now()}-${i}`,
                title: t.title,
                description: t.description || "",
                category: t.category || "Research",
                icon: categoryToIcon(t.category),
              }),
            ),
          );
        }
      } catch {
        // Fallback: generate mock tasks for demo purposes when API isn't available
        const mockTasks = generateMockTasks(prompt);
        onTasksGenerated(mockTasks);
      } finally {
        setIsLoading(false);
        setStreamedText("");
      }
    },
    [value, isLoading, onTasksGenerated],
  );

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
      <AnimatePresence>
        {streamedText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 glass-overlay rounded-2xl p-4 text-sm text-on-surface-variant leading-relaxed max-h-32 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined filled text-primary-container text-sm">
                auto_awesome
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">
                Decomposing...
              </span>
            </div>
            <p className="text-xs font-mono opacity-70">{streamedText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-2 flex items-center gap-3 border border-outline-variant/15">
          <div className="flex-shrink-0 ml-2">
            <span
              className={`material-symbols-outlined filled text-primary-container ${isLoading ? "animate-spin" : ""}`}
            >
              {isLoading ? "progress_activity" : "colors_spark"}
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask ContextOS to decompose a task, find context, or plan your day..."
            className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-3 text-on-surface placeholder:text-on-surface-variant/40"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="adaptive-gradient text-white p-2 rounded-xl hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function categoryToIcon(category: string): string {
  const map: Record<string, string> = {
    Design: "edit_square",
    Meeting: "groups",
    Content: "description",
    Admin: "mail",
    Research: "travel_explore",
  };
  return map[category] || "task_alt";
}

function generateMockTasks(prompt: string): Task[] {
  const words = prompt.toLowerCase();

  if (words.includes("pitch") || words.includes("investor")) {
    return [
      {
        id: `gen-${Date.now()}-0`,
        title: "Research target investors",
        description:
          "Compile a list of investors aligned with our stage and sector.",
        category: "Research",
        icon: "travel_explore",
      },
      {
        id: `gen-${Date.now()}-1`,
        title: "Draft pitch deck narrative",
        description:
          "Structure the story: problem, solution, traction, ask.",
        category: "Content",
        icon: "description",
      },
      {
        id: `gen-${Date.now()}-2`,
        title: "Design pitch deck visuals",
        description:
          "Apply Kinetic Sanctuary design language to slide templates.",
        category: "Design",
        icon: "edit_square",
      },
      {
        id: `gen-${Date.now()}-3`,
        title: "Schedule practice sessions",
        description: "Book 2 dry-run sessions with the team this week.",
        category: "Meeting",
        icon: "groups",
      },
    ];
  }

  return [
    {
      id: `gen-${Date.now()}-0`,
      title: "Break down the objective",
      description: `Define clear success criteria for: "${prompt}"`,
      category: "Research",
      icon: "travel_explore",
    },
    {
      id: `gen-${Date.now()}-1`,
      title: "Gather relevant context",
      description: "Pull related documents, threads, and prior work.",
      category: "Admin",
      icon: "mail",
    },
    {
      id: `gen-${Date.now()}-2`,
      title: "Create first draft",
      description: "Produce the initial deliverable based on gathered context.",
      category: "Content",
      icon: "description",
    },
    {
      id: `gen-${Date.now()}-3`,
      title: "Review with stakeholders",
      description: "Share draft and collect feedback before finalizing.",
      category: "Meeting",
      icon: "groups",
    },
  ];
}
