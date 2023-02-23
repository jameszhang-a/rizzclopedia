import { Prisma } from "@prisma/client";
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
    .mutation(async ({ ctx, input }) => {
      // make sure the input contains the word "rizz" in it
      if (!input.name.toLowerCase().includes("rizz")) {
        throw new Error("not enough rizz 🤏");
      }

      try {
        const rizz = await ctx.prisma.rizz.create({
          data: {
            rizz: input.name,
          },
        });
        return rizz;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new Error("rizz already exists 😔");
          } else {
            throw new Error("Something went wrong. Please try again later.");
          }
        }
      }
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
