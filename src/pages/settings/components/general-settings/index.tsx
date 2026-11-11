import { useState, type FormEvent } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import type { GeneralSettingsState } from "../../types";

export type GeneralTabType = "profile" | "financial" | "operations";

export interface GeneralSettingsViewProps {
  activeTab?: GeneralTabType;
  onTabChange?: (tab: GeneralTabType) => void;
}

const defaultGeneral: GeneralSettingsState = {
  salonName: "Sribees Luxury Salon & Spa",
  phone: "+94 77 123 4567",
  email: "contact@sribeessalon.com",
  address: "No. 42, Galle Road, Colombo 03, Sri Lanka",
  currency: "LKR (Rs.)",
  taxRate: 2.5,
  timeZone: "Asia/Colombo (GMT+5:30)",
  openingTime: "09:00",
  closingTime: "20:00",
};

export function GeneralSettingsView({
  activeTab: controlledTab,
}: GeneralSettingsViewProps = {}) {
  const [internalTab] = useState<GeneralTabType>("profile");
  const activeTab = controlledTab ?? internalTab;

  const [formData, setFormData] = useState<GeneralSettingsState>(() => {
    try {
      const saved = localStorage.getItem("sribees_general_settings");
      return saved ? JSON.parse(saved) : defaultGeneral;
    } catch {
      return defaultGeneral;
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sribees_general_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(defaultGeneral);
    localStorage.removeItem("sribees_general_settings");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-slate-900">
      {/* ========================================================= */}
      {/* TAB 1: SALON PROFILE INFORMATION                          */}
      {/* ========================================================= */}
      {activeTab === "profile" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Salon Profile Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details appear on customer invoices, appointment reminders, and receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-medium text-slate-700">Salon Business Name</label>
              <input
                type="text"
                required
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Official Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Physical Address / Branch</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FINANCIAL & REGIONAL PREFERENCES                   */}
      {/* ========================================================= */}
      {activeTab === "financial" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Financial & Regional Preferences</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Currency formats, time zones, and sales taxes applied at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-medium text-slate-700">Operating Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value="LKR (Rs.)">LKR (Rs.) - Sri Lankan Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Default Service Tax (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Time Zone</label>
              <select
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value="Asia/Colombo (GMT+5:30)">Asia/Colombo (GMT+5:30)</option>
                <option value="Asia/Dubai (GMT+4:00)">Asia/Dubai (GMT+4:00)</option>
                <option value="Asia/Singapore (GMT+8:00)">Asia/Singapore (GMT+8:00)</option>
                <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SALON DAILY OPERATING HOURS                         */}
      {/* ========================================================= */}
      {activeTab === "operations" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Salon Daily Operating Hours</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Controls the appointment scheduling grid range and booking limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block mb-1 font-medium text-slate-700">Opening Time</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">Closing Time</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions bottom bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
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
              <span>
                {activeTab === "profile"
                  ? "Save Salon Profile"
                  : activeTab === "financial"
                  ? "Save Financial Preferences"
                  : "Save Operating Hours"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default GeneralSettingsView;
