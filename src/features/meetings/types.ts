import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type TMeetingsGetOne =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"];
