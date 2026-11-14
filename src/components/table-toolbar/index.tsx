import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Columns3,
  Download,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Input } from "../input";

export type SearchFieldOption = {
  label: string;
  value: string;
};

export type AvailableColumn = {
  key: string;
  label: string;
};

export type TableToolbarProps = {
  // Search state
  search?: string;
  onSearchChange?: (value: string) => void;
  searchField?: string;
  onSearchFieldChange?: (field: string) => void;
  searchFieldOptions?: SearchFieldOption[];
  searchPlaceholder?: string;

  // Filter Popover
  filterTitle?: string;
  isFilterActive?: boolean;
  activeFilterCount?: number;
  onResetFilters?: () => void;
  filterPopoverContent?: ReactNode;

  // Page Size
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];

  // Column Visibility
  availableColumns?: AvailableColumn[];
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;

  // Export CSV
  onExportCsv?: () => void;

  // Additional elements or styling
  extraLeft?: ReactNode;
  extraRight?: ReactNode;
  className?: string;
};

export function TableToolbar({
  search = "",
  onSearchChange,
  searchField,
  onSearchFieldChange,
  searchFieldOptions = [],
  searchPlaceholder = "Search...",
  filterTitle = "Filters",
  isFilterActive = false,
  activeFilterCount = 0,
  onResetFilters,
  filterPopoverContent,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 50, 100],
  availableColumns = [],
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
  extraLeft,
  extraRight,
  className,
}: TableToolbarProps) {
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

  const hasSearchPrefix = searchFieldOptions.length > 0 && !!onSearchFieldChange;
  const hasFilterPopover = Boolean(filterPopoverContent);
  const hasColumnsToggle = availableColumns.length > 0 && !!onToggleColumn;
  const hasPageSize = typeof pageSize === "number" && !!onPageSizeChange;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs",
        className
      )}
    >
      {/* Left: Combined Search input with dropdown prefix + Filter popover button */}
      <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md">
        {onSearchChange && (
          <div className="flex items-center flex-1 rounded-lg border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition overflow-hidden">
            {/* Search Field Dropdown Selector */}
            {hasSearchPrefix && (
              <div className="relative border-r border-slate-200 shrink-0 bg-slate-50/50 hover:bg-slate-50 transition">
                <select
                  value={searchField || searchFieldOptions[0]?.value}
                  onChange={(e) => onSearchFieldChange(e.target.value)}
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
            )}

            {/* Search Text Input */}
            <div className="relative flex-1 flex items-center">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-auto border-0 bg-transparent pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none shadow-none ring-0 focus-visible:ring-0"
              />
              {search ? (
                <Button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 size-4 text-slate-400 hover:text-slate-600 transition cursor-pointer z-10"
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </Button>
              ) : (
                <Search className="pointer-events-none absolute right-2.5 size-4 text-slate-400" />
              )}
            </div>
          </div>
        )}

        {/* Filter Popover Button */}
        {hasFilterPopover && (
          <div className="relative" ref={filterRef}>
            <Button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              aria-label="Toggle filters"
              title="Filter records"
              className={cn(
                "relative flex items-center justify-center size-9 rounded-lg border transition shadow-2xs cursor-pointer",
                isFilterActive || isFilterOpen
                  ? "border-primary bg-primary-lighter/40 text-primary font-semibold ring-2 ring-primary/20"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Filter className="size-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Filter Popover Dropdown Panel */}
            {isFilterOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Filter className="size-3.5 text-primary" />
                    <span>{filterTitle}</span>
                  </div>
                  {isFilterActive && onResetFilters && (
                    <Button
                      type="button"
                      onClick={() => {
                        onResetFilters();
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-primary transition cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset</span>
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-3.5 pt-3">
                  {filterPopoverContent}

                  {/* Popover Action Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-primary-dark transition cursor-pointer"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {extraLeft}
      </div>

      {/* Right: Page Size Dropdown, Column Visibility Toggle, Export CSV */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
        {extraRight}

        {/* Page size selector */}
        {hasPageSize && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="whitespace-nowrap font-normal">Page size</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Select page size"
                className="appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-6 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs hover:bg-slate-50 transition"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
            </div>
          </div>
        )}

        {/* Column toggle button */}
        {hasColumnsToggle && (
          <div className="relative" ref={columnRef}>
            <Button
              type="button"
              onClick={() => setIsColumnMenuOpen((prev) => !prev)}
              aria-label="Toggle visible columns"
              title="Toggle visible columns"
              className={cn(
                "flex items-center justify-center size-8.5 rounded-lg border transition shadow-2xs cursor-pointer",
                isColumnMenuOpen
                  ? "border-primary bg-primary-lighter/30 text-primary"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Columns3 className="size-4 text-slate-600" />
            </Button>

            {/* Columns Popover Dropdown */}
            {isColumnMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-xs flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
                  Visible Columns
                </div>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pt-1">
                  {availableColumns.map((col) => {
                    const isChecked = visibleColumns[col.key] !== false;
                    return (
                      <label
                        key={col.key}
                        className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-slate-700 select-none"
                      >
                        <span>{col.label}</span>
                        <Input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleColumn(col.key)}
                          className="rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export CSV Button */}
        {onExportCsv && (
          <Button
            type="button"
            onClick={onExportCsv}
            aria-label="Export to CSV"
            title="Export to CSV"
            className="flex items-center justify-center size-8.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition cursor-pointer"
          >
            <Download className="size-4 text-slate-600" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default TableToolbar;

