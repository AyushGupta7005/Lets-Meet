import ResponsiveDialog from "@/components/responsive-dialog";
import React from "react";
import MeetingsForm from "../forms/MeetingForm";
import { TMeetingsGetOne } from "../types";
interface CreateMeetingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TMeetingsGetOne;
}
export default function UpdateMeetingsDialog({
  open,
  onOpenChange,
  initialValues,
}: CreateMeetingsDialogProps) {
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
