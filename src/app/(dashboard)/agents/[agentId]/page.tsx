import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import AgentIdPage, {
  AgentIdError,
  AgentIdLoader,
} from "@/features/agents/components/AgentIdPage";

interface AgentPageProps {
  params: Promise<{ agentId: string }>;
}
export default async function AgentPage({ params }: AgentPageProps) {
  const { agentId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentIdLoader />}>
        <ErrorBoundary fallback={<AgentIdError />}>
          <AgentIdPage agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
