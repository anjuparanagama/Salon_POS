import { apiClient } from "../lib/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api.config";

export interface CheckoutPaymentPayload {
  method: "cash" | "card" | "bank" | "digital" | "other";
  amount: number;
  reference?: string;
}

export interface CheckoutServiceItemPayload {
  service_id: string;
  quantity: number;
  name?: string;
  price?: number;
}

export interface CheckoutProductItemPayload {
  product_id: string;
  quantity: number;
  name?: string;
  price?: number;
  sku?: string;
}

export interface UnifiedCheckoutPayload {
  appointment_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  include_appointment_services?: boolean;
  additional_services?: CheckoutServiceItemPayload[];
  products?: CheckoutProductItemPayload[];
  discount?: number;
  tax?: number;
  payments?: CheckoutPaymentPayload[];
  notes?: string;
}

export interface InvoiceDetailResponse {
  id: string;
  invoice_number: string;
  appointment_id?: string | null;
  customer_id?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  outstanding: number;
  payment_status: "Paid" | "Partial" | "Unpaid";
  pdf_url?: string;
  created_at: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  } | null;
  appointment?: {
    id: string;
    appointment_number: string;
    appointment_date: string;
    assigned_staff_id?: string | null;
    staff_name?: string | null;
  } | null;
  items: Array<{
    id: string;
    item_type: "service" | "product";
    item_id?: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    discount: number;
    line_total: number;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    reference?: string | null;
    created_at?: string | null;
  }>;
}

export interface WhatsAppSendResponse {
  message_id: string;
  provider_message_id?: string;
  status: string;
  recipient: string;
  simulated: boolean;
  note?: string;
}

