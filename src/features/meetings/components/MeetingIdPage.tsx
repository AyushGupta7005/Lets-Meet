"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React from "react";
import GeneratedAvatar from "@/components/generated-avatar";
// import { Badge } from "@/components/ui/badge";
// import { VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirmation";
import UpdateMeetingsDialog from "./UpdateMeetingsDialog";
import MeetingIdPageHeader from "./MeetingIdHeader";
interface MeetingIdPageProps {
  meetingId: string;
}
export default function MeetingIdPage({ meetingId }: MeetingIdPageProps) {
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const deleteMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        router.push("/meetings");
      },
      onError: (error) =>
        toast.error(error.message || "Failed to delete meeting"),
    }),
  );
  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action is permanent and cannot be undone.`,
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    deleteMeeting.mutate({ id: meetingId });
  };

  return (
    <>
      <UpdateMeetingsDialog
        initialValues={data}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
      <RemoveConfirmationDialog />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <MeetingIdPageHeader
          meetingId={meetingId}
          meetingName={data?.name || ""}
          onEdit={() => setUpdateDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        <div className="rounded-lg border bg-white">
          <div className="flex flex-col gap-y-5 px-4 py-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                seed={data.name}
                className="size-10"
                variant="botttsNeutral"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            {/* <Badge variant={"outline"} className="flex items-center gap-x-2">
              <VideoIcon className="text-blue-700" />
              {(() => {
                const count = data.meetingCount ?? 0;
                if (count === 0) return "No meetings";
                return `${count} ${count > 1 ? "meetings" : "meeting"}`;
              })()}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export function MeetingIdLoader() {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take some while..."
    />
  );
}

export function MeetingIdError() {
  return (
    <ErrorState
      title="Failed to load Meeting"
      description={"Something went wrong..."}
    />
  );
}
