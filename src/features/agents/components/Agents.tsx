"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import EmptyState from "@/components/empty-state";
import useAgentsFilters from "../hooks/useAgentsFilters";
import DataPagination from "./data-pagination";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Agents() {
  const router = useRouter();

  const [filters, setFilters] = useAgentsFilters();
  const isFiltersModified = filters.search !== "" || filters.page !== 1;
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters }),
  );

  // Ensure current page is within valid range when totalPages changes through url
  useEffect(() => {
    const currentPage = Math.max(
      1,
      Math.min(filters.page, data.totalPages || 1),
    );
    if (filters.page !== currentPage) {
      setFilters((prev) => ({ ...prev, page: currentPage }));
    }
  }, [filters.page, data.totalPages, setFilters]);

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-8 md:px-8">
      {data.items?.length === 0 && !isFiltersModified ? (
        <div className="my-auto">
          <EmptyState
            title="Create your first Agent"
            description="Create an agent to join meetings"
          />
        </div>
      ) : (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/agents/${row.id}`)}
          />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
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
