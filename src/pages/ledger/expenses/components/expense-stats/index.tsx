import { TrendingDown, CalendarDays, Layers3 } from "lucide-react";
import { StatCard } from "../../../../../components/stat-card";
import type { ExpenseStats as ExpenseStatsType } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type ExpenseStatsProps = {
  stats: ExpenseStatsType;
};

export function ExpenseStats({ stats }: ExpenseStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Expenses"
        value={formatPrice(stats.totalExpenses, { space: true })}
        icon={TrendingDown}
        color="rose"
      />
      <StatCard
        label="This Month"
        value={formatPrice(stats.thisMonth, { space: true })}
        icon={CalendarDays}
        color="amber"
      />
      <StatCard
        label="Expense Categories"
        value={`${stats.expenseCategoriesCount} Categories`}
        icon={Layers3}
        color="blue"
      />
    </div>
  );
}

export default ExpenseStats;
