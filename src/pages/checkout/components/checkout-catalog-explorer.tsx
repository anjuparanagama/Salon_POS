import { ShoppingBag, Sparkles, Search, Plus } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import type { Product } from "../../../interface/product.types";
import type {
  CartProductItem,
  CartServiceItem,
  CatalogTab,
  CatalogServiceItem,
} from "../../../interface/checkout.types";
import { formatPrice } from "../../../helpers/price.helper";

export interface CheckoutCatalogExplorerProps {
  catalogTab: CatalogTab;
  setCatalogTab: (tab: CatalogTab) => void;
  catalogProducts: Product[];
  catalogServices: CatalogServiceItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  productCategories: string[];
  filteredProducts: Product[];
  filteredServices: CatalogServiceItem[];
  cartProducts: CartProductItem[];
  additionalServices: CartServiceItem[];
  handleAddProductToCart: (prod: Product) => void;
  handleAddServiceToCart: (svc: { id: string; name: string; price: number; duration: number }) => void;
}

export function CheckoutCatalogExplorer({
  catalogTab,
  setCatalogTab,
  catalogProducts,
  catalogServices,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  productCategories,
  filteredProducts,
  filteredServices,
  cartProducts,
  additionalServices,
  handleAddProductToCart,
  handleAddServiceToCart,
}: CheckoutCatalogExplorerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <Button
            type="button"
            onClick={() => {
              setCatalogTab("products");
              setSelectedCategory("all");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              catalogTab === "products"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="size-3.5" />
            <span>Retail Products ({catalogProducts.length})</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              setCatalogTab("services");
              setSelectedCategory("all");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              catalogTab === "services"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>Extra Services ({catalogServices.length})</span>
          </Button>
        </div>

        {/* Search Bar */}
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            catalogTab === "products" ? "Search products or SKU..." : "Search services..."
          }
          leftElement={<Search className="size-3.5 text-slate-400" />}
          className="rounded-xl border-slate-200 bg-slate-50/50 py-1.5 text-xs font-medium text-slate-900 focus:border-primary focus:bg-white"
          wrapperClassName="flex-1 sm:max-w-xs"
        />
      </div>

      {/* Category Pills (for products) */}
      {catalogTab === "products" && productCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <Button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 font-semibold text-[11px] transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </Button>
          {productCategories.map((cat) => (
            <Button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 font-semibold text-[11px] whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="max-h-72 overflow-y-auto pr-1">
        {catalogTab === "products" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredProducts.map((p) => {
              const inCart = cartProducts.find((item) => item.id === p.id);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">
                      SKU: {p.sku} •{" "}
                      <span className={p.stock > 5 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {p.stock} in stock
                      </span>
                    </p>
                    <p className="text-xs font-mono font-bold text-primary mt-0.5">
                      {formatPrice(p.sellingPrice)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAddProductToCart(p)}
                    disabled={p.stock <= 0}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      inCart
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30"
                    }`}
                  >
                    <Plus className="size-3" />
                    <span>{inCart ? `x${inCart.quantity}` : "Add"}</span>
                  </Button>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <p className="col-span-2 text-center text-xs text-slate-400 py-6 italic">
                No retail products found matching "{searchQuery}".
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredServices.map((s) => {
              const inCart = additionalServices.find((item) => item.id === s.id);
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-400">{s.duration} mins</p>
                    <p className="text-xs font-mono font-bold text-primary mt-0.5">
                      {formatPrice(s.price)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAddServiceToCart(s)}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      inCart
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <Plus className="size-3" />
                    <span>{inCart ? `x${inCart.quantity}` : "Add"}</span>
                  </Button>
                </div>
              );
            })}
            {filteredServices.length === 0 && (
              <p className="col-span-2 text-center text-xs text-slate-400 py-6 italic">
                No services found matching "{searchQuery}".
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutCatalogExplorer;
