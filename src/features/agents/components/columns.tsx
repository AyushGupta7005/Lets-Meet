"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TAgentGetOne } from "../types";
import GeneratedAvatar from "@/components/generated-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<TAgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            seed={row.original.name}
            variant="botttsNeutral"
            className="size-6"
          />
          <span className="fontsemibold capitalize">{row.original.name}</span>
        </div>
        <div className="ml-2 flex items-center gap-x-2">
          <CornerDownRightIcon className="text-muted-foreground size-3" />
          <span className="text-muted-foreground max-w-[200px] truncate text-sm capitalize">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
      <Badge variant={"outline"} className="flex items-center gap-x-2">
        <VideoIcon className="size-4 text-blue-700" />
        {(() => {
          const count = row.original.meetingCount ?? 0;
          if (count === 0) return "No meetings";
          return `${count} ${count > 1 ? "meetings" : "meeting"}`;
        })()}
      </Badge>
    ),
  },
];
