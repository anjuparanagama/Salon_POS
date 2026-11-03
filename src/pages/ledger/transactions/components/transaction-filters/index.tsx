import { Search, Filter, ArrowDownLeft, ArrowUpRight, Layers } from "lucide-react";
import type {
  TransactionType,
  TransactionStatus,
  TransactionFilterState,
} from "../../../../../interface/ledger.types";

export type TransactionFiltersProps = {
  filters: TransactionFilterState;
  onFilterChange: (filters: Partial<TransactionFilterState>) => void;
};

const typeTabs: { label: string; value: TransactionType; icon: typeof Layers }[] = [
  { label: "All Transactions", value: "all", icon: Layers },
  { label: "Payments (In)", value: "payment", icon: ArrowDownLeft },
  { label: "Refunds (Out)", value: "refund", icon: ArrowUpRight },
];

export function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Type Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
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

      {/* Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search txn ID, customer, reference..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="size-3.5" />
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ status: e.target.value as TransactionStatus })
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Payment Method */}
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              onFilterChange({
                paymentMethod: e.target.value as TransactionFilterState["paymentMethod"],
              })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="online">Online Payment</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TransactionFilters;

