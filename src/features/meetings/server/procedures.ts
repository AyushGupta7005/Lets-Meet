import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { and, eq, getTableColumns, ilike, desc, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../../../../constants";
import { TRPCError } from "@trpc/server";
import {
  meetingCreateSchema,
  meetingUpdateSchema,
} from "@/features/meetings/schemas";

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({ ...getTableColumns(meetings) })
        .from(meetings)
        .where(
          and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id)),
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No meeting with id '${input.id}'`,
        });
      }

      return existingMeeting;
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
        .select({ ...getTableColumns(meetings) })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
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
    .input(meetingCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const [newAgent] = await db
        .insert(meetings)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();
      return newAgent;
    }),

  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [updatedMeeting] = await db
        .update(meetings)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, id)))
        .returning();
      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No meeting with id '${input.id}'`,
        });
      }
      return updatedMeeting;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, input.id)),
        )
        .returning();
      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No meeting with id '${input.id}'`,
        });
      }
      return removedMeeting;
    }),
});
