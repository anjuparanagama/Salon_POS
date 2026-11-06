import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  StaffMember,
  StaffStats,
  StaffFormData,
  StaffRole,
} from "../interface/staff.types";

export interface StaffQueryParams {
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  page?: number;
  pageSize?: number;
}

export const staffService = {
  async getStaff(params?: StaffQueryParams): Promise<{ items: StaffMember[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.STAFF.BASE, { params });
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getStats(): Promise<StaffStats> {
    const res = await apiClient.get<StaffStats>(API_ENDPOINTS.STAFF.STATS);
    return res.data;
  },

  async getRoles(): Promise<Array<{ label: string; value: StaffRole }>> {
    const res = await apiClient.get(API_ENDPOINTS.STAFF.ROLES);
    return Array.isArray(res.data) ? res.data : [];
  },

  async getStaffById(id: string): Promise<StaffMember> {
    const res = await apiClient.get<StaffMember>(API_ENDPOINTS.STAFF.BY_ID(id));
    return res.data;
  },

  async createStaff(payload: StaffFormData): Promise<StaffMember> {
    const res = await apiClient.post<StaffMember>(API_ENDPOINTS.STAFF.BASE, payload);
    return res.data;
  },

  async updateStaff(id: string, payload: Partial<StaffFormData>): Promise<StaffMember> {
    const res = await apiClient.put<StaffMember>(API_ENDPOINTS.STAFF.BY_ID(id), payload);
    return res.data;
  },

  async deleteStaff(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.STAFF.BY_ID(id));
  },

  async toggleStatus(id: string): Promise<{ id: string; status: string }> {
    const res = await apiClient.patch(API_ENDPOINTS.STAFF.TOGGLE_STATUS(id));
    return res.data;
  },
};

export default staffService;

