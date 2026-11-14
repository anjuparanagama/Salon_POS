import { Layers, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "../../../../components/stat-card";
import type { ServiceStats as ServiceStatsType } from "../../../../interface/service.types";

export type ServiceStatsProps = {
  stats: ServiceStatsType;
};

export function ServiceStats({ stats }: ServiceStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Services"
        value={Number(stats.totalServices || 0).toLocaleString()}
        icon={Layers}
        color="primary"
      />
      <StatCard
        label="Categories"
        value={Number(stats.categoriesCount || 0).toLocaleString()}
        icon={Sparkles}
        color="purple"
      />
      <StatCard
        label="Active Services"
        value={Number(stats.activeServices || 0).toLocaleString()}
        icon={CheckCircle2}
        color="emerald"
      />
      <StatCard
        label="Inactive Services"
        value={Number(stats.inactiveServices || 0).toLocaleString()}
        icon={XCircle}
        color="rose"
      />
    </div>
  );
}

export default ServiceStats;
