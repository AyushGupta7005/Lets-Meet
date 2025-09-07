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
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AgentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
    return null;
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ userId: session.user.id }),
  );

  return (
    <>
      <AgentsHeader userId={session.user.id} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoader />}>
          <ErrorBoundary fallback={<AgentsError />}>
            <Agents userId={session.user.id} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
