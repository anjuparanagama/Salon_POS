import { Users, CalendarCheck, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "../../../../components/stat-card";
import type { CustomerStats as CustomerStatsType } from "../../../../interface/customer.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type CustomerStatsProps = {
  stats: CustomerStatsType;
};

export function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Registered Clients"
        value={Number(stats.totalCustomers || 0).toLocaleString()}
        icon={Users}
        color="primary"
      />
      <StatCard
        label="Total Visits"
        value={Number(stats.totalVisits || 0).toLocaleString()}
        icon={CalendarCheck}
        color="emerald"
      />
      <StatCard
        label="Total Customer Spend"
        value={formatPrice(stats.totalRevenue)}
        icon={DollarSign}
        color="amber"
      />
      <StatCard
        label="Avg Spend / Customer"
        value={formatPrice(stats.avgSpendPerCustomer)}
        icon={TrendingUp}
        color="indigo"
      />
    </div>
  );
}

export default CustomerStats;
