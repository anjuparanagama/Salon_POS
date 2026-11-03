import { Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { AppointmentFilterState, AppointmentStatus } from "../../../../interface/appointment.types";

export type AppointmentFiltersProps = {
  filters: AppointmentFilterState;
  staffList: string[];
  onFilterChange: (filters: Partial<AppointmentFilterState>) => void;
  onDateChange: (direction: "prev" | "next" | "today") => void;
};

const statusOptions: { label: string; value: "all" | AppointmentStatus }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

export function AppointmentFilters({
  filters,
  staffList,
  onFilterChange,
  onDateChange,
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Top row: Date navigation & Quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-slate-700">
            <button
              type="button"
              onClick={() => onDateChange("prev")}
              title="Previous Day"
              className="rounded p-1.5 hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDateChange("today")}
              className="px-2.5 py-1 text-xs font-semibold hover:bg-white hover:shadow-xs rounded transition cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onDateChange("next")}
              title="Next Day"
              className="rounded p-1.5 hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <CalendarIcon className="size-4 text-primary" />
            <span>{filters.date}</span>
          </div>
        </div>

        {/* Status quick tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {statusOptions.map((opt) => {
            const isSelected = filters.status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange({ status: opt.value })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Search input & Staff select */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search client, service, phone..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <Filter className="size-3.5" />
            <span>Staff:</span>
          </div>
          <select
            value={filters.staff}
            onChange={(e) => onFilterChange({ staff: e.target.value })}
            className="w-full sm:w-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="all">All Specialists</option>
            {staffList.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default AppointmentFilters;

