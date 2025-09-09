import React from "react";
import { Button } from "@/components/ui/button";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DataPagination({
  page,
  totalPages,
  onPageChange,
}: DataPaginationProps) {
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        Page {currentPage} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          variant={"outline"}
          size={"sm"}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          variant={"outline"}
          size={"sm"}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
