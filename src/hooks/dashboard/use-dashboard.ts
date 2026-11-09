import { useState, useEffect, useCallback } from "react";
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
 * Hook to fetch and manage Dashboard Summary Cards
 */
export function useDashboardSummary(filter: SummaryFilterOption = "today") {
  const [data, setData] = useState<DashboardSummaryDto | null>(null);
  const [cards, setCards] = useState<SummaryMetricCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter);
      const res = await dashboardService.getSummary(params);
      setData(res);
      setCards(mapSummaryDtoToCards(res, filter));
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load summary";
      setError(msg);
      setCards(mapSummaryDtoToCards(EMPTY_SUMMARY_DTO, filter));
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter);
        const res = await dashboardService.getSummary(params);
        if (!ignore) {
          setData(res);
          setCards(mapSummaryDtoToCards(res, filter));
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load summary";
          setError(msg);
          setCards(mapSummaryDtoToCards(EMPTY_SUMMARY_DTO, filter));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter]);

  return { data, cards, isLoading, isError: Boolean(error), error, refetch: fetchSummary };
}

/**
 * Hook to fetch orders trend based on services
 */
export function useServiceOrdersTrend(filter: ChartTimeFilter = "7d") {
  const [data, setData] = useState<TrendChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter);
      const res = await dashboardService.getServiceOrders(params);
      if (res.data && res.data.length > 0) {
        setData(
          res.data.map((item) => ({
            label: formatDateLabel(item.date),
            orders: item.orders,
          }))
        );
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load service orders");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter);
        const res = await dashboardService.getServiceOrders(params);
        if (!ignore) {
          if (res.data && res.data.length > 0) {
            setData(
              res.data.map((item) => ({
                label: formatDateLabel(item.date),
                orders: item.orders,
              }))
            );
          } else {
            setData([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load service orders");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter]);

  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  return { data, totalOrders, isLoading, isError: Boolean(error), error, refetch: fetchServiceOrders };
}

/**
 * Hook to fetch orders trend based on products
 */
export function useProductOrdersTrend(filter: ChartTimeFilter = "7d") {
  const [data, setData] = useState<TrendChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter);
      const res = await dashboardService.getProductOrders(params);
      if (res.data && res.data.length > 0) {
        setData(
          res.data.map((item) => ({
            label: formatDateLabel(item.date),
            orders: item.orders,
          }))
        );
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load product orders");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter);
        const res = await dashboardService.getProductOrders(params);
        if (!ignore) {
          if (res.data && res.data.length > 0) {
            setData(
              res.data.map((item) => ({
                label: formatDateLabel(item.date),
                orders: item.orders,
              }))
            );
          } else {
            setData([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load product orders");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter]);

  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  return { data, totalOrders, isLoading, isError: Boolean(error), error, refetch: fetchProductOrders };
}

/**
 * Hook to fetch top selling products
 */
export function useTopProducts(filter: ChartTimeFilter = "30d", limit = 5) {
  const [data, setData] = useState<TopProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter, limit);
      const res = await dashboardService.getTopProducts(params);
      if (res.data && res.data.length > 0) {
        const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0) || 1;
        setData(
          res.data.map((item) => ({
            name: item.name,
            sales: item.quantity,
            revenue: item.quantity * 2500,
            percentage: Math.round((item.quantity / totalQty) * 100),
            category: "Salon Products",
          }))
        );
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load top products");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter, limit);
        const res = await dashboardService.getTopProducts(params);
        if (!ignore) {
          if (res.data && res.data.length > 0) {
            const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0) || 1;
            setData(
              res.data.map((item) => ({
                name: item.name,
                sales: item.quantity,
                revenue: item.quantity * 2500,
                percentage: Math.round((item.quantity / totalQty) * 100),
                category: "Salon Products",
              }))
            );
          } else {
            setData([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load top products");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter, limit]);

  return { data, isLoading, isError: Boolean(error), error, refetch: fetchTopProducts };
}

/**
 * Hook to fetch top requested services
 */
export function useTopServices(filter: ChartTimeFilter = "30d", limit = 5) {
  const [data, setData] = useState<TopServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter, limit);
      const res = await dashboardService.getTopServices(params);
      if (res.data && res.data.length > 0) {
        const totalOrders = res.data.reduce((sum, item) => sum + item.orders, 0) || 1;
        setData(
          res.data.map((item) => ({
            name: item.name,
            bookings: item.orders,
            revenue: item.orders * 3500,
            percentage: Math.round((item.orders / totalOrders) * 100),
            category: "Hair & Beauty",
          }))
        );
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load top services");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter, limit);
        const res = await dashboardService.getTopServices(params);
        if (!ignore) {
          if (res.data && res.data.length > 0) {
            const totalOrders = res.data.reduce((sum, item) => sum + item.orders, 0) || 1;
            setData(
              res.data.map((item) => ({
                name: item.name,
                bookings: item.orders,
                revenue: item.orders * 3500,
                percentage: Math.round((item.orders / totalOrders) * 100),
                category: "Hair & Beauty",
              }))
            );
          } else {
            setData([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load top services");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter, limit]);

  return { data, isLoading, isError: Boolean(error), error, refetch: fetchTopServices };
}

/**
 * Hook to fetch payment types distribution
 */
export function usePaymentTypes(filter: ChartTimeFilter = "30d") {
  const [data, setData] = useState<PaymentTypeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = resolveFilterToApiParams(filter);
      const res = await dashboardService.getPaymentTypes(params);
      if (res.data && res.data.length > 0) {
        const totalAmt = res.data.reduce((sum, item) => sum + item.amount, 0) || 1;
        setData(
          res.data.map((item, index) => ({
            name: item.type,
            count: 1,
            value: item.amount,
            percentage: Math.round((item.amount / totalAmt) * 100),
            color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
          }))
        );
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load payment types");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = resolveFilterToApiParams(filter);
        const res = await dashboardService.getPaymentTypes(params);
        if (!ignore) {
          if (res.data && res.data.length > 0) {
            const totalAmt = res.data.reduce((sum, item) => sum + item.amount, 0) || 1;
            setData(
              res.data.map((item, index) => ({
                name: item.type,
                count: 1,
                value: item.amount,
                percentage: Math.round((item.amount / totalAmt) * 100),
                color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
              }))
            );
          } else {
            setData([]);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load payment types");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [filter]);

  const totalAmount = data.reduce((acc, curr) => acc + curr.value, 0);

  return { data, totalAmount, isLoading, isError: Boolean(error), error, refetch: fetchPaymentTypes };
}
