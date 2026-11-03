import { Edit3, AlertCircle, CheckCircle, XCircle, Plus } from "lucide-react";
import type { Product } from "../../../../interface/product.types";

export type ProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onQuickRestock: (productId: string) => void;
};

const categoryLabels: Record<Product["category"], string> = {
  hair_care: "Hair Care",
  skin_care: "Skin Care",
  styling: "Styling",
  color: "Color & Bleach",
  equipment: "Equipment",
};

export function ProductList({ products, onEdit, onQuickRestock }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No products found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try clearing your search terms or changing stock/category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Product & SKU</th>
              <th scope="col" className="px-5 py-3.5">Category</th>
              <th scope="col" className="px-5 py-3.5">Stock Level</th>
              <th scope="col" className="px-5 py-3.5">Cost / Retail</th>
              <th scope="col" className="px-5 py-3.5">Supplier</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => {
              const isOut = item.stock <= 0;
              const isLow = !isOut && item.stock <= item.minStock;

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Name & Brand & SKU */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-400">SKU: {item.sku}</span>
                      <span>•</span>
                      <span>{item.brand}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                      {categoryLabels[item.category]}
                    </span>
                  </td>

                  {/* Stock Level */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-bold text-slate-900">{item.stock} units</div>
                    <div className="text-[11px] text-slate-400">Min alert: {item.minStock}</div>
                  </td>

                  {/* Cost & Retail */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900">${item.sellingPrice.toFixed(2)}</div>
                    <div className="text-[11px] text-slate-400">Cost: ${item.costPrice.toFixed(2)}</div>
                  </td>

                  {/* Supplier */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {item.supplier}
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-5 py-4">
                    {isOut ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                        <XCircle className="size-3" />
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                        <AlertCircle className="size-3" />
                        Low Stock ({item.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle className="size-3" />
                        In Stock
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onQuickRestock(item.id)}
                        title="Add +5 Stock Units"
                        className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Plus className="size-3" />
                        <span>Restock</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Edit Details"
                        className="rounded-md p-1.5 text-primary hover:bg-primary-lighter transition cursor-pointer"
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

