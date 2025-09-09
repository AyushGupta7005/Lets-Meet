import ResponsiveDialog from "@/components/responsive-dialog";
import React from "react";
import MeetingsForm from "../forms/MeetingForm";
import { useRouter } from "next/navigation";
interface CreateMeetingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function CreateMeetingsDialog({
  open,
  onOpenChange,
}: CreateMeetingsDialogProps) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
