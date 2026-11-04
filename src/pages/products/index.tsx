import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import type {
  Product,
  ProductFilterState,
  ProductFormData,
} from "../../interface/product.types";

import ProductStats from "./components/product-stats";
import ProductFilters from "./components/product-filters";
import ProductList from "./components/product-list";
import ProductModal from "./components/product-modal";
import Header from "../../components/header";

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Moroccan Argan Repair Shampoo (500ml)",
    sku: "SHP-ARG-01",
    category: "hair_care",
    brand: "Moroccanoil",
    stock: 24,
    minStock: 6,
    costPrice: 18.0,
    sellingPrice: 34.0,
    supplier: "Global Beauty Hub",
    status: "in_stock",
  },
  {
    id: "prod-2",
    name: "Olaplex No. 3 Hair Perfector Treatment",
    sku: "TRT-OLA-03",
    category: "hair_care",
    brand: "Olaplex",
    stock: 4,
    minStock: 8,
    costPrice: 20.0,
    sellingPrice: 38.0,
    supplier: "Cosmo Brands Direct",
    status: "low_stock",
  },
  {
    id: "prod-3",
    name: "Hydrating Hyaluronic Acid Serum (30ml)",
    sku: "SKN-HYA-02",
    category: "skin_care",
    brand: "SkinCeuticals",
    stock: 12,
    minStock: 5,
    costPrice: 28.0,
    sellingPrice: 55.0,
    supplier: "DermPro Distributors",
    status: "in_stock",
  },
  {
    id: "prod-4",
    name: "Pro Titanium Ionic Flat Iron 1.25\"",
    sku: "EQP-IRO-09",
    category: "equipment",
    brand: "BaBylissPRO",
    stock: 0,
    minStock: 3,
    costPrice: 75.0,
    sellingPrice: 145.0,
    supplier: "Salon Tech Logistics",
    status: "out_of_stock",
  },
  {
    id: "prod-5",
    name: "Pure Platinum Blonde Bleaching Powder",
    sku: "CLR-BLN-11",
    category: "color",
    brand: "Wella Professionals",
    stock: 16,
    minStock: 5,
    costPrice: 22.0,
    sellingPrice: 42.0,
    supplier: "Wella Direct North",
    status: "in_stock",
  },
  {
    id: "prod-6",
    name: "Matte Finish Styling Clay Pomade (100g)",
    sku: "STY-CLY-04",
    category: "styling",
    brand: "Baxter of California",
    stock: 3,
    minStock: 6,
    costPrice: 12.0,
    sellingPrice: 24.0,
    supplier: "Men's Grooming Wholesale",
    status: "low_stock",
  },
];

export function Products() {
  const { t } = useTranslation(["products", "common"]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<ProductFilterState>({
    search: "",
    category: "all",
    stockStatus: "all",
    sortBy: "name",
  });

  const handleFilterChange = (updated: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleQuickRestock = (productId: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newStock = item.stock + 5;
          const status = newStock > item.minStock ? "in_stock" : newStock > 0 ? "low_stock" : "out_of_stock";
          return { ...item, stock: newStock, status };
        }
        return item;
      })
    );
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (data: ProductFormData) => {
    const status = data.stock <= 0 ? "out_of_stock" : data.stock <= data.minStock ? "low_stock" : "in_stock";

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...data, status }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...data,
        status,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Dynamic calculations
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.stock > p.minStock).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const totalValue = products.reduce((acc, p) => acc + p.stock * p.sellingPrice, 0);

    return {
      totalProducts: total,
      inStockCount: inStock,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalInventoryValue: totalValue,
    };
  }, [products]);

  // Filtered and sorted
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(query);
          const matchesSku = p.sku.toLowerCase().includes(query);
          const matchesBrand = p.brand.toLowerCase().includes(query);
          if (!matchesName && !matchesSku && !matchesBrand) return false;
        }
        if (filters.category !== "all" && p.category !== filters.category) {
          return false;
        }
        if (filters.stockStatus !== "all") {
          if (filters.stockStatus === "in_stock" && p.stock <= p.minStock) return false;
          if (filters.stockStatus === "low_stock" && (p.stock <= 0 || p.stock > p.minStock)) return false;
          if (filters.stockStatus === "out_of_stock" && p.stock > 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.sellingPrice - b.sellingPrice;
        if (filters.sortBy === "price_desc") return b.sellingPrice - a.sellingPrice;
        if (filters.sortBy === "stock_asc") return a.stock - b.stock;
        if (filters.sortBy === "stock_desc") return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("products:title", "Product Inventory")}
        description={t("products:subtitle", "Track beauty products, retail inventory, and supply levels.")}
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("products:addProduct", "Add Product")}</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <ProductStats stats={stats} />

      {/* Filter and Search controls */}
      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Product List Table */}
      <ProductList
        products={filteredProducts}
        onEdit={handleOpenEdit}
        onQuickRestock={handleQuickRestock}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}

export default Products;

