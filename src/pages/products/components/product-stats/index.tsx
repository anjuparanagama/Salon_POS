import { Package, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { StatCard } from "../../../../components/stat-card";
import { StatCardsGridSkeleton } from "../../../../components/skeleton";
import type { ProductStats as ProductStatsType } from "../../../../interface/product.types";

export type ProductStatsProps = {
  stats: ProductStatsType;
  isLoading?: boolean;
};

export function ProductStats({ stats, isLoading = false }: ProductStatsProps) {
  if (isLoading) {
    return <StatCardsGridSkeleton count={4} />;
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Products"
        value={Number(stats.totalProducts || 0).toLocaleString()}
        icon={Package}
        color="primary"
      />
      <StatCard
        label="Active Products"
        value={Number(stats.activeProducts || 0).toLocaleString()}
        icon={CheckCircle2}
        color="emerald"
      />
      <StatCard
        label="Low Stock"
        value={Number(stats.lowStockCount || 0).toLocaleString()}
        icon={AlertTriangle}
        color="amber"
      />
      <StatCard
        label="Out of Stock"
        value={Number(stats.outOfStockCount || 0).toLocaleString()}
        icon={AlertOctagon}
        color="rose"
      />
    </div>
  );
}

export default ProductStats;
