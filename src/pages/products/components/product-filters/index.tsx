import {
  Tag,
  Package,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import type {
  ProductFilterState,
  ProductStockStatus,
  ProductActiveStatusFilter,
} from "../../../../interface/product.types";

export type ProductFiltersProps = {
  filters: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
  categories: { label: string; value: string }[];
  brands?: string[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;
  onExportCsv?: () => void;
  onResetFilters?: () => void;
};

export const AVAILABLE_PRODUCT_COLUMNS: AvailableColumn[] = [
  { key: "product", label: "Product" },
  { key: "sku", label: "SKU" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "price", label: "Selling Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Product Name", value: "name" },
  { label: "SKU", value: "sku" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "All Fields", value: "all" },
];

export function ProductFilters({
  filters,
  onFilterChange,
  categories,
  brands = [],
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
  onResetFilters,
}: ProductFiltersProps) {
  const isAdvancedFiltered =
    filters.category !== "all" ||
    filters.brand !== "all" ||
    filters.stockStatus !== "all" ||
    filters.status !== "all" ||
    filters.sortBy !== "name";

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.brand !== "all" ? 1 : 0) +
    (filters.stockStatus !== "all" ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.sortBy !== "name" ? 1 : 0);

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFilterChange({
        search: "",
        searchField: "name",
        category: "all",
        brand: "all",
        stockStatus: "all",
        status: "all",
        sortBy: "name",
      });
    }
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
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Categories</option>
          {categories
            .filter((c) => c.value !== "all")
            .map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
        </select>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
            <Package className="size-3 text-slate-400" />
            <span>Brand</span>
          </label>
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stock Status */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Package className="size-3 text-slate-400" />
          <span>Stock Status</span>
        </label>
        <select
          value={filters.stockStatus}
          onChange={(e) =>
            onFilterChange({
              stockStatus: e.target.value as ProductStockStatus,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Stock Statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Active Status */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Activity className="size-3 text-slate-400" />
          <span>Product Status</span>
        </label>
        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value as ProductActiveStatusFilter,
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
              sortBy: e.target.value as ProductFilterState["sortBy"],
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="name">Name (A - Z)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock_asc">Stock: Low to High</option>
          <option value="stock_desc">Stock: High to Low</option>
        </select>
      </div>
    </>
  );

  return (
    <TableToolbar
      search={filters.search}
      onSearchChange={(search) => onFilterChange({ search })}
      searchField={filters.searchField || "name"}
      onSearchFieldChange={(searchField) =>
        onFilterChange({
          searchField: searchField as ProductFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search products..."
      filterTitle="Filter Products"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={handleResetFilters}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_PRODUCT_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default ProductFilters;
