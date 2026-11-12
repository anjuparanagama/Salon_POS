import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Customer,
  CustomerStats,
  CustomerFormData,
  CustomerGender,
  ServiceHistoryItem,
} from "../interface/customer.types";

export interface CustomerQueryParams {
  search?: string;
  gender?: string;
  sort_by?: string;
  page?: number;
  pageSize?: number;
}

function normalizeServiceHistoryItem(raw: Record<string, any>): ServiceHistoryItem {
  return {
    id: String(raw.id || ""),
    appointmentId: raw.appointmentId || raw.appointment_id || null,
    invoiceId: raw.invoiceId || raw.invoice_id || null,
    appointmentNumber: raw.appointmentNumber || raw.appointment_number || null,
    invoiceNumber: raw.invoiceNumber || raw.invoice_number || null,
    date: String(raw.date || ""),
    serviceName: String(raw.serviceName || raw.service_name || "Service"),
    staffName: raw.staffName || raw.staff_name || null,
    price: Number(raw.price || 0),
    durationMinutes: Number(raw.durationMinutes || raw.duration_minutes || 30),
    status: String(raw.status || "Completed"),
  };
}

function normalizeCustomer(c: Record<string, any>): Customer {
  const historyRaw = c.serviceHistory || c.service_history;
  const history = Array.isArray(historyRaw)
    ? historyRaw.map(normalizeServiceHistoryItem)
    : undefined;

  return {
    id: String(c.id || ""),
    name: String(c.name || ""),
    phone: String(c.phone || ""),
    email: String(c.email || ""),
    gender: (c.gender as CustomerGender) || "prefer_not_to_say",
    totalVisits: Number(c.totalVisits ?? c.total_visits ?? 0),
    totalSpent: Number(c.totalSpent ?? c.total_spent ?? 0),
    lastVisit: c.lastVisit ?? c.last_visit ?? null,
    serviceHistory: history,
    createdAt: String(c.createdAt ?? c.created_at ?? ""),
  };
}

export const customersService = {
  async getCustomers(
    params?: CustomerQueryParams
  ): Promise<{ items: Customer[]; total: number }> {
    const queryParams: Record<string, any> = {};
    if (params?.search) queryParams.search = params.search;
    if (params?.gender && params.gender !== "all") queryParams.gender = params.gender;
    if (params?.sort_by) queryParams.sort_by = params.sort_by;
    if (params?.page) queryParams.page = params.page;
    if (params?.pageSize) queryParams.page_size = params.pageSize;

    const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BASE, {
      params: queryParams,
    });

    const rawItems: any[] =
      res.data && Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
        ? res.data
        : [];

    const total =
      typeof res.data?.total === "number" ? res.data.total : rawItems.length;

    return {
      items: rawItems.map(normalizeCustomer),
      total,
    };
  },

  async getStats(): Promise<CustomerStats> {
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.STATS);
    const data = res.data || {};
    return {
      totalCustomers: Number(data.totalCustomers ?? data.total_customers ?? 0),
      totalVisits: Number(data.totalVisits ?? data.total_visits ?? 0),
      totalRevenue: Number(data.totalRevenue ?? data.total_revenue ?? 0),
      avgSpendPerCustomer: Number(
        data.avgSpendPerCustomer ?? data.avg_spend_per_customer ?? 0
      ),
    };
  },

  async getCustomer(id: string): Promise<Customer> {
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return normalizeCustomer(res.data);
  },

  async getCustomerHistory(id: string): Promise<ServiceHistoryItem[]> {
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.HISTORY(id));
    if (Array.isArray(res.data)) {
      return res.data.map(normalizeServiceHistoryItem);
    }
    return [];
  },

  async createCustomer(data: CustomerFormData): Promise<Customer> {
    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || null,
      gender: data.gender || "prefer_not_to_say",
    };
    const res = await apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, payload);
    return normalizeCustomer(res.data);
  },

  async updateCustomer(
    id: string,
    data: Partial<CustomerFormData>
  ): Promise<Customer> {
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.phone !== undefined) payload.phone = data.phone.trim();
    if (data.email !== undefined) payload.email = data.email.trim() || null;
    if (data.gender !== undefined) payload.gender = data.gender;

    const res = await apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), payload);
    return normalizeCustomer(res.data);
  },

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};

