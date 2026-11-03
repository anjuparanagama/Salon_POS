import { Search, Filter, Layers, ArrowUpDown } from "lucide-react";
import type { ProductCategory, ProductFilterState, ProductStockStatus } from "../../../../interface/product.types";

export type ProductFiltersProps = {
  filters: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
};

const categoryTabs: { label: string; value: ProductCategory }[] = [
  { label: "All Items", value: "all" },
  { label: "Hair Care", value: "hair_care" },
  { label: "Skin Care", value: "skin_care" },
  { label: "Styling Products", value: "styling" },
  { label: "Color & Bleach", value: "color" },
  { label: "Equipment & Tools", value: "equipment" },
];

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
        {categoryTabs.map((tab) => {
          const isSelected = filters.category === tab.value;
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
              <Layers className="size-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search product name, SKU, brand..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Stock status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="size-3.5" />
            <select
              value={filters.stockStatus}
              onChange={(e) => onFilterChange({ stockStatus: e.target.value as ProductStockStatus })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="low_stock">Low Stock Warning</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="size-3.5" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as ProductFilterState["sortBy"] })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="name">Name (A - Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;

