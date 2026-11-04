import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CreditCard, PackageCheck, Sparkles } from "lucide-react";
import type {
  ChartTimeFilter,
  PaymentTypeItem,
} from "../../../../interface/dashboard.types";
import {
  CHART_TIME_FILTER_OPTIONS,
  PAYMENT_TYPES_DATA,
  TOP_PRODUCTS_DATA,
  TOP_SERVICES_DATA,
} from "../../data/dashboard.mock";
import TimeFilterSelect from "../time-filter-select";

type PaymentTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: PaymentTypeItem;
  }>;
};

function PaymentPieTooltip({ active, payload }: PaymentTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-md text-xs">
        <p className="font-bold text-slate-900">{item.name}</p>
        <div className="mt-1 flex flex-col gap-0.5 text-slate-700">
          <p>
            <span className="font-medium text-slate-500">Share: </span>
            <span className="font-semibold text-slate-950">{item.percentage}%</span>
          </p>
          <p>
            <span className="font-medium text-slate-500">Total: </span>
            <span className="font-semibold text-primary">
              Rs. {item.value.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-medium text-slate-500">Transactions: </span>
            <span className="font-semibold">{item.count}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function BreakdownChartsSection() {
  const [productFilter, setProductFilter] = useState<ChartTimeFilter>("30d");
  const [serviceFilter, setServiceFilter] = useState<ChartTimeFilter>("30d");
  const [paymentFilter, setPaymentFilter] = useState<ChartTimeFilter>("30d");

  const maxProductPct = Math.max(...TOP_PRODUCTS_DATA.map((p) => p.percentage), 1);
  const maxServicePct = Math.max(...TOP_SERVICES_DATA.map((s) => s.percentage), 1);
  const totalPaymentAmount = PAYMENT_TYPES_DATA.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Top Products Card (Horizontal Lines Style) */}
      <div className="flex flex-col rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs transition hover:border-sky-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-sky-100/70 text-sky-700">
              <PackageCheck className="size-4" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-slate-800">
              Top Products
            </h3>
          </div>

          <TimeFilterSelect
            value={productFilter}
            onChange={(val) => setProductFilter(val as ChartTimeFilter)}
            options={CHART_TIME_FILTER_OPTIONS}
            ariaLabel="Filter Top Products time period"
          />
        </div>

        <div className="mt-3 flex flex-col divide-y divide-slate-100/60">
          {TOP_PRODUCTS_DATA.map((item) => {
            const barWidth = Math.max(
              Math.round((item.percentage / maxProductPct) * 44),
              7
            );

            return (
              <div
                key={item.name}
                title={`${item.sales} units sold • Rs. ${item.revenue.toLocaleString()}`}
                className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-white/70 px-1 rounded-lg cursor-default"
              >
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700 group-hover:text-slate-900">
                  {item.name}
                </span>

                <div className="flex w-16 sm:w-20 items-center justify-start shrink-0">
                  <span
                    className="h-2 rounded-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${barWidth}px` }}
                  />
                </div>

                <span className="w-12 text-right text-xs font-semibold text-slate-700 shrink-0">
                  {item.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Top Services Card (Horizontal Lines Style) */}
      <div className="flex flex-col rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs transition hover:border-sky-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary-lighter text-primary">
              <Sparkles className="size-4" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-slate-800">
              Top Services
            </h3>
          </div>

          <TimeFilterSelect
            value={serviceFilter}
            onChange={(val) => setServiceFilter(val as ChartTimeFilter)}
            options={CHART_TIME_FILTER_OPTIONS}
            ariaLabel="Filter Top Services time period"
          />
        </div>

        <div className="mt-3 flex flex-col divide-y divide-slate-100/60">
          {TOP_SERVICES_DATA.map((item) => {
            const barWidth = Math.max(
              Math.round((item.percentage / maxServicePct) * 44),
              7
            );

            return (
              <div
                key={item.name}
                title={`${item.bookings} bookings • Rs. ${item.revenue.toLocaleString()}`}
                className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-white/70 px-1 rounded-lg cursor-default"
              >
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700 group-hover:text-slate-900">
                  {item.name}
                </span>

                <div className="flex w-16 sm:w-20 items-center justify-start shrink-0">
                  <span
                    className="h-2 rounded-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${barWidth}px` }}
                  />
                </div>

                <span className="w-12 text-right text-xs font-semibold text-slate-700 shrink-0">
                  {item.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Payment Types Card (Original Recharts Donut / Pie Chart) */}
      <div className="flex flex-col justify-between rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs transition hover:border-sky-200">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-100/70 text-indigo-700">
                <CreditCard className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-800">
                  Payment Types
                </h3>
              </div>
            </div>

            <TimeFilterSelect
              value={paymentFilter}
              onChange={(val) => setPaymentFilter(val as ChartTimeFilter)}
              options={CHART_TIME_FILTER_OPTIONS}
              ariaLabel="Filter Payment Types time period"
            />
          </div>

          <p className="mt-2 text-xs font-medium text-slate-500">
            Total Revenue:{" "}
            <span className="font-semibold text-slate-800">
              Rs. {totalPaymentAmount.toLocaleString()}
            </span>
          </p>

          {/* Donut Chart */}
          <div className="mt-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_TYPES_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  {PAYMENT_TYPES_DATA.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PaymentPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
          {PAYMENT_TYPES_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-slate-600">
                  {item.name}
                </p>
                <p className="text-[10px] font-semibold text-slate-900">
                  {item.percentage}% ({item.count})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BreakdownChartsSection;
