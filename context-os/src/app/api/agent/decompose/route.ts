import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agent/decompose
 *
 * This route is the integration point for Mastra.ai.
 * When @mastra/core is installed and an API key is configured,
 * swap the mock implementation below with the real agent call.
 *
 * The Mastra agent would be:
 *
 *   import { Agent } from "@mastra/core";
 *   import { createTool } from "@mastra/core/tools";
 *   import { z } from "zod";
 *
 *   const decomposeTask = createTool({
 *     id: "decompose-task",
 *     description: "Break a high-level task into actionable subtasks",
 *     inputSchema: z.object({ taskDescription: z.string() }),
 *     outputSchema: z.object({
 *       tasks: z.array(z.object({
 *         title: z.string(),
 *         description: z.string(),
 *         category: z.enum(["Design","Meeting","Content","Admin","Research"]),
 *       })),
 *     }),
 *     execute: async ({ context }) => { ... },
 *   });
 *
 *   const contextAgent = new Agent({
 *     name: "ContextOS Agent",
 *     instructions: "You decompose tasks into actionable subtasks...",
 *     model: "anthropic/claude-sonnet-4-6",
 *     tools: { decomposeTask },
 *   });
 *
 *   // In the handler:
 *   const result = await contextAgent.generate(prompt);
 */

const CATEGORY_ICONS: Record<string, string> = {
  Design: "edit_square",
  Meeting: "groups",
  Content: "description",
  Admin: "mail",
  Research: "travel_explore",
};

export async function POST(request: NextRequest) {
  const { task } = await request.json();

  if (!task || typeof task !== "string") {
    return NextResponse.json(
      { error: "Missing 'task' field" },
      { status: 400 },
    );
  }

  // Simulate agent processing with streaming delay
  const tasks = decomposeTaskMock(task);
  const result = JSON.stringify({ tasks });

  // Stream the response character-by-character to simulate Mastra .stream()
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < result.length; i++) {
        controller.enqueue(encoder.encode(result[i]));
        // Simulate token-by-token streaming
        if (i % 10 === 0) {
          await new Promise((r) => setTimeout(r, 15));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });
}

function decomposeTaskMock(
  prompt: string,
): { title: string; description: string; category: string; icon: string }[] {
  const lower = prompt.toLowerCase();

  if (lower.includes("pitch") || lower.includes("investor")) {
    return [
      {
        title: "Research target investors",
        description:
          "Compile a list of investors aligned with our stage and sector.",
        category: "Research",
        icon: CATEGORY_ICONS["Research"],
      },
      {
        title: "Draft pitch deck narrative",
        description: "Structure the story: problem, solution, traction, ask.",
        category: "Content",
        icon: CATEGORY_ICONS["Content"],
      },
      {
        title: "Design pitch deck visuals",
        description:
          "Apply Kinetic Sanctuary design language to slide templates.",
        category: "Design",
        icon: CATEGORY_ICONS["Design"],
      },
      {
        title: "Schedule dry-run sessions",
        description: "Book 2 practice sessions with the team this week.",
        category: "Meeting",
        icon: CATEGORY_ICONS["Meeting"],
      },
    ];
  }

  if (lower.includes("launch") || lower.includes("product")) {
    return [
      {
        title: "Conduct market research",
        description: "Analyze competitors and identify positioning.",
        category: "Research",
        icon: CATEGORY_ICONS["Research"],
      },
      {
        title: "Define product requirements",
        description: "Write user stories and acceptance criteria for MVP.",
        category: "Content",
        icon: CATEGORY_ICONS["Content"],
      },
      {
        title: "Design UI prototype",
        description: "Create high-fidelity mockups following the Sanctuary system.",
        category: "Design",
        icon: CATEGORY_ICONS["Design"],
      },
      {
        title: "Coordinate launch plan",
        description:
          "Align marketing, engineering, and support on timeline.",
        category: "Meeting",
        icon: CATEGORY_ICONS["Meeting"],
      },
    ];
  }

  return [
    {
      title: "Define success criteria",
      description: `Clarify what "done" looks like for: "${prompt}"`,
      category: "Research",
      icon: CATEGORY_ICONS["Research"],
    },
    {
      title: "Gather context and resources",
      description: "Pull related documents, threads, and prior work.",
      category: "Admin",
      icon: CATEGORY_ICONS["Admin"],
    },
    {
      title: "Produce first deliverable",
      description: "Create the initial output based on gathered context.",
      category: "Content",
      icon: CATEGORY_ICONS["Content"],
    },
    {
      title: "Stakeholder review",
      description: "Share draft and collect feedback before finalizing.",
      category: "Meeting",
      icon: CATEGORY_ICONS["Meeting"],
    },
  ];
}
