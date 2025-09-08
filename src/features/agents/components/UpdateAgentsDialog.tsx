import ResponsiveDialog from "@/components/responsive-dialog";
import React from "react";
import AgentsForm from "../forms/AgentsForm";
import { TAgentGetOne } from "../types";
interface CreateAgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intialValues: TAgentGetOne;
}
export default function UpdateAgentsDialog({
  open,
  onOpenChange,
  intialValues,
}: CreateAgentsDialogProps) {
  return (
    <ResponsiveDialog
      title="Update Agent"
      description="Update agent details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        intialValues={intialValues}
      />
    </ResponsiveDialog>
  );
}
