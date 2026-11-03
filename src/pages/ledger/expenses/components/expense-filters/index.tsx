import { Search, Layers, Building, Zap, Users, ShoppingCart, Wrench } from "lucide-react";
import type { ExpenseCategory, ExpenseFilterState } from "../../../../../interface/ledger.types";

export type ExpenseFiltersProps = {
  filters: ExpenseFilterState;
  onFilterChange: (filters: Partial<ExpenseFilterState>) => void;
};

const categoryTabs: { label: string; value: ExpenseCategory; icon: typeof Layers }[] = [
  { label: "All Expenses", value: "all", icon: Layers },
  { label: "Rent", value: "rent", icon: Building },
  { label: "Electricity & Power", value: "electricity", icon: Zap },
  { label: "Salaries & Payroll", value: "salaries", icon: Users },
  { label: "Product Purchases", value: "product_purchases", icon: ShoppingCart },
  { label: "Maintenance", value: "maintenance", icon: Wrench },
];

export function ExpenseFilters({ filters, onFilterChange }: ExpenseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Category Pills */}
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

      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search expense description, vendor, receipt..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

export default ExpenseFilters;

