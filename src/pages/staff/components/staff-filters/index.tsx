import { Search, RotateCcw } from "lucide-react";
import type { StaffFilterState } from "../../../../interface/staff.types";

export type StaffFiltersProps = {
  filters: StaffFilterState;
  onFilterChange: (filters: Partial<StaffFilterState>) => void;
};

export function StaffFilters({ filters, onFilterChange }: StaffFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      search: "",
      role: "all",
      status: "all",
      sortBy: "name",
    });
  };

  const isFiltered =
    filters.search !== "" ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.sortBy !== "name";

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
            placeholder="Search by staff name, specialty, email or phone..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) =>
              onFilterChange({
                role: e.target.value as StaffFilterState["role"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Roles</option>
            <option value="senior_stylist">Senior Stylist</option>
            <option value="stylist">Stylist</option>
            <option value="colorist">Colorist</option>
            <option value="esthetician">Esthetician</option>
            <option value="nail_technician">Nail Technician</option>
            <option value="barber">Barber</option>
            <option value="receptionist">Receptionist</option>
            <option value="salon_manager">Salon Manager</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as StaffFilterState["status"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as StaffFilterState["sortBy"],
              })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="name">Name (A - Z)</option>
            <option value="rating">Top Rated</option>
            <option value="appointments">Most Appointments</option>
            <option value="revenue">Highest Revenue</option>
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

export default StaffFilters;

