import { Layers, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { ServiceStats as ServiceStatsType } from "../../../../interface/service.types";

export type ServiceStatsProps = {
  stats: ServiceStatsType;
};

export function ServiceStats({ stats }: ServiceStatsProps) {
  const cards = [
    {
      label: "Total Services",
      value: stats.totalServices,
      icon: Layers,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "All catalog treatments",
    },
    {
      label: "Categories",
      value: stats.categoriesCount,
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50",
      subtext: "Service classifications",
    },
    {
      label: "Active Services",
      value: stats.activeServices,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Available for booking",
    },
    {
      label: "Inactive Services",
      value: stats.inactiveServices,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Hidden from catalog",
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

export default ServiceStats;
