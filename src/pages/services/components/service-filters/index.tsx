import {
  Tag,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import type {
  ServiceCategoryItem,
  ServiceFilterState,
} from "../../../../interface/service.types";

export type ServiceFiltersProps = {
  filters: ServiceFilterState;
  categories: ServiceCategoryItem[];
  onFilterChange: (filters: Partial<ServiceFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (key: string) => void;
  onExportCsv?: () => void;
  onResetFilters?: () => void;
};

export const AVAILABLE_SERVICE_COLUMNS: AvailableColumn[] = [
  { key: "category", label: "Category" },
  { key: "duration", label: "Duration" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "description", label: "Description" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Service Name", value: "name" },
  { label: "Category", value: "category" },
  { label: "Description", value: "description" },
  { label: "All Fields", value: "all" },
];

export function ServiceFilters({
  filters,
  categories,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
  onResetFilters,
}: ServiceFiltersProps) {
  const isAdvancedFiltered =
    filters.category !== "all" ||
    (filters.status !== undefined && filters.status !== "all") ||
    filters.sortBy !== "name";

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.status && filters.status !== "all" ? 1 : 0) +
    (filters.sortBy !== "name" ? 1 : 0);

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFilterChange({
        search: "",
        searchField: "name",
        category: "all",
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
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Activity className="size-3 text-slate-400" />
          <span>Status</span>
        </label>
        <select
          value={filters.status || "all"}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value as "all" | "active" | "inactive",
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
              sortBy: e.target.value as ServiceFilterState["sortBy"],
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="name">Alphabetical (A - Z)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration">Duration (Shortest first)</option>
        </select>
      </div>
    </>
  );

  return (
    <TableToolbar
      search={filters.search}
      onSearchChange={(search) => onFilterChange({ search })}
      searchField={filters.searchField || "name"}
      onSearchFieldChange={(val) =>
        onFilterChange({
          searchField: val as "all" | "name" | "category" | "description",
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search services..."
      filterTitle="Filter Services"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={isAdvancedFiltered ? handleResetFilters : undefined}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_SERVICE_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default ServiceFilters;
