import { createTRPCRouter } from "../init";
import { agentsRouter } from "@/features/agents/server/procedures";
import { meetingsRouter } from "@/features/meetings/server/procedures";
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
