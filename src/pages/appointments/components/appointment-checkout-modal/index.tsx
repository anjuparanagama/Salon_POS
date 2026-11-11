import { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  ShoppingBag,
  Scissors,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Download,
  CalendarPlus,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Check,
  MessageCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import Modal from "../../../../components/modal";
import type { Appointment, AppointmentFormData } from "../../../../interface/appointment.types";
import type { Product } from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";
import { servicesService } from "../../../../services/services.service";
import { productsService } from "../../../../services/products.service";
import {
  checkoutService,
  type InvoiceDetailResponse,
  type CheckoutPaymentPayload,
} from "../../../../services/checkout.service";

export type AppointmentCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCheckoutSuccess?: (invoice: InvoiceDetailResponse) => void;
  onBookNextAppointment?: (prefill: Partial<AppointmentFormData>) => void;
};

interface SelectedServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}

interface SelectedProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  quantity: number;
}

export function AppointmentCheckoutModal({
  isOpen,
  onClose,
  appointment,
  onCheckoutSuccess,
  onBookNextAppointment,
}: AppointmentCheckoutModalProps) {
  // State for Catalog
  const [catalogServices, setCatalogServices] = useState<Array<{ id: string; name: string; price: number; duration: number; isActive: boolean }>>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  // Checkout Form State
  const [includeApptServices, setIncludeApptServices] = useState(true);
  const [additionalServices, setAdditionalServices] = useState<SelectedServiceItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductItem[]>([]);

  // Selection inputs
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Customer details (for walk-in or editing)
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Adjustments & Payments
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [payments, setPayments] = useState<CheckoutPaymentPayload[]>([
    { method: "cash", amount: 0, reference: "" },
  ]);

  // Submission & Post-Checkout State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<InvoiceDetailResponse | null>(null);

  // WhatsApp Web & Sharing State
  const [waPhone, setWaPhone] = useState("");
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waStatusMsg, setWaStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Load active catalog services and products when modal opens
  useEffect(() => {
    if (!isOpen) {
      setCompletedInvoice(null);
      setErrorMsg(null);
      setWaStatusMsg(null);
      setCopiedMessage(false);
      return;
    }

    if (appointment) {
      setClientName(appointment.clientName || "");
      setClientPhone(appointment.clientPhone || "");
      const cleanPhone = (appointment.clientPhone || "").replace(/[^\d+]/g, "");
      setWaPhone(cleanPhone.startsWith("0") ? `+94${cleanPhone.slice(1)}` : cleanPhone || "+94");
    } else {
      setClientName("");
      setClientPhone("");
      setWaPhone("+94");
    }

    setIncludeApptServices(true);
    setAdditionalServices([]);
    setSelectedProducts([]);
    setDiscountAmount(0);

    const loadCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const [svcs, prods] = await Promise.all([
          servicesService.getServicesList(),
          productsService.getProducts({ pageSize: 100 }),
        ]);
        setCatalogServices(svcs.filter((s) => s.isActive));
        setCatalogProducts(prods.items.filter((p) => p.status === "active" && p.stock > 0));
      } catch (err) {
        console.error("Failed to load catalog for checkout:", err);
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    loadCatalog();
  }, [isOpen, appointment]);

  // Existing appointment services
  const appointmentServices = useMemo(() => {
    if (!appointment) return [];
    if (appointment.services && appointment.services.length > 0) {
      return appointment.services.map((s) => ({
        id: s.id || appointment.serviceId || "",
        name: s.name,
        price: s.price || 0,
        duration: s.durationMinutes || 30,
        quantity: 1,
      }));
    }
    return [
      {
        id: appointment.serviceId || "",
        name: appointment.serviceName || "Salon Service",
        price: appointment.price || 0,
        duration: appointment.durationMinutes || 45,
        quantity: 1,
      },
    ];
  }, [appointment]);

  // Add Additional Service handler
  const handleAddService = () => {
    if (!selectedServiceId) return;
    const found = catalogServices.find((s) => s.id === selectedServiceId);
    if (!found) return;

    setAdditionalServices((prev) => {
      const idx = prev.findIndex((item) => item.id === found.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: found.id,
          name: found.name,
          price: found.price,
          duration: found.duration,
          quantity: 1,
        },
      ];
    });
    setSelectedServiceId("");
  };

  // Add Retail Product handler
  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const found = catalogProducts.find((p) => p.id === selectedProductId);
    if (!found) return;

    setSelectedProducts((prev) => {
      const idx = prev.findIndex((item) => item.id === found.id);
      if (idx >= 0) {
        if (prev[idx].quantity >= found.stock) {
          setErrorMsg(`Cannot add more. Available stock for ${found.name} is ${found.stock}.`);
          return prev;
        }
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: found.id,
          name: found.name,
          sku: found.sku,
          price: found.sellingPrice,
          stock: found.stock,
          quantity: 1,
        },
      ];
    });
    setSelectedProductId("");
    setErrorMsg(null);
  };

  // Financial Calculations
  const subtotal = useMemo(() => {
    let sum = 0;
    if (includeApptServices) {
      appointmentServices.forEach((s) => {
        sum += s.price * s.quantity;
      });
    }
    additionalServices.forEach((s) => {
      sum += s.price * s.quantity;
    });
    selectedProducts.forEach((p) => {
      sum += p.price * p.quantity;
    });
    return sum;
  }, [includeApptServices, appointmentServices, additionalServices, selectedProducts]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - Number(discountAmount || 0));
  }, [subtotal, discountAmount]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const balanceDue = useMemo(() => {
    return Math.max(0, grandTotal - totalPaid);
  }, [grandTotal, totalPaid]);

  const changeDue = useMemo(() => {
    return totalPaid > grandTotal ? totalPaid - grandTotal : 0;
  }, [grandTotal, totalPaid]);

  // Quick Pay Full helper
  const handlePayFull = (method: "cash" | "card" | "bank" = "cash") => {
    setPayments([{ method, amount: grandTotal, reference: "" }]);
  };

  // Submit Checkout
  const handleCompleteCheckout = async () => {
    setErrorMsg(null);

    if (subtotal <= 0) {
      setErrorMsg("Please include at least one service or product in the invoice.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        appointment_id: appointment ? appointment.id : undefined,
        customer_name: clientName.trim() || undefined,
        customer_phone: clientPhone.trim() || undefined,
        include_appointment_services: includeApptServices,
        additional_services: additionalServices.map((s) => ({
          service_id: s.id,
          quantity: s.quantity,
          name: s.name,
          price: s.price,
        })),
        products: selectedProducts.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
          name: p.name,
          price: p.price,
          sku: p.sku,
        })),
        discount: Number(discountAmount || 0),
        tax: 0,
        payments: payments.filter((p) => Number(p.amount) > 0),
      };

      let result: InvoiceDetailResponse;
      if (appointment) {
        result = await checkoutService.checkoutAppointment(appointment.id, payload);
      } else {
        result = await checkoutService.directPosCheckout(payload);
      }

      setCompletedInvoice(result);
      if (onCheckoutSuccess) {
        onCheckoutSuccess(result);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to complete checkout.";
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build formatted receipt message for WhatsApp
  const buildWhatsAppMessage = () => {
    if (!completedInvoice) return "";
    const itemsText = completedInvoice.items
      .map(
        (item) =>
          `• ${item.description} (x${item.quantity}) - ${formatPrice(item.line_total)}`
      )
      .join("\n");

    const pdfReceiptLink = checkoutService.getPublicReceiptPdfUrl(completedInvoice.id);

    return `✨ *Sribees Salon & Spa - Official Receipt* ✨

Dear *${completedInvoice.customer?.name || clientName || "Valued Customer"}*,
Thank you for visiting us! Here is your bill summary:

🧾 *Invoice No:* ${completedInvoice.invoice_number}
📅 *Date:* ${completedInvoice.created_at ? new Date(completedInvoice.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
${completedInvoice.appointment?.staff_name ? `💇 *Specialist:* ${completedInvoice.appointment.staff_name}\n` : ""}
*Billed Items:*
${itemsText}

💵 *Subtotal:* ${formatPrice(completedInvoice.subtotal)}
${completedInvoice.discount > 0 ? `🏷️ *Discount:* -${formatPrice(completedInvoice.discount)}\n` : ""}💰 *Grand Total:* ${formatPrice(completedInvoice.total)}
💳 *Payment Status:* ${completedInvoice.payment_status.toUpperCase()} (${formatPrice(completedInvoice.paid)} paid)

📄 *View / Download PDF Receipt:*
${pdfReceiptLink}

Thank you for choosing Sribees Salon & Spa! 💖
Hotline: +94 11 234 5678`;
  };

  const cleanRecipientPhone = () => {
    const raw = waPhone.replace(/[^\d]/g, "");
    if (!raw) return "";
    if (raw.startsWith("0")) return `94${raw.slice(1)}`;
    if (raw.startsWith("94")) return raw;
    return `94${raw}`;
  };

  // 1. Open directly in WhatsApp Web
  const handleOpenWhatsAppWeb = () => {
    const phone = cleanRecipientPhone();
    if (!phone) {
      setWaStatusMsg({ type: "error", text: "Please enter a valid phone number." });
      return;
    }
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
    window.open(url, "_blank");
    setWaStatusMsg({
      type: "success",
      text: `Opening WhatsApp Web for +${phone}... Press Enter in WhatsApp Web to send!`,
    });
  };

  // 2. Open in WhatsApp App (Desktop / Mobile)
  const handleOpenWhatsAppApp = () => {
    const phone = cleanRecipientPhone();
    if (!phone) {
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

  // 3. Copy message text
  const handleCopyReceiptText = () => {
    const message = buildWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Optional Cloud API background sender
  const handleSendWhatsAppApi = async () => {
    if (!completedInvoice) return;
    if (!waPhone.trim()) {
      setWaStatusMsg({ type: "error", text: "Please enter a valid WhatsApp phone number." });
      return;
    }

    setIsSendingWa(true);
    setWaStatusMsg(null);
    try {
      const res = await checkoutService.sendInvoiceWhatsApp(
        completedInvoice.id,
        waPhone.trim(),
        true
      );
      if (res.simulated) {
        setWaStatusMsg({
          type: "success",
          text: `[Notice: Meta credentials not set] Simulated send to ${res.recipient} was logged successfully!`,
        });
      } else {
        setWaStatusMsg({
          type: "success",
          text: `Invoice PDF successfully sent to ${res.recipient} via WhatsApp!`,
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to send WhatsApp message.";
      setWaStatusMsg({ type: "error", text: msg });
    } finally {
      setIsSendingWa(false);
    }
  };

  // Next Appointment Booking Flow
  const handleBookNext = () => {
    if (!completedInvoice) return;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 28);
    const dateStr = nextDate.toISOString().split("T")[0];

    const serviceItems = completedInvoice.items
      .filter((i) => i.item_type === "service")
      .map((i) => ({
        id: i.item_id || undefined,
        name: i.description,
        price: i.unit_price,
        durationMinutes: 30,
      }));

    const prefill: Partial<AppointmentFormData> = {
      clientName: completedInvoice.customer?.name || clientName,
      clientPhone: completedInvoice.customer?.phone || clientPhone,
      staffName: completedInvoice.appointment?.staff_name || appointment?.staffName || "",
      serviceName: serviceItems.map((s) => s.name).join(", "),
      services: serviceItems,
      date: dateStr,
      time: appointment?.time || "10:00 AM",
    };

    onClose();
    if (onBookNextAppointment) {
      onBookNextAppointment(prefill);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={completedInvoice ? "Invoice & Checkout Receipt" : "Unified POS Checkout"}
      description={
        completedInvoice
          ? `Invoice #${completedInvoice.invoice_number} successfully recorded.`
          : appointment
          ? `Completing Appointment ${formatAppointmentId(appointment)} & billing client`
          : "Direct walk-in POS sale without appointment"
      }
      size="2xl"
      className="max-w-5xl"
      footer={
        !completedInvoice ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Grand Total
                </span>
                <span className="text-base font-extrabold text-primary font-mono">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Balance Due
                </span>
                <span
                  className={`text-xs font-bold font-mono ${
                    balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {formatPrice(balanceDue)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteCheckout}
                disabled={isSubmitting || subtotal <= 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Complete Checkout & Bill</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )
      }
    >
      {/* ========================================================================= */}
      {/* 1. SUCCESS VIEW (POST-CHECKOUT RECEIPT & ACTIONS)                          */}
      {/* ========================================================================= */}
      {completedInvoice ? (
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
            <button
              type="button"
              onClick={() => checkoutService.downloadInvoicePdf(completedInvoice.id, completedInvoice.invoice_number)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
            >
              <Download className="size-4 text-primary" />
              <span>Download PDF Invoice</span>
            </button>

            {/* Print Invoice */}
            <button
              type="button"
              onClick={() => {
                const pdfUrl = checkoutService.getInvoicePdfViewUrl(completedInvoice.id);
                window.open(pdfUrl, "_blank");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
            >
              <Printer className="size-4 text-slate-600" />
              <span>Print Invoice Receipt</span>
            </button>
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
                  <p className="text-[11px] text-slate-500">Opens WhatsApp Web with pre-formatted receipt message and PDF link.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyReceiptText}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 rounded-md px-2 py-1 transition cursor-pointer"
                title="Copy receipt text to clipboard"
              >
                {copiedMessage ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                <span>{copiedMessage ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="relative flex-1 w-full">
                <Phone className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-mono font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Primary: Open WhatsApp Web */}
              <button
                type="button"
                onClick={handleOpenWhatsAppWeb}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>Open WhatsApp Web</span>
              </button>

              {/* Secondary: Open WhatsApp App (wa.me) */}
              <button
                type="button"
                onClick={handleOpenWhatsAppApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                title="Open in WhatsApp Desktop or Mobile App"
              >
                <ExternalLink className="size-3.5" />
                <span>wa.me</span>
              </button>
            </div>

            {/* Optional Cloud API trigger */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Customer phone: {cleanRecipientPhone() ? `+${cleanRecipientPhone()}` : "Not provided"}</span>
              <button
                type="button"
                onClick={handleSendWhatsAppApi}
                disabled={isSendingWa}
                className="text-slate-500 hover:text-emerald-700 underline cursor-pointer disabled:opacity-40"
              >
                {isSendingWa ? "Sending via API..." : "Send via Cloud API (Background)"}
              </button>
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

            <button
              type="button"
              onClick={handleBookNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
            >
              <CalendarPlus className="size-3.5" />
              <span>Book Next Appointment</span>
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. CHECKOUT INTERFACE (TWO COLUMN LAYOUT)                                  */
        /* ========================================================================= */
        <div className="flex flex-col gap-4 text-slate-800">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: SERVICES & PRODUCTS (7 cols)                     */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
              {/* Appointment Booked Services */}
              {appointment && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Scissors className="size-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Appointment Services
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeApptServices}
                        onChange={(e) => setIncludeApptServices(e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span>Include in Bill</span>
                    </label>
                  </div>

                  {includeApptServices ? (
                    <div className="divide-y divide-slate-100 mt-2">
                      {appointmentServices.map((svc, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 text-xs">
                          <div>
                            <p className="font-semibold text-slate-900">{svc.name}</p>
                            <p className="text-[11px] text-slate-400">{svc.duration} mins • Qty: {svc.quantity}</p>
                          </div>
                          <span className="font-bold text-slate-900">
                            {formatPrice(svc.price * svc.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-center text-xs text-slate-400 italic">
                      Appointment services excluded from invoice.
                    </p>
                  )}
                </div>
              )}

              {/* Additional Services Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Additional Services
                  </span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    disabled={isLoadingCatalog}
                    className="flex-1 min-w-0 w-full truncate rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="">
                      {isLoadingCatalog ? "Loading salon services..." : "-- Choose additional salon service --"}
                    </option>
                    {catalogServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration} mins) - {formatPrice(s.price)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddService}
                    disabled={!selectedServiceId || isLoadingCatalog}
                    className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Additional services list */}
                {additionalServices.length > 0 && (
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                    {additionalServices.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-1 text-xs">
                        <div className="flex-1 pr-2 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{formatPrice(item.price)} each</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => {
                                setAdditionalServices((prev) =>
                                  prev
                                    .map((s, i) => (i === idx ? { ...s, quantity: Math.max(1, s.quantity - 1) } : s))
                                );
                              }}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setAdditionalServices((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, quantity: s.quantity + 1 } : s))
                                );
                              }}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                            >
                              +
                            </button>
                          </div>
                          <span className="w-16 text-right font-bold text-slate-900 font-mono">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdditionalServices((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                            title="Remove service"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Retail Products Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Retail Products (Inventory)
                  </span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    disabled={isLoadingCatalog}
                    className="flex-1 min-w-0 w-full truncate rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="">
                      {isLoadingCatalog ? "Loading products..." : "-- Choose retail product to sell --"}
                    </option>
                    {catalogProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - {formatPrice(p.sellingPrice)} [Stock: {p.stock}]
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!selectedProductId || isLoadingCatalog}
                    className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Selected products list */}
                {selectedProducts.length > 0 && (
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                    {selectedProducts.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-1 text-xs">
                        <div className="flex-1 pr-2 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            SKU: {item.sku} • {formatPrice(item.price)} each • <span className="text-emerald-600 font-medium">In stock: {item.stock}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProducts((prev) =>
                                  prev
                                    .map((p, i) => (i === idx ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
                                );
                              }}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity >= item.stock) {
                                  setErrorMsg(`Maximum stock available for ${item.name} is ${item.stock}.`);
                                  return;
                                }
                                setSelectedProducts((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, quantity: p.quantity + 1 } : p))
                                );
                              }}
                              className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                            >
                              +
                            </button>
                          </div>
                          <span className="w-16 text-right font-bold text-slate-900 font-mono">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedProducts((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                            title="Remove product"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: CUSTOMER, SUMMARY & PAYMENTS (5 cols)           */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
              {/* Customer Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Customer Info
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <div className="relative">
                    <Phone className="absolute left-3 top-2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value);
                        const clean = e.target.value.replace(/[^\d+]/g, "");
                        setWaPhone(clean.startsWith("0") ? `+94${clean.slice(1)}` : clean);
                      }}
                      placeholder="Customer Phone (+94...)"
                      className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Summary Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Billing Breakdown
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900 font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span>Discount (LKR):</span>
                    <input
                      type="number"
                      min={0}
                      max={subtotal}
                      value={discountAmount === 0 ? "" : discountAmount}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                      placeholder="0.00"
                      className="w-28 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-right font-mono font-semibold text-xs text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-primary text-base font-extrabold font-mono">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payments Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Payments
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePayFull("cash")}
                      className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                    >
                      Cash Full
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePayFull("card")}
                      className="rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold hover:bg-purple-100 transition cursor-pointer"
                    >
                      Card Full
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={payments[0]?.method || "cash"}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPayments((prev) => [
                          { ...(prev[0] || { amount: 0, reference: "" }), method: val },
                        ]);
                      }}
                      className="rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-xs font-semibold text-slate-700 outline-none shrink-0"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="digital">Digital / QR</option>
                    </select>

                    <input
                      type="number"
                      min={0}
                      value={payments[0]?.amount === 0 ? "" : payments[0]?.amount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPayments((prev) => [
                          { ...(prev[0] || { method: "cash", reference: "" }), amount: val },
                        ]);
                      }}
                      placeholder="Amount"
                      className="flex-1 min-w-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-900 outline-none focus:border-primary text-right"
                    />
                  </div>
                </div>

                {/* Payment balances */}
                <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Paid:</span>
                    <span className="font-semibold text-slate-900 font-mono">{formatPrice(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Balance Due:</span>
                    <span className={`font-bold font-mono ${balanceDue > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {formatPrice(balanceDue)}
                    </span>
                  </div>
                  {changeDue > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold bg-amber-50 p-1.5 rounded-md text-xs">
                      <span>Change to Return:</span>
                      <span className="font-mono">{formatPrice(changeDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Checkout Action */}
              <button
                type="button"
                onClick={handleCompleteCheckout}
                disabled={isSubmitting || subtotal <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing Checkout...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4.5" />
                    <span>Complete Checkout & Bill</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default AppointmentCheckoutModal;
