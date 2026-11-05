import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  Product,
  ProductStatus,
  ProductFilterState,
  ProductFormData,
  StockInPayload,
  StockAdjustmentPayload,
  StockSalePayload,
  StockMovement,
} from "../../interface/product.types";

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

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Moroccan Argan Repair Shampoo (500ml)",
    sku: "SHP-ARG-01",
    category: "shampoo",
    brand: "Moroccanoil",
    description: "Deep cleansing argan oil-infused restorative shampoo for damaged salon hair.",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=60",
    stock: 24,
    lowStockLevel: 6,
    costPrice: 3500,
    sellingPrice: 5500,
    status: "active",
    totalSold: 42,
    supplier: "Global Beauty Hub",
    createdAt: "2026-10-01",
    stockMovements: [
      {
        id: "mov-1-1",
        productId: "prod-1",
        type: "stock_in",
        quantity: 30,
        previousStock: 0,
        newStock: 30,
        reason: "Initial batch shipment",
        reference: "PO-9021",
        date: "2026-10-01 10:00",
      },
      {
        id: "mov-1-2",
        productId: "prod-1",
        type: "stock_out_sale",
        quantity: -4,
        previousStock: 30,
        newStock: 26,
        reason: "Retail sale to VIP clients",
        date: "2026-10-15 14:30",
      },
      {
        id: "mov-1-3",
        productId: "prod-1",
        type: "damaged",
        quantity: -2,
        previousStock: 26,
        newStock: 24,
        reason: "Cap seal leaked in storage box",
        date: "2026-10-25 11:20",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Olaplex No. 3 Hair Perfector Treatment (100ml)",
    sku: "TRT-OLA-03",
    category: "treatment",
    brand: "Olaplex",
    description: "At-home bond building treatment to reduce hair breakage and strengthen bonds.",
    imageUrl: "https://images.unsplash.com/photo-1608248597359-216e453fa844?w=300&auto=format&fit=crop&q=60",
    stock: 4,
    lowStockLevel: 8,
    costPrice: 7500,
    sellingPrice: 11500,
    status: "active",
    totalSold: 38,
    supplier: "Cosmo Brands Direct",
    createdAt: "2026-10-05",
    stockMovements: [
      {
        id: "mov-2-1",
        productId: "prod-2",
        type: "stock_in",
        quantity: 15,
        previousStock: 0,
        newStock: 15,
        reason: "Shipment restock",
        date: "2026-10-05 09:15",
      },
      {
        id: "mov-2-2",
        productId: "prod-2",
        type: "stock_out_sale",
        quantity: -11,
        previousStock: 15,
        newStock: 4,
        reason: "Salon service bundle retail sales",
        date: "2026-10-28 16:45",
      },
    ],
  },
  {
    id: "prod-3",
    name: "Hydrating Hyaluronic Acid Serum (30ml)",
    sku: "SKN-HYA-02",
    category: "skin_care",
    brand: "SkinCeuticals",
    description: "Intense moisture boosting serum suitable for facial care & aftercare.",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=60",
    stock: 12,
    lowStockLevel: 5,
    costPrice: 4200,
    sellingPrice: 6800,
    status: "active",
    totalSold: 25,
    supplier: "DermPro Distributors",
    createdAt: "2026-10-08",
    stockMovements: [
      {
        id: "mov-3-1",
        productId: "prod-3",
        type: "stock_in",
        quantity: 20,
        previousStock: 0,
        newStock: 20,
        reason: "Quarterly skincare stock",
        date: "2026-10-08 11:30",
      },
      {
        id: "mov-3-2",
        productId: "prod-3",
        type: "stock_out_sale",
        quantity: -8,
        previousStock: 20,
        newStock: 12,
        reason: "Client retail purchases",
        date: "2026-10-22 17:00",
      },
    ],
  },
  {
    id: "prod-4",
    name: "Pro Titanium Ionic Flat Iron 1.25\"",
    sku: "EQP-IRO-09",
    category: "equipment",
    brand: "BaBylissPRO",
    description: "Heavy duty salon straightener with ultra-smooth titanium plates.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=60",
    stock: 0,
    lowStockLevel: 3,
    costPrice: 18000,
    sellingPrice: 26000,
    status: "active",
    totalSold: 8,
    supplier: "Salon Tech Logistics",
    createdAt: "2026-09-15",
    stockMovements: [
      {
        id: "mov-4-1",
        productId: "prod-4",
        type: "stock_in",
        quantity: 5,
        previousStock: 0,
        newStock: 5,
        reason: "Initial equipment order",
        date: "2026-09-15 10:00",
      },
      {
        id: "mov-4-2",
        productId: "prod-4",
        type: "stock_out_sale",
        quantity: -5,
        previousStock: 5,
        newStock: 0,
        reason: "Sold out to clients",
        date: "2026-10-30 18:20",
      },
    ],
  },
  {
    id: "prod-5",
    name: "Pure Platinum Blonde Bleaching Powder (500g)",
    sku: "CLR-BLN-11",
    category: "color",
    brand: "Wella Professionals",
    description: "Dust-free lifting powder achieving up to 7 levels of light blonde.",
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&auto=format&fit=crop&q=60",
    stock: 16,
    lowStockLevel: 5,
    costPrice: 3200,
    sellingPrice: 5100,
    status: "active",
    totalSold: 37,
    supplier: "Wella Direct North",
    createdAt: "2026-10-10",
    stockMovements: [
      {
        id: "mov-5-1",
        productId: "prod-5",
        type: "stock_in",
        quantity: 25,
        previousStock: 0,
        newStock: 25,
        reason: "Hair coloring supplies order",
        date: "2026-10-10 13:00",
      },
      {
        id: "mov-5-2",
        productId: "prod-5",
        type: "stock_out_sale",
        quantity: -9,
        previousStock: 25,
        newStock: 16,
        reason: "In-salon dyeing services usage",
        date: "2026-10-27 15:40",
      },
    ],
  },
  {
    id: "prod-6",
    name: "Matte Finish Styling Clay Pomade (100g)",
    sku: "STY-CLY-04",
    category: "styling",
    brand: "Baxter of California",
    description: "Firm hold matte pomade with natural bentonite clay.",
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f55b9a4c5a6?w=300&auto=format&fit=crop&q=60",
    stock: 2,
    lowStockLevel: 6,
    costPrice: 2100,
    sellingPrice: 3600,
    status: "active",
    totalSold: 54,
    supplier: "Men's Grooming Wholesale",
    createdAt: "2026-09-20",
    stockMovements: [
      {
        id: "mov-6-1",
        productId: "prod-6",
        type: "stock_in",
        quantity: 20,
        previousStock: 0,
        newStock: 20,
        reason: "Stock replenishment",
        date: "2026-09-20 12:00",
      },
      {
        id: "mov-6-2",
        productId: "prod-6",
        type: "stock_out_sale",
        quantity: -18,
        previousStock: 20,
        newStock: 2,
        reason: "Counter sales",
        date: "2026-10-29 19:10",
      },
    ],
  },
  {
    id: "prod-7",
    name: "Herbal Scalp Detox Treatment Oil (120ml)",
    sku: "TRT-SCX-08",
    category: "treatment",
    brand: "Aveda Salon",
    description: "Clarifying plant-powered scalp treatment oil to nourish roots.",
    imageUrl: "https://images.unsplash.com/photo-1608248597359-216e453fa844?w=300&auto=format&fit=crop&q=60",
    stock: 0,
    lowStockLevel: 4,
    costPrice: 2600,
    sellingPrice: 4500,
    status: "inactive",
    totalSold: 12,
    supplier: "Aveda Lanka Ltd",
    createdAt: "2026-09-01",
    stockMovements: [
      {
        id: "mov-7-1",
        productId: "prod-7",
        type: "stock_in",
        quantity: 10,
        previousStock: 0,
        newStock: 10,
        reason: "Trial shipment",
        date: "2026-09-01 10:30",
      },
      {
        id: "mov-7-2",
        productId: "prod-7",
        type: "stock_out_sale",
        quantity: -10,
        previousStock: 10,
        newStock: 0,
        reason: "Depleted inventory - supplier discontinued",
        date: "2026-10-18 12:00",
      },
    ],
  },
  {
    id: "prod-8",
    name: "Keratin Smooth Daily Conditioner (400ml)",
    sku: "SHP-CND-02",
    category: "hair_care",
    brand: "Tresemme Pro",
    description: "Daily frizz control conditioner for silky smooth hair texture.",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=60",
    stock: 18,
    lowStockLevel: 5,
    costPrice: 2800,
    sellingPrice: 4200,
    status: "active",
    totalSold: 30,
    supplier: "Global Beauty Hub",
    createdAt: "2026-10-02",
    stockMovements: [
      {
        id: "mov-8-1",
        productId: "prod-8",
        type: "stock_in",
        quantity: 25,
        previousStock: 0,
        newStock: 25,
        reason: "Bulk shipment",
        date: "2026-10-02 11:00",
      },
      {
        id: "mov-8-2",
        productId: "prod-8",
        type: "stock_out_sale",
        quantity: -7,
        previousStock: 25,
        newStock: 18,
        reason: "Customer sales",
        date: "2026-10-26 14:15",
      },
    ],
  },
  {
    id: "prod-9",
    name: "Vitamin C Brightening Face Cream (50ml)",
    sku: "SKN-VTC-05",
    category: "skin_care",
    brand: "The Ordinary",
    description: "Radiance boosting facial moisturizer with pure vitamin C.",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=60",
    stock: 22,
    lowStockLevel: 6,
    costPrice: 3800,
    sellingPrice: 5900,
    status: "active",
    totalSold: 28,
    supplier: "DermPro Distributors",
    createdAt: "2026-10-04",
    stockMovements: [
      {
        id: "mov-9-1",
        productId: "prod-9",
        type: "stock_in",
        quantity: 30,
        previousStock: 0,
        newStock: 30,
        reason: "Import restock",
        date: "2026-10-04 15:00",
      },
      {
        id: "mov-9-2",
        productId: "prod-9",
        type: "stock_out_sale",
        quantity: -8,
        previousStock: 30,
        newStock: 22,
        reason: "Facial packages retail",
        date: "2026-10-24 16:30",
      },
    ],
  },
  {
    id: "prod-10",
    name: "Professional Ceramic Hair Dryer 2200W",
    sku: "EQP-DRY-01",
    category: "equipment",
    brand: "Parlux Advance",
    description: "Lightweight, whisper-quiet professional salon blow dryer.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=60",
    stock: 7,
    lowStockLevel: 2,
    costPrice: 14500,
    sellingPrice: 21000,
    status: "active",
    totalSold: 14,
    supplier: "Salon Tech Logistics",
    createdAt: "2026-09-18",
    stockMovements: [
      {
        id: "mov-10-1",
        productId: "prod-10",
        type: "stock_in",
        quantity: 10,
        previousStock: 0,
        newStock: 10,
        reason: "New tool lineup",
        date: "2026-09-18 10:15",
      },
      {
        id: "mov-10-2",
        productId: "prod-10",
        type: "stock_out_sale",
        quantity: -3,
        previousStock: 10,
        newStock: 7,
        reason: "Sold to stylists",
        date: "2026-10-21 11:45",
      },
    ],
  },
];

