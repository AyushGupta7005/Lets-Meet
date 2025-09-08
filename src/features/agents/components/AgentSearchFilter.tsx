import { Input } from "@/components/ui/input";
import React from "react";
import { SearchIcon } from "lucide-react";
import useAgentsFilters from "../hooks/useAgentsFilters";
import { DEFAULT_PAGE } from "../../../../constants";
export default function AgentSearchBar() {
  const [filters, setFilters] = useAgentsFilters();
  return (
    <div className="relative">
      <Input
        className="h-9 w-[200px] bg-white pl-7"
        value={filters.search}
        placeholder="Search agents..."
        onChange={(e) =>
          setFilters({ search: e.target.value, page: DEFAULT_PAGE })
        }
      />
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
    </div>
  );
}
