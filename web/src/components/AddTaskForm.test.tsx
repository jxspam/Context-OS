import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/app/actions", () => ({
  createTask: vi.fn(async () => ({ error: null })),
}));

import { AddTaskForm } from "./AddTaskForm";

describe("AddTaskForm", () => {
  it("renders a required title and optional notes / due date", () => {
    render(<AddTaskForm />);

    const title = screen.getByLabelText(/task title/i) as HTMLInputElement;
    const notes = screen.getByLabelText(/notes/i) as HTMLInputElement;
    const due = screen.getByLabelText(/due date/i) as HTMLInputElement;

    expect(title).toBeRequired();
    expect(notes).not.toBeRequired();
    expect(due).not.toBeRequired();
    expect(title).toHaveAttribute("name", "title");
    expect(notes).toHaveAttribute("name", "notes");
    expect(due).toHaveAttribute("name", "due_date");
    expect(due.type).toBe("date");

    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });
});
