"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Agents() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function AgentsLoader() {
  return <div>Loading...</div>;
}

export function AgentsError({ error }: { error: string }) {
  return <div>Error: {error}</div>;
}
