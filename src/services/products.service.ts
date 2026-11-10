import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Product,
  ProductStats,
  ProductFormData,
  StockInPayload,
  StockAdjustmentPayload,
  StockSalePayload,
  StockMovement,
} from "../interface/product.types";
import type { CategoryItem, CategoryFormData } from "../interface/category.types";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  stock_status?: string;
  status?: string;
  sort_by?: string;
  page?: number;
  pageSize?: number;
}

export const productsService = {
  async getProducts(params?: ProductQueryParams): Promise<{ items: Product[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getStats(): Promise<ProductStats> {
    const res = await apiClient.get<ProductStats>(API_ENDPOINTS.PRODUCTS.STATS);
    return res.data;
  },

  async getCategories(): Promise<CategoryItem[]> {
    const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
    return Array.isArray(res.data) ? res.data : [];
  },

  async createCategory(payload: CategoryFormData): Promise<CategoryItem> {
    const res = await apiClient.post<CategoryItem>(API_ENDPOINTS.PRODUCTS.CATEGORIES, payload);
    return res.data;
  },

  async updateCategory(id: string, payload: Partial<CategoryFormData>): Promise<CategoryItem> {
    const res = await apiClient.put<CategoryItem>(API_ENDPOINTS.PRODUCTS.CATEGORY_BY_ID(id), payload);
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.CATEGORY_BY_ID(id));
  },

  async getBrands(): Promise<string[]> {
    const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.BRANDS);
    return Array.isArray(res.data) ? res.data : [];
  },

  async getProductById(id: string): Promise<Product> {
    const res = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return res.data;
  },

  async createProduct(payload: ProductFormData): Promise<Product> {
    const res = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.BASE, payload);
    return res.data;
  },

  async updateProduct(id: string, payload: Partial<ProductFormData>): Promise<Product> {
    const res = await apiClient.put<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), payload);
    return res.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  async toggleStatus(id: string): Promise<{ id: string; status: string }> {
    const res = await apiClient.patch(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id));
    return res.data;
  },

  async stockIn(id: string, payload: StockInPayload): Promise<Product> {
    const res = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.STOCK_IN(id), payload);
    return res.data;
  },

  async adjustStock(id: string, payload: StockAdjustmentPayload): Promise<Product> {
    const res = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.ADJUSTMENT(id), payload);
    return res.data;
  },

  async recordSale(id: string, payload: StockSalePayload): Promise<Product> {
    const res = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.RECORD_SALE(id), payload);
    return res.data;
  },

  async getMovements(id: string): Promise<StockMovement[]> {
    const res = await apiClient.get<StockMovement[]>(API_ENDPOINTS.PRODUCTS.MOVEMENTS(id));
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default productsService;

