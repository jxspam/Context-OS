import { NextRequest } from "next/server";
import { mastra } from "@/mastra";
import { taskSchema } from "@/mastra/tools/decompose-task";

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
    return Response.json({ error: "Missing 'task' field" }, { status: 400 });
  }

  // If OPENAI_API_KEY is set, use the real Mastra agent
  if (process.env.OPENAI_API_KEY) {
    try {
      const agent = mastra.getAgent("contextAgent");

      const result = await agent.generate(
        `Decompose this task into actionable subtasks: "${task}"`,
        {
          structuredOutput: {
            schema: taskSchema,
          },
        },
      );

      const parsed = result.object as { tasks: Array<{ title: string; description: string; category: string }> };

      if (parsed?.tasks) {
        const tasks = parsed.tasks.map((t) => ({
          ...t,
          icon: CATEGORY_ICONS[t.category] || "task_alt",
        }));
        return Response.json({ tasks });
      }

      return Response.json(
        { error: "Agent returned no structured output" },
        { status: 500 },
      );
    } catch (err) {
      console.error("[Mastra Agent Error]", err);
      // Fall through to mock if agent fails
    }
  }

  // Fallback: mock decomposition (works without an API key for demos)
  const tasks = decomposeTaskMock(task);

  // Stream the response to simulate Mastra .stream() behavior
  const payload = JSON.stringify({ tasks });
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < payload.length; i++) {
        controller.enqueue(encoder.encode(payload[i]));
        if (i % 10 === 0) await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}

// ── Mock decomposition for offline / demo use ──

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
        description:
          "Create high-fidelity mockups following the Sanctuary system.",
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
