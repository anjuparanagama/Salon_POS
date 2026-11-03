import { Search, Filter, Scissors, Package, Layers } from "lucide-react";
import type { IncomeCategory, IncomeFilterState } from "../../../../../interface/ledger.types";

export type IncomeFiltersProps = {
  filters: IncomeFilterState;
  onFilterChange: (filters: Partial<IncomeFilterState>) => void;
};

const categoryTabs: { label: string; value: IncomeCategory; icon: typeof Scissors }[] = [
  { label: "All Income", value: "all", icon: Layers },
  { label: "Service Sales", value: "service_sale", icon: Scissors },
  { label: "Product Sales", value: "product_sale", icon: Package },
];

export function IncomeFilters({ filters, onFilterChange }: IncomeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
        {categoryTabs.map((tab) => {
          const isSelected = filters.category === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onFilterChange({ category: tab.value })}
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search invoice, customer, item..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <Filter className="size-3.5" />
            <span>Payment Method:</span>
          </div>
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              onFilterChange({ paymentMethod: e.target.value as IncomeFilterState["paymentMethod"] })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card / Terminal</option>
            <option value="online">Online / Transfer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default IncomeFilters;

