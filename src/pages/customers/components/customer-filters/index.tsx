import { User, SlidersHorizontal } from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import type { CustomerFilterState, CustomerGender } from "../../../../interface/customer.types";

export type CustomerFiltersProps = {
  filters: CustomerFilterState;
  onFilterChange: (filters: Partial<CustomerFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_COLUMNS: AvailableColumn[] = [
  { key: "name", label: "Customer Name & Gender" },
  { key: "contact", label: "Contact Number & Email" },
  { key: "lastVisit", label: "Last Visit" },
  { key: "visitsSpend", label: "Visits & Spends" },
  { key: "history", label: "Service History" },
  { key: "actions", label: "Actions" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Client Name", value: "name" },
  { label: "Phone Number", value: "phone" },
  { label: "Email Address", value: "email" },
  { label: "All Fields", value: "all" },
];

export function CustomerFilters({
  filters,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: CustomerFiltersProps) {
  const isAdvancedFiltered =
    filters.gender !== "all" || filters.sortBy !== "recent";

  const activeFilterCount =
    (filters.gender !== "all" ? 1 : 0) +
    (filters.sortBy !== "recent" ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      searchField: "name",
      gender: "all",
      sortBy: "recent",
    });
  };

  const filterPopoverContent = (
    <>
      {/* Gender Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <User className="size-3 text-slate-400" />
          <span>Gender</span>
        </label>
        <select
          value={filters.gender}
          onChange={(e) =>
            onFilterChange({
              gender: e.target.value as "all" | CustomerGender,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Genders</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      {/* Sort By Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <SlidersHorizontal className="size-3 text-slate-400" />
          <span>Sort Customers By</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              sortBy: e.target.value as CustomerFilterState["sortBy"],
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="recent">Most Recent Visit</option>
          <option value="name">Customer Name (A - Z)</option>
          <option value="visits">Most Visits</option>
          <option value="spent">Highest Spend</option>
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
          searchField: searchField as CustomerFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search customers..."
      filterTitle="Filter Customers"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={handleResetFilters}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default CustomerFilters;
