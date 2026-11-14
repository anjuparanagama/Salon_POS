import type { Dispatch, SetStateAction } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ChevronDown,
  Download,
  Columns3,
} from "lucide-react";
import { Input } from "../../../../../components/input";
import type { RoleSearchField, VisibleColumns } from "../../../../../interface/staff-settings.types";

export interface RolesToolbarProps {
  searchField: RoleSearchField;
  onSearchFieldChange: (field: RoleSearchField) => void;
  roleSearchQuery: string;
  onRoleSearchQueryChange: (query: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: Dispatch<SetStateAction<boolean>>;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
  onRefresh: () => void;
  isLoadingRoles: boolean;
  onExportCSV: () => void;
  onOpenAddRole: () => void;
}

export function RolesToolbar({
  searchField,
  onSearchFieldChange,
  roleSearchQuery,
  onRoleSearchQueryChange,
  pageSize,
  onPageSizeChange,
  showColumnMenu,
  setShowColumnMenu,
  visibleColumns,
  onToggleColumn,
  onRefresh,
  isLoadingRoles,
  onExportCSV,
  onOpenAddRole,
}: RolesToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left: Combined Search input with dropdown prefix */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition w-full sm:w-96">
        <div className="relative border-r border-slate-200 shrink-0">
          <select
            value={searchField}
            onChange={(e) => onSearchFieldChange(e.target.value as RoleSearchField)}
            className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="name">Role Name</option>
            <option value="slug">Identifier</option>
            <option value="id">Role ID</option>
            <option value="all">All Fields</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
        </div>

        <Input
          type="text"
          placeholder="Search..."
          value={roleSearchQuery}
          onChange={(e) => onRoleSearchQueryChange(e.target.value)}
          rightElement={<Search className="pointer-events-none size-4 text-slate-400" />}
          className="w-full bg-transparent pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none border-0"
          wrapperClassName="flex-1"
        />
      </div>

      {/* Right: Page Size, Column Toggle, Export CSV, + Add New Role */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
        {/* Page size selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Page size</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-6 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
          </div>
        </div>

        {/* Column toggle button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColumnMenu((p) => !p)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
            title="Toggle visible columns"
          >
            <Columns3 className="size-4" />
          </button>

          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl text-xs flex flex-col gap-1.5">
              <div className="font-semibold text-slate-700 pb-1 border-b border-slate-100">
                Visible Columns
              </div>
              <Input
                type="checkbox"
                checked={visibleColumns.roleId}
                onChange={() => onToggleColumn("roleId")}
                label={<span>Role ID</span>}
                className="rounded accent-primary"
                wrapperClassName="px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
              />
              <Input
                type="checkbox"
                checked={visibleColumns.identifier}
                onChange={() => onToggleColumn("identifier")}
                label={<span>Identifier / Slug</span>}
                className="rounded accent-primary"
                wrapperClassName="px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
              />
              <Input
                type="checkbox"
                checked={visibleColumns.description}
                onChange={() => onToggleColumn("description")}
                label={<span>Description</span>}
                className="rounded accent-primary"
                wrapperClassName="px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
              />
              <Input
                type="checkbox"
                checked={visibleColumns.staffCount}
                onChange={() => onToggleColumn("staffCount")}
                label={<span>Assigned Staff</span>}
                className="rounded accent-primary"
                wrapperClassName="px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
              />
              <Input
                type="checkbox"
                checked={visibleColumns.status}
                onChange={() => onToggleColumn("status")}
                label={<span>Status</span>}
                className="rounded accent-primary"
                wrapperClassName="px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
              />
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          title="Refresh staff roles"
        >
          <RefreshCw className={`size-4 ${isLoadingRoles ? "animate-spin" : ""}`} />
        </button>

        {/* Export / Download CSV */}
        <button
          type="button"
          onClick={onExportCSV}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          title="Download roles as CSV"
        >
          <Download className="size-4" />
        </button>

        {/* Primary Action Button: + Add New Role */}
        <button
          type="button"
          onClick={onOpenAddRole}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add New Role</span>
        </button>
      </div>
    </div>
  );
}

export default RolesToolbar;
