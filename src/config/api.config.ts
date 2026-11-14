const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "";

// In local development (port 5173), use relative path "" so Vite's proxy forwards
// requests to the backend target configured in .env. This avoids CORS blocking, especially when backend
// errors (500 / 502) happen, allowing the UI to receive and handle status codes properly.
export const API_BASE_URL =
  import.meta.env.DEV && import.meta.env.VITE_DIRECT_API !== "true"
    ? ""
    : rawBaseUrl.replace(/\/+$/, "");

// Public customer-facing web client URL (salora-web / Share_web)
export const PUBLIC_WEB_URL = (
  import.meta.env.VITE_PUBLIC_WEB_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "https://salora.lk")
).replace(/\/+$/, "");

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER_INITIATE: "/api/v1/auth/register/initiate",
    REGISTER_VERIFY_OTP: "/api/v1/auth/register/verify-otp",
    REGISTER_RESEND_OTP: "/api/v1/auth/register/resend-otp",
    REGISTER_CHECK_SLUG: "/api/v1/auth/register/check-slug",
    REGISTER_VALIDATE_REFERRAL: "/api/v1/auth/referral/validate",
    REGISTER_COMPLETE: "/api/v1/auth/register/complete",
  },
  DASHBOARD: {
    SUMMARY: "/api/v1/salon/dashboard/summary",
    SERVICE_ORDERS: "/api/v1/salon/dashboard/charts/service-orders",
    PRODUCT_ORDERS: "/api/v1/salon/dashboard/charts/product-orders",
    TOP_PRODUCTS: "/api/v1/salon/dashboard/charts/top-products",
    TOP_SERVICES: "/api/v1/salon/dashboard/charts/top-services",
    PAYMENT_TYPES: "/api/v1/salon/dashboard/charts/payment-types",
  },
  SERVICES: {
    BASE: "/api/v1/salon/services",
    LIST: "/api/v1/salon/services",
    STATS: "/api/v1/salon/services/stats",
    SUMMARY: "/api/v1/salon/services/summary",
    CATEGORIES: "/api/v1/salon/services/categories",
    CATEGORY_BY_ID: (id: string) => `/api/v1/salon/services/categories/${id}`,
    BY_ID: (id: string) => `/api/v1/salon/services/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/salon/services/${id}/toggle-status`,
  },
  PRODUCTS: {
    BASE: "/api/v1/salon/products",
    STATS: "/api/v1/salon/products/stats",
    SUMMARY: "/api/v1/salon/products/summary",
    CATEGORIES: "/api/v1/salon/products/categories",
    CATEGORY_BY_ID: (id: string) => `/api/v1/salon/products/categories/${id}`,
    BRANDS: "/api/v1/salon/products/brands",
    BY_ID: (id: string) => `/api/v1/salon/products/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/salon/products/${id}/toggle-status`,
    STOCK_IN: (id: string) => `/api/v1/salon/products/${id}/stock-in`,
    ADJUSTMENT: (id: string) => `/api/v1/salon/products/${id}/adjustment`,
    RECORD_SALE: (id: string) => `/api/v1/salon/products/${id}/record-sale`,
    MOVEMENTS: (id: string) => `/api/v1/salon/products/${id}/movements`,
  },
  APPOINTMENTS: {
    BASE: "/api/v1/salon/appointments",
    SUMMARY: "/api/v1/salon/appointments/summary",
    BY_ID: (id: string) => `/api/v1/salon/appointments/${id}`,
    STATUS: (id: string) => `/api/v1/salon/appointments/${id}/status`,
    CANCEL: (id: string) => `/api/v1/salon/appointments/${id}/cancel`,
    HISTORY: (id: string) => `/api/v1/salon/appointments/${id}/history`,
    INVOICE: (id: string) => `/api/v1/salon/appointments/${id}/invoice`,
    CHECKOUT: (id: string) => `/api/v1/salon/appointments/${id}/checkout`,
    PAYMENTS: (invoiceId: string) => `/api/v1/salon/appointments/invoices/${invoiceId}/payments`,
  },
  INVOICES: {
    CHECKOUT: "/api/v1/salon/invoices/checkout",
    BY_ID: (id: string) => `/api/v1/salon/invoices/${id}`,
    PDF: (id: string, download = false) => `/api/v1/salon/invoices/${id}/pdf${download ? "?download=true" : ""}`,
    WHATSAPP: (id: string) => `/api/v1/salon/invoices/${id}/whatsapp`,
    WHATSAPP_HISTORY: (id: string) => `/api/v1/salon/invoices/${id}/whatsapp/history`,
  },
  STAFF: {
    BASE: "/api/v1/salon/staff",
    LIST: "/api/v1/salon/staff",
    STATS: "/api/v1/salon/staff/stats",
    SUMMARY: "/api/v1/salon/staff/summary",
    ROLES: "/api/v1/salon/staff/roles",
    ROLE_BY_ID: (id: string) => `/api/v1/salon/staff/roles/${id}`,
    BY_ID: (id: string) => `/api/v1/salon/staff/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/salon/staff/${id}/toggle-status`,
  },
  CUSTOMERS: {
    BASE: "/api/v1/salon/customers",
    STATS: "/api/v1/salon/customers/stats",
    SUMMARY: "/api/v1/salon/customers/summary",
    BY_ID: (id: string) => `/api/v1/salon/customers/${id}`,
    HISTORY: (id: string) => `/api/v1/salon/customers/${id}/history`,
  },
  LEDGER: {
    SUMMARY: "/api/v1/salon/ledger/summary",
    INCOME: {
      BASE: "/api/v1/salon/ledger/income",
      STATS: "/api/v1/salon/ledger/income/stats",
      SUMMARY: "/api/v1/salon/ledger/income/summary",
    },
    EXPENSES: {
      BASE: "/api/v1/salon/ledger/expenses",
      STATS: "/api/v1/salon/ledger/expenses/stats",
      SUMMARY: "/api/v1/salon/ledger/expenses/summary",
      CATEGORIES: "/api/v1/salon/ledger/expenses/categories",
      CATEGORY_BY_ID: (id: string) => `/api/v1/salon/ledger/expenses/categories/${id}`,
      BY_ID: (id: string) => `/api/v1/salon/ledger/expenses/${id}`,
    },
    TRANSACTIONS: {
      BASE: "/api/v1/salon/ledger/transactions",
      STATS: "/api/v1/salon/ledger/transactions/stats",
      SUMMARY: "/api/v1/salon/ledger/transactions/summary",
      BY_ID: (id: string) => `/api/v1/salon/ledger/transactions/${id}`,
    },
  },
  REFERRALS: {
    BASE: "/api/v1/salon/referrals",
    SUMMARY: "/api/v1/salon/referrals/summary",
  },
} as const;
