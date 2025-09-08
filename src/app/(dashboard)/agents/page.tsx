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
import { loadAgentsSearchParams } from "@/features/agents/params";
import type { SearchParams } from "nuqs";
interface AgentsPageProps {
  searchParams: Promise<SearchParams>;
}
export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const filters = await loadAgentsSearchParams(searchParams);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    }),
  );
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
