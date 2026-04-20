import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/app/actions", () => ({
  createTask: vi.fn(async () => ({ error: null })),
}));

import { AddSubtaskForm } from "./AddSubtaskForm";

describe("AddSubtaskForm", () => {
  it("starts collapsed as a '+ subtask' trigger button", () => {
    render(<AddSubtaskForm parentId="parent-1" />);
    expect(
      screen.getByRole("button", { name: /add sub-task/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/sub-task title/i),
    ).not.toBeInTheDocument();
  });

  it("reveals the inline input with a hidden parent_id field when opened", () => {
    render(<AddSubtaskForm parentId="parent-42" />);
    fireEvent.click(screen.getByRole("button", { name: /add sub-task/i }));

    const title = screen.getByLabelText(/sub-task title/i) as HTMLInputElement;
    expect(title).toBeRequired();
    expect(title).toHaveAttribute("name", "title");

    const hidden = title.form?.elements.namedItem(
      "parent_id",
    ) as HTMLInputElement | null;
    expect(hidden).not.toBeNull();
    expect(hidden?.type).toBe("hidden");
    expect(hidden?.value).toBe("parent-42");

    expect(
      screen.getByRole("button", { name: /^add$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
  });

  it("collapses back to the trigger when Cancel is clicked", () => {
    render(<AddSubtaskForm parentId="parent-9" />);
    fireEvent.click(screen.getByRole("button", { name: /add sub-task/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(
      screen.queryByLabelText(/sub-task title/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add sub-task/i }),
    ).toBeInTheDocument();
  });
});
