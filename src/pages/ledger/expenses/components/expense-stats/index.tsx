import { DollarSign, Users, ShoppingCart, Building } from "lucide-react";
import type { ExpenseStats as ExpenseStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type ExpenseStatsProps = {
  stats: ExpenseStatsType;
};

export function ExpenseStats({ stats }: ExpenseStatsProps) {
  const cards = [
    {
      label: "Total Operating Expenses",
      value: formatPrice(stats.totalExpenses),
      icon: DollarSign,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Total monthly outflow",
    },
    {
      label: "Staff Salaries & Wages",
      value: formatPrice(stats.salaries),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      subtext: "Stylists, reception & staff",
    },
    {
      label: "Product & Stock Purchases",
      value: formatPrice(stats.productPurchases),
      icon: ShoppingCart,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Wholesale inventory restocks",
    },
    {
      label: "Rent & Utilities",
      value: formatPrice(stats.utilitiesAndRent),
      icon: Building,
      color: "text-purple-600",
      bg: "bg-purple-50",
      subtext: "Premises rent, electricity & water",
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

export default ExpenseStats;

