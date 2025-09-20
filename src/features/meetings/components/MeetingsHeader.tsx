"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import CreateMeetingsDialog from "./CreateMeetingsDialog";
import useMeetingsFilters from "../hooks/useMeetingsFilters";
import MeetingSearchFilter from "./MeetingSearchFilter";
import { DEFAULT_PAGE } from "../../../../constants";
import StatusFilters from "./status-filters";
import AgentIdFilters from "./agentId-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export default function MeetingsHeader() {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId;
  const onClearFilters = () => {
    setFilters({
      page: DEFAULT_PAGE,
      status: null,
      search: "",
      agentId: "",
    });
  };
  return (
    <>
      <CreateMeetingsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">My Meetings</h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="active:scale-95"
          >
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea className="space-y-2">
          <div className="flex items-center gap-x-2 p-1">
            <MeetingSearchFilter />
            <StatusFilters />
            <AgentIdFilters />
            {isAnyFilterModified && (
              <Button variant={"outline"} size={"sm"} onClick={onClearFilters}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
