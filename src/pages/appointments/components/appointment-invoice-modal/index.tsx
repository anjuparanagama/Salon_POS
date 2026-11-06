import { Printer, Sparkles, CheckCircle2 } from "lucide-react";
import Modal from "../../../../components/modal";
import type { Appointment } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";

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
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanAptNum = formatAppointmentId(appointment).replace(/^#APT-/, "");
  const invoiceNumber = `INV-2026-${cleanAptNum}`;
  const clientDisplayName = appointment.clientName || "Client";
  const clientDisplayPhone = appointment.clientPhone || "N/A";
  const staffDisplayName = appointment.staffName || "Specialist";
  const serviceDisplayName = appointment.serviceName || "Salon Service";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Invoice"
      description={`Official receipt for invoice #${invoiceNumber}`}
      size="lg"
    >
      <div className="flex flex-col gap-5 text-xs text-slate-800">
        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                  <Sparkles className="size-4" />
                </span>
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Sribees Salon & Spa
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                123 Beauty Avenue, Colombo 03, Sri Lanka
              </p>
              <p className="text-[11px] text-slate-500">
                Hotline: +94 11 234 5678 | info@sribeessalon.com
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="size-3" />
                <span>PAID</span>
              </span>
              <p className="mt-2 font-mono text-sm font-bold text-slate-900">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500">Date: {appointment.date || "N/A"}</p>
              <p className="text-[11px] text-slate-500">Time: {appointment.time || "09:00 AM"}</p>
            </div>
          </div>

          {/* Billed To & Service By */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Billed To
              </p>
              <p className="mt-1 font-bold text-slate-900 text-sm">{clientDisplayName}</p>
              <p className="text-[11px] text-slate-600">{clientDisplayPhone}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Specialist / Staff
              </p>
              <p className="mt-1 font-semibold text-slate-900">{staffDisplayName}</p>
              <p className="text-[11px] text-slate-500">Hair & Beauty Specialist</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">Duration</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="font-semibold text-slate-900">{serviceDisplayName}</p>
                    {appointment.notes && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{appointment.notes}</p>
                    )}
                  </td>
                  <td className="py-3 text-center text-slate-600">{appointment.durationMinutes ?? 45} mins</td>
                  <td className="py-3 text-right font-semibold text-slate-900">
                    {formatPrice(appointment.price ?? 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <div className="w-60 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatPrice(appointment.price ?? 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax / VAT (0%):</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-primary">{formatPrice(appointment.price ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-[11px] text-slate-500">
            Thank you for trusting Sribees Salon & Spa! We look forward to serving you again.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
          >
            <Printer className="size-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AppointmentInvoiceModal;

