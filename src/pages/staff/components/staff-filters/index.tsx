import { Briefcase, Activity, ArrowUpDown } from "lucide-react";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import type { StaffFilterState, StaffStatus } from "../../../../interface/staff.types";

export type StaffFiltersProps = {
  filters: StaffFilterState;
  onFilterChange: (filters: Partial<StaffFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (key: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_STAFF_COLUMNS: AvailableColumn[] = [
  { key: "id", label: "Staff ID" },
  { key: "name", label: "Staff Name" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Staff Name", value: "name" },
  { label: "Role", value: "role" },
  { label: "Phone Number", value: "phone" },
  { label: "Email", value: "email" },
  { label: "All Fields", value: "all" },
];

export function StaffFilters({
  filters,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: StaffFiltersProps) {
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
  };

  const filterPopoverContent = (
    <>
      {/* Role Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Briefcase className="size-3 text-slate-400" />
          <span>Role</span>
        </label>
        <select
          value={filters.role}
          onChange={(e) => onFilterChange({ role: e.target.value })}
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
              status: e.target.value as "all" | StaffStatus,
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
    </>
  );

  return (
    <TableToolbar
      search={filters.search}
      onSearchChange={(search) => onFilterChange({ search })}
      searchField={filters.searchField || "name"}
      onSearchFieldChange={(searchField) =>
        onFilterChange({
          searchField: searchField as StaffFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search staff members..."
      filterTitle="Filter Staff Members"
      isFilterActive={isAdvancedFiltered}
      activeFilterCount={activeFilterCount}
      onResetFilters={handleResetFilters}
      filterPopoverContent={filterPopoverContent}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 50, 100]}
      availableColumns={AVAILABLE_STAFF_COLUMNS}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
      onExportCsv={onExportCsv}
    />
  );
}

export default StaffFilters;
