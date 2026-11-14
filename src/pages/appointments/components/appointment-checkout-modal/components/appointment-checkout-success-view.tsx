import {
  CheckCircle2,
  Check,
  Download,
  Printer,
  MessageCircle,
  Copy,
  ExternalLink,
  Phone,
  CalendarPlus,
} from "lucide-react";
import { Button } from "../../../../../components/button";
import { Input } from "../../../../../components/input";
import type { InvoiceDetailResponse } from "../../../../../services/checkout.service";
import type { WhatsAppStatusMsg } from "../../../../../interface/appointment-checkout.types";
import { checkoutService } from "../../../../../services/checkout.service";
import { formatPrice } from "../../../../../helpers/price.helper";

interface AppointmentCheckoutSuccessViewProps {
  completedInvoice: InvoiceDetailResponse;
  waPhone: string;
  setWaPhone: (phone: string) => void;
  cleanRecipientPhone: () => string;
  copiedMessage: boolean;
  isSendingWa: boolean;
  waStatusMsg: WhatsAppStatusMsg | null;
  onCopyReceiptText: () => void;
  onOpenWhatsAppWeb: () => void;
  onOpenWhatsAppApp: () => void;
  onSendWhatsAppApi: () => void;
  onBookNext: () => void;
}

export function AppointmentCheckoutSuccessView({
  completedInvoice,
  waPhone,
  setWaPhone,
  cleanRecipientPhone,
  copiedMessage,
  isSendingWa,
  waStatusMsg,
  onCopyReceiptText,
  onOpenWhatsAppWeb,
  onOpenWhatsAppApp,
  onSendWhatsAppApi,
  onBookNext,
}: AppointmentCheckoutSuccessViewProps) {
  return (
    <div className="flex flex-col gap-6 py-2 text-slate-800">
      {/* Celebratory Success Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Checkout Completed Successfully!</h3>
              <p className="text-xs text-slate-500">
                Invoice #{completedInvoice.invoice_number} has been generated & inventory updated.
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                completedInvoice.payment_status === "Paid"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : completedInvoice.payment_status === "Partial"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-rose-100 text-rose-800 border-rose-300"
              }`}
            >
              <Check className="size-3.5" />
              <span>{completedInvoice.payment_status.toUpperCase()}</span>
            </span>
            <p className="mt-1 font-mono text-sm font-bold text-primary">
              {formatPrice(completedInvoice.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Download PDF */}
        <Button
          type="button"
          onClick={() =>
            checkoutService.downloadInvoicePdf(completedInvoice.id, completedInvoice.invoice_number)
          }
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
        >
          <Download className="size-4 text-primary" />
          <span>Download PDF Invoice</span>
        </Button>

        {/* Print Invoice */}
        <Button
          type="button"
          onClick={() => {
            const pdfUrl = checkoutService.getInvoicePdfViewUrl(completedInvoice.id);
            window.open(pdfUrl, "_blank");
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
        >
          <Printer className="size-4 text-slate-600" />
          <span>Print Invoice Receipt</span>
        </Button>
      </div>

      {/* WhatsApp Web Sharing Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4.5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <MessageCircle className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Share Receipt on WhatsApp Web</h4>
              <p className="text-[11px] text-slate-500">
                Opens WhatsApp Web with pre-formatted receipt message and PDF link.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onCopyReceiptText}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 rounded-md px-2 py-1 transition cursor-pointer"
            title="Copy receipt text to clipboard"
          >
            {copiedMessage ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
            <span>{copiedMessage ? "Copied!" : "Copy Text"}</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Input
            type="text"
            value={waPhone}
            onChange={(e) => setWaPhone(e.target.value)}
            placeholder="+94 77 123 4567"
            leftElement={<Phone className="size-3.5 text-slate-400" />}
            className="border-slate-200 bg-white py-2 font-mono font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            wrapperClassName="flex-1 w-full"
          />

          {/* Primary: Open WhatsApp Web */}
          <Button
            type="button"
            onClick={onOpenWhatsAppWeb}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <MessageCircle className="size-4" />
            <span>Open WhatsApp Web</span>
          </Button>

          {/* Secondary: Open WhatsApp App (wa.me) */}
          <Button
            type="button"
            onClick={onOpenWhatsAppApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
            title="Open in WhatsApp Desktop or Mobile App"
          >
            <ExternalLink className="size-3.5" />
            <span>wa.me</span>
          </Button>
        </div>

        {/* Optional Cloud API trigger */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Customer phone: {cleanRecipientPhone() ? `+${cleanRecipientPhone()}` : "Not provided"}</span>
          <Button
            type="button"
            onClick={onSendWhatsAppApi}
            disabled={isSendingWa}
            className="text-slate-500 hover:text-emerald-700 underline cursor-pointer disabled:opacity-40"
          >
            {isSendingWa ? "Sending via API..." : "Send via Cloud API (Background)"}
          </Button>
        </div>

        {waStatusMsg && (
          <div
            className={`rounded-lg p-2.5 text-xs font-medium ${
              waStatusMsg.type === "success"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {waStatusMsg.text}
          </div>
        )}
      </div>

      {/* Next Appointment Booking Call-out */}
      <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50/50 to-white p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarPlus className="size-4 text-primary" />
            <h4 className="text-xs font-bold text-slate-900">Book Next Follow-up Appointment</h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pre-fill this customer, specialist, and regular services for their next salon visit.
          </p>
        </div>

        <Button
          type="button"
          onClick={onBookNext}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          <CalendarPlus className="size-3.5" />
          <span>Book Next Appointment</span>
        </Button>
      </div>
    </div>
  );
}
