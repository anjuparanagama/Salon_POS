import { Calendar, CreditCard, Layers } from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../../components/table-toolbar";
import type {
  IncomeFilterState,
  IncomeFilterType,
  IncomePaymentMethod,
} from "../../../../../interface/ledger.types";

export type IncomeFiltersProps = {
  filters: IncomeFilterState;
  onFilterChange: (filters: Partial<IncomeFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_INCOME_COLUMNS: AvailableColumn[] = [
  { key: "saleId", label: "Sale ID" },
  { key: "customer", label: "Customer" },
  { key: "description", label: "Description" },
  { key: "incomeType", label: "Income Type" },
  { key: "amount", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "date", label: "Date" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Sale ID", value: "saleId" },
  { label: "Customer", value: "customer" },
  { label: "Description", value: "description" },
  { label: "All Fields", value: "all" },
];

export function IncomeFilters({
  filters,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: IncomeFiltersProps) {
  const isAdvancedFiltered =
    filters.incomeType !== "all" ||
    (filters.paymentMethod && filters.paymentMethod !== "all") ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const activeFilterCount =
    (filters.incomeType !== "all" ? 1 : 0) +
    (filters.paymentMethod && filters.paymentMethod !== "all" ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      searchField: "saleId",
      incomeType: "all",
      paymentMethod: "all",
      startDate: "",
      endDate: "",
    });
  };

  const filterPopoverContent = (
    <>
      {/* Income Type Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Layers className="size-3 text-slate-400" />
          <span>Income Type</span>
        </label>
        <select
          value={filters.incomeType}
          onChange={(e) =>
            onFilterChange({
              incomeType: e.target.value as IncomeFilterType,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Income Types</option>
          <option value="service">Services Only</option>
          <option value="product">Products Only</option>
        </select>
      </div>

      {/* Payment Method Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <CreditCard className="size-3 text-slate-400" />
          <span>Payment Method</span>
        </label>
        <select
          value={filters.paymentMethod || "all"}
          onChange={(e) =>
            onFilterChange({
              paymentMethod: e.target.value as "all" | IncomePaymentMethod,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Calendar className="size-3 text-slate-400" />
          <span>Date Range</span>
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
            title="Start Date"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
            title="End Date"
          />
        </div>
      </div>
    </>
  );

  return (
    <TableToolbar
      search={filters.search}
      onSearchChange={(search) => onFilterChange({ search })}
      searchField={filters.searchField || "saleId"}
      onSearchFieldChange={(searchField) =>
        onFilterChange({
          searchField: searchField as IncomeFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search income records..."
      filterTitle="Filter Income"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={handleResetFilters}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_INCOME_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default IncomeFilters;
