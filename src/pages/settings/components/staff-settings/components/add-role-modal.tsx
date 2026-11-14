import { useState, type FormEvent } from "react";
import { ShieldCheck, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../../../../../components/button";
import { Input } from "../../../../../components/input";
import { staffService } from "../../../../../services/staff.service";
import type { StaffRoleItem } from "../../../../../interface/staff.types";
import type { RolePermissions, StaffSettingsState } from "../../../types";
import type { ComputedRole } from "../../../../../interface/staff-settings.types";
import { defaultPermissions } from "../../../../../constants/staff-settings.constants";

export interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  computedRolesList: ComputedRole[];
  formData: StaffSettingsState;
  onRoleCreated: (created: StaffRoleItem, templatePerms: RolePermissions) => void;
}

export function AddRoleModal({
  isOpen,
  onClose,
  computedRolesList,
  formData,
  onRoleCreated,
}: AddRoleModalProps) {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRole, setCloneFromRole] = useState<string>("stylist");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleNameChange = (val: string) => {
    setNewRoleName(val);
    const slug = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setNewRoleCode(slug);
  };

  const handleSaveNewRole = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setAddRoleError("Please enter a role name.");
      return;
    }

    const trimmedCode =
      newRoleCode.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_") ||
      trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    setIsSavingRole(true);
    setAddRoleError(null);

    const templatePerms =
      formData.rolesPermissions[cloneFromRole] ||
      defaultPermissions[cloneFromRole as keyof typeof defaultPermissions] ||
      defaultPermissions.stylist;

    try {
      const created = await staffService.createRole({
        label: trimmedName,
        value: trimmedCode,
        description: newRoleDesc.trim() || undefined,
        permissions: templatePerms as unknown as Record<string, boolean>,
        active: true,
      });

      onRoleCreated(created, templatePerms);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create role:", err);
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setAddRoleError(detail || "Failed to create role. Please try again.");
    } finally {
      setIsSavingRole(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Staff Role</h3>
              <p className="text-[11px] text-slate-500">
                Create a salon staff role with custom POS system permissions
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSaveNewRole}>
          <div className="p-6 flex flex-col gap-4">
            {addRoleError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                <AlertCircle className="size-4 shrink-0" />
                <span>{addRoleError}</span>
              </div>
            )}

            <Input
              label={<>Role Title <span className="text-rose-500">*</span></>}
              labelClassName="block text-xs font-semibold text-slate-700 mb-1"
              type="text"
              required
              placeholder="e.g. Color Specialist, Junior Barber"
              value={newRoleName}
              onChange={(e) => handleRoleNameChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <Input
              label={<>Code / Identifier <span className="text-xs text-slate-400 font-normal">(slug)</span></>}
              labelClassName="block text-xs font-semibold text-slate-700 mb-1"
              type="text"
              placeholder="e.g. color_specialist"
              value={newRoleCode}
              onChange={(e) => setNewRoleCode(e.target.value)}
              className="w-full font-mono rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Description <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of the staff responsibilities..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clone Initial Permissions From:
              </label>
              <select
                value={cloneFromRole}
                onChange={(e) => setCloneFromRole(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {computedRolesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-400">
                Permissions can be tailored anytime in the Permission Management tab.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSavingRole || !newRoleName.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
            >
              {isSavingRole && <Loader2 className="size-3.5 animate-spin" />}
              <span>Create Role</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoleModal;
