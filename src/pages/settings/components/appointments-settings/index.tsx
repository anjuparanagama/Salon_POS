import { useState, type FormEvent } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { Input } from "../../../../components/input";
import type { AppointmentsSettingsState } from "../../types";

const defaultAppointments: AppointmentsSettingsState = {
  defaultDuration: 45,
  slotInterval: 15,
  bufferMinutes: 10,
  allowOnlineBooking: true,
  autoApprove: false,
  cancellationWindowHours: 4,
  maxAdvanceBookingDays: 30,
};

export function AppointmentsSettingsView() {
  const [formData, setFormData] = useState<AppointmentsSettingsState>(() => {
    try {
      const saved = localStorage.getItem("sribees_appointments_settings");
      return saved ? JSON.parse(saved) : defaultAppointments;
    } catch {
      return defaultAppointments;
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sribees_appointments_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(defaultAppointments);
    localStorage.removeItem("sribees_appointments_settings");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-slate-900">
      {/* Booking Slot & Duration Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Booking Slots & Service Intervals</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure default service durations, calendar slot stepping, and clean-up buffer intervals.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Default Service Duration</label>
            <select
              value={formData.defaultDuration}
              onChange={(e) => setFormData({ ...formData, defaultDuration: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Standard)</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Calendar Slot Interval</label>
            <select
              value={formData.slotInterval}
              onChange={(e) => setFormData({ ...formData, slotInterval: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
            >
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Clean-up / Buffer Time</label>
            <select
              value={formData.bufferMinutes}
              onChange={(e) => setFormData({ ...formData, bufferMinutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
            >
              <option value={0}>No Buffer (Back-to-back)</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes (Recommended)</option>
              <option value={15}>15 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies & Advance Limits Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Booking Rules & Cancellation Policies</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Cancellation policy deadlines and how far in advance appointments can be reserved.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Input
            type="number"
            min="1"
            max="72"
            label="Cancellation Deadline (Hours before appointment)"
            labelClassName="block mb-0 font-medium text-slate-700"
            value={formData.cancellationWindowHours}
            onChange={(e) => setFormData({ ...formData, cancellationWindowHours: Number(e.target.value) })}
            className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
          />

          <Input
            type="number"
            min="1"
            max="180"
            label="Maximum Advance Booking Window (Days)"
            labelClassName="block mb-0 font-medium text-slate-700"
            value={formData.maxAdvanceBookingDays}
            onChange={(e) => setFormData({ ...formData, maxAdvanceBookingDays: Number(e.target.value) })}
            className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
          />
        </div>

        {/* Toggle switches */}
        <div className="mt-5 flex flex-col gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800">Allow Online Customer Booking</span>
              <p className="text-[11px] text-slate-500">Allow customers to request appointments via shared links.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.allowOnlineBooking}
              onChange={(e) => setFormData({ ...formData, allowOnlineBooking: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800">Auto-Approve Appointments</span>
              <p className="text-[11px] text-slate-500">Automatically mark online bookings as Confirmed without manual review.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.autoApprove}
              onChange={(e) => setFormData({ ...formData, autoApprove: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Actions bottom bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isSaved
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="size-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Appointments Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default AppointmentsSettingsView;

