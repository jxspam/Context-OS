import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const taskSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Short, actionable task title"),
      description: z
        .string()
        .describe("One-sentence description of what to do"),
      category: z
        .enum(["Design", "Meeting", "Content", "Admin", "Research"])
        .describe("Task category for UI grouping"),
    }),
  ),
});

export type DecomposedTasks = z.infer<typeof taskSchema>;

export const decomposeTask = createTool({
  id: "decompose-task",
  description:
    "Break a high-level task or goal into 3-6 concrete, actionable subtasks. " +
    "Each subtask should be specific enough to start immediately and completable in one session.",
  inputSchema: z.object({
    taskDescription: z
      .string()
      .describe("The high-level task or goal to decompose"),
    projectContext: z
      .string()
      .optional()
      .describe("Optional context about the project or workspace"),
  }),
  execute: async ({ taskDescription, projectContext }) => {
    return {
      input: taskDescription,
      projectContext: projectContext ?? "general workspace",
    };
  },
});
