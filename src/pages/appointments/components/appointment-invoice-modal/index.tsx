import { useState, useEffect } from "react";
import {
  Printer,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Download,
} from "lucide-react";
import Modal from "../../../../components/modal";
import type { Appointment } from "../../../../interface/appointment.types";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";
import { formatPrice } from "../../../../helpers/price.helper";
import { getStoredLayoutSettings } from "../../../../helpers/layout-settings.helper";
import InvoiceRenderer, {
  type InvoiceData,
  type SalonInfo,
} from "../../../../components/invoice-template";
import type { LayoutSettingsState } from "../../../settings/types";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import {
  checkoutService,
  type InvoiceDetailResponse,
} from "../../../../services/checkout.service";

export type AppointmentInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
};

interface AppointmentInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
}

function AppointmentInvoiceDialog({
  isOpen,
  onClose,
  appointment,
}: AppointmentInvoiceDialogProps) {
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettingsState>(() =>
    getStoredLayoutSettings()
  );

  // WhatsApp and Sharing state
  const [waPhone, setWaPhone] = useState(appointment.clientPhone || "");
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [waStatusMsg, setWaStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetailResponse | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredLayoutSettings();
      setLayoutSettings(stored);
    };
    window.addEventListener("sribees_layout_settings_updated", handleUpdate);
    return () => window.removeEventListener("sribees_layout_settings_updated", handleUpdate);
  }, []);

  // Fetch complete invoice details if invoiceId exists
  useEffect(() => {
    let isMounted = true;
    if (appointment.invoiceId) {
      checkoutService
        .getInvoiceDetails(appointment.invoiceId)
        .then((data) => {
          if (isMounted) setInvoiceDetails(data);
        })
        .catch(() => {
          // fallback to appointment data
        });
    }
    return () => {
      isMounted = false;
    };
  }, [appointment.invoiceId]);

  const cleanAptNum = formatAppointmentId(appointment).replace(/^#APT-/, "");
  const invoiceNumber =
    invoiceDetails?.invoice_number ||
    appointment.invoiceNumber ||
    `INV-2026-${cleanAptNum}`;

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
    subtotal: invoiceDetails?.subtotal ?? subtotal,
    discount: invoiceDetails?.discount ?? 0,
    tax: invoiceDetails?.tax ?? 0,
    total: invoiceDetails?.total ?? subtotal,
    paidAmount: invoiceDetails?.paid ?? subtotal,
    paymentStatus: invoiceDetails?.payment_status?.toUpperCase() || "PAID",
    paymentMethod: invoiceDetails?.payments?.[0]?.method || "Cash",
  };

  const cleanRecipientPhone = () => {
    const raw = waPhone.replace(/[^\d]/g, "");
    if (!raw) return "";
    if (raw.startsWith("0")) return `94${raw.slice(1)}`;
    if (raw.startsWith("94")) return raw;
    return `94${raw}`;
  };

  const buildWhatsAppMessage = () => {
    const itemsList = invoiceDetails?.items?.length
      ? invoiceDetails.items.map(
          (item) => `• ${item.description} (x${item.quantity}) - ${formatPrice(item.line_total)}`
        )
      : items.map(
          (item) => `• ${item.name} (x${item.quantity}) - ${formatPrice(item.totalPrice)}`
        );

    const itemsText = itemsList.join("\n");
    const grandTotal = invoiceDetails?.total ?? subtotal;
    const client = appointment.clientName || invoiceDetails?.customer?.name || "Valued Customer";

    const pdfReceiptLink = appointment.invoiceId
      ? checkoutService.getPublicReceiptPdfUrl(
          appointment.invoiceId,
          layoutSettings.selectedInvoiceTemplate
        )
      : "";

    return `✨ *${salonInfo.name} - Official Receipt* ✨

Dear *${client}*,
Thank you for visiting us! Here is your bill summary:

🧾 *Invoice No:* ${invoiceNumber}
📅 *Date:* ${invoiceData.date}
${appointment.staffName ? `💇 *Specialist:* ${appointment.staffName}\n` : ""}*Billed Items:*
${itemsText}

💵 *Subtotal:* ${formatPrice(invoiceDetails?.subtotal ?? subtotal)}
${invoiceDetails && invoiceDetails.discount > 0 ? `🏷️ *Discount:* -${formatPrice(invoiceDetails.discount)}\n` : ""}💰 *Grand Total:* ${formatPrice(grandTotal)}
💳 *Payment Status:* ${invoiceData.paymentStatus} (${formatPrice(grandTotal)} paid)
${pdfReceiptLink ? `\n📄 *View / Download PDF Receipt:*\n${pdfReceiptLink}\n` : ""}
Thank you for choosing ${salonInfo.name}! 💖
Hotline: ${salonInfo.phone}`;
  };

  const handleOpenWhatsAppWeb = () => {
    const phone = cleanRecipientPhone();
    if (!phone || phone.length < 9) {
      setWaStatusMsg({ type: "error", text: "Please enter a valid phone number." });
      return;
    }
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
    window.open(url, "_blank");
    setWaStatusMsg({
      type: "success",
      text: `Opening WhatsApp Web for +${phone}... Press Enter in WhatsApp to send!`,
    });
  };

  const handleOpenWhatsAppApp = () => {
    const phone = cleanRecipientPhone();
    if (!phone || phone.length < 9) {
      setWaStatusMsg({ type: "error", text: "Please enter a valid phone number." });
      return;
    }
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank");
    setWaStatusMsg({
      type: "success",
      text: `Opening WhatsApp chat for +${phone}...`,
    });
  };

  const handleCopyReceiptText = async () => {
    try {
      const message = buildWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (appointment.invoiceId) {
      await checkoutService.downloadInvoicePdf(
        appointment.invoiceId,
        invoiceNumber,
        layoutSettings.selectedInvoiceTemplate
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Invoice & Receipt"
      description={`Official receipt for invoice #${invoiceNumber}`}
      size="xl"
    >
      <div className="flex flex-col gap-4 text-xs text-slate-800">
        {/* WhatsApp Sharing Card (Matching Checkout Success View) */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0 shadow-2xs">
                <MessageCircle className="size-4.5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Share Bill via WhatsApp
                </h4>
                <p className="text-[11px] text-slate-500">
                  Send pre-filled bill summary and digital PDF link directly to customer.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCopyReceiptText}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 transition cursor-pointer shadow-2xs hover:border-emerald-300"
              title="Copy formatted receipt text to clipboard"
            >
              {copiedMessage ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{copiedMessage ? "Copied!" : "Copy Bill Text"}</span>
            </Button>
          </div>

          {/* Phone Number Input & WhatsApp Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
            <Input
              type="text"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              placeholder="e.g. 078 141 5147 or +94 78 141 5147"
              leftElement={<Phone className="size-3.5 text-slate-400" />}
              className="border-slate-200 bg-white py-2 font-mono font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs"
              wrapperClassName="flex-1 w-full"
            />

            {/* Primary: Open WhatsApp Web */}
            <Button
              type="button"
              onClick={handleOpenWhatsAppWeb}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer shrink-0"
            >
              <MessageCircle className="size-4" />
              <span>Open WhatsApp Web</span>
            </Button>

            {/* Secondary: Open WhatsApp App (wa.me) */}
            <Button
              type="button"
              onClick={handleOpenWhatsAppApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer shrink-0"
              title="Open in WhatsApp Desktop or Mobile App"
            >
              <ExternalLink className="size-3.5" />
              <span>wa.me</span>
            </Button>
          </div>

          {/* Customer info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>
              Customer: <strong>{appointment.clientName || "Valued Customer"}</strong> (
              {cleanRecipientPhone() ? `+${cleanRecipientPhone()}` : "No number provided"})
            </span>
          </div>

          {waStatusMsg && (
            <div
              className={`rounded-lg p-2 text-xs font-medium ${
                waStatusMsg.type === "success"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-rose-100 text-rose-800 border border-rose-200"
              }`}
            >
              {waStatusMsg.text}
            </div>
          )}
        </div>

        {/* Printable Invoice Container using configured layout from Layout Settings */}
        <div className="max-h-[55vh] overflow-y-auto p-1 rounded-xl bg-slate-100/30 border border-slate-100">
          <InvoiceRenderer
            invoice={invoiceData}
            salon={salonInfo}
            layoutSettings={layoutSettings}
            containerId="printable-invoice"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-3 gap-2">
          <span className="text-[11px] text-slate-500">
            Bill layout style is configured in <strong>Layout Settings</strong>.
          </span>

          <div className="flex items-center gap-2">
            {appointment.invoiceId && (
              <Button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Download className="size-4 text-primary" />
                <span>Download PDF</span>
              </Button>
            )}

            <Button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </Button>

            <Button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <Printer className="size-4" />
              <span>Print Invoice</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function AppointmentInvoiceModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentInvoiceModalProps) {
  if (!isOpen || !appointment) return null;

  return (
    <AppointmentInvoiceDialog
      key={appointment.id}
      isOpen={isOpen}
      onClose={onClose}
      appointment={appointment}
    />
  );
}

export default AppointmentInvoiceModal;
