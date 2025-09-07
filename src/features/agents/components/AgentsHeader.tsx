"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import CreateAgentsDialog from "./CreateAgentsDialog";

export default function AgentsHeader({ userId }: { userId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <CreateAgentsDialog
        userId={userId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Agents</h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="active:scale-95"
          >
            <PlusIcon />
            New Agent
          </Button>
        </div>
      </div>
    </>
  );
}
