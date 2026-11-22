import { ArrowLeftRight, ArrowDownLeft, RotateCcw } from "lucide-react";
import { StatCard } from "../../../../../components/stat-card";
import { StatCardsGridSkeleton } from "../../../../../components/skeleton";
import type { TransactionStats as TransactionStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type TransactionStatsProps = {
  stats: TransactionStatsType;
  isLoading?: boolean;
};

export function TransactionStats({ stats, isLoading = false }: TransactionStatsProps) {
  if (isLoading) {
    return <StatCardsGridSkeleton count={3} className="sm:grid-cols-3 lg:grid-cols-3" />;
  }

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
