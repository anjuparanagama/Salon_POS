import { Search, Calendar, Filter, ArrowDownLeft, ArrowUpRight, Layers, X } from "lucide-react";
import { Input } from "../../../../../components/input";
import type {
  TransactionType,
  TransactionPaymentMethod,
  TransactionFilterState,
} from "../../../../../interface/ledger.types";

export type TransactionFiltersProps = {
  filters: TransactionFilterState;
  onFilterChange: (filters: Partial<TransactionFilterState>) => void;
  onResetFilters: () => void;
};

const typeTabs: { label: string; value: TransactionType; icon: typeof Layers }[] = [
  { label: "All Transactions", value: "all", icon: Layers },
  { label: "Payment", value: "payment", icon: ArrowDownLeft },
  { label: "Refund", value: "refund", icon: ArrowUpRight },
];

export function TransactionFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: TransactionFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.type !== "all" ||
    filters.paymentMethod !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {typeTabs.map((tab) => {
            const isSelected = filters.type === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange({ type: tab.value })}
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

      {/* Search, Date Range & Payment Method */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search by Transaction ID / Customer */}
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by Transaction ID or Customer name..."
          leftElement={<Search className="size-4 text-slate-400" />}
          className="rounded-lg border-slate-200 bg-slate-50 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          wrapperClassName="flex-1"
        />

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Payment Method */}
          <div className="flex items-center gap-1.5">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={filters.paymentMethod}
              onChange={(e) =>
                onFilterChange({
                  paymentMethod: e.target.value as TransactionPaymentMethod,
                })
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="rounded-lg border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 focus:border-primary focus:bg-white"
                title="Start Date"
              />
              <span className="text-xs text-slate-400">to</span>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="rounded-lg border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 focus:border-primary focus:bg-white"
                title="End Date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionFilters;
