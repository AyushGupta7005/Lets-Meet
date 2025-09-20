import React from "react";
import CommandSelect from "@/components/command-select";
import useMeetingsFilters from "../hooks/useMeetingsFilters";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import GeneratedAvatar from "@/components/generated-avatar";
export default function AgentIdFilters() {
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({ search: agentSearch, pageSize: 100 }),
  );

  return (
    <CommandSelect
      placeholder="Agent"
      className="h-9"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId || ""}
    />
  );
}
