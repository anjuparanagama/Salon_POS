import { useState, type FormEvent } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  Crown,
  Receipt,
  Layers,
} from "lucide-react";
import type { InvoiceTemplateId, LayoutSettingsState } from "../../types";
import {
  DEFAULT_LAYOUT_SETTINGS,
  INVOICE_TEMPLATES_META,
  getStoredLayoutSettings,
  saveStoredLayoutSettings,
} from "../../../../helpers/layout-settings.helper";
import Modal from "../../../../components/modal";
import InvoiceRenderer, {
  type InvoiceData,
  type SalonInfo,
} from "../../../../components/invoice-template";

export function LayoutSettingsView() {
  const [formData, setFormData] = useState<LayoutSettingsState>(() => getStoredLayoutSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Live Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<InvoiceTemplateId>(
    formData.selectedInvoiceTemplate || "modern"
  );

  // Read salon general settings for realistic preview
  const salonInfo: SalonInfo = (() => {
    try {
      const saved = localStorage.getItem("sribees_general_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.salonName || "Sribees Luxury Salon & Spa",
          address: parsed.address || "123 Beauty Avenue, Colombo 03, Sri Lanka",
          phone: parsed.phone || "+94 11 234 5678",
          email: parsed.email || "info@sribeessalon.com",
        };
      }
    } catch {
      // fallback
    }
    return {
      name: "Sribees Salon & Spa",
      address: "123 Beauty Avenue, Colombo 03, Sri Lanka",
      phone: "+94 11 234 5678",
      email: "info@sribeessalon.com",
    };
  })();

  const sampleInvoice: InvoiceData = {
    invoiceNumber: "INV-2026-0042",
    date: new Date().toISOString().split("T")[0],
    time: "11:30 AM",
    clientName: "Sanduni Perera",
    clientPhone: "+94 77 456 7890",
    staffName: "Kavindi Silva",
    items: [
      {
        id: "1",
        name: "Balayage Hair Colour & Keratin Spa",
        durationMinutes: 90,
        quantity: 1,
        unitPrice: 12500,
        totalPrice: 12500,
        notes: "Full tone treatment with organic argan serum",
      },
      {
        id: "2",
        name: "Luxury Gel Manicure & Nail Art",
        durationMinutes: 45,
        quantity: 1,
        unitPrice: 3500,
        totalPrice: 3500,
        notes: "French tip with chrome finish",
      },
    ],
    subtotal: 16000,
    discount: 1000,
    tax: 0,
    total: 15000,
    paidAmount: 15000,
    paymentStatus: "PAID",
    paymentMethod: "Cash",
  };

  const handleApplyTemplate = (templateId: InvoiceTemplateId) => {
    const updated = {
      ...formData,
      selectedInvoiceTemplate: templateId,
    };
    setFormData(updated);
    saveStoredLayoutSettings(updated);

    const templateMeta = INVOICE_TEMPLATES_META.find((t) => t.id === templateId);
    setAppliedNotice(`"${templateMeta?.name}" layout applied as active invoice template!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const openPreview = (templateId?: InvoiceTemplateId) => {
    setPreviewTemplate(templateId || formData.selectedInvoiceTemplate || "modern");
    setPreviewOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveStoredLayoutSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(DEFAULT_LAYOUT_SETTINGS);
    saveStoredLayoutSettings(DEFAULT_LAYOUT_SETTINGS);
    setAppliedNotice("Layout settings reset to default Modern Sleek layout.");
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const activeTemplateId = formData.selectedInvoiceTemplate || "modern";
  const activeTemplateMeta = INVOICE_TEMPLATES_META.find((t) => t.id === activeTemplateId);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-slate-900">
      {/* Toast Notice */}
      {appliedNotice && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-600 text-white p-4 text-xs font-semibold shadow-md animate-fade-in">
          <CheckCircle2 className="size-5 shrink-0" />
          <div className="flex-1">{appliedNotice}</div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PREMADE INVOICE LAYOUTS SELECTOR                                        */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Premade Invoice Layouts
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                3 Styles Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select one of the 3 pre-designed invoice styles below. The selected layout will be used when viewing and printing customer receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openPreview(activeTemplateId)}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <Eye className="size-3.5 text-primary" />
            <span>Preview Active Template</span>
          </button>
        </div>

        {/* 3 Template Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-5">
          {INVOICE_TEMPLATES_META.map((tmpl) => {
            const isSelected = activeTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleApplyTemplate(tmpl.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary-subtle/30 ring-2 ring-primary/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                }`}
              >
                {/* Top Badge & Indicator */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tmpl.tagColor}`}
                  >
                    {tmpl.tag}
                  </span>

                  <div className="flex items-center gap-1">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white text-[10px] font-bold px-2 py-0.5 shadow-2xs">
                        <Check className="size-3 stroke-[3]" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600">
                        Click to Apply
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Thumbnail Representation */}
                <div className="my-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-inner select-none overflow-hidden">
                  {tmpl.id === "modern" && (
                    <div className="space-y-1.5 text-[8px] font-sans">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                        <div className="flex items-center gap-1">
                          <span className="size-3 rounded-full bg-primary flex items-center justify-center text-white">
                            <Sparkles className="size-2" />
                          </span>
                          <span className="font-bold text-slate-800">Sribees Salon</span>
                        </div>
                        <span className="rounded bg-emerald-100 text-emerald-800 px-1 py-0.2 font-bold">
                          PAID
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-slate-500 text-[7px] py-0.5">
                        <div className="rounded bg-slate-50 p-1">Client: Sanduni</div>
                        <div className="rounded bg-slate-50 p-1">Staff: Kavindi</div>
                      </div>
                      <div className="space-y-0.5 pt-0.5">
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="font-medium text-slate-700">Balayage Colour</span>
                          <span className="font-bold text-slate-800">Rs. 12,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-700">Gel Manicure</span>
                          <span className="font-bold text-slate-800">Rs. 3,500</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-primary text-[9px]">
                        <span>TOTAL</span>
                        <span>Rs. 15,000.00</span>
                      </div>
                    </div>
                  )}

                  {tmpl.id === "thermal" && (
                    <div
                      className="space-y-1 text-[7.5px] text-slate-800 bg-amber-50/40 p-1 border border-dashed border-slate-300"
                      style={{ fontFamily: "monospace" }}
                    >
                      <div className="text-center font-bold text-[8px]">
                        *** SRIBBEES SALON ***
                      </div>
                      <div className="text-center text-[7px] text-slate-500">
                        - - - - - - - - - - - - -
                      </div>
                      <div className="flex justify-between text-[7px]">
                        <span>INV#0042</span>
                        <span>11:30 AM</span>
                      </div>
                      <div className="flex justify-between font-bold text-[7.5px]">
                        <span>1x Balayage Colour</span>
                        <span>12,500</span>
                      </div>
                      <div className="flex justify-between font-bold text-[7.5px]">
                        <span>1x Gel Manicure</span>
                        <span>3,500</span>
                      </div>
                      <div className="border-t border-dashed border-slate-400 pt-0.5 flex justify-between font-black text-[9px]">
                        <span>TOTAL:</span>
                        <span>Rs. 15,000</span>
                      </div>
                      <div className="flex justify-center gap-[1px] h-3 pt-0.5 opacity-70">
                        <span className="w-0.5 bg-slate-800" />
                        <span className="w-1 bg-slate-800" />
                        <span className="w-0.5 bg-slate-800" />
                        <span className="w-1.5 bg-slate-800" />
                        <span className="w-0.5 bg-slate-800" />
                      </div>
                    </div>
                  )}

                  {tmpl.id === "luxury" && (
                    <div className="rounded-lg overflow-hidden border border-amber-300/40 text-[8px] font-sans">
                      <div className="bg-slate-950 p-1.5 text-white flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Crown className="size-2.5 text-amber-300" />
                          <span className="font-serif font-bold text-amber-200">
                            Sribees Spa
                          </span>
                        </div>
                        <span className="text-[7px] text-amber-300 font-mono">INV#42</span>
                      </div>
                      <div className="p-1.5 bg-white space-y-1">
                        <div className="flex justify-between text-[7.5px] border-b border-amber-200/50 pb-0.5">
                          <span className="font-medium text-slate-800">VIP Hair Treatment</span>
                          <span className="font-serif font-bold">Rs. 12,500</span>
                        </div>
                        <div className="flex justify-between text-[7.5px]">
                          <span className="font-medium text-slate-800">Gel Polish Care</span>
                          <span className="font-serif font-bold">Rs. 3,500</span>
                        </div>
                        <div className="bg-slate-900 text-white rounded p-1 flex justify-between font-serif text-[8.5px] font-bold text-amber-300">
                          <span>Grand Total</span>
                          <span className="text-white">Rs. 15,000</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {tmpl.id === "modern" && <Sparkles className="size-3.5 text-primary" />}
                    {tmpl.id === "thermal" && <Receipt className="size-3.5 text-amber-600" />}
                    {tmpl.id === "luxury" && <Crown className="size-3.5 text-purple-600" />}
                    <span>{tmpl.name}</span>
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500">{tmpl.subtitle}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    {tmpl.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(tmpl.id);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-primary transition cursor-pointer"
                  >
                    <Eye className="size-3" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyTemplate(tmpl.id);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="size-3" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <span>Apply Layout</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Applied Status Bar */}
        <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-700">
              Active Invoice Layout:{" "}
              <strong className="font-bold text-slate-900">{activeTemplateMeta?.name}</strong>{" "}
              ({activeTemplateMeta?.subtitle})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Will be used across all invoices and receipt prints.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RECEIPT TEXT & HEADER/FOOTER CUSTOMISATION                             */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Thermal Receipt & Invoice Content</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Customise the header greeting note, footer thank-you message, and styling printed on receipts.
        </p>

        <div className="mt-4 flex flex-col gap-4 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Receipt Top Header Note</label>
            <input
              type="text"
              value={formData.receiptHeader}
              onChange={(e) => setFormData({ ...formData, receiptHeader: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              placeholder="e.g. Thank you for pampering yourself at Sribees Salon!"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Receipt Footer Disclaimer / Social Handles</label>
            <textarea
              rows={2}
              value={formData.receiptFooter}
              onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50"
              placeholder="e.g. Follow us on Instagram @sribeessalon • Hotline: 077 123 4567"
            />
          </div>
        </div>

        {/* Print switches */}
        <div className="mt-5 flex flex-col gap-3 pt-3 border-t border-slate-100">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Print Salon Logo on Top of Invoice</span>
              <p className="text-[11px] text-slate-500">Includes salon brand icon/logo on digital receipts and printed slips.</p>
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

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-slate-800">Display Duration on Receipt Line Items</span>
              <p className="text-[11px] text-slate-500">Shows minutes taken for appointments and treatments on the invoice.</p>
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

      {/* ========================================================================= */}
      {/* 3. SCREEN VIEWPORT & DATA TABLE DENSITY CARD                               */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE LIVE PREVIEW MODAL                                          */}
      {/* ========================================================================= */}
      {previewOpen && (
        <Modal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Invoice Layout Live Preview"
          description="Preview and compare how customer receipts appear across the 3 premade templates."
          size="lg"
        >
          <div className="flex flex-col gap-4 text-xs text-slate-800">
            {/* Template Switching Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                {INVOICE_TEMPLATES_META.map((tmpl) => {
                  const isActive = previewTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{tmpl.name}</span>
                      {activeTemplateId === tmpl.id && (
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Printer className="size-3.5 text-slate-500" />
                  <span>Test Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleApplyTemplate(previewTemplate);
                    setPreviewOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTemplateId === previewTemplate
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  <Check className="size-3.5" />
                  <span>
                    {activeTemplateId === previewTemplate
                      ? "Currently Applied"
                      : "Apply This Template"}
                  </span>
                </button>
              </div>
            </div>

            {/* Live Rendered Template */}
            <div className="max-h-[65vh] overflow-y-auto p-1 rounded-xl bg-slate-100/50">
              <InvoiceRenderer
                invoice={sampleInvoice}
                salon={salonInfo}
                layoutSettings={formData}
                templateOverride={previewTemplate}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-500">
                You can change the applied invoice layout at any time.
              </span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
}

export default LayoutSettingsView;
