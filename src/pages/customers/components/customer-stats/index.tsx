import { Users, CalendarCheck, DollarSign, TrendingUp } from "lucide-react";
import type { CustomerStats as CustomerStatsType } from "../../../../interface/customer.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type CustomerStatsProps = {
  stats: CustomerStatsType;
};

export function CustomerStats({ stats }: CustomerStatsProps) {
  const cards = [
    {
      label: "Total Registered Clients",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Tracked customer base",
    },
    {
      label: "Total Visits",
      value: stats.totalVisits,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Total salon visits recorded",
    },
    {
      label: "Total Customer Spend",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "All-time customer revenue",
    },
    {
      label: "Avg Spend / Customer",
      value: formatPrice(stats.avgSpendPerCustomer),
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      subtext: "Average client value",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`flex size-9 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="mt-0.5 truncate text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default CustomerStats;
