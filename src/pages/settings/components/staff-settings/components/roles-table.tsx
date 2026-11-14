import {
  Users,
  Trash2,
  ShieldCheck,
  Loader2,
  ChevronsUpDown,
  Pencil,
} from "lucide-react";
import type { StaffRoleItem } from "../../../../../interface/staff.types";
import type { StaffRoleType } from "../../../types";
import type { ComputedRole, RoleSortField, VisibleColumns } from "../../../../../interface/staff-settings.types";
import { Button } from "../../../../../components/button";

export interface RolesTableProps {
  dbRoles: StaffRoleItem[];
  paginatedRoles: ComputedRole[];
  visibleColumns: VisibleColumns;
  isLoadingRoles: boolean;
  roleSearchQuery: string;
  onSort: (field: RoleSortField) => void;
  onQuickToggleRole: (roleId: string, currentActive: boolean) => void;
  onConfigurePermissions: (roleId: StaffRoleType) => void;
  onOpenEditRole: (roleItem: StaffRoleItem) => void;
  onDeleteRole: (roleItem: StaffRoleItem) => void;
}

export function RolesTable({
  dbRoles,
  paginatedRoles,
  visibleColumns,
  isLoadingRoles,
  roleSearchQuery,
  onSort,
  onQuickToggleRole,
  onConfigurePermissions,
  onOpenEditRole,
  onDeleteRole,
}: RolesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-[#f4f7fb] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {visibleColumns.roleId && (
                <th
                  onClick={() => onSort("roleCode")}
                  className="px-4 py-3 min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center gap-1">
                    <span>LOCATION ID</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              <th
                onClick={() => onSort("label")}
                className="px-4 py-3 min-w-[190px] cursor-pointer hover:bg-slate-200/60 select-none transition"
              >
                <div className="flex items-center gap-1">
                  <span>ROLE NAME</span>
                  <ChevronsUpDown className="size-3 text-slate-400" />
                </div>
              </th>

              {visibleColumns.identifier && (
                <th
                  onClick={() => onSort("id")}
                  className="px-4 py-3 min-w-[150px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center gap-1">
                    <span>IDENTIFIER</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              {visibleColumns.description && (
                <th className="px-4 py-3 min-w-[260px]">
                  <span>DESCRIPTION</span>
                </th>
              )}

              {visibleColumns.staffCount && (
                <th
                  onClick={() => onSort("staffCount")}
                  className="px-4 py-3 text-center min-w-[130px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ASSIGNED STAFF</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              {visibleColumns.status && (
                <th
                  onClick={() => onSort("active")}
                  className="px-4 py-3 text-center min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>STATUS</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              <th className="px-4 py-3 text-right min-w-[120px]">
                <span>ACTIONS</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoadingRoles ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" />
                  <span>Loading staff roles...</span>
                </td>
              </tr>
            ) : paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <Users className="size-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No staff roles found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {roleSearchQuery
                      ? "Try adjusting your search keywords"
                      : 'Click "+ Add New Role" to register your first custom role.'}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role) => {
                const roleItemObj = dbRoles.find((r) => r.value === role.id) || {
                  id: role.dbId || `default-${role.id}`,
                  label: role.label,
                  value: role.id,
                  description: role.description,
                  active: role.active,
                  staffCount: role.staffCount,
                };

                return (
                  <tr key={role.id} className="hover:bg-slate-50/70 transition group">
                    {/* Role ID Code */}
                    {visibleColumns.roleId && (
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                        {role.roleCode}
                      </td>
                    )}

                    {/* Role Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">
                          {role.label}
                        </span>
                        {role.isCustom && (
                          <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 border border-purple-200">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Identifier / Slug */}
                    {visibleColumns.identifier && (
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        {role.id}
                      </td>
                    )}

                    {/* Description */}
                    {visibleColumns.description && (
                      <td className="px-4 py-3.5 text-slate-600 max-w-[280px]">
                        {role.description ? (
                          <span className="truncate block" title={role.description}>
                            {role.description}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    )}

                    {/* Staff Count */}
                    {visibleColumns.staffCount && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {role.staffCount} staff
                        </span>
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.status && (
                      <td className="px-4 py-3.5 text-center">
                        <Button
                          type="button"
                          onClick={() => onQuickToggleRole(role.id, role.active)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                            role.active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              role.active ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{role.active ? "Active" : "Inactive"}</span>
                        </Button>
                      </td>
                    )}

                    {/* Actions: Pencil Edit icon, Permissions, Delete */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manage Permissions Shortcut */}
                        <Button
                          type="button"
                          onClick={() => onConfigurePermissions(role.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                          title="Configure Permissions"
                        >
                          <ShieldCheck className="size-4" />
                        </Button>

                        {/* Pencil Edit Icon */}
                        <Button
                          type="button"
                          onClick={() => onOpenEditRole(roleItemObj)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-primary transition cursor-pointer"
                          title="Edit Role"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        {/* Delete button (custom roles only) */}
                        {role.isCustom && (
                          <Button
                            type="button"
                            onClick={() => onDeleteRole(roleItemObj)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                            title="Delete Role"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RolesTable;
