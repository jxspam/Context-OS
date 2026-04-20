"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createTask } from "@/app/actions";
import { initialFormState } from "@/lib/actions-types";

export function AddSubtaskForm({ parentId }: { parentId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createTask,
    initialFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setOpen(false);
    }
    prevPending.current = pending;
  }, [pending, state]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Add sub-task"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        <span>subtask</span>
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="parent_id" value={parentId} />
      <input
        name="title"
        type="text"
        required
        minLength={1}
        autoFocus
        placeholder="Sub-task title"
        aria-label="Sub-task title"
        disabled={pending}
        className="bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-br from-primary to-secondary text-white font-semibold px-4 py-1.5 rounded-full text-xs disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
        >
          {pending ? "Adding\u2026" : "Add"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={pending}
          className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-3 h-3" strokeWidth={2} />
          <span>Cancel</span>
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
