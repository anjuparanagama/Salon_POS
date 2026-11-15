import { useState } from "react";
import { checkoutService, type InvoiceDetailResponse } from "../../services/checkout.service";
import { formatPrice } from "../../helpers/price.helper";
import { getActiveSalonProfile } from "../../helpers/salon-profile.helper";

export function useCheckoutWhatsApp(
  completedInvoice: InvoiceDetailResponse | null,
  clientName: string
) {
  const [waPhone, setWaPhone] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [waNotice, setWaNotice] = useState<string | null>(null);

  const buildWhatsAppMessage = () => {
    if (!completedInvoice) return "";
    const itemsText = completedInvoice.items
      .map((item) => `• ${item.description} (x${item.quantity}) - ${formatPrice(item.line_total)}`)
      .join("\n");

    const salon = getActiveSalonProfile(completedInvoice.salon);
    const pdfReceiptLink = checkoutService.getPublicReceiptPdfUrl(completedInvoice.id);

    return `✨ *${salon.name} - Official Receipt* ✨

Dear *${completedInvoice.customer?.name || clientName || "Valued Customer"}*,
Thank you for visiting us! Here is your bill summary:

🧾 *Invoice No:* ${completedInvoice.invoice_number}
📅 *Date:* ${
      completedInvoice.created_at
        ? new Date(completedInvoice.created_at).toLocaleDateString()
        : new Date().toLocaleDateString()
    }
${completedInvoice.appointment?.staff_name ? `💇 *Specialist:* ${completedInvoice.appointment.staff_name}\n` : ""}*Billed Items:*
${itemsText}

💵 *Subtotal:* ${formatPrice(completedInvoice.subtotal)}
${completedInvoice.discount > 0 ? `🏷️ *Discount:* -${formatPrice(completedInvoice.discount)}\n` : ""}💰 *Grand Total:* ${formatPrice(completedInvoice.total)}
💳 *Payment Status:* ${completedInvoice.payment_status.toUpperCase()} (${formatPrice(
      completedInvoice.paid
    )} paid)

📄 *View / Download PDF Receipt:*
${pdfReceiptLink}

Thank you for choosing ${salon.name}! 💖
${salon.phone ? `Hotline: ${salon.phone}` : ""}`.trim();
  };

  const handleOpenWhatsAppWeb = () => {
    const raw = waPhone.replace(/[^\d]/g, "");
    const clean = raw.startsWith("0") ? `94${raw.slice(1)}` : raw.startsWith("94") ? raw : `94${raw}`;
    if (!clean || clean.length < 9) {
      setWaNotice("Please enter a valid phone number with country code.");
      return;
    }
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://web.whatsapp.com/send?phone=${clean}&text=${encoded}`;
    window.open(url, "_blank");
    setWaNotice(`Opening WhatsApp Web for +${clean}... Click Send in WhatsApp to share!`);
  };

  const handleCopyReceiptText = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage());
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  return {
    waPhone,
    setWaPhone,
    copiedMessage,
    waNotice,
    setWaNotice,
    buildWhatsAppMessage,
    handleOpenWhatsAppWeb,
    handleCopyReceiptText,
  };
}

export default useCheckoutWhatsApp;
