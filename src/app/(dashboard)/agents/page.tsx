import {
  Agents,
  AgentsError,
  AgentsLoader,
} from "@/features/agents/components/Agents";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import AgentsHeader from "@/features/agents/components/AgentsHeader";

export default async function AgentsPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <>
      <AgentsHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoader />}>
          <ErrorBoundary fallback={<AgentsError />}>
            <Agents />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
