import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import type { Appointment } from "../../interface/appointment.types";
import type { Product } from "../../interface/product.types";
import type {
  CartServiceItem,
  CatalogTab,
  CatalogServiceItem,
} from "../../interface/checkout.types";
import { servicesService } from "../../services/services.service";
import { productsService } from "../../services/products.service";
import { appointmentsService } from "../../services/appointments.service";
import {
  checkoutService,
  type InvoiceDetailResponse,
} from "../../services/checkout.service";
import { ROUTES } from "../../routes/sidebar.routes";
import { useCheckoutCart } from "./use-checkout-cart";
import { useCheckoutWhatsApp } from "./use-checkout-whatsapp";

export function useCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const targetAppointmentId = searchParams.get("appointmentId") || searchParams.get("id");

  // Catalog State
  const [catalogServices, setCatalogServices] = useState<CatalogServiceItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Active Appointment
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    (location.state as any)?.appointment || null
  );

  // Search & Filter State
  const [catalogTab, setCatalogTab] = useState<CatalogTab>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Cart Option & Customer Form State
  const [includeApptServices, setIncludeApptServices] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Submission & Post-Checkout State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<InvoiceDetailResponse | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

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

  // Sub-hook 1: Cart management and monetary math
  const {
    additionalServices,
    setAdditionalServices,
    cartProducts,
    setCartProducts,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    handleAddServiceToCart,
    handleAddProductToCart,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handlePayFull,
    resetCart,
  } = useCheckoutCart({
    selectedAppointment,
    includeApptServices,
    appointmentServices,
    setErrorMsg,
  });

  // Sub-hook 2: WhatsApp Web generation and sharing
  const {
    waPhone,
    setWaPhone,
    copiedMessage,
    waNotice,
    setWaNotice,
    buildWhatsAppMessage,
    handleOpenWhatsAppWeb,
    handleCopyReceiptText,
  } = useCheckoutWhatsApp(completedInvoice, clientName);

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

  // Initial Data Fetch
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

  // Reset to fresh walk-in sale when POS Terminal button in top header is clicked
  useEffect(() => {
    if ((location.state as any)?.fresh) {
      handleStartNewSale();
    }
  }, [location.state]);

  // Switch / reset to walk-in sale
  const handleClearAppointment = () => {
    setSelectedAppointment(null);
    setClientName("");
    setClientPhone("");
    setWaPhone("+94");
    navigate(ROUTES.CHECKOUT, { replace: true, state: {} });
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

  // Reset to create another sale
  const handleStartNewSale = () => {
    setCompletedInvoice(null);
    setSelectedAppointment(null);
    setIncludeApptServices(true);
    setClientName("");
    setClientPhone("");
    setErrorMsg(null);
    setWaNotice(null);
    resetCart();
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

  return {
    navigate,
    isLoadingData,
    selectedAppointment,
    bindAppointment,
    handleClearAppointment,
    recentAppointments,
    appointmentServices,
    includeApptServices,
    setIncludeApptServices,
    catalogTab,
    setCatalogTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    catalogProducts,
    catalogServices,
    filteredProducts,
    filteredServices,
    productCategories,
    additionalServices,
    setAdditionalServices,
    cartProducts,
    setCartProducts,
    handleAddServiceToCart,
    handleAddProductToCart,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handlePayFull,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    completedInvoice,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    handleCompleteCheckout,
    handleStartNewSale,
    waPhone,
    setWaPhone,
    copiedMessage,
    waNotice,
    buildWhatsAppMessage,
    handleOpenWhatsAppWeb,
    handleCopyReceiptText,
  };
}

export default useCheckout;
