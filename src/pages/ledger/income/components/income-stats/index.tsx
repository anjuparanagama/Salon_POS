import { Coins, Scissors, Package } from "lucide-react";
import { StatCard } from "../../../../../components/stat-card";
import type { IncomeStats as IncomeStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type IncomeStatsProps = {
  stats: IncomeStatsType;
};

export function IncomeStats({ stats }: IncomeStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Income"
        value={formatPrice(stats.totalIncome, { space: true })}
        icon={Coins}
        color="emerald"
      />
      <StatCard
        label="Service Income"
        value={formatPrice(stats.serviceIncome, { space: true })}
        icon={Scissors}
        color="primary"
      />
      <StatCard
        label="Product Income"
        value={formatPrice(stats.productIncome, { space: true })}
        icon={Package}
        color="purple"
      />
    </div>
  );
}

export default IncomeStats;
