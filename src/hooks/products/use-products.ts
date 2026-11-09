import { useState, useEffect, useCallback } from "react";
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
  const [products, setProducts] = useState<Product[]>(initialProductsList ?? []);
  const [stats, setStats] = useState<ProductStats>(defaultStats);
  const [categories, setCategories] = useState<Array<{ label: string; value: string }>>(
    initialCategories ?? []
  );
  const [brands, setBrands] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [prodRes, statsRes, catRes, brandRes] = await Promise.allSettled([
        productsService.getProducts(params),
        productsService.getStats(),
        productsService.getCategories(),
        productsService.getBrands(),
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value.items);
        setTotal(prodRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (catRes.status === "fulfilled") {
        setCategories(catRes.value);
      }
      if (brandRes.status === "fulfilled") {
        setBrands(brandRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [prodRes, statsRes, catRes, brandRes] = await Promise.allSettled([
          productsService.getProducts(params),
          productsService.getStats(),
          productsService.getCategories(),
          productsService.getBrands(),
        ]);

        if (!ignore) {
          if (prodRes.status === "fulfilled") {
            setProducts(prodRes.value.items);
            setTotal(prodRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          if (catRes.status === "fulfilled") {
            setCategories(catRes.value);
          }
          if (brandRes.status === "fulfilled") {
            setBrands(brandRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load products");
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

  const createProduct = async (data: ProductFormData) => {
    try {
      const created = await productsService.createProduct(data);
      setProducts((prev) => [created, ...prev]);
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
      setProducts((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
      const updated = await productsService.updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      return updated;
    } catch {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
    } finally {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await productsService.toggleStatus(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: res.status as Product["status"] } : p))
      );
    } catch {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
        )
      );
    }
  };

  const stockIn = async (id: string, payload: StockInPayload) => {
    try {
      const updated = await productsService.stockIn(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: p.stock + payload.quantity } : p))
      );
    }
  };

  const adjustStock = async (id: string, payload: StockAdjustmentPayload) => {
    try {
      const updated = await productsService.adjustStock(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + payload.quantity) } : p))
      );
    }
  };

  const recordSale = async (id: string, payload: StockSalePayload) => {
    try {
      const updated = await productsService.recordSale(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                stock: Math.max(0, p.stock - payload.quantity),
                totalSold: p.totalSold + payload.quantity,
              }
            : p
        )
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

