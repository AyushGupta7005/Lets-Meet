"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TMeetingsGetOne } from "../types";
import { CornerDownRightIcon } from "lucide-react";

export const columns: ColumnDef<TMeetingsGetOne>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <span className="fontsemibold capitalize">{row.original.name}</span>
        </div>
        <div className="ml-2 flex items-center gap-x-2">
          <CornerDownRightIcon className="text-muted-foreground size-3" />
          <span className="text-muted-foreground max-w-[200px] truncate text-sm capitalize">
            {row.original.agentId}
          </span>
        </div>
      </div>
    ),
  },
];
