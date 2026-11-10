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

function normalizeStaff(s: Record<string, any>): StaffMember {
  const canAccessPos = Boolean(
    s.canAccessPos !== undefined
      ? s.canAccessPos
      : s.can_access_pos !== undefined
      ? s.can_access_pos
      : false
  );

  return {
    id: String(s.id || ""),
    name: String(s.name || ""),
    role: (s.role as StaffRole) || "stylist",
    email: String(s.email || ""),
    phone: String(s.phone || ""),
    avatar: s.avatar ? String(s.avatar) : undefined,
    specialties: Array.isArray(s.specialties) ? s.specialties : [],
    commissionRate: Number(s.commissionRate ?? s.commission_rate ?? 0),
    rating: Number(s.rating ?? 5.0),
    reviewsCount: Number(s.reviewsCount ?? s.reviews_count ?? 0),
    completedAppointments: Number(
      s.completedAppointments ?? s.completed_appointments ?? 0
    ),
    revenueGenerated: Number(
      s.revenueGenerated ?? s.revenue_generated ?? 0
    ),
    status: (s.status as StaffMember["status"]) || "active",
    joinedDate: String(
      s.joinedDate ?? s.joined_date ?? new Date().toISOString().split("T")[0]
    ),
    bio: s.bio ? String(s.bio) : undefined,
    canAccessPos,
  };
}

export const staffService = {
  async getStaff(params?: StaffQueryParams): Promise<{ items: StaffMember[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.STAFF.BASE, { params });
    const rawItems: any[] =
      res.data && Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
        ? res.data
        : [];
    const items = rawItems.map(normalizeStaff);
    const total =
      typeof res.data?.total === "number" ? res.data.total : items.length;
    return { items, total };
  },

  async getStaffList(): Promise<Array<{ id: string; name: string; role?: string; status?: string }>> {
    const res = await apiClient.get(API_ENDPOINTS.STAFF.BASE, { params: { page_size: 100 } });
    const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
    return items.map((s: Record<string, unknown>) => ({
      id: String(s.id),
      name: String(s.name),
      role: s.role ? String(s.role) : undefined,
      status: s.status ? String(s.status) : undefined,
    }));
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
    return normalizeStaff(res.data);
  },

  async createStaff(payload: StaffFormData): Promise<StaffMember> {
    const body = {
      ...payload,
      canAccessPos: Boolean(payload.canAccessPos),
      can_access_pos: Boolean(payload.canAccessPos),
    };
    const res = await apiClient.post<Record<string, any>>(API_ENDPOINTS.STAFF.BASE, body);
    return normalizeStaff(res.data);
  },

  async updateStaff(id: string, payload: Partial<StaffFormData>): Promise<StaffMember> {
    const body: Record<string, any> = { ...payload };
    if (payload.canAccessPos !== undefined) {
      body.canAccessPos = Boolean(payload.canAccessPos);
      body.can_access_pos = Boolean(payload.canAccessPos);
    }
    const res = await apiClient.put<Record<string, any>>(API_ENDPOINTS.STAFF.BY_ID(id), body);
    return normalizeStaff(res.data);
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

