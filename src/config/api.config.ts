const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://sribees-gkbeajd5dzatf3gc.southeastasia-01.azurewebsites.net";

// In local development (port 5173), use relative path "" so Vite's proxy forwards
// requests to the Azure backend. This avoids CORS blocking, especially when backend
// errors (500 / 502) happen, allowing the UI to receive and handle status codes properly.
export const API_BASE_URL =
  import.meta.env.DEV && import.meta.env.VITE_DIRECT_API !== "true"
    ? ""
    : rawBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
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
    LIST: "/api/v1/salon/services/list",
    STATS: "/api/v1/salon/services/stats",
    SUMMARY: "/api/v1/salon/services/summary",
    CATEGORIES: "/api/v1/salon/services/categories",
    BY_ID: (id: string) => `/api/v1/salon/services/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/salon/services/${id}/toggle-status`,
  },
  PRODUCTS: {
    BASE: "/api/v1/salon/products",
    STATS: "/api/v1/salon/products/stats",
    SUMMARY: "/api/v1/salon/products/summary",
    CATEGORIES: "/api/v1/salon/products/categories",
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
    PAYMENTS: (invoiceId: string) => `/api/v1/salon/appointments/invoices/${invoiceId}/payments`,
  },
  STAFF: {
    BASE: "/api/v1/salon/staff",
    LIST: "/api/v1/salon/staff/list",
    STATS: "/api/v1/salon/staff/stats",
    SUMMARY: "/api/v1/salon/staff/summary",
    ROLES: "/api/v1/salon/staff/roles",
    BY_ID: (id: string) => `/api/v1/salon/staff/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/salon/staff/${id}/toggle-status`,
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
      BY_ID: (id: string) => `/api/v1/salon/ledger/expenses/${id}`,
    },
    TRANSACTIONS: {
      BASE: "/api/v1/salon/ledger/transactions",
      STATS: "/api/v1/salon/ledger/transactions/stats",
      SUMMARY: "/api/v1/salon/ledger/transactions/summary",
      BY_ID: (id: string) => `/api/v1/salon/ledger/transactions/${id}`,
    },
  },
} as const;
