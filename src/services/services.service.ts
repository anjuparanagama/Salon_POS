import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceStats,
  ServiceFormData,
} from "../interface/service.types";

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

  async getStats(): Promise<ServiceStats> {
    const res = await apiClient.get<ServiceStats>(API_ENDPOINTS.SERVICES.STATS);
    return res.data;
  },

  async getCategories(): Promise<ServiceCategoryItem[]> {
    const res = await apiClient.get(API_ENDPOINTS.SERVICES.CATEGORIES);
    return Array.isArray(res.data) ? res.data : [];
  },

  async addCategory(label: string, value?: string): Promise<ServiceCategoryItem> {
    const res = await apiClient.post<ServiceCategoryItem>(
      API_ENDPOINTS.SERVICES.CATEGORIES,
      { label, value }
    );
    return res.data;
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

