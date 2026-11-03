import { DollarSign, Scissors, Package, Sparkles } from "lucide-react";
import type { IncomeStats as IncomeStatsType } from "../../../../../interface/ledger.types";

export type IncomeStatsProps = {
  stats: IncomeStatsType;
};

export function IncomeStats({ stats }: IncomeStatsProps) {
  const cards = [
    {
      label: "Total Gross Income",
      value: `$${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Combined earnings",
    },
    {
      label: "Service Sales Revenue",
      value: `$${stats.serviceIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Scissors,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Hair, treatments & styling",
    },
    {
      label: "Product Sales Revenue",
      value: `$${stats.productIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      subtext: "Retail inventory sales",
    },
    {
      label: "Today's Intake",
      value: `$${stats.todayIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Sparkles,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Recorded today",
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

export default IncomeStats;

