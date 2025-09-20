import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type TAgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
export type TAgentGetMany =
  inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
