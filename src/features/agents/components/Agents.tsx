"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Agents() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function AgentsLoader() {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take some while..."
    />
  );
}

export function AgentsError() {
  return (
    <ErrorState
      title="Failed to load Agents"
      description={"Something went wrong..."}
    />
  );
}
