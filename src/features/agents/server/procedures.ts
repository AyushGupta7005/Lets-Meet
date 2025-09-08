import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentCreateSchema, agentUpdateSchema } from "../schemas";
import z from "zod";
import { and, eq, getTableColumns, ilike, sql, desc, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../../../../constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({ ...getTableColumns(agent), meetingCount: sql<number>`5` })
        .from(agent)
        .where(and(eq(agent.userId, ctx.auth.user.id), eq(agent.id, input.id)));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No agent with id '${input.id}'`,
        });
      }

      return existingAgent;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        page: z.number().int().min(1).default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;
      const data = await db
        .select({ ...getTableColumns(agent), meetingCount: sql<number>`5` })
        .from(agent)
        .where(
          and(
            eq(agent.userId, ctx.auth.user.id),
            search ? ilike(agent.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(agent.createdAt), desc(agent.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
      const [total] = await db
        .select({ count: count() })
        .from(agent)
        .where(
          and(
            eq(agent.userId, ctx.auth.user.id),
            search ? ilike(agent.name, `%${search}%`) : undefined,
          ),
        );
      const totalPages = Math.ceil(total.count / pageSize);
      return {
        items: data,
        total: total.count ?? 0,
        totalPages: totalPages,
      };
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

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedAgent] = await db
        .delete(agent)
        .where(and(eq(agent.userId, ctx.auth.user.id), eq(agent.id, input.id)))
        .returning();
      if (!removedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No agent with id '${input.id}'`,
        });
      }
      return removedAgent;
    }),
  update: protectedProcedure
    .input(agentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      const [updatedAgent] = await db
        .update(agent)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(agent.userId, ctx.auth.user.id), eq(agent.id, id)))
        .returning();
      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No agent with id '${id}'`,
        });
      }
      return updatedAgent;
    }),
});
