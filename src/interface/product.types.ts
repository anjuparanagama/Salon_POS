export type ProductCategory =
  | "all"
  | "shampoo"
  | "hair_care"
  | "skin_care"
  | "styling"
  | "color"
  | "treatment"
  | "equipment"
  | "other";

export type ProductStockStatus = "all" | "in_stock" | "low_stock" | "out_of_stock";

export type ProductActiveStatusFilter = "all" | "active" | "inactive";

export type ProductStatus = "active" | "inactive";

export type StockMovementType =
  | "stock_in"
  | "stock_out_sale"
  | "damaged"
  | "lost"
  | "correction";

export type StockMovement = {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number; // positive for additions, negative for reductions
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string; // invoice or order no
  date: string;
  performedBy?: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  description?: string;
  imageUrl?: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  lowStockLevel: number;
  status: ProductStatus;
  totalSold: number;
  supplier?: string;
  stockMovements: StockMovement[];
  createdAt: string;
  updatedAt?: string;
};

export type ProductStats = {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue?: number;
};

export type ProductFilterState = {
  search: string;
  category: string;
  brand: string;
  stockStatus: ProductStockStatus;
  status: ProductActiveStatusFilter;
  sortBy: "name" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc";
};

export type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  brand?: string;
  description?: string;
  imageUrl?: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  lowStockLevel: number;
  status: ProductStatus;
  supplier?: string;
};

export type StockInPayload = {
  quantity: number;
  costPrice?: number;
  supplier?: string;
  note?: string;
  reference?: string;
};

export type StockAdjustmentPayload = {
  type: "damaged" | "lost" | "correction";
  quantity: number; // adjustment delta (positive or negative) or quantity affected
  reason: string;
  note?: string;
};

export type StockSalePayload = {
  quantity: number;
  customer?: string;
  note?: string;
  reference?: string;
};
