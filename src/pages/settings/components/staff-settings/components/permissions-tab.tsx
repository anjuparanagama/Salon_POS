import type { FormEvent } from "react";
import { Check, RotateCcw, Save, KeyRound, Loader2 } from "lucide-react";
import type { RolePermissions, StaffRoleType } from "../../../types";
import type { ComputedRole } from "../../../../../interface/staff-settings.types";
import { PermissionsMatrix } from "./permissions-matrix";

export interface PermissionsTabProps {
  computedRolesList: ComputedRole[];
  activeRole: StaffRoleType;
  setActiveRole: (roleId: StaffRoleType) => void;
  currentRolePerms: RolePermissions;
  handleTogglePermission: (key: keyof RolePermissions) => void;
  handleSelectAllForRole: () => void;
  handleDeselectAllForRole: () => void;
  handleResetDefaults: () => void;
  handleSavePermissions: (e?: FormEvent) => void;
  isSavingPermissions: boolean;
  isSaved: boolean;
  activeCount: number;
  totalCount: number;
}

export function PermissionsTab({
  computedRolesList,
  activeRole,
  setActiveRole,
  currentRolePerms,
  handleTogglePermission,
  handleSelectAllForRole,
  handleDeselectAllForRole,
  handleResetDefaults,
  handleSavePermissions,
  isSavingPermissions,
  isSaved,
  activeCount,
  totalCount,
}: PermissionsTabProps) {
  return (
    <form onSubmit={handleSavePermissions} className="flex flex-col gap-6 animate-in fade-in duration-150">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        {/* Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Role-Based POS System Permissions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a staff role below to configure what features, POS checkout tools, and data they can access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllForRole}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAllForRole}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Role selector pill tabs */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {computedRolesList.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={[
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0",
                  isSelected
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100",
                ].join(" ")}
              >
                <span>{role.label}</span>
                <span
                  className={[
                    "rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold",
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500 border border-slate-200",
                  ].join(" ")}
                >
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role Description & Counter Banner */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/60 border border-amber-100/80 px-3.5 py-2 text-xs text-amber-900">
          <p className="font-medium text-[11px] sm:text-xs">
            {computedRolesList.find((r) => r.id === activeRole)?.description}
          </p>
          <span className="shrink-0 font-bold text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
            {activeCount} of {totalCount} Enabled
          </span>
        </div>

        {/* Permissions Matrix 4 Groups */}
        <PermissionsMatrix
          currentRolePerms={currentRolePerms}
          handleTogglePermission={handleTogglePermission}
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="submit"
          disabled={isSavingPermissions}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isSaved
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {isSavingPermissions ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving to Database...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="size-4" />
              <span>Permissions Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Role Permissions</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default PermissionsTab;
