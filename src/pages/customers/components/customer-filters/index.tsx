import { Search, RotateCcw } from "lucide-react";
import type { CustomerFilterState, CustomerGender } from "../../../../interface/customer.types";

export type CustomerFiltersProps = {
  filters: CustomerFilterState;
  onFilterChange: (filters: Partial<CustomerFilterState>) => void;
};

export function CustomerFilters({ filters, onFilterChange }: CustomerFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      search: "",
      gender: "all",
      sortBy: "recent",
    });
  };

  const isFiltered =
    filters.search !== "" ||
    filters.gender !== "all" ||
    filters.sortBy !== "recent";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by customer name, phone number, or email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gender Filter */}
          <select
            value={filters.gender}
            onChange={(e) =>
              onFilterChange({
                gender: e.target.value as "all" | CustomerGender,
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>

          {/* Sort By Select */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as CustomerFilterState["sortBy"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="recent">Most Recent Visit</option>
            <option value="name">Name (A - Z)</option>
            <option value="visits">Most Visits</option>
            <option value="spent">Highest Spend</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerFilters;
