export type TaskStatus = "open" | "done";

export type Task = {
  id: string;
  title: string;
  notes: string | null;
  due_date: string | null;
  status: TaskStatus;
  parent_id: string | null;
  created_at: string;
};
