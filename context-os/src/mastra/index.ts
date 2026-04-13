import { Mastra } from "@mastra/core";
import { contextAgent } from "./agents/context-agent";

export const mastra = new Mastra({
  agents: { contextAgent },
});
