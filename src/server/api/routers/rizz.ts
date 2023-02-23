import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const rizzRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rizz.findMany({
      orderBy: {
        votes: "desc",
      },
    });
  }),

  submit: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rizz.create({
        data: {
          rizz: input.name,
        },
      });
    }),

  upvote: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rizz.update({
        where: {
          id: input.id,
        },
        data: {
          votes: {
            increment: 1,
          },
        },
      });
    }),

  downvote: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rizz.update({
        where: {
          id: input.id,
        },
        data: {
          votes: {
            decrement: 1,
          },
        },
      });
    }),
});
