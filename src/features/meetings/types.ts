import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type TMeetingsGetOne =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type TMeetingsGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
  Processing = "processing",
}
