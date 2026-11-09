import {
  Package,
  DollarSign,
  Boxes,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Edit3,
  History,
  Tag,
  Building2,
} from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type { Product, StockMovement } from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ProductViewPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onStockIn?: (product: Product) => void;
  onStockAdjustment?: (product: Product) => void;
  onRecordSale?: (product: Product) => void;
};

export function ProductViewPanel({
  isOpen,
  onClose,
  product,
  onEdit,
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
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            Stock In
          </span>
        );
      case "stock_out_sale":
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
            Sale
          </span>
        );
      case "damaged":
        return (
          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
            Damaged
          </span>
        );
      case "lost":
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Lost / Expired
          </span>
        );
      case "correction":
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            Correction
          </span>
        );
      default:
        return null;
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-2.5">
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
      title="Product Details"
      description={`SKU: ${product.sku}`}
      size="lg"
      footer={footer}
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Header / Product Banner */}
        <div className="flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
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
              <Package className="size-6 text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {product.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
              <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                {product.sku}
              </span>
              <span>•</span>
              <span className="capitalize">{product.category.replace("_", " ")}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>{product.brand}</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* 2 Key KPI Cards: Inventory & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Stock KPI Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Boxes className="size-3.5 text-primary" />
                Inventory Status
              </span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                  <AlertCircle className="size-3" /> Out of stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  <AlertTriangle className="size-3" /> Low stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3" /> In stock
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {product.stock}
              </span>
              <span className="text-xs text-slate-500">units available</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">Min Alert Level</span>
                <span className="font-semibold text-slate-700">
                  {product.lowStockLevel} units
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Sold</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <TrendingUp className="size-3 text-primary" />
                  {product.totalSold} units
                </span>
              </div>
            </div>
          </div>

          {/* Pricing KPI Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-primary" />
                Pricing & Profit
              </span>
              <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                {marginPercent}% margin
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {formatPrice(product.sellingPrice)}
              </span>
              <span className="text-[10px] text-slate-400">retail price</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">Cost Price</span>
                <span className="font-semibold text-slate-700">
                  {formatPrice(product.costPrice)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Unit Profit</span>
                <span className="font-semibold text-emerald-600">
                  +{formatPrice(profit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications / Info List */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
            <Tag className="size-3.5 text-slate-400" />
            General Information
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block">Category</span>
              <span className="font-medium text-slate-800 capitalize">
                {product.category.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">Brand</span>
              <span className="font-medium text-slate-800">
                {product.brand || "—"}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">Supplier</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Building2 className="size-3 text-slate-400" />
                {product.supplier || "Standard Supply"}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Movement History Table */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5">
              <History className="size-3.5 text-slate-500" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Stock Activity History
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">
              {product.stockMovements?.length || 0} records
            </span>
          </div>

          {!product.stockMovements || product.stockMovements.length === 0 ? (
            <p className="py-4 text-center text-[11px] text-slate-400">
              No stock movements recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-1.5 pr-2">Date</th>
                    <th className="py-1.5 px-2">Type</th>
                    <th className="py-1.5 px-2 text-right">Qty</th>
                    <th className="py-1.5 px-2 text-center">Balance</th>
                    <th className="py-1.5 pl-2">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.stockMovements.map((m) => {
                    const isPositive = m.quantity > 0;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60">
                        <td className="py-2 pr-2 text-slate-600 whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="py-2 px-2">{getMovementBadge(m.type)}</td>
                        <td
                          className={`py-2 px-2 text-right font-semibold whitespace-nowrap ${
                            isPositive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isPositive ? `+${m.quantity}` : m.quantity}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-700 whitespace-nowrap">
                          <span className="text-slate-400 text-[10px]">{m.previousStock}</span>
                          <span className="mx-1 text-slate-300">→</span>
                          <span className="font-bold">{m.newStock}</span>
                        </td>
                        <td className="py-2 pl-2 text-slate-500 max-w-[140px] truncate text-[10px]">
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
