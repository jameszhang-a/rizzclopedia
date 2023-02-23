import { createTRPCRouter } from "~/server/api/trpc";
import { rizzRouter } from "~/server/api/routers/rizz";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rizz: rizzRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
