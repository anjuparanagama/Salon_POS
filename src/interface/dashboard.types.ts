import type { ComponentType, SVGProps } from "react";

export type SummaryFilterOption = "today" | "this_week" | "this_month" | "this_year";

export type SummaryMetricKey =
  | "revenues"
  | "appointments"
  | "customers"
  | "sold_products";

export type SummaryMetricCard = {
  id: SummaryMetricKey;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  count: number;
  percentage: number;
  gradientClass: string;
};

export type ChartTimeFilter = "7d" | "30d" | "1y";

export type TimeFilterOptionItem<T extends string = string> = {
  label: string;
  value: T;
};

export type TimeFilterSelectProps<T extends string = string> = {
  value: T;
  onChange: (value: T) => void;
  options?: TimeFilterOptionItem<T>[];
  ariaLabel?: string;
  className?: string;
};

export type TrendChartPoint = {
  label: string;
  orders: number;
  revenue?: number;
};

export type TopProductItem = {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
  category: string;
};

export type TopServiceItem = {
  name: string;
  bookings: number;
  revenue: number;
  percentage: number;
  category: string;
};

export type PaymentTypeItem = {
  name: string;
  count: number;
  value: number;
  percentage: number;
  color: string;
};

export type RecentAppointment = {
  time: string;
  customer: string;
  service: string;
  staff: string;
};
