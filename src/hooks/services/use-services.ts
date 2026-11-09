import { useState, useEffect, useCallback } from "react";
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
  const [services, setServices] = useState<ServiceItem[]>(initialServicesList ?? []);
  const [categories, setCategories] = useState<ServiceCategoryItem[]>(initialCategoriesList ?? []);
  const [stats, setStats] = useState<ServiceStats>(defaultStats);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [svcRes, statsRes, catRes] = await Promise.allSettled([
        servicesService.getServices(params),
        servicesService.getStats(),
        servicesService.getCategories(),
      ]);

      if (svcRes.status === "fulfilled") {
        setServices(svcRes.value.items);
        setTotal(svcRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (catRes.status === "fulfilled") {
        setCategories(catRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [svcRes, statsRes, catRes] = await Promise.allSettled([
          servicesService.getServices(params),
          servicesService.getStats(),
          servicesService.getCategories(),
        ]);

        if (!ignore) {
          if (svcRes.status === "fulfilled") {
            setServices(svcRes.value.items);
            setTotal(svcRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          if (catRes.status === "fulfilled") {
            setCategories(catRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load services");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [params]);

  const createService = async (data: ServiceFormData) => {
    try {
      const created = await servicesService.createService(data);
      setServices((prev) => [created, ...prev]);
      return created;
    } catch {
      // Local fallback on error
      const mockCreated: ServiceItem = {
        ...data,
        id: `svc-${Date.now()}`,
      };
      setServices((prev) => [mockCreated, ...prev]);
      return mockCreated;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    try {
      const updated = await servicesService.updateService(id, data);
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      return updated;
    } catch {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    }
  };

  const deleteService = async (id: string) => {
    try {
      await servicesService.deleteService(id);
    } finally {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await servicesService.toggleStatus(id);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: res.isActive } : s))
      );
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
    }
  };

  const addCategory = async (label: string, value?: string) => {
    try {
      const created = await servicesService.addCategory(label, value);
      setCategories((prev) => [...prev, created]);
      return created;
    } catch {
      const fallback: ServiceCategoryItem = {
        id: `cat-${Date.now()}`,
        label,
        value: value || label.toLowerCase().replace(/\s+/g, "_"),
      };
      setCategories((prev) => [...prev, fallback]);
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
