import { useState, useEffect, useCallback } from "react";
import {
  ledgerService,
  type IncomeQueryParams,
} from "../../services/ledger.service";
import type {
  IncomeRecord,
  IncomeStats,
} from "../../interface/ledger.types";

export function useIncomeLedger(
  params?: IncomeQueryParams,
  initialRecords?: IncomeRecord[]
) {
  const [records, setRecords] = useState<IncomeRecord[]>(initialRecords ?? []);
  const [stats, setStats] = useState<IncomeStats>({
    totalIncome: 0,
    serviceIncome: 0,
    productIncome: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [dataRes, statsRes] = await Promise.allSettled([
        ledgerService.getIncome(params),
        ledgerService.getIncomeStats(),
      ]);

      if (dataRes.status === "fulfilled") {
        setRecords(dataRes.value.items);
        setTotal(dataRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load income ledger");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [dataRes, statsRes] = await Promise.allSettled([
          ledgerService.getIncome(params),
          ledgerService.getIncomeStats(),
        ]);

        if (!ignore) {
          if (dataRes.status === "fulfilled") {
            setRecords(dataRes.value.items);
            setTotal(dataRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load income ledger");
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

  const createIncome = async (data: Partial<IncomeRecord>) => {
    try {
      const created = await ledgerService.createIncome(data);
      setRecords((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: IncomeRecord = {
        id: `inc-${Date.now()}`,
        saleId: data.saleId || `SAL-${Date.now().toString().slice(-4)}`,
        customerName: data.customerName || "Customer",
        incomeType: data.incomeType || "service",
        amount: data.amount || 0,
        paymentMethod: data.paymentMethod || "cash",
        date: data.date || new Date().toISOString().split("T")[0],
        description: data.description,
      };
      setRecords((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  return {
    records,
    stats,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createIncome,
  };
}

export default useIncomeLedger;

