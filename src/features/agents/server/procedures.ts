import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentCreateSchema } from "../schemas";
import z from "zod";
import { and, eq, getTableColumns, ilike, sql, desc, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../../../../constants";

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
});
