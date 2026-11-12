import { useState, useEffect, useMemo } from "react";
import { Calendar, CreditCard, Tag } from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../../components/table-toolbar";
import type {
  ExpenseCategory,
  ExpenseFilterState,
  ExpensePaymentMethod,
} from "../../../../../interface/ledger.types";
import { expenseCategoryFilterOptions } from "../../../../../helpers/ledger.helper";
import { ledgerService } from "../../../../../services/ledger.service";

export type ExpenseFiltersProps = {
  filters: ExpenseFilterState;
  onFilterChange: (filters: Partial<ExpenseFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_EXPENSE_COLUMNS: AvailableColumn[] = [
  { key: "title", label: "Expense Title" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "date", label: "Date" },
  { key: "actions", label: "Actions" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Expense Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "All Fields", value: "all" },
];

export function ExpenseFilters({
  filters,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: ExpenseFiltersProps) {
  const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    let isMounted = true;
    ledgerService
      .getExpenseCategories()
      .then((cats) => {
        if (isMounted && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch((err) => console.error("Failed to load categories for expense filter", err));
    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = useMemo(() => {
    if (categories.length === 0) return expenseCategoryFilterOptions;
    return [
      { label: "All Categories", value: "all" },
      ...categories.map((c) => ({ label: c.label, value: c.value })),
    ];
  }, [categories]);

  const isAdvancedFiltered =
    filters.category !== "all" ||
    (filters.paymentMethod && filters.paymentMethod !== "all") ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.paymentMethod && filters.paymentMethod !== "all" ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      searchField: "title",
      category: "all",
      paymentMethod: "all",
      startDate: "",
      endDate: "",
    });
  };

  const filterPopoverContent = (
    <>
      {/* Category Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Tag className="size-3 text-slate-400" />
          <span>Category</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) =>
            onFilterChange({
              category: e.target.value as ExpenseCategory,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
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
              paymentMethod: e.target.value as "all" | ExpensePaymentMethod,
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
      searchField={filters.searchField || "title"}
      onSearchFieldChange={(searchField) =>
        onFilterChange({
          searchField: searchField as ExpenseFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search expense records..."
      filterTitle="Filter Expenses"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={handleResetFilters}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_EXPENSE_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default ExpenseFilters;
