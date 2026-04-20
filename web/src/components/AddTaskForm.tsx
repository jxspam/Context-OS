"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createTask } from "@/app/actions";
import { initialFormState } from "@/lib/actions-types";

export function AddTaskForm() {
  const [state, formAction, pending] = useActionState(createTask, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    prevPending.current = pending;
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate={false}
      className="bg-surface-container-high rounded-[var(--radius-card)] p-6 flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="add-task-title"
          className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant"
        >
          Title
        </label>
        <input
          id="add-task-title"
          name="title"
          type="text"
          required
          minLength={1}
          placeholder="What are you working on?"
          aria-label="Task title"
          disabled={pending}
          className="mt-1 w-full bg-transparent focus:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-3 py-2 text-lg font-medium placeholder:text-on-surface-variant/50"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-3">
        <div className="flex-1">
          <label
            htmlFor="add-task-notes"
            className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant"
          >
            Notes
          </label>
          <input
            id="add-task-notes"
            name="notes"
            type="text"
            placeholder="Optional context"
            aria-label="Notes"
            disabled={pending}
            className="mt-1 w-full bg-transparent focus:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-3 py-2 text-sm placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="md:w-48">
          <label
            htmlFor="add-task-due"
            className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant"
          >
            Due date
          </label>
          <input
            id="add-task-due"
            name="due_date"
            type="date"
            aria-label="Due date"
            disabled={pending}
            className="mt-1 w-full bg-transparent focus:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-3 py-2 text-sm text-on-surface"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-br from-primary to-secondary text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>{pending ? "Adding\u2026" : "Add task"}</span>
        </button>
      </div>

      {state.error ? (
        <p role="alert" className="text-xs text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
