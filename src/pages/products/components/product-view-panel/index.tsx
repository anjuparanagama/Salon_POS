import {
  Package,
  DollarSign,
  History,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  PlusCircle,
  ShoppingBag,
  Edit3,
} from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type { Product, StockMovement } from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ProductViewPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onStockIn: (product: Product) => void;
  onStockAdjustment: (product: Product) => void;
  onRecordSale: (product: Product) => void;
};

export function ProductViewPanel({
  isOpen,
  onClose,
  product,
  onEdit,
  onStockIn,
  onStockAdjustment,
  onRecordSale,
}: ProductViewPanelProps) {
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockLevel;
  const isActive = product.status === "active";
  const profit = Math.max(0, product.sellingPrice - product.costPrice);
  const marginPercent =
    product.sellingPrice > 0
      ? Math.round((profit / product.sellingPrice) * 100)
      : 0;

  const getMovementBadge = (type: StockMovement["type"]) => {
    switch (type) {
      case "stock_in":
        return (
          <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            Stock In
          </span>
        );
      case "stock_out_sale":
        return (
          <span className="inline-flex items-center rounded bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
            Sale (Stock Out)
          </span>
        );
      case "damaged":
        return (
          <span className="inline-flex items-center rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
            Damaged
          </span>
        );
      case "lost":
        return (
          <span className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Lost / Expired
          </span>
        );
      case "correction":
        return (
          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            Count Correction
          </span>
        );
      default:
        return null;
    }
  };

  const footer = (
    <div className="flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          onEdit(product);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
      >
        <Edit3 className="size-3.5" />
        <span>Edit Product</span>
      </button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={`SKU: ${product.sku}`}
      size="xl"
      footer={footer}
    >
      <div className="flex flex-col gap-5 text-xs">
        {/* Product Hero Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Package className="size-8 text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-slate-200/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-800">
                {product.sku}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 capitalize">
                {product.category.replace("_", " ")}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <h3 className="mt-1.5 text-sm font-bold text-slate-900">
              {product.name}
            </h3>

            {product.brand && (
              <p className="text-[11px] text-slate-500">Brand: {product.brand}</p>
            )}

            {product.description && (
              <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Stock & Quick Action Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Available Stock</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900">{product.stock}</span>
                <span className="text-xs text-slate-500">units</span>

                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                    <AlertCircle className="size-3" />
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    <AlertTriangle className="size-3" />
                    Low Stock (Threshold: {product.lowStockLevel})
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Healthy Level (Min {product.lowStockLevel})
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium">Total Units Sold</span>
              <div className="mt-0.5 flex items-center justify-end gap-1.5 text-primary">
                <TrendingUp className="size-4" />
                <span className="text-2xl font-bold text-slate-900">{product.totalSold}</span>
              </div>
            </div>
          </div>

          {/* Quick Stock Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onStockIn(product)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              <PlusCircle className="size-3.5" />
              <span>Stock In</span>
            </button>

            <button
              type="button"
              onClick={() => onStockAdjustment(product)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
            >
              <AlertTriangle className="size-3.5" />
              <span>Stock Adjustment</span>
            </button>

            <button
              type="button"
              onClick={() => onRecordSale(product)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-semibold transition ${
                isOutOfStock
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-primary/30 bg-primary-lighter/40 text-primary hover:bg-primary-lighter cursor-pointer"
              }`}
            >
              <ShoppingBag className="size-3.5" />
              <span>Record Sale</span>
            </button>
          </div>
        </div>

        {/* Pricing & Financial Breakdown */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <DollarSign className="size-4 text-primary" />
            <h4 className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">
              Pricing & Profit Analysis
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Cost Price</span>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatPrice(product.costPrice)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Selling Price</span>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatPrice(product.sellingPrice)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 uppercase font-semibold">Profit / Unit</span>
              <p className="mt-1 text-sm font-bold text-emerald-700">
                +{formatPrice(profit)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 uppercase font-semibold">Margin</span>
              <p className="mt-1 text-sm font-bold text-emerald-700">
                {marginPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Stock Movement History */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <History className="size-4 text-primary" />
              <h4 className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">
                Stock Movement History
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              {product.stockMovements?.length || 0} entries
            </span>
          </div>

          {(!product.stockMovements || product.stockMovements.length === 0) ? (
            <div className="py-6 text-center text-slate-400">
              <History className="mx-auto size-6 mb-1 opacity-50" />
              <p className="text-xs">No stock movement recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Type</th>
                    <th className="py-2 px-2.5 text-right">Change</th>
                    <th className="py-2 px-2.5 text-center">Balance</th>
                    <th className="py-2 px-2.5">Notes / Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.stockMovements.map((m) => {
                    const isPositive = m.quantity > 0;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-slate-600 whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="py-2 px-2.5">{getMovementBadge(m.type)}</td>
                        <td
                          className={`py-2 px-2.5 text-right font-bold whitespace-nowrap ${
                            isPositive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isPositive ? `+${m.quantity}` : m.quantity}
                        </td>
                        <td className="py-2 px-2.5 text-center font-medium text-slate-700 whitespace-nowrap">
                          <span className="text-slate-400">{m.previousStock}</span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="font-bold text-slate-900">{m.newStock}</span>
                        </td>
                        <td className="py-2 px-2.5 text-slate-600 max-w-[160px] truncate">
                          {m.reason || m.reference || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SidePanel>
  );
}

export default ProductViewPanel;
