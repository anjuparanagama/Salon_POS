import React from "react";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import type { Product } from "../../../../../interface/product.types";
import type { SelectedProductItem } from "../../../../../interface/appointment-checkout.types";
import { formatPrice } from "../../../../../helpers/price.helper";
import { Button } from "../../../../../components/button";

interface AppointmentCheckoutProductsCardProps {
  catalogProducts: Product[];
  isLoadingCatalog: boolean;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedProducts: SelectedProductItem[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProductItem[]>>;
  onAddProduct: () => void;
  onError: (msg: string) => void;
}

export function AppointmentCheckoutProductsCard({
  catalogProducts,
  isLoadingCatalog,
  selectedProductId,
  setSelectedProductId,
  selectedProducts,
  setSelectedProducts,
  onAddProduct,
  onError,
}: AppointmentCheckoutProductsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2">
        <ShoppingBag className="size-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Retail Products (Inventory)
        </span>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={isLoadingCatalog}
          className="flex-1 min-w-0 w-full truncate rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
        >
          <option value="">
            {isLoadingCatalog ? "Loading products..." : "-- Choose retail product to sell --"}
          </option>
          {catalogProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) - {formatPrice(p.sellingPrice)} [Stock: {p.stock}]
            </option>
          ))}
        </select>
        <Button
          type="button"
          onClick={onAddProduct}
          disabled={!selectedProductId || isLoadingCatalog}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </Button>
      </div>

      {/* Selected products list */}
      {selectedProducts.length > 0 && (
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 p-2">
          {selectedProducts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 px-1 text-xs">
              <div className="flex-1 pr-2 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-500">
                  SKU: {item.sku} • {formatPrice(item.price)} each •{" "}
                  <span className="text-emerald-600 font-medium">In stock: {item.stock}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border border-slate-200 rounded-md bg-white">
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedProducts((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
                        )
                      );
                    }}
                    className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                  >
                    -
                  </Button>
                  <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                  <Button
                    type="button"
                    onClick={() => {
                      if (item.quantity >= item.stock) {
                        onError(`Maximum stock available for ${item.name} is ${item.stock}.`);
                        return;
                      }
                      setSelectedProducts((prev) =>
                        prev.map((p, i) => (i === idx ? { ...p, quantity: p.quantity + 1 } : p))
                      );
                    }}
                    className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                  >
                    +
                  </Button>
                </div>
                <span className="w-16 text-right font-bold text-slate-900 font-mono">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <Button
                  type="button"
                  onClick={() => setSelectedProducts((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-600 transition p-1"
                  title="Remove product"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
