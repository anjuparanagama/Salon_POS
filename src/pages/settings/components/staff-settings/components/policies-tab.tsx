import type { FormEvent, Dispatch, SetStateAction } from "react";
import { Check, RotateCcw, Save, Loader2 } from "lucide-react";
import { Input } from "../../../../../components/input";
import type { StaffSettingsState } from "../../../types";

export interface PoliciesTabProps {
  formData: StaffSettingsState;
  setFormData: Dispatch<SetStateAction<StaffSettingsState>>;
  handleResetDefaults: () => void;
  handleSavePermissions: (e?: FormEvent) => void;
  isSavingPermissions: boolean;
  isSaved: boolean;
}

export function PoliciesTab({
  formData,
  setFormData,
  handleResetDefaults,
  handleSavePermissions,
  isSavingPermissions,
  isSaved,
}: PoliciesTabProps) {
  return (
    <form onSubmit={handleSavePermissions} className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Card 1: Staff Login & Session Policies */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800">Staff Login & Session Policies</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rules enforced when staff members are logged into the salon terminal.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Require Staff PIN for Checkout Transactions</span>
              <p className="text-[11px] text-slate-400">Staff must verify their 4-digit PIN before finishing each bill.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.requirePinForCheckout}
              onChange={(e) => setFormData({ ...formData, requirePinForCheckout: e.target.checked })}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Restrict Stylists to View Only Their Own Bookings</span>
              <p className="text-[11px] text-slate-400">When logged in, stylists can only inspect their personal schedule and assigned clients.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.staffCanOnlyViewOwnBookings}
              onChange={(e) => setFormData({ ...formData, staffCanOnlyViewOwnBookings: e.target.checked })}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Restrict Login to Working Hours Only</span>
              <p className="text-[11px] text-slate-400">Staff accounts cannot log in outside salon operating hours.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.restrictLoginToWorkingHours}
              onChange={(e) => setFormData({ ...formData, restrictLoginToWorkingHours: e.target.checked })}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-800">Terminal Inactivity Auto-Lock</span>
              <p className="text-[11px] text-slate-400">Automatically logs out staff after idle period on the POS device.</p>
            </div>
            <select
              value={formData.autoLogoutMinutes}
              onChange={(e) => setFormData({ ...formData, autoLogoutMinutes: Number(e.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes (Standard)</option>
              <option value={60}>1 Hour</option>
              <option value={0}>Never Auto-Lock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card 2: Shift Management & Auto-Assignment */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800">Shift Management & Auto-Assignment</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rules for automated staff distribution and breaks in booking schedules.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Auto-assign Available Specialist for Walk-in Clients</span>
              <p className="text-[11px] text-slate-400">Picks the active staff member with lowest load in the current time slot.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.autoAssignWalkIns}
              onChange={(e) => setFormData({ ...formData, autoAssignWalkIns: e.target.checked })}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Enforce Scheduled Break Times in Calendar</span>
              <p className="text-[11px] text-slate-400">Prevents appointments from being booked during marked staff breaks.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.enforceBreakSchedule}
              onChange={(e) => setFormData({ ...formData, enforceBreakSchedule: e.target.checked })}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          {formData.enforceBreakSchedule && (
            <div className="pl-4 pt-1 flex items-center gap-3">
              <label className="text-xs font-medium text-slate-700">Mandatory Break Duration:</label>
              <select
                value={formData.breakDurationMinutes}
                onChange={(e) => setFormData({ ...formData, breakDurationMinutes: Number(e.target.value) })}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
              </select>
            </div>
          )}
        </div>
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
              <span>Saving Policies...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="size-4" />
              <span>Policies Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Staff Policies</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default PoliciesTab;
