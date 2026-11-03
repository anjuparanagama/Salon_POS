export type ProductCategory =
  | "all"
  | "hair_care"
  | "skin_care"
  | "styling"
  | "color"
  | "equipment";

export type ProductStockStatus = "all" | "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: "hair_care" | "skin_care" | "styling" | "color" | "equipment";
  brand: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
};

export type ProductStats = {
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
};

export type ProductFilterState = {
  search: string;
  category: ProductCategory;
  stockStatus: ProductStockStatus;
  sortBy: "name" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc";
};

export type ProductFormData = {
  name: string;
  sku: string;
  category: "hair_care" | "skin_care" | "styling" | "color" | "equipment";
  brand: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
};

