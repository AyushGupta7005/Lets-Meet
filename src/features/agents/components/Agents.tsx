"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import EmptyState from "@/components/empty-state";

export function Agents() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-8 md:px-8">
      {data?.length === 0 ? (
        <div className="my-auto">
          <EmptyState
            title="Create your first Agent"
            description="Create an agent to join meetings"
          />
        </div>
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </div>
  );
}

export function AgentsLoader() {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take some while..."
    />
  );
}

export function AgentsError() {
  return (
    <ErrorState
      title="Failed to load Agents"
      description={"Something went wrong..."}
    />
  );
}
