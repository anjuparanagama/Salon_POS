import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Columns3,
  Download,
  RotateCcw,
  Calendar,
  CreditCard,
  Layers,
  X,
} from "lucide-react";
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

export const AVAILABLE_INCOME_COLUMNS = [
  { key: "saleId", label: "Sale ID" },
  { key: "customer", label: "Customer" },
  { key: "description", label: "Description" },
  { key: "incomeType", label: "Income Type" },
  { key: "amount", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "date", label: "Date" },
];

export function IncomeFilters({
  filters,
  onFilterChange,
  pageSize = 100,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: IncomeFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (columnRef.current && !columnRef.current.contains(e.target as Node)) {
        setIsColumnMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchFieldOptions = [
    { label: "Sale ID", value: "saleId" },
    { label: "Customer", value: "customer" },
    { label: "Description", value: "description" },
    { label: "All Fields", value: "all" },
  ];

  const currentSearchField = filters.searchField || "saleId";

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
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      {/* Left: Combined Search input with dropdown prefix + Filter icon button */}
      <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md">
        {/* Segmented Search Control: [ Sale ID ▾ | Search... 🔍 ] */}
        <div className="flex items-center flex-1 rounded-lg border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition overflow-hidden">
          {/* Dropdown Selector */}
          <div className="relative border-r border-slate-200 shrink-0 bg-slate-50/50 hover:bg-slate-50 transition">
            <select
              value={currentSearchField}
              onChange={(e) =>
                onFilterChange({
                  searchField: e.target.value as "all" | "saleId" | "customer" | "description",
                })
              }
              aria-label="Search by Field"
              className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              {searchFieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
          </div>

          {/* Search Text Input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full bg-transparent pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
            />
            {filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange({ search: "" })}
                className="absolute right-2.5 size-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <Search className="pointer-events-none absolute right-2.5 size-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Filter Popover Button */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-label="Filter income"
            title="Filter by income type, payment method, and date range"
            className={`relative flex items-center justify-center size-9 rounded-lg border transition shadow-2xs cursor-pointer ${
              isAdvancedFiltered || isFilterOpen
                ? "border-primary bg-primary-lighter/40 text-primary font-semibold ring-2 ring-primary/20"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Filter className="size-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Popover Dropdown Panel */}
          {isFilterOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Filter className="size-3.5 text-primary" />
                  <span>Filter Income</span>
                </div>
                {isAdvancedFiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-primary transition cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3.5 pt-3">
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

                {/* Popover Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-primary-dark transition cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Page Size Dropdown, Column Visibility Toggle, Export CSV */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
        {/* Page size selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="whitespace-nowrap font-normal">Page size</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              aria-label="Select page size"
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-6 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs hover:bg-slate-50 transition"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
          </div>
        </div>

        {/* Column toggle button */}
        <div className="relative" ref={columnRef}>
          <button
            type="button"
            onClick={() => setIsColumnMenuOpen((prev) => !prev)}
            aria-label="Toggle visible columns"
            title="Toggle visible columns"
            className={`flex items-center justify-center size-8.5 rounded-lg border transition shadow-2xs cursor-pointer ${
              isColumnMenuOpen
                ? "border-primary bg-primary-lighter/30 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Columns3 className="size-4 text-slate-600" />
          </button>

          {/* Columns Popover Dropdown */}
          {isColumnMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-xs flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-100">
              <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
                Visible Columns
              </div>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pt-1">
                {AVAILABLE_INCOME_COLUMNS.map((col) => {
                  const isChecked = visibleColumns[col.key] !== false;
                  return (
                    <label
                      key={col.key}
                      className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-slate-700 select-none"
                    >
                      <span>{col.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleColumn?.(col.key)}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          aria-label="Export income records to CSV"
          title="Export income records to CSV"
          className="flex items-center justify-center size-8.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition cursor-pointer"
        >
          <Download className="size-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

export default IncomeFilters;
