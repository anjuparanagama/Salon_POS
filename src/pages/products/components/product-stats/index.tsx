import { Package, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import type { ProductStats as ProductStatsType } from "../../../../interface/product.types";

export type ProductStatsProps = {
  stats: ProductStatsType;
};

export function ProductStats({ stats }: ProductStatsProps) {
  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "All salon items",
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Available for sale",
    },
    {
      label: "Low Stock",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Needs reordering soon",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStockCount,
      icon: AlertOctagon,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Zero quantity available",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <div
                className={`flex size-9 items-center justify-center rounded-lg ${card.bg} ${card.color}`}
              >
                <Icon className="size-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
              <p className="mt-1 text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductStats;
