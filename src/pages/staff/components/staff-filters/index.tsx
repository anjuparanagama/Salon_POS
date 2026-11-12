import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Columns3,
  Download,
  RotateCcw,
  Briefcase,
  Activity,
  ArrowUpDown,
  X,
} from "lucide-react";
import type { StaffFilterState } from "../../../../interface/staff.types";

export type StaffFiltersProps = {
  filters: StaffFilterState;
  onFilterChange: (filters: Partial<StaffFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (key: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_STAFF_COLUMNS = [
  { key: "id", label: "Staff ID" },
  { key: "name", label: "Staff Name" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export function StaffFilters({
  filters,
  onFilterChange,
  pageSize = 100,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: StaffFiltersProps) {
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
    { label: "Staff Name", value: "name" },
    { label: "Role", value: "role" },
    { label: "Phone Number", value: "phone" },
    { label: "Email", value: "email" },
    { label: "All Fields", value: "all" },
  ];

  const currentSearchField = filters.searchField || "name";

  const isAdvancedFiltered =
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.sortBy !== "name";

  const activeFilterCount =
    (filters.role !== "all" ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.sortBy !== "name" ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      searchField: "name",
      role: "all",
      status: "all",
      sortBy: "name",
    });
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      {/* Left: Combined Search input with dropdown prefix + Filter icon button */}
      <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md">
        {/* Segmented Search Control: [ Staff Name ▾ | Search... 🔍 ] */}
        <div className="flex items-center flex-1 rounded-lg border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition overflow-hidden">
          {/* Dropdown Selector */}
          <div className="relative border-r border-slate-200 shrink-0 bg-slate-50/50 hover:bg-slate-50 transition">
            <select
              value={currentSearchField}
              onChange={(e) =>
                onFilterChange({
                  searchField: e.target.value as "all" | "name" | "role" | "phone" | "email",
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
            aria-label="Filter staff"
            title="Filter by role, status, and sorting"
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
                  <span>Filter Staff Members</span>
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
                {/* Role Filter */}
                <div>
                  <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
                    <Briefcase className="size-3 text-slate-400" />
                    <span>Role</span>
                  </label>
                  <select
                    value={filters.role}
                    onChange={(e) =>
                      onFilterChange({
                        role: e.target.value as StaffFilterState["role"],
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Roles</option>
                    <option value="senior_stylist">Senior Stylist</option>
                    <option value="stylist">Stylist</option>
                    <option value="colorist">Colorist</option>
                    <option value="esthetician">Esthetician</option>
                    <option value="nail_technician">Nail Technician</option>
                    <option value="barber">Barber</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="salon_manager">Salon Manager</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
                    <Activity className="size-3 text-slate-400" />
                    <span>Status</span>
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      onFilterChange({
                        status: e.target.value as StaffFilterState["status"],
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
                    <ArrowUpDown className="size-3 text-slate-400" />
                    <span>Sort By</span>
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      onFilterChange({
                        sortBy: e.target.value as StaffFilterState["sortBy"],
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
                  >
                    <option value="name">Name (A - Z)</option>
                    <option value="rating">Top Rated</option>
                    <option value="appointments">Most Appointments</option>
                    <option value="revenue">Highest Revenue</option>
                  </select>
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
                {AVAILABLE_STAFF_COLUMNS.map((col) => {
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
          aria-label="Export staff to CSV"
          title="Export staff to CSV"
          className="flex items-center justify-center size-8.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition cursor-pointer"
        >
          <Download className="size-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

export default StaffFilters;
