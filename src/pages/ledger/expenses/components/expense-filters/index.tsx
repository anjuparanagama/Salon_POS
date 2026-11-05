import { Search, Calendar, Filter, X } from "lucide-react";
import type { ExpenseCategory, ExpenseFilterState } from "../../../../../interface/ledger.types";
import { expenseCategoryFilterOptions } from "../../../../../helpers/ledger.helper";

export type ExpenseFiltersProps = {
  filters: ExpenseFilterState;
  onFilterChange: (filters: Partial<ExpenseFilterState>) => void;
  onResetFilters: () => void;
};

export function ExpenseFilters({ filters, onFilterChange, onResetFilters }: ExpenseFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.category !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search expense title, description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Date Range & Category */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ category: e.target.value as ExpenseCategory })
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
            >
              {expenseCategoryFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                title="Start Date"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                title="End Date"
              />
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="size-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseFilters;
