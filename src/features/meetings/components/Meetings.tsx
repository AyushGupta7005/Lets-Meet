"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useMeetingsFilters from "../hooks/useMeetingsFilters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import EmptyState from "@/components/empty-state";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import DataPagination from "@/components/data-pagination";
export default function Meetings() {
  const router = useRouter();

  const [filters, setFilters] = useMeetingsFilters();
  const isFiltersModified = filters.search !== "" || filters.page !== 1;
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters }),
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
            title="Create your first Meeting"
            description="Create a meeting to get started"
          />
        </div>
      ) : (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}
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
export function MeetingsLoader() {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take some while..."
    />
  );
}

export function MeetingsError() {
  return (
    <ErrorState
      title="Failed to load Meetings"
      description={"Something went wrong..."}
    />
  );
}
