import { Search, Calendar, Scissors, Package, Layers, X } from "lucide-react";
import type { IncomeFilterType, IncomeFilterState } from "../../../../../interface/ledger.types";

export type IncomeFiltersProps = {
  filters: IncomeFilterState;
  onFilterChange: (filters: Partial<IncomeFilterState>) => void;
  onResetFilters: () => void;
};

const incomeTypes: { label: string; value: IncomeFilterType; icon: typeof Layers }[] = [
  { label: "All Income", value: "all", icon: Layers },
  { label: "Service", value: "service", icon: Scissors },
  { label: "Product", value: "product", icon: Package },
];

export function IncomeFilters({ filters, onFilterChange, onResetFilters }: IncomeFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.incomeType !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Income Type Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {incomeTypes.map((tab) => {
            const isSelected = filters.incomeType === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange({ incomeType: tab.value })}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="size-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Search & Date Range */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search Sale ID, Customer name..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <span>Date Range:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-primary focus:bg-white"
              title="Start Date"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-primary focus:bg-white"
              title="End Date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeFilters;
