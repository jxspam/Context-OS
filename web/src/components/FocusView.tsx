"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import type { Task } from "@/lib/types";

const POMODORO_SECONDS = 25 * 60;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function FocusView({ task }: { task: Task }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleBack();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleBack]);

  const isDone = secondsLeft === 0;

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
      <div className="self-start mb-10">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          <span>Back</span>
        </button>
      </div>

      <p className="text-[11px] uppercase tracking-[0.12em] text-on-surface-variant mb-4">
        Focus Mode
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-on-surface leading-tight mb-4">
        {task.title}
      </h1>
      {task.notes ? (
        <p className="text-base text-on-surface-variant leading-relaxed max-w-xl mb-12">
          {task.notes}
        </p>
      ) : (
        <div className="mb-12" />
      )}

      <div
        role="timer"
        aria-live="polite"
        aria-label="Pomodoro timer"
        className="text-[9rem] font-black tracking-tighter text-on-surface leading-none tabular-nums"
      >
        {formatTime(secondsLeft)}
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] font-semibold text-on-surface-variant">
        Minutes Remaining
      </p>

      {isDone ? (
        <p
          role="status"
          className="mt-10 text-lg font-semibold text-primary"
        >
          Done &mdash; take a break
        </p>
      ) : null}

      <div className="mt-12 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setRunning(true)}
          disabled={running || isDone}
          className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-secondary text-white font-semibold px-6 py-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
        >
          <Play className="w-4 h-4" strokeWidth={2} />
          <span>Start</span>
        </button>
        <button
          type="button"
          onClick={() => setRunning(false)}
          disabled={!running}
          className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-semibold px-6 py-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-colors"
        >
          <Pause className="w-4 h-4" strokeWidth={2} />
          <span>Pause</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(POMODORO_SECONDS);
          }}
          className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-semibold px-6 py-3 rounded-full text-sm hover:bg-surface-container-highest transition-colors"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
