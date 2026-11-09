import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  ChartTimeFilter,
  DashboardFilterParams,
  DashboardSummaryDto,
  OrdersChartResponseDto,
  PaymentTypesResponseDto,
  SummaryFilterOption,
  TopProductsResponseDto,
  TopServicesResponseDto,
} from "../interface/dashboard.types";

/**
 * Format a Date object to YYYY-MM-DD string
 */
function formatDateIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Converts frontend filter options (today, this_week, 7d, 30d, etc.)
 * into backend query parameters compatible with FastAPI dashboard endpoints.
 */
export function resolveFilterToApiParams(
  filter: SummaryFilterOption | ChartTimeFilter,
  limit?: number
): DashboardFilterParams {
  const today = new Date();
  const toStr = formatDateIso(today);

  if (filter === "today") {
    return { period: "today", limit };
  }
  if (filter === "this_week") {
    return { period: "this_week", limit };
  }
  if (filter === "this_month") {
    return { period: "this_month", limit };
  }
  if (filter === "this_year") {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return { from: formatDateIso(startOfYear), to: toStr, limit };
  }
  if (filter === "7d") {
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 6);
    return { from: formatDateIso(fromDate), to: toStr, limit };
  }
  if (filter === "30d") {
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 29);
    return { from: formatDateIso(fromDate), to: toStr, limit };
  }
  if (filter === "1y") {
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 364);
    return { from: formatDateIso(fromDate), to: toStr, limit };
  }

  return { period: "today", limit };
}

export const dashboardService = {
  /**
   * Get Salon dashboard summary metrics (revenue, appointments, customers, payments, sold_products)
   */
  async getSummary(params?: DashboardFilterParams): Promise<DashboardSummaryDto> {
    const response = await apiClient.get<DashboardSummaryDto>(
      API_ENDPOINTS.DASHBOARD.SUMMARY,
      { params }
    );
    return response.data;
  },

  /**
   * Get orders count based on salon services over date range
   */
  async getServiceOrders(
    params?: DashboardFilterParams
  ): Promise<OrdersChartResponseDto> {
    const response = await apiClient.get<OrdersChartResponseDto>(
      API_ENDPOINTS.DASHBOARD.SERVICE_ORDERS,
      { params }
    );
    return response.data;
  },

  /**
   * Get orders count based on salon products over date range
   */
  async getProductOrders(
    params?: DashboardFilterParams
  ): Promise<OrdersChartResponseDto> {
    const response = await apiClient.get<OrdersChartResponseDto>(
      API_ENDPOINTS.DASHBOARD.PRODUCT_ORDERS,
      { params }
    );
    return response.data;
  },

  /**
   * Get top selling salon products ranked by quantity
   */
  async getTopProducts(
    params?: DashboardFilterParams
  ): Promise<TopProductsResponseDto> {
    const response = await apiClient.get<TopProductsResponseDto>(
      API_ENDPOINTS.DASHBOARD.TOP_PRODUCTS,
      { params }
    );
    return response.data;
  },

  /**
   * Get top requested salon services ranked by bookings
   */
  async getTopServices(
    params?: DashboardFilterParams
  ): Promise<TopServicesResponseDto> {
    const response = await apiClient.get<TopServicesResponseDto>(
      API_ENDPOINTS.DASHBOARD.TOP_SERVICES,
      { params }
    );
    return response.data;
  },

  /**
   * Get salon payments grouped by payment method/type
   */
  async getPaymentTypes(
    params?: DashboardFilterParams
  ): Promise<PaymentTypesResponseDto> {
    const response = await apiClient.get<PaymentTypesResponseDto>(
      API_ENDPOINTS.DASHBOARD.PAYMENT_TYPES,
      { params }
    );
    return response.data;
  },
};

export default dashboardService;

