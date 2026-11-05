import { ArrowLeftRight, ArrowDownLeft, RotateCcw } from "lucide-react";
import type { TransactionStats as TransactionStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type TransactionStatsProps = {
  stats: TransactionStatsType;
};

export function TransactionStats({ stats }: TransactionStatsProps) {
  const cards = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions.toString(),
      icon: ArrowLeftRight,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "All customer payments & refund reversals",
    },
    {
      label: "Total Received",
      value: formatPrice(stats.totalReceived, { space: true }),
      icon: ArrowDownLeft,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Gross funds paid in by clients",
    },
    {
      label: "Total Refunded",
      value: formatPrice(stats.totalRefunded, { space: true }),
      icon: RotateCcw,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Reversals & refund payouts issued",
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
                Settlements
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

export default TransactionStats;
