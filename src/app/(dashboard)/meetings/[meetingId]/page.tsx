import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import MeetingIdPage, {
  MeetingIdError,
  MeetingIdLoader,
} from "@/features/meetings/components/MeetingIdPage";

interface MeetingPageProps {
  params: Promise<{ meetingId: string }>;
}
export default async function MeetingPage({ params }: MeetingPageProps) {
  const { meetingId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdLoader />}>
        <ErrorBoundary fallback={<MeetingIdError />}>
          <MeetingIdPage meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
