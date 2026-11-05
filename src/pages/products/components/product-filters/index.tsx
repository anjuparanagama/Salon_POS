import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ChevronDown, RotateCcw } from "lucide-react";
import type {
  ProductFilterState,
  ProductStockStatus,
  ProductActiveStatusFilter,
} from "../../../../interface/product.types";

export type ProductFiltersProps = {
  filters: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  categories: { label: string; value: string }[];
  brands?: string[];
};

export function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  brands = [],
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ProductFilterState>(filters);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync draft when opened
  const handleToggle = () => {
    if (!isOpen) {
      setDraft(filters);
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click or ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleApply = () => {
    onFilterChange(draft);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared: ProductFilterState = {
      search: filters.search,
      category: "all",
      brand: "all",
      stockStatus: "all",
      status: "all",
      sortBy: "name",
    };
    setDraft(cleared);
    onFilterChange(cleared);
    setIsOpen(false);
  };

  // Count active filters (excluding search)
  const activeCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.brand !== "all" ? 1 : 0) +
    (filters.stockStatus !== "all" ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0);

  const isAnyFilterActive = activeCount > 0 || filters.search.trim() !== "";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
      {/* Search Input Row with Filter Tunnel / Funnel Button */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by product name or SKU..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Anchored Filter Dropdown / Popover Container */}
        <div className="relative" ref={popoverRef}>
          {/* Funnel Icon Button */}
          <button
            type="button"
            onClick={handleToggle}
            className={`flex items-center justify-center rounded-lg border p-2 transition cursor-pointer shrink-0 ${
              isOpen || activeCount > 0
                ? "border-primary bg-primary-lighter/40 text-primary"
                : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Filter options"
          >
            <Filter className="size-4" />
            {activeCount > 0 && (
              <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Floating Popover opening directly below the funnel icon */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-40 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Brand Name */}
                <div>
                  <div className="relative">
                    <select
                      value={draft.brand}
                      onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="all">Brand Name</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* 2. Category Name */}
                <div>
                  <div className="relative">
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="all">Category Name</option>
                      {categories
                        .filter((c) => c.value !== "all")
                        .map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* 3. Product Type / Stock Status */}
                <div>
                  <div className="relative">
                    <select
                      value={draft.stockStatus}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          stockStatus: e.target.value as ProductStockStatus,
                        })
                      }
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="all">Stock Status</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* 4. Status (Active / Inactive) */}
                <div>
                  <div className="relative">
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          status: e.target.value as ProductActiveStatusFilter,
                        })
                      }
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="all">Product Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Matching Screenshot */}
              <div className="mt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reset Button */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer shrink-0"
            title="Reset All Filters"
          >
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-slate-400 font-medium">Applied:</span>

          {filters.brand !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              Brand: {filters.brand}
              <button
                type="button"
                onClick={() => onFilterChange({ brand: "all" })}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              Category:{" "}
              {categories.find((c) => c.value === filters.category)?.label || filters.category}
              <button
                type="button"
                onClick={() => onFilterChange({ category: "all" })}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {filters.stockStatus !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 capitalize">
              Stock: {filters.stockStatus.replace("_", " ")}
              <button
                type="button"
                onClick={() => onFilterChange({ stockStatus: "all" })}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {filters.status !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 capitalize">
              Status: {filters.status}
              <button
                type="button"
                onClick={() => onFilterChange({ status: "all" })}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-[10px] text-primary hover:underline font-medium cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductFilters;
