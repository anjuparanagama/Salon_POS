import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  DollarSign,
  PackageCheck,
  Users,
} from "lucide-react";
import {
  dashboardService,
  resolveFilterToApiParams,
} from "../../services/dashboard.service";
import { formatPrice } from "../../helpers/price.helper";
import type {
  ChartTimeFilter,
  DashboardSummaryDto,
  PaymentTypeItem,
  SummaryFilterOption,
  SummaryMetricCard,
  TopProductItem,
  TopServiceItem,
  TrendChartPoint,
} from "../../interface/dashboard.types";

/**
 * Palette for payment method charts
 */
const PAYMENT_COLORS = [
  "#2563eb", // blue-600
  "#0ea5e9", // sky-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

const EMPTY_SUMMARY_DTO: DashboardSummaryDto = {
  revenue: 0,
  payments: 0,
  appointments: 0,
  customers: 0,
  sold_products: 0,
};

/**
 * Format date string (YYYY-MM-DD) into readable chart label (e.g., "Nov 05")
 */
function formatDateLabel(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Converts backend DashboardSummaryDto into UI cards with styling and icons
 */
export function mapSummaryDtoToCards(
  dto: DashboardSummaryDto,
  filter: SummaryFilterOption
): SummaryMetricCard[] {
  const subtitleMap: Record<SummaryFilterOption, string> = {
    today: "vs yesterday",
    this_week: "vs last week",
    this_month: "vs last month",
    this_year: "vs last year",
  };
  const subtitle = subtitleMap[filter] || "vs previous period";

  const totalApts = dto.appointments || 0;
  const cancelledApts = dto.cancelled_appointments ?? 0;
  const activeApts = Math.max(0, totalApts - cancelledApts);
  const appointmentPercentage =
    dto.appointment_rate !== undefined
      ? dto.appointment_rate
      : totalApts > 0
      ? Math.round((activeApts / totalApts) * 100)
      : 0;

  return [
    {
      id: "revenues",
      title: "Revenues",
      value: formatPrice(dto.revenue, { space: true }),
      change: dto.revenue > 0 ? "+100%" : "0%",
      isPositive: dto.revenue > 0,
      subtitle,
      icon: DollarSign,
      count: dto.payments,
      percentage: dto.revenue > 0 ? Math.min(100, Math.round((dto.revenue / 50000) * 100)) : 0,
      gradientClass: "from-blue-600 via-blue-500 to-sky-500",
    },
    {
      id: "appointments",
      title: "Appointments",
      value: dto.appointments.toLocaleString(),
      change: `${appointmentPercentage}%`,
      isPositive: appointmentPercentage >= 50,
      subtitle,
      icon: CalendarDays,
      count: dto.appointments,
      percentage: appointmentPercentage,
      gradientClass: "from-amber-600 via-orange-500 to-amber-500",
    },
    {
      id: "customers",
      title: "Customers",
      value: dto.customers.toLocaleString(),
      change: dto.customers > 0 ? "+100%" : "0%",
      isPositive: dto.customers > 0,
      subtitle,
      icon: Users,
      count: dto.customers,
      percentage: dto.customers > 0 ? Math.min(100, Math.round((dto.customers / 20) * 100)) : 0,
      gradientClass: "from-lime-700 via-green-600 to-emerald-500",
    },
    {
      id: "sold_products",
      title: "Sold Products",
      value: dto.sold_products.toLocaleString(),
      change: dto.sold_products > 0 ? "+100%" : "0%",
      isPositive: dto.sold_products > 0,
      subtitle,
      icon: PackageCheck,
      count: dto.sold_products,
      percentage: dto.sold_products > 0 ? Math.min(100, Math.round((dto.sold_products / 20) * 100)) : 0,
      gradientClass: "from-rose-950 via-rose-800 to-red-600",
    },
  ];
}

/**
 * Hook to fetch and manage Dashboard Summary Cards with caching
 */
export function useDashboardSummary(filter: SummaryFilterOption = "today") {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "summary", filter],
    queryFn: () => dashboardService.getSummary(resolveFilterToApiParams(filter)),
  });

  const cards = useMemo(() => {
    return mapSummaryDtoToCards(data || EMPTY_SUMMARY_DTO, filter);
  }, [data, filter]);

  return {
    data: data ?? null,
    cards,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load summary") : null,
    refetch,
  };
}

