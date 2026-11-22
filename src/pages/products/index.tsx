import { useState, useMemo } from "react";
import {
  Plus,
  Share2,
} from "lucide-react";
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
import ShareProductsModal from "./components/share-products-modal";
import AppointmentCheckoutModal from "../appointments/components/appointment-checkout-modal";
import Header from "../../components/header";
import Tooltip from "../../components/tooltip";
import Pagination from "../../components/pagination";
import { Button } from "../../components/button";

const defaultCategories = [
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
    categories: apiCategories,
    createProduct,
    updateProduct,
    toggleStatus,
    stockIn,
    adjustStock,
    recordSale,
    isLoading,
  } = useProducts();

  const categories = useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) return defaultCategories;
    const hasAll = apiCategories.some((c) => c.value === "all");
    const list = hasAll
      ? [...apiCategories]
      : [{ label: "All Items", value: "all" }, ...apiCategories];
    return list;
  }, [apiCategories]);

  // Right Slider Drawers State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Stock Modal State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(
    null,
  );
  const [stockModalMode, setStockModalMode] =
    useState<StockModalMode>("stock_in");
  const [isPosCheckoutOpen, setIsPosCheckoutOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ProductFilterState>({
    search: "",
    searchField: "name",
    category: "all",
    brand: "all",
    stockStatus: "all",
    status: "all",
    sortBy: "name",
  });

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      product: true,
      sku: true,
      category: true,
      description: true,
      price: true,
      stock: true,
      status: true,
      actions: true,
    },
  );

  const handleFilterChange = (updated: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey] === false ? true : false,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      searchField: "name",
      category: "all",
      brand: "all",
      stockStatus: "all",
      status: "all",
      sortBy: "name",
    });
    setCurrentPage(1);
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
        p
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : null,
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
    payload: StockAdjustmentPayload,
  ) => {
    const updated = await adjustStock(productId, payload);
    if (viewingProduct?.id === productId && updated) {
      setViewingProduct(updated);
    }
    setIsStockModalOpen(false);
  };

  // Record Sale Handler (Automatically decreases stock)
  const handleRecordSale = async (
    productId: string,
    payload: StockSalePayload,
  ) => {
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
    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= p.lowStockLevel,
    ).length;
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
        // Search filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const searchField = filters.searchField || "name";

          if (searchField === "name") {
            if (!p.name.toLowerCase().includes(query)) return false;
          } else if (searchField === "sku") {
            if (!p.sku.toLowerCase().includes(query)) return false;
          } else if (searchField === "brand") {
            if (!p.brand?.toLowerCase().includes(query)) return false;
          } else if (searchField === "category") {
            if (!p.category.toLowerCase().includes(query)) return false;
          } else {
            const matchesName = p.name.toLowerCase().includes(query);
            const matchesSku = p.sku.toLowerCase().includes(query);
            const matchesBrand =
              p.brand?.toLowerCase().includes(query) ?? false;
            const matchesCategory = p.category.toLowerCase().includes(query);
            const matchesDesc =
              p.description?.toLowerCase().includes(query) ?? false;
            if (
              !matchesName &&
              !matchesSku &&
              !matchesBrand &&
              !matchesCategory &&
              !matchesDesc
            )
              return false;
          }
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
          if (
            filters.stockStatus === "in_stock" &&
            (p.stock <= 0 || p.stock <= p.lowStockLevel)
          ) {
            return false;
          }
          if (
            filters.stockStatus === "low_stock" &&
            (p.stock <= 0 || p.stock > p.lowStockLevel)
          ) {
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
        if (filters.sortBy === "price_asc")
          return a.sellingPrice - b.sellingPrice;
        if (filters.sortBy === "price_desc")
          return b.sellingPrice - a.sellingPrice;
        if (filters.sortBy === "stock_asc") return a.stock - b.stock;
        if (filters.sortBy === "stock_desc") return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, filters]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    if (filteredProducts.length === 0) return;
    const headers = [
      "Product Name",
      "SKU",
      "Brand",
      "Category",
      "Description",
      "Selling Price",
      "Cost Price",
      "Stock",
      "Status",
    ];
    const rows = filteredProducts.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${(p.brand || "").replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${(p.description || "").replace(/"/g, '""')}"`,
      p.sellingPrice,
      p.costPrice,
      p.stock,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `products_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* 1. Top Header */}
      <Header
        title="Products"
        description="Manage your salon products and stock."
        isLoading={isLoading}
        titleSuffix={
          <Tooltip content="Share Product Catalog" placement="right">
            <Button
              type="button"
              aria-label="Share Product Catalog"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex size-6 sm:size-7 items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <Share2
                aria-hidden="true"
                className="size-3.5 sm:size-4"
                strokeWidth={2}
              />
            </Button>
          </Tooltip>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Product</span>
            </Button>
          </div>
        }
      />

      {/* 2. Summary Cards */}
      <ProductStats stats={stats} isLoading={isLoading} />

      {/* 3. Search & Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        categories={categories}
        brands={brands}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* 4. Products Table */}
      <ProductList
        products={paginatedProducts}
        categories={categories}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onQuickStockIn={handleOpenStockIn}
        onQuickAdjust={handleOpenStockAdjust}
        onToggleStatus={handleToggleStatus}
        visibleColumns={visibleColumns}
      />

      {/* Pagination Footer */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredProducts.length / pageSize))}
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="products"
          className="mt-1"
        />
      )}

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
        categories={categories}
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

      {/* 8. Share Products Modal */}
      <ShareProductsModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* 9. Direct POS Sale Modal */}
      <AppointmentCheckoutModal
        isOpen={isPosCheckoutOpen}
        onClose={() => setIsPosCheckoutOpen(false)}
        appointment={null}
      />
    </div>
  );
}

export default Products;
