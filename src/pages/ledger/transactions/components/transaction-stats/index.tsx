import { ArrowLeftRight, ArrowDownLeft, RotateCcw } from "lucide-react";
import { StatCard } from "../../../../../components/stat-card";
import type { TransactionStats as TransactionStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type TransactionStatsProps = {
  stats: TransactionStatsType;
};

export function TransactionStats({ stats }: TransactionStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Transactions"
        value={Number(stats.totalTransactions || 0).toLocaleString()}
        icon={ArrowLeftRight}
        color="primary"
      />
      <StatCard
        label="Total Received"
        value={formatPrice(stats.totalReceived, { space: true })}
        icon={ArrowDownLeft}
        color="emerald"
      />
      <StatCard
        label="Total Refunded"
        value={formatPrice(stats.totalRefunded, { space: true })}
        icon={RotateCcw}
        color="rose"
      />
    </div>
  );
}

export default TransactionStats;
