import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Printer,
  Download,
  Phone,
  Check,
  MessageCircle,
  Copy,
  ExternalLink,
  Plus,
  Eye,
} from "lucide-react";
import Modal from "../../../components/modal";
import { Input } from "../../../components/input";
import InvoiceRenderer from "../../../components/invoice-template";
import { getStoredLayoutSettings } from "../../../helpers/layout-settings.helper";
import { formatPrice } from "../../../helpers/price.helper";
import {
  checkoutService,
  type InvoiceDetailResponse,
  type CheckoutPaymentPayload,
} from "../../../services/checkout.service";
import { ROUTES } from "../../../routes/sidebar.routes";

export interface CheckoutSuccessViewProps {
  completedInvoice: InvoiceDetailResponse;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  waPhone: string;
  setWaPhone: (phone: string) => void;
  copiedMessage: boolean;
  waNotice: string | null;
  handleOpenWhatsAppWeb: () => void;
  handleCopyReceiptText: () => void;
  handleStartNewSale: () => void;
  clientName: string;
  clientPhone: string;
  payments: CheckoutPaymentPayload[];
}

export function CheckoutSuccessView({
  completedInvoice,
  isReceiptModalOpen,
  setIsReceiptModalOpen,
  waPhone,
  setWaPhone,
  copiedMessage,
  waNotice,
  handleOpenWhatsAppWeb,
  handleCopyReceiptText,
  handleStartNewSale,
  clientName,
  clientPhone,
  payments,
}: CheckoutSuccessViewProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Celebratory Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="size-8" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">Payment Processed Successfully!</h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 font-bold border border-emerald-200">
                  {completedInvoice.payment_status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Invoice <span className="font-mono font-bold text-slate-800">#{completedInvoice.invoice_number}</span> has been created and retail stock updated.
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">Total Amount</span>
            <span className="text-2xl font-black text-primary font-mono">{formatPrice(completedInvoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setIsReceiptModalOpen(true)}
          className="flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 p-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
        >
          <Eye className="size-5 text-amber-300" />
          <span>View & Print Receipt</span>
        </button>

        <button
          type="button"
          onClick={() => checkoutService.downloadInvoicePdf(completedInvoice.id, completedInvoice.invoice_number)}
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
        >
          <Download className="size-5 text-primary" />
          <span>Download PDF Invoice</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsReceiptModalOpen(true);
            setTimeout(() => window.print(), 350);
          }}
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
        >
          <Printer className="size-5 text-slate-600" />
          <span>Print Receipt Slip</span>
        </button>
      </div>

      {/* Modal to Preview & Print Receipt in Customer's Selected Layout */}
      {isReceiptModalOpen && completedInvoice && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Receipt / Invoice Slip"
          description={`Official receipt for invoice #${completedInvoice.invoice_number}`}
          size="lg"
        >
          <div className="flex flex-col gap-4 text-xs text-slate-800">
            <div className="max-h-[65vh] overflow-y-auto p-1 rounded-xl bg-slate-100/30">
              <InvoiceRenderer
                invoice={{
                  invoiceNumber: completedInvoice.invoice_number,
                  date: completedInvoice.created_at
                    ? new Date(completedInvoice.created_at).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                  time: completedInvoice.created_at
                    ? new Date(completedInvoice.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "12:00 PM",
                  clientName:
                    completedInvoice.customer?.name || clientName || "Valued Customer",
                  clientPhone: completedInvoice.customer?.phone || clientPhone || "",
                  staffName: completedInvoice.appointment?.staff_name || "Specialist",
                  items:
                    completedInvoice.items && completedInvoice.items.length > 0
                      ? completedInvoice.items.map((it, idx) => ({
                          id: it.id || String(idx),
                          name: it.description || "Salon Item",
                          quantity: it.quantity || 1,
                          unitPrice: it.unit_price,
                          totalPrice: it.line_total,
                        }))
                      : [
                          {
                            name: "Salon Services / Retail Sale",
                            quantity: 1,
                            unitPrice: completedInvoice.total,
                            totalPrice: completedInvoice.total,
                          },
                        ],
                  subtotal: completedInvoice.subtotal,
                  discount: completedInvoice.discount,
                  tax: completedInvoice.tax,
                  total: completedInvoice.total,
                  paidAmount: completedInvoice.paid,
                  paymentStatus: completedInvoice.payment_status.toUpperCase(),
                  paymentMethod: payments[0]?.method || "Cash",
                }}
                layoutSettings={getStoredLayoutSettings()}
                containerId="printable-invoice"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-500">
                Layout styled according to <strong>Layout Settings</strong>.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* WhatsApp Web Sharing Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Share Receipt via WhatsApp Web</h4>
              <p className="text-xs text-slate-500">Opens WhatsApp Web with the client's pre-filled receipt link.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyReceiptText}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs transition cursor-pointer"
          >
            {copiedMessage ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            <span>{copiedMessage ? "Copied!" : "Copy Receipt Text"}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            type="text"
            value={waPhone}
            onChange={(e) => setWaPhone(e.target.value)}
            placeholder="+94 77 123 4567"
            leftElement={<Phone className="size-4 text-slate-400" />}
            className="rounded-xl border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            wrapperClassName="flex-1 w-full"
          />

          <button
            type="button"
            onClick={handleOpenWhatsAppWeb}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
          >
            <ExternalLink className="size-4" />
            <span>Open in WhatsApp Web</span>
          </button>
        </div>

        {waNotice && (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 p-2.5 rounded-lg">
            {waNotice}
          </p>
        )}
      </div>

      {/* Navigation Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate(ROUTES.APPOINTMENTS)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Back to Appointments
        </button>

        <button
          type="button"
          onClick={handleStartNewSale}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Start New POS Sale</span>
        </button>
      </div>
    </div>
  );
}

export default CheckoutSuccessView;
