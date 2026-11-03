import { ArrowLeftRight, CheckCircle2, RotateCcw, DollarSign } from "lucide-react";
import type { TransactionStats as TransactionStatsType } from "../../../../../interface/ledger.types";

export type TransactionStatsProps = {
  stats: TransactionStatsType;
};

export function TransactionStats({ stats }: TransactionStatsProps) {
  const cards = [
    {
      label: "Total Processing Volume",
      value: `$${stats.totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowLeftRight,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Gross processed flows",
    },
    {
      label: "Successful Payments",
      value: stats.paymentsCount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Client transactions settled",
    },
    {
      label: "Customer Refunds",
      value: stats.refundsCount,
      icon: RotateCcw,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Reversals processed",
    },
    {
      label: "Net Settled Funds",
      value: `$${stats.netCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      subtext: "After subtracting refunds",
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

export default TransactionStats;

