import {
  Eye,
  Edit3,
  Package,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { Product } from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ProductListProps = {
  products: Product[];
  categories?: Array<{ label: string; value: string }>;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onQuickStockIn?: (product: Product) => void;
  onQuickAdjust?: (product: Product) => void;
  onToggleStatus?: (productId: string) => void;
  isLoading?: boolean;
};

export function ProductList({
  products,
  categories,
  onView,
  onEdit,
  onQuickStockIn: _onQuickStockIn,
  onQuickAdjust: _onQuickAdjust,
  onToggleStatus,
  isLoading = false,
}: ProductListProps) {
  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="size-8 animate-spin text-primary" />
        <h3 className="mt-3 text-sm font-semibold text-slate-800">Loading products...</h3>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs">
        <div className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-2.5 text-xs font-semibold text-slate-800">No products found</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const matched = categories?.find((c) => c.value === category);
    if (matched) return matched.label;
    switch (category) {
      case "shampoo":
        return "Shampoo";
      case "hair_care":
        return "Hair Care";
      case "skin_care":
        return "Skin Care";
      case "styling":
        return "Styling";
      case "color":
        return "Color & Bleach";
      case "treatment":
        return "Treatment";
      case "equipment":
        return "Equipment";
      default:
        return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="border-b border-slate-100 bg-slate-50/80 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-3.5 py-2.5 min-w-[240px]">
                Product
              </th>
              <th scope="col" className="px-3 py-2.5 min-w-[110px]">
                SKU
              </th>
              <th scope="col" className="px-3 py-2.5 min-w-[120px]">
                Category
              </th>
              <th scope="col" className="px-3 py-2.5 min-w-[180px] max-w-[260px]">
                Description
              </th>
              <th scope="col" className="px-3 py-2.5 text-right min-w-[110px]">
                Selling Price
              </th>
              <th scope="col" className="px-3 py-2.5 text-center min-w-[120px]">
                Stock
              </th>
              <th scope="col" className="px-3 py-2.5 text-center min-w-[100px]">
                Status
              </th>
              {/* Sticky Right Fixed Actions Header */}
              <th
                scope="col"
                className="sticky right-0 z-20 bg-slate-50/95 backdrop-blur-xs px-3.5 py-2.5 text-center min-w-[90px]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {products.map((item) => {
              const isOutOfStock = item.stock <= 0;
              const isLowStock = !isOutOfStock && item.stock <= item.lowStockLevel;
              const isActive = item.status === "active";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition group cursor-pointer"
                  onClick={() => onView(item)}
                >
                  {/* Product: Image + Name (Single compact line) */}
                  <td className="px-3.5 py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Package className="size-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors truncate max-w-[220px]">
                          {item.name}
                        </span>
                        {item.brand && (
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">
                            • {item.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-600">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium">
                      {item.sku}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {getCategoryLabel(item.category)}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="px-3 py-2 text-slate-600 max-w-[260px]" title={item.description || ""}>
                    {item.description && item.description.trim() ? (
                      <span className="truncate block">{item.description.trim()}</span>
                    ) : (
                      <span className="text-slate-400 font-medium">-</span>
                    )}
                  </td>

                  {/* Selling Price */}
                  <td className="px-3 py-2 text-right font-medium text-slate-900">
                    {formatPrice(item.sellingPrice)}
                  </td>

                  {/* Stock */}
                  <td className="px-3 py-2 text-center">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                        <AlertCircle className="size-2.5" />
                        Out of stock (0)
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        <AlertTriangle className="size-2.5" />
                        Low ({item.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {item.stock} in stock
                      </span>
                    )}
                  </td>

                  {/* Status: Active / Inactive */}
                  <td
                    className="px-3 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(item.id)}
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title="Click to toggle status"
                    >
                      <span
                        className={`mr-1 size-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* Sticky Right Fixed Actions: Icons ONLY, no borders */}
                  <td
                    className="sticky right-0 z-10 bg-white group-hover:bg-slate-50/95 transition-colors px-3 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Action - Icon only */}
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="rounded-md p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="size-3.5" />
                      </button>

                      {/* Edit Action - Icon only */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-md p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
