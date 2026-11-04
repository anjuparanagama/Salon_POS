import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Scissors, ShoppingBag } from "lucide-react";
import type { ChartTimeFilter, TrendChartPoint } from "../../../../interface/dashboard.types";
import {
  CHART_TIME_FILTER_OPTIONS,
  PRODUCT_ORDERS_DATA,
  SERVICE_ORDERS_DATA,
} from "../../data/dashboard.mock";
import TimeFilterSelect from "../time-filter-select";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: TrendChartPoint;
  }>;
  label?: string;
  metricLabel: string;
};

function ChartCustomTooltip({ active, payload, label, metricLabel }: CustomTooltipProps) {
  if (active && payload && payload.length > 0 && payload[0]?.payload) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-md text-xs">
        <p className="font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-slate-600">
          <span className="font-medium text-slate-500">{metricLabel}: </span>
          <span className="font-bold text-slate-900">{payload[0].value.toLocaleString()} orders</span>
        </p>
        {data.revenue !== undefined && (
          <p className="mt-0.5 text-slate-600">
            <span className="font-medium text-slate-500">Revenue: </span>
            <span className="font-semibold text-primary">
              Rs. {data.revenue.toLocaleString()}
            </span>
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function OrdersTrendSection() {
  const [serviceFilter, setServiceFilter] = useState<ChartTimeFilter>("7d");
  const [productFilter, setProductFilter] = useState<ChartTimeFilter>("7d");

  const serviceData = SERVICE_ORDERS_DATA[serviceFilter] ?? [];
  const productData = PRODUCT_ORDERS_DATA[productFilter] ?? [];

  const totalServiceOrders = serviceData.reduce((acc, curr) => acc + curr.orders, 0);
  const totalProductOrders = productData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart 1: Orders Based on Services (Bar Chart) */}
      <div className="flex min-w-0 flex-col rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs transition hover:border-sky-200">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-lighter text-primary">
              <Scissors aria-hidden="true" className="size-4.5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Orders Based on Services
              </h3>
              <p className="text-xs text-slate-500">
                Total: <span className="font-semibold text-slate-800">{totalServiceOrders.toLocaleString()} bookings</span>
              </p>
            </div>
          </div>

          {/* Service Chart Filter Component */}
          <TimeFilterSelect
            value={serviceFilter}
            onChange={(val) => setServiceFilter(val as ChartTimeFilter)}
            options={CHART_TIME_FILTER_OPTIONS}
            ariaLabel="Filter Services time range"
          />
        </div>

        {/* Bar Chart Container */}
        <div className="mt-4 h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={serviceData}
              margin={{ top: 15, right: 15, left: -5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                content={<ChartCustomTooltip metricLabel="Service Bookings" />}
              />
              <Bar
                dataKey="orders"
                fill="#D9145A"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Orders Based on Products (Bar Chart) */}
      <div className="flex min-w-0 flex-col rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs transition hover:border-sky-200">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <ShoppingBag aria-hidden="true" className="size-4.5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Orders Based on Products
              </h3>
              <p className="text-xs text-slate-500">
                Total: <span className="font-semibold text-slate-800">{totalProductOrders.toLocaleString()} sales</span>
              </p>
            </div>
          </div>

          {/* Product Chart Filter Component */}
          <TimeFilterSelect
            value={productFilter}
            onChange={(val) => setProductFilter(val as ChartTimeFilter)}
            options={CHART_TIME_FILTER_OPTIONS}
            ariaLabel="Filter Products time range"
          />
        </div>

        {/* Bar Chart Container */}
        <div className="mt-4 h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productData}
              margin={{ top: 15, right: 15, left: -5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                content={<ChartCustomTooltip metricLabel="Product Sales" />}
              />
              <Bar
                dataKey="orders"
                fill="#0284c7"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default OrdersTrendSection;
