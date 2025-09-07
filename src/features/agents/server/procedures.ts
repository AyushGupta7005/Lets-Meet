import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentCreateSchema } from "../schemas";
import z from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [data] = await db
        .select({ ...getTableColumns(agent), meetingCount: sql<number>`5` })
        .from(agent)
        .where(eq(agent.id, input.id));
      return data;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select({ ...getTableColumns(agent), meetingCount: sql<number>`5` })
      .from(agent)
      .where(eq(agent.userId, ctx.auth.user.id));
    return data;
  }),

  create: protectedProcedure
    .input(agentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const [newAgent] = await db
        .insert(agent)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();
      return newAgent;
    }),
});
