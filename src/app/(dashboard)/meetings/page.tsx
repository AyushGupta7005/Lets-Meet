import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import type { SearchParams } from "nuqs";
import { loadMeetingsSearchParams } from "@/features/meetings/params";
import Meetings, {
  MeetingsError,
  MeetingsLoader,
} from "@/features/meetings/components/Meetings";
import MeetingsHeader from "@/features/meetings/components/MeetingsHeader";
interface MeetingsPageProps {
  searchParams: Promise<SearchParams>;
}
export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const filters = await loadMeetingsSearchParams(searchParams);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({}));
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    }),
  );
  return (
    <>
      <MeetingsHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsLoader />}>
          <ErrorBoundary fallback={<MeetingsError />}>
            <Meetings />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