export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

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
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus: ProductStatus = p.status === "active" ? "inactive" : "active";
          const updated: Product = { ...p, status: nextStatus };
          if (viewingProduct?.id === productId) {
            setViewingProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingProduct.id) {
            const updated: Product = {
              ...p,
              ...formData,
              updatedAt: new Date().toISOString().split("T")[0],
            };
            if (viewingProduct?.id === p.id) {
              setViewingProduct(updated);
            }
            return updated;
          }
          return p;
        })
      );
    } else {
      const now = new Date();
      const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().slice(0, 5)}`;
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        totalSold: 0,
        createdAt: now.toISOString().split("T")[0],
        stockMovements: [
          {
            id: `mov-${Date.now()}`,
            productId: `prod-${Date.now()}`,
            type: "stock_in",
            quantity: formData.stock,
            previousStock: 0,
            newStock: formData.stock,
            reason: "Initial registered inventory",
            date: dateStr,
          },
        ],
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Stock In Handler
  const handleStockIn = (productId: string, payload: StockInPayload) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().slice(0, 5)}`;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = p.stock + payload.quantity;
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId,
            type: "stock_in",
            quantity: payload.quantity,
            previousStock: p.stock,
            newStock,
            reason: payload.note || "Stock In purchase restock",
            reference: payload.supplier || payload.reference,
            date: dateStr,
          };
          const updated: Product = {
            ...p,
            stock: newStock,
            costPrice: payload.costPrice ?? p.costPrice,
            stockMovements: [movement, ...p.stockMovements],
          };
          if (viewingProduct?.id === productId) {
            setViewingProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Stock Adjustment Handler
  const handleStockAdjustment = (productId: string, payload: StockAdjustmentPayload) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().slice(0, 5)}`;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const delta = -Math.abs(payload.quantity);
          const newStock = Math.max(0, p.stock + delta);
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId,
            type: payload.type,
            quantity: delta,
            previousStock: p.stock,
            newStock,
            reason: payload.reason,
            date: dateStr,
          };
          const updated: Product = {
            ...p,
            stock: newStock,
            stockMovements: [movement, ...p.stockMovements],
          };
          if (viewingProduct?.id === productId) {
            setViewingProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Record Sale Handler (Automatically decreases stock)
  const handleRecordSale = (productId: string, payload: StockSalePayload) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toTimeString().slice(0, 5)}`;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const delta = -Math.abs(payload.quantity);
          const newStock = Math.max(0, p.stock + delta);
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId,
            type: "stock_out_sale",
            quantity: delta,
            previousStock: p.stock,
            newStock,
            reason: payload.customer
              ? `Sold to ${payload.customer} (${payload.note || "Retail"})`
              : payload.note || "Customer product retail sale",
            date: dateStr,
          };
          const updated: Product = {
            ...p,
            stock: newStock,
            totalSold: p.totalSold + payload.quantity,
            stockMovements: [movement, ...p.stockMovements],
          };
          if (viewingProduct?.id === productId) {
            setViewingProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
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
