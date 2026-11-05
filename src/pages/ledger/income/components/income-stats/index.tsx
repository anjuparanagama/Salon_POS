import { Coins, Scissors, Package } from "lucide-react";
import type { IncomeStats as IncomeStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type IncomeStatsProps = {
  stats: IncomeStatsType;
};

export function IncomeStats({ stats }: IncomeStatsProps) {
  const cards = [
    {
      label: "Total Income",
      value: formatPrice(stats.totalIncome, { space: true }),
      icon: Coins,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Combined salon revenue",
    },
    {
      label: "Service Income",
      value: formatPrice(stats.serviceIncome, { space: true }),
      icon: Scissors,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Hair, treatments & styling",
    },
    {
      label: "Product Income",
      value: formatPrice(stats.productIncome, { space: true }),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      subtext: "Retail sales & merchandise",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`flex size-10 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                Sales Sync
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900">
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

export default IncomeStats;
