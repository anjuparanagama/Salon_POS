import { Package, Edit3 } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type {
  Product,
  StockMovement,
} from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ProductViewPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories?: Array<{ label: string; value: string }>;
  onEdit: (product: Product) => void;
  onStockIn?: (product: Product) => void;
  onStockAdjustment?: (product: Product) => void;
  onRecordSale?: (product: Product) => void;
};

export function ProductViewPanel({
  isOpen,
  onClose,
  product,
  categories,
  onEdit,
}: ProductViewPanelProps) {
  if (!product) return null;

  const categoryLabel =
    categories?.find((c) => c.value === product.category)?.label ||
    product.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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
      size="xl"
      footer={footer}
    >
      <div className="py-2 text-xs flex flex-col gap-4">
        {/* Top Product Header (Clean, no card design) */}
        <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
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
              <Package className="size-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {product.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0 border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
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
            <p className="text-[11px] text-slate-500 mt-0.5">
              SKU:{" "}
              <span className="font-mono text-slate-700 font-semibold">
                {product.sku}
              </span>
            </p>
          </div>
        </div>

        {/* Professional Bullet Points List */}
        <ul className="divide-y divide-slate-100">
          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Status:
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                isActive
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Selling Price:
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {formatPrice(product.sellingPrice)}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Cost Price:
            </span>
            <span className="font-medium text-slate-800">
              {formatPrice(product.costPrice)}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Unit Profit:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-600">
                +{formatPrice(profit)}
              </span>
              <span className="rounded bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {marginPercent}% margin
              </span>
            </div>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Current Stock:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {product.stock} units
              </span>
              {isOutOfStock ? (
                <span className="inline-flex items-center rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                  Out of stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  Low stock
                </span>
              ) : (
                <span className="inline-flex items-center rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  In stock
                </span>
              )}
            </div>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Min Alert Level:
            </span>
            <span className="font-medium text-slate-800">
              {product.lowStockLevel} units
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Total Sold:
            </span>
            <span className="font-medium text-slate-800">
              {product.totalSold || 0} units
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Category:
            </span>
            <span className="font-medium text-slate-800">
              {categoryLabel}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Brand:
            </span>
            <span className="font-medium text-slate-800">
              {product.brand || "—"}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Supplier:
            </span>
            <span className="font-medium text-slate-800">
              {product.supplier || "Standard Supply"}
            </span>
          </li>

          {product.description && (
            <li className="flex items-start gap-3 py-2.5">
              <span className="size-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
              <span className="w-36 shrink-0 text-slate-500 font-medium">
                Description:
              </span>
              <span className="font-medium text-slate-700 leading-relaxed flex-1">
                {product.description}
              </span>
            </li>
          )}
        </ul>

        {/* Stock Activity History (Clean & Minimal, no card design) */}
        {product.stockMovements && product.stockMovements.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-800 text-xs">
                Stock Activity History
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                {product.stockMovements.length}{" "}
                {product.stockMovements.length === 1 ? "record" : "records"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-center">Balance</th>
                    <th className="py-2 px-3">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {product.stockMovements.map((m) => {
                    const isPositive = m.quantity > 0;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="py-2 px-3">
                          {getMovementBadge(m.type)}
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold whitespace-nowrap ${
                            isPositive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isPositive ? `+${m.quantity}` : m.quantity}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-700 whitespace-nowrap">
                          <span className="text-slate-400 text-[10px]">
                            {m.previousStock}
                          </span>
                          <span className="mx-1 text-slate-300">→</span>
                          <span className="font-bold">{m.newStock}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-500 max-w-[140px] truncate text-[10px]">
                          {m.reason || m.reference || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  );
}

export default ProductViewPanel;
