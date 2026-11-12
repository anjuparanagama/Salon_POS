import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  customersService,
  type CustomerQueryParams,
} from "../../services/customers.service";
import type {
  Customer,
  CustomerStats,
  CustomerFormData,
} from "../../interface/customer.types";

const defaultStats: CustomerStats = {
  totalCustomers: 0,
  totalVisits: 0,
  totalRevenue: 0,
  avgSpendPerCustomer: 0,
};

export function useCustomers(params?: CustomerQueryParams) {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers", "list", params],
    queryFn: () => customersService.getCustomers(params),
  });

  const statsQuery = useQuery({
    queryKey: ["customers", "stats"],
    queryFn: () => customersService.getStats(),
  });

  const customers: Customer[] = customersQuery.data?.items ?? [];
  const stats: CustomerStats = statsQuery.data ?? defaultStats;
  const total: number = customersQuery.data?.total ?? customers.length;
  const isLoading = customersQuery.isLoading || statsQuery.isLoading;
  const error = customersQuery.error
    ? customersQuery.error instanceof Error
      ? customersQuery.error.message
      : "Failed to load customers"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      customersQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }, [customersQuery, statsQuery]);

  const createCustomer = async (data: CustomerFormData) => {
    try {
      const created = await customersService.createCustomer(data);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      return created;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.message || "Failed to create customer";
      throw new Error(message);
    }
  };

  const updateCustomer = async (id: string, data: Partial<CustomerFormData>) => {
    try {
      const updated = await customersService.updateCustomer(id, data);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      return updated;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.message || "Failed to update customer";
      throw new Error(message);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customersService.deleteCustomer(id);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.message || "Failed to delete customer";
      throw new Error(message);
    }
  };

  return {
    customers,
    stats,
    total,
    isLoading,
    error,
    fetchAll,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: customersQuery.refetch,
  };
}