/**
 * Hook to fetch orders trend based on services with caching
 */
export function useServiceOrdersTrend(filter: ChartTimeFilter = "7d") {
  const { data: rawData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "service-orders", filter],
    queryFn: () => dashboardService.getServiceOrders(resolveFilterToApiParams(filter)),
  });

  const data = useMemo<TrendChartPoint[]>(() => {
    if (rawData?.data && rawData.data.length > 0) {
      return rawData.data.map((item) => ({
        label: formatDateLabel(item.date),
        orders: item.orders,
      }));
    }
    return [];
  }, [rawData]);

  const totalOrders = useMemo(() => data.reduce((acc, curr) => acc + curr.orders, 0), [data]);

  return {
    data,
    totalOrders,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load service orders") : null,
    refetch,
  };
}

/**
 * Hook to fetch orders trend based on products with caching
 */
export function useProductOrdersTrend(filter: ChartTimeFilter = "7d") {
  const { data: rawData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "product-orders", filter],
    queryFn: () => dashboardService.getProductOrders(resolveFilterToApiParams(filter)),
  });

  const data = useMemo<TrendChartPoint[]>(() => {
    if (rawData?.data && rawData.data.length > 0) {
      return rawData.data.map((item) => ({
        label: formatDateLabel(item.date),
        orders: item.orders,
      }));
    }
    return [];
  }, [rawData]);

  const totalOrders = useMemo(() => data.reduce((acc, curr) => acc + curr.orders, 0), [data]);

  return {
    data,
    totalOrders,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load product orders") : null,
    refetch,
  };
}

/**
 * Hook to fetch top selling products with caching
 */
export function useTopProducts(filter: ChartTimeFilter = "30d", limit = 5) {
  const { data: rawData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "top-products", filter, limit],
    queryFn: () => dashboardService.getTopProducts(resolveFilterToApiParams(filter, limit)),
  });

  const data = useMemo<TopProductItem[]>(() => {
    if (rawData?.data && rawData.data.length > 0) {
      const totalQty = rawData.data.reduce((sum, item) => sum + item.quantity, 0) || 1;
      return rawData.data.map((item) => ({
        name: item.name,
        sales: item.quantity,
        revenue: item.quantity * 2500,
        percentage: Math.round((item.quantity / totalQty) * 100),
        category: "Salon Products",
      }));
    }
    return [];
  }, [rawData]);

  return {
    data,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load top products") : null,
    refetch,
  };
}

/**
 * Hook to fetch top requested services with caching
 */
export function useTopServices(filter: ChartTimeFilter = "30d", limit = 5) {
  const { data: rawData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "top-services", filter, limit],
    queryFn: () => dashboardService.getTopServices(resolveFilterToApiParams(filter, limit)),
  });

  const data = useMemo<TopServiceItem[]>(() => {
    if (rawData?.data && rawData.data.length > 0) {
      const totalOrders = rawData.data.reduce((sum, item) => sum + item.orders, 0) || 1;
      return rawData.data.map((item) => ({
        name: item.name,
        bookings: item.orders,
        revenue: item.orders * 3500,
        percentage: Math.round((item.orders / totalOrders) * 100),
        category: "Hair & Beauty",
      }));
    }
    return [];
  }, [rawData]);

  return {
    data,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load top services") : null,
    refetch,
  };
}

/**
 * Hook to fetch payment types distribution with caching
 */
export function usePaymentTypes(filter: ChartTimeFilter = "30d") {
  const { data: rawData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "payment-types", filter],
    queryFn: () => dashboardService.getPaymentTypes(resolveFilterToApiParams(filter)),
  });

  const data = useMemo<PaymentTypeItem[]>(() => {
    if (rawData?.data && rawData.data.length > 0) {
      const totalAmt = rawData.data.reduce((sum, item) => sum + item.amount, 0) || 1;
      return rawData.data.map((item, index) => ({
        name: item.type,
        count: 1,
        value: item.amount,
        percentage: Math.round((item.amount / totalAmt) * 100),
        color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
      }));
    }
    return [];
  }, [rawData]);

  const totalAmount = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return {
    data,
    totalAmount,
    isLoading,
    isError,
    error: error ? (error instanceof Error ? error.message : "Failed to load payment types") : null,
    refetch,
  };
}
