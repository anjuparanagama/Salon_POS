import { useState, type FormEvent } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import type { NotificationSettingsState } from "../../types";

const defaultNotifications: NotificationSettingsState = {
  enableSmsReminders: true,
  smsAdvanceHours: 2,
  enableBookingConfirmationSms: true,
  enableWhatsAppNotifications: true,
  enableLowStockEmail: true,
  managerNotificationEmail: "manager@sribeessalon.com",
};

export function NotificationSettingsView() {
  const [formData, setFormData] = useState<NotificationSettingsState>(() => {
    try {
      const saved = localStorage.getItem("sribees_notification_settings");
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sribees_notification_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(defaultNotifications);
    localStorage.removeItem("sribees_notification_settings");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-slate-900">
      {/* Customer SMS & Instant Alerts Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Customer SMS & WhatsApp Notifications</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Automated text notifications sent to clients when bookings are confirmed or upcoming.
        </p>

        <div className="mt-4 flex flex-col gap-3.5 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800">Send Booking Confirmation SMS</span>
              <p className="text-[11px] text-slate-500">Dispatches an instant booking receipt via SMS once an appointment is scheduled.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.enableBookingConfirmationSms}
              onChange={(e) => setFormData({ ...formData, enableBookingConfirmationSms: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800">Send Appointment Reminder SMS</span>
              <p className="text-[11px] text-slate-500">Sends reminder with appointment time, specialist, and salon directions.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.enableSmsReminders}
              onChange={(e) => setFormData({ ...formData, enableSmsReminders: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>

          {formData.enableSmsReminders && (
            <div className="pl-4 pt-1 flex items-center gap-3">
              <label className="text-xs font-medium text-slate-700">Reminder Timing:</label>
              <select
                value={formData.smsAdvanceHours}
                onChange={(e) => setFormData({ ...formData, smsAdvanceHours: Number(e.target.value) })}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value={1}>1 Hour before</option>
                <option value={2}>2 Hours before (Recommended)</option>
                <option value={4}>4 Hours before</option>
                <option value={24}>24 Hours before (1 Day)</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold text-xs text-slate-800">Enable WhatsApp Direct Share Links</span>
              <p className="text-[11px] text-slate-500">Allows one-click sharing of catalogs and invoices via WhatsApp API.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.enableWhatsAppNotifications}
              onChange={(e) => setFormData({ ...formData, enableWhatsAppNotifications: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Internal & Manager Alerts Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Salon Operations & Inventory Alerts</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic email updates sent to salon managers for operational events.
        </p>

        <div className="mt-4 flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800">Low Stock Product Alert Emails</span>
              <p className="text-[11px] text-slate-500">Notifies management when inventory reaches or drops below warning threshold.</p>
            </div>
            <Input
              type="checkbox"
              checked={formData.enableLowStockEmail}
              onChange={(e) => setFormData({ ...formData, enableLowStockEmail: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <Input
              type="email"
              label="Manager Notification Email"
              labelClassName="block mb-0 font-medium text-slate-700"
              value={formData.managerNotificationEmail}
              onChange={(e) => setFormData({ ...formData, managerNotificationEmail: e.target.value })}
              wrapperClassName="w-full sm:w-1/2"
              className="rounded-xl border-slate-200 px-3.5 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Actions bottom bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </Button>

        <Button
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
              <span>Save Notification Settings</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default NotificationSettingsView;

