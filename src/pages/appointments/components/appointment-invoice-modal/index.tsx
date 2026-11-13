import { useState, useEffect } from "react";
import { Printer, Layers } from "lucide-react";
import Modal from "../../../../components/modal";
import type { Appointment } from "../../../../interface/appointment.types";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";
import {
  getStoredLayoutSettings,
  INVOICE_TEMPLATES_META,
} from "../../../../helpers/layout-settings.helper";
import InvoiceRenderer, {
  type InvoiceData,
  type SalonInfo,
} from "../../../../components/invoice-template";
import type { InvoiceTemplateId, LayoutSettingsState } from "../../../settings/types";

export type AppointmentInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
};

export function AppointmentInvoiceModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentInvoiceModalProps) {
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettingsState>(() =>
    getStoredLayoutSettings()
  );
  const [activeTemplate, setActiveTemplate] = useState<InvoiceTemplateId>(
    layoutSettings.selectedInvoiceTemplate || "modern"
  );

  // Sync settings when opened or updated
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredLayoutSettings();
      setLayoutSettings(stored);
      setActiveTemplate(stored.selectedInvoiceTemplate || "modern");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredLayoutSettings();
      setLayoutSettings(stored);
      setActiveTemplate(stored.selectedInvoiceTemplate || "modern");
    };
    window.addEventListener("sribees_layout_settings_updated", handleUpdate);
    return () => window.removeEventListener("sribees_layout_settings_updated", handleUpdate);
  }, []);

  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanAptNum = formatAppointmentId(appointment).replace(/^#APT-/, "");
  const invoiceNumber = appointment.invoiceNumber || `INV-2026-${cleanAptNum}`;

  // Read salon general settings
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

  // Construct items from appointment
  const items =
    appointment.services && appointment.services.length > 0
      ? appointment.services.map((s, idx) => ({
          id: s.id || String(idx),
          name: s.name,
          durationMinutes: s.durationMinutes,
          quantity: 1,
          unitPrice: s.price,
          totalPrice: s.price,
          notes: idx === 0 ? appointment.notes : undefined,
        }))
      : [
          {
            id: "1",
            name: appointment.serviceName || "Salon Service",
            durationMinutes: appointment.durationMinutes ?? 45,
            quantity: 1,
            unitPrice: appointment.price ?? 0,
            totalPrice: appointment.price ?? 0,
            notes: appointment.notes,
          },
        ];

  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const invoiceData: InvoiceData = {
    invoiceNumber,
    date: appointment.date || new Date().toISOString().split("T")[0],
    time: appointment.time || "09:00 AM",
    clientName: appointment.clientName || "Valued Customer",
    clientPhone: appointment.clientPhone || "",
    staffName: appointment.staffName || "Stylist Specialist",
    items,
    subtotal,
    discount: 0,
    tax: 0,
    total: subtotal,
    paidAmount: subtotal,
    paymentStatus: "PAID",
    paymentMethod: "Cash",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Invoice"
      description={`Official receipt for invoice #${invoiceNumber}`}
      size="lg"
    >
      <div className="flex flex-col gap-4 text-xs text-slate-800">
        {/* Layout Bar: Shows active layout and allows quick switching */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Layers className="size-3.5 text-primary" />
            <span className="font-semibold text-slate-700">Layout Template:</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            {INVOICE_TEMPLATES_META.map((tmpl) => {
              const isSelected = activeTemplate === tmpl.id;
              const isConfiguredDefault =
                layoutSettings.selectedInvoiceTemplate === tmpl.id ||
                (!layoutSettings.selectedInvoiceTemplate && tmpl.id === "modern");

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setActiveTemplate(tmpl.id)}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  title={`${tmpl.description}${isConfiguredDefault ? " (Default in Layout Settings)" : ""}`}
                >
                  <span>{tmpl.name}</span>
                  {isConfiguredDefault && (
                    <span
                      className={`size-1.5 rounded-full ${
                        isSelected ? "bg-emerald-400" : "bg-emerald-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Printable Invoice Container using the selected layout */}
        <div className="max-h-[65vh] overflow-y-auto p-1 rounded-xl bg-slate-100/30">
          <InvoiceRenderer
            invoice={invoiceData}
            salon={salonInfo}
            layoutSettings={layoutSettings}
            templateOverride={activeTemplate}
            containerId="printable-invoice"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-500">
            Default layout can be configured in <strong>Layout Settings</strong>.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <Printer className="size-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AppointmentInvoiceModal;
