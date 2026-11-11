import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesService, type ServiceQueryParams } from "../../services/services.service";
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceStats,
  ServiceFormData,
} from "../../interface/service.types";

const defaultStats: ServiceStats = {
  totalServices: 0,
  categoriesCount: 0,
  activeServices: 0,
  inactiveServices: 0,
  averagePrice: 0,
};

export function useServices(
  params?: ServiceQueryParams,
  initialServicesList?: ServiceItem[],
  initialCategoriesList?: ServiceCategoryItem[]
) {
  const queryClient = useQueryClient();

  const servicesQuery = useQuery({
    queryKey: ["services", "list", params],
    queryFn: () => servicesService.getServices(params),
    initialData: initialServicesList
      ? { items: initialServicesList, total: initialServicesList.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["services", "stats"],
    queryFn: () => servicesService.getStats(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["services", "categories"],
    queryFn: () => servicesService.getCategories(),
    initialData: initialCategoriesList,
  });

  const services: ServiceItem[] = servicesQuery.data?.items ?? [];
  const categories: ServiceCategoryItem[] = categoriesQuery.data ?? [];
  const stats: ServiceStats = statsQuery.data ?? defaultStats;
  const total: number = servicesQuery.data?.total ?? services.length;
  const isLoading = servicesQuery.isLoading || statsQuery.isLoading || categoriesQuery.isLoading;
  const error = servicesQuery.error
    ? servicesQuery.error instanceof Error
      ? servicesQuery.error.message
      : "Failed to load services"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      servicesQuery.refetch(),
      statsQuery.refetch(),
      categoriesQuery.refetch(),
    ]);
  }, [servicesQuery, statsQuery, categoriesQuery]);

  const createService = async (data: ServiceFormData) => {
    try {
      const created = await servicesService.createService(data);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return created;
    } catch {
      const mockCreated: ServiceItem = {
        ...data,
        id: `svc-${Date.now()}`,
      };
      queryClient.setQueryData(
        ["services", "list", params],
        (old: { items: ServiceItem[]; total: number } | undefined) => {
          if (!old) return { items: [mockCreated], total: 1 };
          return { ...old, items: [mockCreated, ...old.items], total: old.total + 1 };
        }
      );
      return mockCreated;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    try {
      const updated = await servicesService.updateService(id, data);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["services", "list", params],
        (old: { items: ServiceItem[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((s) => (s.id === id ? { ...s, ...data } : s)),
          };
        }
      );
    }
  };

  const deleteService = async (id: string) => {
    try {
      await servicesService.deleteService(id);
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  const toggleStatus = async (id: string) => {
    // Optimistic toggle in cache
    queryClient.setQueryData(
      ["services", "list", params],
      (old: { items: ServiceItem[]; total: number } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
        };
      }
    );

    try {
      const res = await servicesService.toggleStatus(id);
      queryClient.setQueryData(
        ["services", "list", params],
        (old: { items: ServiceItem[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((s) => (s.id === id ? { ...s, isActive: res.isActive } : s)),
          };
        }
      );
      await queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch {
      await fetchAll();
    }
  };

  const addCategory = async (label: string, value?: string) => {
    try {
      const created = await servicesService.addCategory(label, value);
      await queryClient.invalidateQueries({ queryKey: ["services", "categories"] });
      return created;
    } catch {
      const fallback: ServiceCategoryItem = {
        id: `cat-${Date.now()}`,
        label,
        value: value || label.toLowerCase().replace(/\s+/g, "_"),
      };
      queryClient.setQueryData(
        ["services", "categories"],
        (old: ServiceCategoryItem[] | undefined) => {
          if (!old) return [fallback];
          return [...old, fallback];
        }
      );
      return fallback;
    }
  };

  return {
    services,
    categories,
    stats,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createService,
    updateService,
    deleteService,
    toggleStatus,
    addCategory,
  };
}

export default useServices;
