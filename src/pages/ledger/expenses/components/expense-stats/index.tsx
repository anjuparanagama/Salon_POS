import { TrendingDown, CalendarDays, Layers3 } from "lucide-react";
import type { ExpenseStats as ExpenseStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type ExpenseStatsProps = {
  stats: ExpenseStatsType;
};

export function ExpenseStats({ stats }: ExpenseStatsProps) {
  const cards = [
    {
      label: "Total Expenses",
      value: formatPrice(stats.totalExpenses, { space: true }),
      icon: TrendingDown,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "All-time recorded outflows",
    },
    {
      label: "This Month",
      value: formatPrice(stats.thisMonth, { space: true }),
      icon: CalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Current month expenses",
    },
    {
      label: "Expense Categories",
      value: `${stats.expenseCategoriesCount} Categories`,
      icon: Layers3,
      color: "text-blue-600",
      bg: "bg-blue-50",
      subtext: "Active expense allocations",
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
                Ledger
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

export default ExpenseStats;
