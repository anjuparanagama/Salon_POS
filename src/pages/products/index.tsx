import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  Product,
  ProductFilterState,
  ProductFormData,
  StockInPayload,
  StockAdjustmentPayload,
  StockSalePayload,
} from "../../interface/product.types";
import { useProducts } from "../../hooks/products";

import ProductStats from "./components/product-stats";
import ProductFilters from "./components/product-filters";
import ProductList from "./components/product-list";
import ProductPanel from "./components/product-panel";
import ProductViewPanel from "./components/product-view-panel";
import StockModal, { type StockModalMode } from "./components/stock-modal";
import Header from "../../components/header";

const categories = [
  { label: "All Items", value: "all" },
  { label: "Shampoo", value: "shampoo" },
  { label: "Hair Care", value: "hair_care" },
  { label: "Skin Care", value: "skin_care" },
  { label: "Styling", value: "styling" },
  { label: "Color & Bleach", value: "color" },
  { label: "Treatment", value: "treatment" },
  { label: "Equipment", value: "equipment" },
];

export function Products() {
  const {
    products,
    createProduct,
    updateProduct,
    toggleStatus,
    stockIn,
    adjustStock,
    recordSale,
  } = useProducts();

  // Right Slider Drawers State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Stock Modal State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockModalMode, setStockModalMode] = useState<StockModalMode>("stock_in");

  // Filters State
  const [filters, setFilters] = useState<ProductFilterState>({
    search: "",
    category: "all",
    brand: "all",
    stockStatus: "all",
    status: "all",
    sortBy: "name",
  });

  const handleFilterChange = (updated: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      brand: "all",
      stockStatus: "all",
      status: "all",
      sortBy: "name",
    });
  };

  // Open Handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (product: Product) => {
    setViewingProduct(product);
    setIsViewOpen(true);
  };

  const handleOpenStockIn = (product: Product) => {
    setStockModalProduct(product);
    setStockModalMode("stock_in");
    setIsStockModalOpen(true);
  };

  const handleOpenStockAdjust = (product: Product) => {
    setStockModalProduct(product);
    setStockModalMode("adjustment");
    setIsStockModalOpen(true);
  };

  const handleOpenRecordSale = (product: Product) => {
    setStockModalProduct(product);
    setStockModalMode("sale");
    setIsStockModalOpen(true);
  };

  // Status Toggle
  const handleToggleStatus = (productId: string) => {
    toggleStatus(productId);
    if (viewingProduct?.id === productId) {
      setViewingProduct((p) =>
        p ? { ...p, status: p.status === "active" ? "inactive" : "active" } : null
      );
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (formData: ProductFormData) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, formData);
      if (viewingProduct?.id === editingProduct.id && updated) {
        setViewingProduct(updated);
      }
    } else {
      await createProduct(formData);
    }
    setIsAddEditOpen(false);
    setEditingProduct(null);
  };

  // Stock In Handler
  const handleStockIn = async (productId: string, payload: StockInPayload) => {
    const updated = await stockIn(productId, payload);
    if (viewingProduct?.id === productId && updated) {
      setViewingProduct(updated);
    }
    setIsStockModalOpen(false);
  };

  // Stock Adjustment Handler
  const handleStockAdjustment = async (
    productId: string,
    payload: StockAdjustmentPayload
  ) => {
    const updated = await adjustStock(productId, payload);
    if (viewingProduct?.id === productId && updated) {
      setViewingProduct(updated);
    }
    setIsStockModalOpen(false);
  };

  // Record Sale Handler (Automatically decreases stock)
  const handleRecordSale = async (productId: string, payload: StockSalePayload) => {
    const updated = await recordSale(productId, payload);
    if (viewingProduct?.id === productId && updated) {
      setViewingProduct(updated);
    }
    setIsStockModalOpen(false);
  };

  // Summary Cards Data
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockLevel).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;

    return {
      totalProducts: total,
      activeProducts: active,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
    };
  }, [products]);

  const brands = useMemo(() => {
    const list = products.map((p) => p.brand).filter(Boolean) as string[];
    return Array.from(new Set(list));
  }, [products]);

  // Filtered and Sorted Products Table Data
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter: Name or SKU
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(query);
          const matchesSku = p.sku.toLowerCase().includes(query);
          const matchesBrand = p.brand?.toLowerCase().includes(query) ?? false;
          if (!matchesName && !matchesSku && !matchesBrand) return false;
        }

        // Category filter
        if (filters.category !== "all" && p.category !== filters.category) {
          return false;
        }

        // Brand filter
        if (filters.brand !== "all" && p.brand !== filters.brand) {
          return false;
        }

        // Stock status filter
        if (filters.stockStatus !== "all") {
          if (filters.stockStatus === "in_stock" && (p.stock <= 0 || p.stock <= p.lowStockLevel)) {
            return false;
          }
          if (filters.stockStatus === "low_stock" && (p.stock <= 0 || p.stock > p.lowStockLevel)) {
            return false;
          }
          if (filters.stockStatus === "out_of_stock" && p.stock > 0) {
            return false;
          }
        }

        // Active / Inactive status filter
        if (filters.status !== "all" && p.status !== filters.status) {
          return false;
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
      {/* 1. Top Header */}
      <Header
        title="Products"
        description="Manage your salon products and stock."
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </button>
        }
      />

      {/* 2. Summary Cards */}
      <ProductStats stats={stats} />

      {/* 3. Search & Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        categories={categories}
        brands={brands}
      />

      {/* 4. Products Table */}
      <ProductList
        products={filteredProducts}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onQuickStockIn={handleOpenStockIn}
        onQuickAdjust={handleOpenStockAdjust}
        onToggleStatus={handleToggleStatus}
      />

      {/* 5. Right Slider Side Panel for Add & Edit Product */}
      <ProductPanel
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* 6. Right Slider Side Panel for Product Details / View */}
      <ProductViewPanel
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
        onEdit={handleOpenEdit}
        onStockIn={handleOpenStockIn}
        onStockAdjustment={handleOpenStockAdjust}
        onRecordSale={handleOpenRecordSale}
      />

      {/* 7. Stock Management Modal (Stock In / Stock Adjustment / Record Sale) */}
      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setStockModalProduct(null);
        }}
        product={stockModalProduct}
        initialMode={stockModalMode}
        onStockIn={handleStockIn}
        onStockAdjustment={handleStockAdjustment}
        onRecordSale={handleRecordSale}
      />
    </div>
  );
}

export default Products;
