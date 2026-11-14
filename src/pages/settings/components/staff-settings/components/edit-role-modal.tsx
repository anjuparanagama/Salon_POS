import { useState, useEffect, type FormEvent } from "react";
import { Edit2, X, Loader2 } from "lucide-react";
import { Input } from "../../../../../components/input";
import { staffService } from "../../../../../services/staff.service";
import type { StaffRoleItem } from "../../../../../interface/staff.types";

export interface EditRoleModalProps {
  role: StaffRoleItem | null;
  onClose: () => void;
  onRoleUpdated: (roleValueOrId: string, updatedData: Partial<StaffRoleItem>) => void;
}

export function EditRoleModal({
  role,
  onClose,
  onRoleUpdated,
}: EditRoleModalProps) {
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDesc, setEditRoleDesc] = useState("");
  const [editRoleActive, setEditRoleActive] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    if (role) {
      setEditRoleName(role.label);
      setEditRoleDesc(role.description || "");
      setEditRoleActive(role.active !== false);
    }
  }, [role]);

  if (!role) return null;

  const handleSaveEditRole = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = editRoleName.trim();
    if (!trimmedName) return;

    setIsUpdatingRole(true);
    try {
      const roleIdOrSlug = role.id || role.value;
      const updated = await staffService.updateRole(roleIdOrSlug, {
        label: trimmedName,
        description: editRoleDesc.trim() || undefined,
        active: editRoleActive,
      });

      onRoleUpdated(role.value, updated);
      onClose();
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Edit2 className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit Staff Role</h3>
              <p className="text-[11px] text-slate-500">
                Update role title, description, and active status
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSaveEditRole}>
          <div className="p-6 flex flex-col gap-4">
            <Input
              label={<>Role Title <span className="text-rose-500">*</span></>}
              labelClassName="block text-xs font-semibold text-slate-700 mb-1"
              type="text"
              required
              value={editRoleName}
              onChange={(e) => setEditRoleName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <Input
              label="Identifier (Slug)"
              labelClassName="block text-xs font-semibold text-slate-700 mb-1"
              type="text"
              disabled
              value={role.value}
              className="w-full font-mono rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={editRoleDesc}
                onChange={(e) => setEditRoleDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
              <div>
                <div className="text-xs font-semibold text-slate-800">Role Status</div>
                <div className="text-[10px] text-slate-500">
                  Active roles appear in staff registration and assignment dropdowns
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={editRoleActive}
                onClick={() => setEditRoleActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  editRoleActive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    editRoleActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingRole || !editRoleName.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingRole && <Loader2 className="size-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoleModal;