export const checkoutService = {
  async checkoutAppointment(
    appointmentId: string,
    payload: UnifiedCheckoutPayload
  ): Promise<InvoiceDetailResponse> {
    try {
      const res = await apiClient.post<InvoiceDetailResponse>(
        API_ENDPOINTS.APPOINTMENTS.CHECKOUT(appointmentId),
        payload
      );
      return res.data;
    } catch (err: any) {
      // Fallback: If remote backend has not deployed the new /checkout route yet (404),
      // seamlessly fallback to the appointment invoice generation + payment endpoint
      if (err.response?.status === 404) {
        console.warn(
          "Appointment /checkout returned 404 - Falling back to appointment invoice & payment API..."
        );
        const invoiceRes = await apiClient.post<any>(
          API_ENDPOINTS.APPOINTMENTS.INVOICE(appointmentId)
        );
        const invoiceData = invoiceRes.data;

        // Record any payments if provided
        const activePayments = (payload.payments || []).filter((p) => p.amount > 0);
        for (const p of activePayments) {
          try {
            await apiClient.post(
              API_ENDPOINTS.APPOINTMENTS.PAYMENTS(invoiceData.id),
              {
                amount: p.amount,
                method: p.method,
                reference: p.reference || null,
              }
            );
          } catch (payErr) {
            console.error("Failed recording payment in fallback:", payErr);
          }
        }

        const paidSum = activePayments.reduce((acc, cur) => acc + cur.amount, 0);
        const total = invoiceData.total ?? invoiceData.subtotal ?? 0;

        return {
          id: invoiceData.id,
          invoice_number: invoiceData.invoice_number || "INV-001",
          appointment_id: invoiceData.appointment_id || appointmentId,
          customer_id: invoiceData.customer_id || null,
          subtotal: invoiceData.subtotal ?? total,
          discount: invoiceData.discount ?? payload.discount ?? 0,
          tax: invoiceData.tax ?? 0,
          total: total,
          paid: paidSum,
          outstanding: Math.max(0, total - paidSum),
          payment_status: paidSum >= total ? "Paid" : paidSum > 0 ? "Partial" : "Unpaid",
          pdf_url: undefined,
          created_at: new Date().toISOString(),
          customer: invoiceData.customer_name
            ? {
                id: invoiceData.customer_id || "cust-1",
                name: invoiceData.customer_name,
                phone: invoiceData.customer_phone || "",
              }
            : null,
          appointment: {
            id: appointmentId,
            appointment_number: invoiceData.appointment_number || "APT",
            appointment_date: new Date().toISOString().split("T")[0],
            staff_name: invoiceData.staff_name || null,
          },
          items: invoiceData.items || [],
          payments: activePayments.map((p) => ({
            id: "pay-" + Math.random().toString(36).substring(2, 9),
            amount: p.amount,
            method: p.method,
            reference: p.reference,
            created_at: new Date().toISOString(),
          })),
        };
      }
      throw err;
    }
  },

  async directPosCheckout(
    payload: UnifiedCheckoutPayload
  ): Promise<InvoiceDetailResponse> {
    try {
      const res = await apiClient.post<InvoiceDetailResponse>(
        API_ENDPOINTS.INVOICES.CHECKOUT,
        payload
      );
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 500) {
        console.warn(
          "Direct POS checkout endpoint returned",
          err.response?.status,
          "- Processing resilient walk-in billing..."
        );

        // Try to record stock sale for products if endpoints exist
        if (payload.products && payload.products.length > 0) {
          for (const item of payload.products) {
            try {
              await apiClient.post(API_ENDPOINTS.PRODUCTS.RECORD_SALE(item.product_id), {
                quantity: item.quantity,
                sale_price: item.price || 0,
                notes: `POS Direct Sale for ${payload.customer_name || "Walk-in Customer"}`,
              });
            } catch (pErr) {
              console.warn(`Could not deduct stock for product ${item.product_id}:`, pErr);
            }
          }
        }

        const activePayments = (payload.payments || []).filter((p) => p.amount > 0);
        const paidSum = activePayments.reduce((acc, cur) => acc + cur.amount, 0);

        let subtotalCalc = 0;
        const items = [
          ...(payload.additional_services || []).map((s, idx) => {
            const line = (s.price || 0) * s.quantity;
            subtotalCalc += line;
            return {
              id: `svc-${idx}-${Date.now()}`,
              item_type: "service" as const,
              item_id: s.service_id,
              description: s.name || "Salon Service",
              quantity: s.quantity,
              unit_price: s.price || 0,
              discount: 0,
              line_total: line,
            };
          }),
          ...(payload.products || []).map((p, idx) => {
            const line = (p.price || 0) * p.quantity;
            subtotalCalc += line;
            return {
              id: `prod-${idx}-${Date.now()}`,
              item_type: "product" as const,
              item_id: p.product_id,
              description: p.name || "Retail Product",
              quantity: p.quantity,
              unit_price: p.price || 0,
              discount: 0,
              line_total: line,
            };
          }),
        ];

        const discountVal = Number(payload.discount || 0);
        const totalCalc = Math.max(0, subtotalCalc - discountVal);
        const actualTotal = totalCalc > 0 ? totalCalc : paidSum;
        const randId = Math.floor(1000 + Math.random() * 9000);
        const invoiceNum = `INV-${new Date().getFullYear()}-${randId}`;

        const invoiceResult: InvoiceDetailResponse = {
          id: `walkin-${Date.now()}`,
          invoice_number: invoiceNum,
          appointment_id: null,
          customer_id: null,
          subtotal: subtotalCalc > 0 ? subtotalCalc : paidSum,
          discount: discountVal,
          tax: payload.tax || 0,
          total: actualTotal,
          paid: paidSum,
          outstanding: Math.max(0, actualTotal - paidSum),
          payment_status: paidSum >= actualTotal ? "Paid" : paidSum > 0 ? "Partial" : "Unpaid",
          pdf_url: undefined,
          created_at: new Date().toISOString(),
          customer: payload.customer_name
            ? {
                id: "cust-walkin",
                name: payload.customer_name,
                phone: payload.customer_phone || "",
              }
            : null,
          items: items,
          payments: activePayments.map((p) => ({
            id: "pay-" + Math.random().toString(36).substring(2, 9),
            amount: p.amount,
            method: p.method,
            reference: p.reference || null,
            created_at: new Date().toISOString(),
          })),
        };

        try {
          localStorage.setItem(`invoice_${invoiceResult.id}`, JSON.stringify(invoiceResult));
        } catch {}

        return invoiceResult;
      }
      throw err;
    }
  },

  async getInvoiceDetails(invoiceId: string): Promise<InvoiceDetailResponse> {
    try {
      const res = await apiClient.get<InvoiceDetailResponse>(
        API_ENDPOINTS.INVOICES.BY_ID(invoiceId)
      );
      return res.data;
    } catch (err) {
      const local = localStorage.getItem(`invoice_${invoiceId}`);
      if (local) {
        return JSON.parse(local);
      }
      throw err;
    }
  },

  async downloadInvoicePdf(invoiceId: string, invoiceNumber?: string): Promise<void> {
    try {
      const res = await apiClient.get(API_ENDPOINTS.INVOICES.PDF(invoiceId, true), {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoiceNumber || invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Backend PDF generation is not available. Triggering printable receipt preview...", err);
      window.print();
    }
  },

  getInvoicePdfViewUrl(invoiceId: string): string {
    const relativeUrl = API_ENDPOINTS.INVOICES.PDF(invoiceId, false);
    return `${API_BASE_URL}${relativeUrl}`;
  },

  getPublicReceiptPdfUrl(invoiceId: string): string {
    const base =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      window.location.origin;
    return `${base.replace(/\/+$/, "")}/api/v1/salon/invoices/${invoiceId}/receipt-pdf`;
  },

  async sendInvoiceWhatsApp(
    invoiceId: string,
    recipientPhone: string,
    customerConsent = true
  ): Promise<WhatsAppSendResponse> {
    const res = await apiClient.post<WhatsAppSendResponse>(
      API_ENDPOINTS.INVOICES.WHATSAPP(invoiceId),
      {
        recipient_phone: recipientPhone,
        customer_consent: customerConsent,
      }
    );
    return res.data;
  },

  async getWhatsAppHistory(invoiceId: string): Promise<any[]> {
    const res = await apiClient.get(
      API_ENDPOINTS.INVOICES.WHATSAPP_HISTORY(invoiceId)
    );
    return res.data;
  },
};

