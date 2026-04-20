import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn();
const revalidateMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidateMock }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: insertMock }),
  })),
}));

describe("createTask", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    revalidateMock.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://example.com";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  });

  it("rejects empty title server-side", async () => {
    const { createTask } = await import("./actions");
    const fd = new FormData();
    fd.set("title", "   ");
    const result = await createTask({ error: null }, fd);
    expect(result.error).toMatch(/title is required/i);
    expect(insertMock).not.toHaveBeenCalled();
    expect(revalidateMock).not.toHaveBeenCalled();
  });

  it("rejects missing title server-side", async () => {
    const { createTask } = await import("./actions");
    const fd = new FormData();
    const result = await createTask({ error: null }, fd);
    expect(result.error).toMatch(/title is required/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("inserts and revalidates on valid submission", async () => {
    const { createTask } = await import("./actions");
    const fd = new FormData();
    fd.set("title", "  Write tests  ");
    fd.set("notes", "cover happy path");
    fd.set("due_date", "2026-04-21");
    const result = await createTask({ error: null }, fd);
    expect(result.error).toBeNull();
    expect(insertMock).toHaveBeenCalledWith({
      title: "Write tests",
      notes: "cover happy path",
      due_date: "2026-04-21",
      parent_id: null,
    });
    expect(revalidateMock).toHaveBeenCalledWith("/");
  });

  it("inserts null notes, due_date, and parent_id when omitted", async () => {
    const { createTask } = await import("./actions");
    const fd = new FormData();
    fd.set("title", "Just a title");
    const result = await createTask({ error: null }, fd);
    expect(result.error).toBeNull();
    expect(insertMock).toHaveBeenCalledWith({
      title: "Just a title",
      notes: null,
      due_date: null,
      parent_id: null,
    });
  });

  it("passes parent_id through when provided (sub-task creation)", async () => {
    const { createTask } = await import("./actions");
    const fd = new FormData();
    fd.set("title", "Sub-task");
    fd.set("parent_id", "11111111-1111-1111-1111-111111111111");
    const result = await createTask({ error: null }, fd);
    expect(result.error).toBeNull();
    expect(insertMock).toHaveBeenCalledWith({
      title: "Sub-task",
      notes: null,
      due_date: null,
      parent_id: "11111111-1111-1111-1111-111111111111",
    });
    expect(revalidateMock).toHaveBeenCalledWith("/");
  });

  it("surfaces insert errors", async () => {
    insertMock.mockResolvedValue({ error: { message: "boom" } });
    const { createTask } = await import("./actions");
    const fd = new FormData();
    fd.set("title", "Valid");
    const result = await createTask({ error: null }, fd);
    expect(result.error).toBe("boom");
    expect(revalidateMock).not.toHaveBeenCalled();
  });
});
