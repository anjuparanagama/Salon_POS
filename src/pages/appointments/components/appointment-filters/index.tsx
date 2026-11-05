import { useTranslation } from "react-i18next";
import { Search, Filter, RotateCcw } from "lucide-react";
import type { AppointmentFilterState, AppointmentStatus } from "../../../../interface/appointment.types";

export type AppointmentFiltersProps = {
  filters: AppointmentFilterState;
  staffList: string[];
  onFilterChange: (filters: Partial<AppointmentFilterState>) => void;
};

export function AppointmentFilters({
  filters,
  staffList,
  onFilterChange,
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

  const isFiltered =
    filters.search !== "" || filters.status !== "all" || filters.staff !== "all";

  const handleReset = () => {
    onFilterChange({
      search: "",
      status: "all",
      staff: "all",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder={t(
            "appointments:filters.searchPlaceholder",
            "Search by client name, service, or staff..."
          )}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Select */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
          <span>Status:</span>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ status: e.target.value as "all" | AppointmentStatus })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Staff Select */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
          <Filter className="size-3.5" />
          <span>Staff:</span>
          <select
            value={filters.staff}
            onChange={(e) => onFilterChange({ staff: e.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Specialists</option>
            {staffList.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-2xs"
            title="Reset Filters"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default AppointmentFilters;
