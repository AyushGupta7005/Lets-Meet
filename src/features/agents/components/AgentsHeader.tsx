"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import CreateAgentsDialog from "./CreateAgentsDialog";
import useAgentsFilters from "../hooks/useAgentsFilters";
import AgentSearchBar from "./AgentSearchFilter";
import { DEFAULT_PAGE } from "../../../../constants";
export default function AgentsHeader() {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterModified = !!filters.search;
  const onClearFilters = () => {
    setFilters({ search: "", page: DEFAULT_PAGE });
  };
  return (
    <>
      <CreateAgentsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">My Agents</h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="active:scale-95"
          >
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentSearchBar />
          {isAnyFilterModified && (
            <Button variant={"outline"} size={"sm"} onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
