import { useTranslation } from "react-i18next";
import {
  Calendar,
  User,
  Activity,
  X,
} from "lucide-react";
import { Input } from "../../../../components/input";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import type {
  AppointmentFilterState,
  AppointmentStatus,
} from "../../../../interface/appointment.types";

export type AppointmentFiltersProps = {
  filters: AppointmentFilterState;
  staffList: string[];
  onFilterChange: (filters: Partial<AppointmentFilterState>) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (columnKey: string) => void;
  onExportCsv?: () => void;
};

export const AVAILABLE_COLUMNS: AvailableColumn[] = [
  { key: "aptNumber", label: "Apt / Order #" },
  { key: "dateTime", label: "Date & Time" },
  { key: "client", label: "Client Info" },
  { key: "service", label: "Service" },
  { key: "specialist", label: "Specialist" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const SEARCH_FIELD_OPTIONS: SearchFieldOption[] = [
  { label: "Order ID", value: "id" },
  { label: "Client Name", value: "client" },
  { label: "Phone Number", value: "phone" },
  { label: "Service", value: "service" },
  { label: "Specialist", value: "staff" },
  { label: "All Fields", value: "all" },
];

export function AppointmentFilters({
  filters,
  staffList,
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  visibleColumns = {},
  onToggleColumn,
  onExportCsv,
}: AppointmentFiltersProps) {
  const { t } = useTranslation(["appointments", "common"]);

  const statusOptions: { label: string; value: "all" | AppointmentStatus }[] = [
    { label: t("appointments:filters.allStatuses", "All Statuses"), value: "all" },
    { label: t("appointments:stats.confirmed", "Confirmed"), value: "confirmed" },
    { label: t("appointments:stats.inProgress", "In Progress"), value: "in_progress" },
    { label: t("appointments:stats.completed", "Completed"), value: "completed" },
    { label: t("appointments:stats.pending", "Pending"), value: "pending" },
    { label: t("appointments:stats.cancelled", "Cancelled"), value: "cancelled" },
  ];

  const isAdvancedFiltered =
    filters.status !== "all" || filters.staff !== "all" || Boolean(filters.date);

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.staff !== "all" ? 1 : 0) +
    (filters.date ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      searchField: "id",
      status: "all",
      staff: "all",
      date: "",
    });
  };

  const filterPopoverContent = (
    <>
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
              status: e.target.value as "all" | AppointmentStatus,
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Specialist / Staff Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <User className="size-3 text-slate-400" />
          <span>Specialist / Staff</span>
        </label>
        <select
          value={filters.staff}
          onChange={(e) => onFilterChange({ staff: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
        >
          <option value="all">All Specialists</option>
          {staffList.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div>
        <label className="flex items-center gap-1 font-medium text-slate-600 mb-1.5">
          <Calendar className="size-3 text-slate-400" />
          <span>Booking Date</span>
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filters.date || ""}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className="rounded-lg border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-2xs"
          />
          {filters.date && (
            <button
              type="button"
              onClick={() => onFilterChange({ date: "" })}
              className="rounded-md p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Clear date filter"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <TableToolbar
      search={filters.search}
      onSearchChange={(search) => onFilterChange({ search })}
      searchField={filters.searchField || "id"}
      onSearchFieldChange={(searchField) =>
        onFilterChange({
          searchField: searchField as AppointmentFilterState["searchField"],
        })
      }
      searchFieldOptions={SEARCH_FIELD_OPTIONS}
      searchPlaceholder="Search appointments..."
      filterTitle="Filter Appointments"
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

export default AppointmentFilters;
