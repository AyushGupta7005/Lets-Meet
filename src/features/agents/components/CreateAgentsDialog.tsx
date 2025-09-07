import ResponsiveDialog from "@/components/responsive-dialog";
import React from "react";
import AgentsForm from "../forms/AgentsForm";
interface CreateAgentsDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function CreateAgentsDialog({
  userId,
  open,
  onOpenChange,
}: CreateAgentsDialogProps) {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentsForm
        userId={userId}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
