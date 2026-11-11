import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsService, type ProductQueryParams } from "../../services/products.service";
import type {
  Product,
  ProductStats,
  ProductFormData,
  StockInPayload,
  StockAdjustmentPayload,
  StockSalePayload,
} from "../../interface/product.types";

const defaultStats: ProductStats = {
  totalProducts: 0,
  activeProducts: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
  totalInventoryValue: 0,
};

export function useProducts(
  params?: ProductQueryParams,
  initialProductsList?: Product[],
  initialCategories?: Array<{ label: string; value: string }>
) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => productsService.getProducts(params),
    initialData: initialProductsList
      ? { items: initialProductsList, total: initialProductsList.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["products", "stats"],
    queryFn: () => productsService.getStats(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["products", "categories"],
    queryFn: () => productsService.getCategories(),
    initialData: initialCategories,
  });

  const brandsQuery = useQuery({
    queryKey: ["products", "brands"],
    queryFn: () => productsService.getBrands(),
  });

  const products: Product[] = productsQuery.data?.items ?? [];
  const stats: ProductStats = statsQuery.data ?? defaultStats;
  const categories: Array<{ label: string; value: string }> = categoriesQuery.data ?? [];
  const brands: string[] = brandsQuery.data ?? [];
  const total: number = productsQuery.data?.total ?? products.length;
  const isLoading =
    productsQuery.isLoading ||
    statsQuery.isLoading ||
    categoriesQuery.isLoading ||
    brandsQuery.isLoading;

  const error = productsQuery.error
    ? productsQuery.error instanceof Error
      ? productsQuery.error.message
      : "Failed to load products"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      productsQuery.refetch(),
      statsQuery.refetch(),
      categoriesQuery.refetch(),
      brandsQuery.refetch(),
    ]);
  }, [productsQuery, statsQuery, categoriesQuery, brandsQuery]);

  const createProduct = async (data: ProductFormData) => {
    try {
      const created = await productsService.createProduct(data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return created;
    } catch {
      const fallback: Product = {
        ...data,
        id: `prod-${Date.now()}`,
        status: data.status || "active",
        totalSold: 0,
        stockMovements: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return { items: [fallback], total: 1 };
          return { ...old, items: [fallback, ...old.items], total: old.total + 1 };
        }
      );
      return fallback;
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
      const updated = await productsService.updateProduct(id, data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) => (p.id === id ? { ...p, ...data } : p)),
          };
        }
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  const toggleStatus = async (id: string) => {
    queryClient.setQueryData(
      ["products", "list", params],
      (old: { items: Product[]; total: number } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((p) =>
            p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
          ),
        };
      }
    );

    try {
      const res = await productsService.toggleStatus(id);
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) =>
              p.id === id ? { ...p, status: res.status as Product["status"] } : p
            ),
          };
        }
      );
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      await fetchAll();
    }
  };

  const stockIn = async (id: string, payload: StockInPayload) => {
    try {
      const updated = await productsService.stockIn(id, payload);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) =>
              p.id === id ? { ...p, stock: p.stock + payload.quantity } : p
            ),
          };
        }
      );
    }
  };

  const adjustStock = async (id: string, payload: StockAdjustmentPayload) => {
    try {
      const updated = await productsService.adjustStock(id, payload);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) =>
              p.id === id ? { ...p, stock: Math.max(0, p.stock + payload.quantity) } : p
            ),
          };
        }
      );
    }
  };

  const recordSale = async (id: string, payload: StockSalePayload) => {
    try {
      const updated = await productsService.recordSale(id, payload);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["products", "list", params],
        (old: { items: Product[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) =>
              p.id === id
                ? {
                    ...p,
                    stock: Math.max(0, p.stock - payload.quantity),
                    totalSold: p.totalSold + payload.quantity,
                  }
                : p
            ),
          };
        }
      );
    }
  };

  return {
    products,
    stats,
    categories,
    brands,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    stockIn,
    adjustStock,
    recordSale,
  };
}

export default useProducts;
