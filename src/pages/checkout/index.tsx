import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import {
  Sparkles,
  ShoppingBag,
  Scissors,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Download,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Check,
  MessageCircle,
  Copy,
  ExternalLink,
  ArrowLeft,
  Search,
  RotateCcw,
  Receipt,
} from "lucide-react";
import Header from "../../components/header";
import type { Appointment } from "../../interface/appointment.types";
import type { Product } from "../../interface/product.types";
import { formatPrice } from "../../helpers/price.helper";
import { formatAppointmentId } from "../../helpers/format-id.helper";
import { servicesService } from "../../services/services.service";
import { productsService } from "../../services/products.service";
import { appointmentsService } from "../../services/appointments.service";
import {
  checkoutService,
  type InvoiceDetailResponse,
  type CheckoutPaymentPayload,
} from "../../services/checkout.service";
import { ROUTES } from "../../routes/sidebar.routes";

interface CartServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
  isAppointmentService?: boolean;
}

interface CartProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  quantity: number;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const targetAppointmentId = searchParams.get("appointmentId") || searchParams.get("id");

  // Catalog State
  const [catalogServices, setCatalogServices] = useState<
    Array<{ id: string; name: string; price: number; duration: number; isActive: boolean; categoryId?: string }>
  >([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Active Appointment (if checking out an appointment)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    (location.state as any)?.appointment || null
  );

  // Search & Filter State
  const [catalogTab, setCatalogTab] = useState<"services" | "products">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Cart State
  const [includeApptServices, setIncludeApptServices] = useState(true);
  const [additionalServices, setAdditionalServices] = useState<CartServiceItem[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);

  // Customer Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Financials & Payment
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [payments, setPayments] = useState<CheckoutPaymentPayload[]>([
    { method: "cash", amount: 0, reference: "" },
  ]);

  // Submission & Post-Checkout State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<InvoiceDetailResponse | null>(null);

  // WhatsApp Web State
  const [waPhone, setWaPhone] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [waNotice, setWaNotice] = useState<string | null>(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setIsLoadingData(true);
      try {
        const [svcs, prods, aptsRes] = await Promise.all([
          servicesService.getServicesList(),
          productsService.getProducts({ pageSize: 200 }),
          appointmentsService.getAppointments({ pageSize: 50 }),
        ]);

        if (!isMounted) return;

        setCatalogServices(svcs.filter((s) => s.isActive));
        setCatalogProducts(prods.items.filter((p) => p.status === "active"));
        setRecentAppointments(aptsRes.items || []);

        // If an appointment ID was passed in query parameters, find and bind it
        if (targetAppointmentId) {
          const found = aptsRes.items?.find((a) => a.id === targetAppointmentId);
          if (found) {
            bindAppointment(found);
          } else {
            try {
              const directApt = await appointmentsService.getAppointmentById(targetAppointmentId);
              if (directApt && isMounted) {
                bindAppointment(directApt);
              }
            } catch (err) {
              console.warn("Could not load appointment by ID:", err);
            }
          }
        } else if ((location.state as any)?.appointment) {
          bindAppointment((location.state as any).appointment);
        }
      } catch (err) {
        console.error("Failed loading POS catalog:", err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [targetAppointmentId]);

  // When POS Terminal button in top header is clicked, reset to fresh walk-in sale
  useEffect(() => {
    if ((location.state as any)?.fresh) {
      handleStartNewSale();
    }
  }, [location.state]);

  // Helper to bind appointment data to checkout
  const bindAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setClientName(apt.clientName || "");
    setClientPhone(apt.clientPhone || "");
    const cleanPhone = (apt.clientPhone || "").replace(/[^\d+]/g, "");
    setWaPhone(cleanPhone.startsWith("0") ? `+94${cleanPhone.slice(1)}` : cleanPhone || "+94");
    setIncludeApptServices(true);
    setErrorMsg(null);
  };

  // Switch / reset to walk-in sale
  const handleClearAppointment = () => {
    setSelectedAppointment(null);
    setClientName("");
    setClientPhone("");
    setWaPhone("+94");
    navigate(ROUTES.CHECKOUT, { replace: true, state: {} });
  };

  // Appointment booked services
  const appointmentServices: CartServiceItem[] = useMemo(() => {
    if (!selectedAppointment) return [];
    if (selectedAppointment.services && selectedAppointment.services.length > 0) {
      return selectedAppointment.services.map((s) => ({
        id: s.id || `apt-svc-${s.name}`,
        name: s.name,
        price: Number(s.price || 0),
        duration: Number(s.durationMinutes || 30),
        quantity: Number((s as any).quantity || 1),
        isAppointmentService: true,
      }));
    }
    return [
      {
        id: `apt-svc-${selectedAppointment.id}`,
        name: selectedAppointment.serviceName || "Salon Service",
        price: Number(selectedAppointment.price || 0),
        duration: 30,
        quantity: 1,
        isAppointmentService: true,
      },
    ];
  }, [selectedAppointment]);

  // Add a Service to cart
  const handleAddServiceToCart = (svc: { id: string; name: string; price: number; duration: number }) => {
    setAdditionalServices((prev) => {
      const existing = prev.find((s) => s.id === svc.id);
      if (existing) {
        return prev.map((s) => (s.id === svc.id ? { ...s, quantity: s.quantity + 1 } : s));
      }
      return [
        ...prev,
        {
          id: svc.id,
          name: svc.name,
          price: svc.price,
          duration: svc.duration,
          quantity: 1,
        },
      ];
    });
  };

  // Add a Product to cart
  const handleAddProductToCart = (prod: Product) => {
    if (prod.stock <= 0) {
      setErrorMsg(`Product "${prod.name}" is out of stock.`);
      return;
    }

    setCartProducts((prev) => {
      const existing = prev.find((p) => p.id === prod.id);
      if (existing) {
        if (existing.quantity >= prod.stock) {
          setErrorMsg(`Only ${prod.stock} units available for ${prod.name}.`);
          return prev;
        }
        return prev.map((p) => (p.id === prod.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          price: prod.sellingPrice,
          stock: prod.stock,
          quantity: 1,
        },
      ];
    });
  };

  // Monetary Calculations
  const subtotal = useMemo(() => {
    let sum = 0;
    if (includeApptServices && selectedAppointment) {
      appointmentServices.forEach((s) => {
        sum += s.price * s.quantity;
      });
    }
    additionalServices.forEach((s) => {
      sum += s.price * s.quantity;
    });
    cartProducts.forEach((p) => {
      sum += p.price * p.quantity;
    });
    return sum;
  }, [includeApptServices, selectedAppointment, appointmentServices, additionalServices, cartProducts]);

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
        appointment_id: selectedAppointment ? selectedAppointment.id : undefined,
        customer_name: clientName.trim() || undefined,
        customer_phone: clientPhone.trim() || undefined,
        include_appointment_services: includeApptServices,
        additional_services: additionalServices.map((s) => ({
          service_id: s.id,
          quantity: s.quantity,
          name: s.name,
          price: s.price,
        })),
        products: cartProducts.map((p) => ({
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
      if (selectedAppointment) {
        result = await checkoutService.checkoutAppointment(selectedAppointment.id, payload);
      } else {
        result = await checkoutService.directPosCheckout(payload);
      }

      setCompletedInvoice(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to complete checkout.";
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Web message generator
  const buildWhatsAppMessage = () => {
    if (!completedInvoice) return "";
    const itemsText = completedInvoice.items
      .map((item) => `• ${item.description} (x${item.quantity}) - ${formatPrice(item.line_total)}`)
      .join("\n");

    const pdfReceiptLink = checkoutService.getPublicReceiptPdfUrl(completedInvoice.id);

    return `✨ *Sribees Salon & Spa - Official Receipt* ✨

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

Thank you for choosing Sribees Salon & Spa! 💖
Hotline: +94 11 234 5678`;
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

  // Reset to create another sale
  const handleStartNewSale = () => {
    setCompletedInvoice(null);
    setSelectedAppointment(null);
    setIncludeApptServices(true);
    setAdditionalServices([]);
    setCartProducts([]);
    setClientName("");
    setClientPhone("");
    setDiscountAmount(0);
    setPayments([{ method: "cash", amount: 0, reference: "" }]);
    setErrorMsg(null);
    setWaNotice(null);
    navigate(ROUTES.CHECKOUT, { replace: true, state: {} });
  };

  // Filter Catalog Items
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [catalogProducts, searchQuery, selectedCategory]);

  const filteredServices = useMemo(() => {
    return catalogServices.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || s.categoryId === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [catalogServices, searchQuery, selectedCategory]);

  // Categories list
  const productCategories = useMemo(() => {
    const set = new Set<string>();
    catalogProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [catalogProducts]);

  return (
    <div className="flex flex-col gap-6 text-slate-900 pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER SECTION                                                     */}
      {/* ========================================================================= */}
      <Header
        title="Salon POS Checkout"
        description={
          selectedAppointment
            ? `Billing & Completing Appointment ${formatAppointmentId(selectedAppointment)}`
            : "Cashier Terminal for walk-in retail sales and salon services"
        }
        isLoading={isLoadingData}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.APPOINTMENTS)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Appointments</span>
            </button>
            <button
              type="button"
              onClick={handleStartNewSale}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset POS</span>
            </button>
          </div>
        }
      />

      {/* ========================================================================= */}
      {/* 2. SUCCESS RECEIPT VIEW (AFTER CHECKOUT)                                  */}
      {/* ========================================================================= */}
      {completedInvoice ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => checkoutService.downloadInvoicePdf(completedInvoice.id, completedInvoice.invoice_number)}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
            >
              <Download className="size-5 text-primary" />
              <span>Download Official PDF Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const pdfUrl = checkoutService.getInvoicePdfViewUrl(completedInvoice.id);
                window.open(pdfUrl, "_blank");
              }}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
            >
              <Printer className="size-5 text-slate-600" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>

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
              <div className="relative flex-1 w-full">
                <Phone className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

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
      ) : (
        /* ========================================================================= */
        /* 3. FULL PAGE POS CASHIER WORKSPACE (2 COLUMNS)                            */
        /* ========================================================================= */
        <div className="flex flex-col gap-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-700 shadow-2xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ------------------------------------------------------------------- */}
            {/* LEFT / CENTER PANEL: CATALOG & CART ITEMS (7 Cols)                  */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              {/* Mode Bar: Appointment Selector / Walk-in Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-9 items-center justify-center rounded-xl text-white ${
                        selectedAppointment ? "bg-primary" : "bg-slate-800"
                      }`}
                    >
                      {selectedAppointment ? <Scissors className="size-4.5" /> : <ShoppingBag className="size-4.5" />}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {selectedAppointment ? "Appointment Checkout Mode" : "Direct Walk-in Sale Mode"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedAppointment
                          ? `${formatAppointmentId(selectedAppointment)} • ${selectedAppointment.clientName} (${selectedAppointment.time || "Scheduled"})`
                          : "Selling salon retail products or ad-hoc services without prior booking"}
                      </p>
                      {selectedAppointment && selectedAppointment.hasInvoice && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800">
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                          <span>
                            Previous Invoice: <strong>#{selectedAppointment.invoiceNumber || "INV"}</strong> (Additional billing enabled)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedAppointment ? (
                      <button
                        type="button"
                        onClick={handleClearAppointment}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Switch to Walk-in
                      </button>
                    ) : (
                      <select
                        onChange={(e) => {
                          const apt = recentAppointments.find((a) => a.id === e.target.value);
                          if (apt) bindAppointment(apt);
                        }}
                        defaultValue=""
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-primary"
                      >
                        <option value="" disabled>
                          -- Load Appointment --
                        </option>
                        {recentAppointments
                          .filter((a) => a.status !== "cancelled")
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {formatAppointmentId(a)}: {a.clientName} ({a.time || a.date})
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Appointment Booked Services Row */}
                {selectedAppointment && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Booked Appointment Services
                      </span>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeApptServices}
                          onChange={(e) => setIncludeApptServices(e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>Include in Invoice</span>
                      </label>
                    </div>

                    {includeApptServices ? (
                      <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 p-3">
                        {appointmentServices.map((svc, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                            <div>
                              <p className="font-semibold text-slate-900">{svc.name}</p>
                              <p className="text-[11px] text-slate-400">{svc.duration} mins • Qty: {svc.quantity}</p>
                            </div>
                            <span className="font-bold text-slate-900 font-mono">
                              {formatPrice(svc.price * svc.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">
                        Appointment services excluded from this bill.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Catalog Explorer (Products & Services Tabs) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Tab Selector */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setCatalogTab("products");
                        setSelectedCategory("all");
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                        catalogTab === "products"
                          ? "bg-white text-primary shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>Retail Products ({catalogProducts.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCatalogTab("services");
                        setSelectedCategory("all");
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                        catalogTab === "services"
                          ? "bg-white text-primary shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="size-3.5" />
                      <span>Extra Services ({catalogServices.length})</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        catalogTab === "products" ? "Search products or SKU..." : "Search services..."
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                {/* Category Pills (for products) */}
                {catalogTab === "products" && productCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-3 py-1 font-semibold text-[11px] transition cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All Categories
                    </button>
                    {productCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-3 py-1 font-semibold text-[11px] whitespace-nowrap transition cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Items Grid */}
                <div className="max-h-72 overflow-y-auto pr-1">
                  {catalogTab === "products" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredProducts.map((p) => {
                        const inCart = cartProducts.find((item) => item.id === p.id);
                        return (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                              <p className="text-[11px] text-slate-400">
                                SKU: {p.sku} •{" "}
                                <span className={p.stock > 5 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                                  {p.stock} in stock
                                </span>
                              </p>
                              <p className="text-xs font-mono font-bold text-primary mt-0.5">
                                {formatPrice(p.sellingPrice)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddProductToCart(p)}
                              disabled={p.stock <= 0}
                              className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                inCart
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30"
                              }`}
                            >
                              <Plus className="size-3" />
                              <span>{inCart ? `x${inCart.quantity}` : "Add"}</span>
                            </button>
                          </div>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <p className="col-span-2 text-center text-xs text-slate-400 py-6 italic">
                          No retail products found matching "{searchQuery}".
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredServices.map((s) => {
                        const inCart = additionalServices.find((item) => item.id === s.id);
                        return (
                          <div
                            key={s.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                              <p className="text-[11px] text-slate-400">{s.duration} mins</p>
                              <p className="text-xs font-mono font-bold text-primary mt-0.5">
                                {formatPrice(s.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddServiceToCart(s)}
                              className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                inCart
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              <Plus className="size-3" />
                              <span>{inCart ? `x${inCart.quantity}` : "Add"}</span>
                            </button>
                          </div>
                        );
                      })}
                      {filteredServices.length === 0 && (
                        <p className="col-span-2 text-center text-xs text-slate-400 py-6 italic">
                          No services found matching "{searchQuery}".
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Billed Items Cart Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="size-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Invoice Items ({additionalServices.length + cartProducts.length + (includeApptServices && selectedAppointment ? appointmentServices.length : 0)})
                    </span>
                  </div>
                  {(additionalServices.length > 0 || cartProducts.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalServices([]);
                        setCartProducts([]);
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Added Items
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  {/* Additional Services Rows */}
                  {additionalServices.map((item, idx) => (
                    <div key={`svc-${idx}`} className="flex items-center justify-between py-2.5 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-pink-100 text-primary shrink-0">
                          <Scissors className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{formatPrice(item.price)} each</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              setAdditionalServices((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, quantity: Math.max(1, s.quantity - 1) } : s))
                              )
                            }
                            className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setAdditionalServices((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, quantity: s.quantity + 1 } : s))
                              )
                            }
                            className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                          >
                            +
                          </button>
                        </div>
                        <span className="w-20 text-right font-bold text-slate-900 font-mono">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdditionalServices((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Retail Products Rows */}
                  {cartProducts.map((item, idx) => (
                    <div key={`prod-${idx}`} className="flex items-center justify-between py-2.5 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                          <ShoppingBag className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            SKU: {item.sku} • {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              setCartProducts((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
                              )
                            }
                            className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity >= item.stock) {
                                setErrorMsg(`Maximum available stock for ${item.name} is ${item.stock}.`);
                                return;
                              }
                              setCartProducts((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, quantity: p.quantity + 1 } : p))
                              );
                            }}
                            className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                          >
                            +
                          </button>
                        </div>
                        <span className="w-20 text-right font-bold text-slate-900 font-mono">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCartProducts((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty state */}
                  {additionalServices.length === 0 &&
                    cartProducts.length === 0 &&
                    (!includeApptServices || !selectedAppointment) && (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        <ShoppingBag className="size-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold">Your invoice cart is empty.</p>
                        <p className="text-[11px]">Select items from the catalog above to add to this invoice.</p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT PANEL: BILLING SUMMARY, CUSTOMER & PAYMENTS (5 Cols)          */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              {/* Customer Info Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Customer Details
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Kasun Fernando"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Phone Number (for WhatsApp Receipt)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          const clean = e.target.value.replace(/[^\d+]/g, "");
                          setWaPhone(clean.startsWith("0") ? `+94${clean.slice(1)}` : clean);
                        }}
                        placeholder="077 123 4567 or +94..."
                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Breakdown Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Billing Breakdown
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900 font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="font-medium">Discount (LKR):</span>
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

                  {/* Quick discount pills */}
                  {subtotal > 0 && (
                    <div className="flex items-center justify-end gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setDiscountAmount(Math.round(subtotal * 0.05))}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                      >
                        5%
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountAmount(Math.round(subtotal * 0.1))}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                      >
                        10%
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountAmount(Math.round(subtotal * 0.15))}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                      >
                        15%
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountAmount(0)}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Grand Total:</span>
                    <span className="text-2xl font-black text-primary font-mono">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payments Terminal Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Payments
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePayFull("cash")}
                      className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                    >
                      💵 Cash Full
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePayFull("card")}
                      className="rounded-lg bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 text-xs font-bold hover:bg-purple-100 transition cursor-pointer"
                    >
                      💳 Card Full
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
                      className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 outline-none shrink-0"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit / Debit Card</option>
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
                      className="flex-1 min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-semibold text-slate-900 outline-none focus:border-primary text-right"
                    />
                  </div>
                </div>

                {/* Balances Summary */}
                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Paid:</span>
                    <span className="font-semibold text-slate-900 font-mono">{formatPrice(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Balance Due:</span>
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded ${
                        balanceDue > 0
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {formatPrice(balanceDue)}
                    </span>
                  </div>
                  {changeDue > 0 && (
                    <div className="flex justify-between items-center text-amber-800 font-bold bg-amber-50 p-2 rounded-lg text-xs">
                      <span>Change to Return:</span>
                      <span className="font-mono text-sm">{formatPrice(changeDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Checkout Action Button */}
              <button
                type="button"
                onClick={handleCompleteCheckout}
                disabled={isSubmitting || subtotal <= 0}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Processing Checkout...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-5" />
                    <span>Complete Checkout & Generate Invoice ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
