import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  ServiceItem,
  ServiceStats,
  ServiceFormData,
} from "../interface/service.types";
import type { CategoryFormData, CategoryItem } from "../interface/category.types";

export interface ServiceQueryParams {
  search?: string;
  category?: string;
  sortBy?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export const servicesService = {
  async getServices(params?: ServiceQueryParams): Promise<{ items: ServiceItem[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.SERVICES.BASE, { params });
    // Handle both { items: [...], total } and direct array
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getServicesList(): Promise<Array<{ id: string; name: string; price: number; duration: number; isActive: boolean }>> {
    const res = await apiClient.get(API_ENDPOINTS.SERVICES.BASE, { params: { page_size: 100 } });
    const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
    return items.map((s: Record<string, unknown>) => {
      const active = s.isActive ?? s.is_active ?? s.active;
      return {
        id: String(s.id),
        name: String(s.name),
        price: Number(s.price || 0),
        duration: Number(s.durationMinutes || s.duration_minutes || s.duration || 45),
        isActive: active === undefined ? true : Boolean(active),
      };
    });
  },

  async getStats(): Promise<ServiceStats> {
    const res = await apiClient.get<ServiceStats>(API_ENDPOINTS.SERVICES.STATS);
    return res.data;
  },

  async getCategories(): Promise<CategoryItem[]> {
    const res = await apiClient.get(API_ENDPOINTS.SERVICES.CATEGORIES);
    return Array.isArray(res.data) ? res.data : [];
  },

  async addCategory(label: string, value?: string, description?: string, active?: boolean): Promise<CategoryItem> {
    const res = await apiClient.post<CategoryItem>(
      API_ENDPOINTS.SERVICES.CATEGORIES,
      { label, value, description, active: active !== undefined ? active : true }
    );
    return res.data;
  },

  async createCategory(payload: CategoryFormData): Promise<CategoryItem> {
    const res = await apiClient.post<CategoryItem>(API_ENDPOINTS.SERVICES.CATEGORIES, payload);
    return res.data;
  },

  async updateCategory(id: string, payload: Partial<CategoryFormData>): Promise<CategoryItem> {
    const res = await apiClient.put<CategoryItem>(API_ENDPOINTS.SERVICES.CATEGORY_BY_ID(id), payload);
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SERVICES.CATEGORY_BY_ID(id));
  },

  async getServiceById(id: string): Promise<ServiceItem> {
    const res = await apiClient.get<ServiceItem>(API_ENDPOINTS.SERVICES.BY_ID(id));
    return res.data;
  },

  async createService(payload: ServiceFormData): Promise<ServiceItem> {
    const res = await apiClient.post<ServiceItem>(API_ENDPOINTS.SERVICES.BASE, payload);
    return res.data;
  },

  async updateService(id: string, payload: Partial<ServiceFormData>): Promise<ServiceItem> {
    const res = await apiClient.put<ServiceItem>(API_ENDPOINTS.SERVICES.BY_ID(id), payload);
    return res.data;
  },

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SERVICES.BY_ID(id));
  },

  async toggleStatus(id: string): Promise<{ id: string; isActive: boolean }> {
    const res = await apiClient.patch(API_ENDPOINTS.SERVICES.TOGGLE_STATUS(id));
    return res.data;
  },
};

export default servicesService;

