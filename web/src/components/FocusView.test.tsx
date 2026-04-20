import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import type { Task } from "@/lib/types";

const backMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backMock }),
}));

import { FocusView } from "./FocusView";

const baseTask: Task = {
  id: "task-1",
  title: "Refine grid system",
  notes: "Editorial dashboard tuning",
  due_date: null,
  status: "open",
  parent_id: null,
  created_at: "2026-04-20T00:00:00Z",
};

describe("FocusView", () => {
  beforeEach(() => {
    backMock.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the task title, notes, and a 25:00 timer at rest", () => {
    render(<FocusView task={baseTask} />);
    expect(screen.getByText("Refine grid system")).toBeInTheDocument();
    expect(
      screen.getByText("Editorial dashboard tuning"),
    ).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  });

  it("starts counting down when Start is pressed and pauses on Pause", () => {
    render(<FocusView task={baseTask} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("24:57");

    fireEvent.click(screen.getByRole("button", { name: /pause/i }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("24:57");
  });

  it("resets to 25:00 when Reset is pressed", () => {
    render(<FocusView task={baseTask} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("24:50");

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  });

  it("shows the done message when the timer reaches 00:00", () => {
    render(<FocusView task={baseTask} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
    expect(screen.getByRole("status")).toHaveTextContent(
      /done.*take a break/i,
    );
  });

  it("calls router.back when the Back button is clicked", () => {
    render(<FocusView task={baseTask} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it("calls router.back when Escape is pressed", () => {
    render(<FocusView task={baseTask} />);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(backMock).toHaveBeenCalledTimes(1);
  });
});
