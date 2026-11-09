import { useState, type FormEvent } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import type { LayoutSettingsState } from "../../types";

const defaultLayout: LayoutSettingsState = {
  compactDensity: false,
  showLogoOnReceipt: true,
  showSpecialistOnReceipt: true,
  receiptHeader: "Thank you for pampering yourself at Sribees Salon!",
  receiptFooter: "Follow us on Instagram @sribeessalon • Hotline: 077 123 4567",
  showAppointmentDuration: true,
};

export function LayoutSettingsView() {
  const [formData, setFormData] = useState<LayoutSettingsState>(() => {
    try {
      const saved = localStorage.getItem("sribees_layout_settings");
      return saved ? JSON.parse(saved) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sribees_layout_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(defaultLayout);
    localStorage.removeItem("sribees_layout_settings");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-slate-900">
      {/* Receipt & Thermal Print Templates Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Thermal Receipt & Invoice Layout</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Customise the header greeting, footer thank-you message, and styling printed on receipts.
        </p>

        <div className="mt-4 flex flex-col gap-4 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Receipt Top Header Note</label>
            <input
              type="text"
              value={formData.receiptHeader}
              onChange={(e) => setFormData({ ...formData, receiptHeader: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Receipt Footer Disclaimer / Social Handles</label>
            <textarea
              rows={2}
              value={formData.receiptFooter}
              onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Print switches */}
        <div className="mt-5 flex flex-col gap-3 pt-3 border-t border-slate-100">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Print Salon Logo on Top of Invoice</span>
              <p className="text-[11px] text-slate-500">Includes monochrome salon brand icon on 80mm thermal receipts.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.showLogoOnReceipt}
              onChange={(e) => setFormData({ ...formData, showLogoOnReceipt: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Show Assigned Stylist Name on Customer Receipt</span>
              <p className="text-[11px] text-slate-500">Prints specialist attribution under each service line item.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.showSpecialistOnReceipt}
              onChange={(e) => setFormData({ ...formData, showSpecialistOnReceipt: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* POS Screen Density & Visuals Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Screen Viewport & Data Table Density</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Display preferences for touch counters, tablets, and high-density cashier displays.
        </p>

        <div className="mt-3 flex flex-col gap-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Compact Table Rows</span>
              <p className="text-[11px] text-slate-500">Reduces vertical cell padding in appointments, products, and customer lists.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.compactDensity}
              onChange={(e) => setFormData({ ...formData, compactDensity: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Display Duration Badges on Calendar Cards</span>
              <p className="text-[11px] text-slate-500">Shows estimated minutes badge directly inside appointment cards.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.showAppointmentDuration}
              onChange={(e) => setFormData({ ...formData, showAppointmentDuration: e.target.checked })}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </label>
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
              <span>Save Layout Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default LayoutSettingsView;

