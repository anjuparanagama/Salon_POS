import { Package, CheckCircle2, AlertTriangle, DollarSign } from "lucide-react";
import type { ProductStats as ProductStatsType } from "../../../../interface/product.types";

export type ProductStatsProps = {
  stats: ProductStatsType;
};

export function ProductStats({ stats }: ProductStatsProps) {
  const cards = [
    {
      label: "Total Inventory Items",
      value: stats.totalProducts,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Across all categories",
    },
    {
      label: "In Stock & Ready",
      value: stats.inStockCount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Healthy stock levels",
    },
    {
      label: "Low / Out of Stock",
      value: stats.lowStockCount + stats.outOfStockCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: `${stats.outOfStockCount} zero stock items`,
    },
    {
      label: "Total Inventory Value",
      value: `$${stats.totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-primary-dark",
      bg: "bg-primary-lighter",
      subtext: "Retail inventory worth",
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

export default ProductStats;

