import { Search, RotateCcw } from "lucide-react";
import type { CustomerFilterState } from "../../../../interface/customer.types";

export type CustomerFiltersProps = {
  filters: CustomerFilterState;
  onFilterChange: (filters: Partial<CustomerFilterState>) => void;
};

export function CustomerFilters({ filters, onFilterChange }: CustomerFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      search: "",
      status: "all",
      membershipTier: "all",
      sortBy: "recent",
    });
  };

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.membershipTier !== "all" ||
    filters.sortBy !== "recent";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by client name, phone number, or email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as CustomerFilterState["status"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Membership Tier Select */}
          <select
            value={filters.membershipTier}
            onChange={(e) =>
              onFilterChange({
                membershipTier: e.target.value as CustomerFilterState["membershipTier"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum Tier</option>
            <option value="gold">Gold Tier</option>
            <option value="silver">Silver Tier</option>
            <option value="regular">Regular</option>
          </select>

          {/* Sort By Select */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as CustomerFilterState["sortBy"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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

