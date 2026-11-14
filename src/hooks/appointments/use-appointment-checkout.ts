import { useState, useEffect, useMemo } from "react";
import type { Appointment, AppointmentFormData } from "../../interface/appointment.types";
import type { Product } from "../../interface/product.types";
import type {
  SelectedServiceItem,
  SelectedProductItem,
  WhatsAppStatusMsg,
} from "../../interface/appointment-checkout.types";
import { servicesService } from "../../services/services.service";
import { productsService } from "../../services/products.service";
import {
  checkoutService,
  type InvoiceDetailResponse,
  type CheckoutPaymentPayload,
} from "../../services/checkout.service";
import { formatPrice } from "../../helpers/price.helper";

export interface UseAppointmentCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCheckoutSuccess?: (invoice: InvoiceDetailResponse) => void;
  onBookNextAppointment?: (prefill: Partial<AppointmentFormData>) => void;
}

export interface CatalogServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export function useAppointmentCheckout({
  isOpen,
  onClose,
  appointment,
  onCheckoutSuccess,
  onBookNextAppointment,
}: UseAppointmentCheckoutProps) {
  // State for Catalog
  const [catalogServices, setCatalogServices] = useState<CatalogServiceItem[]>([]);
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
  const [waStatusMsg, setWaStatusMsg] = useState<WhatsAppStatusMsg | null>(null);
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
  const appointmentServices = useMemo<SelectedServiceItem[]>(() => {
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

  return {
    catalogServices,
    catalogProducts,
    isLoadingCatalog,
    includeApptServices,
    setIncludeApptServices,
    additionalServices,
    setAdditionalServices,
    selectedProducts,
    setSelectedProducts,
    selectedServiceId,
    setSelectedServiceId,
    selectedProductId,
    setSelectedProductId,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    waPhone,
    setWaPhone,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    completedInvoice,
    setCompletedInvoice,
    isSendingWa,
    waStatusMsg,
    copiedMessage,
    appointmentServices,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handleAddService,
    handleAddProduct,
    handlePayFull,
    handleCompleteCheckout,
    handleOpenWhatsAppWeb,
    handleOpenWhatsAppApp,
    handleCopyReceiptText,
    handleSendWhatsAppApi,
    cleanRecipientPhone,
    handleBookNext,
  };
}

export type UseAppointmentCheckoutReturn = ReturnType<typeof useAppointmentCheckout>;
