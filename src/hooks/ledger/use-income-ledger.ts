import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ledgerService,
  type IncomeQueryParams,
} from "../../services/ledger.service";
import type {
  IncomeRecord,
  IncomeStats,
} from "../../interface/ledger.types";

const defaultStats: IncomeStats = {
  totalIncome: 0,
  serviceIncome: 0,
  productIncome: 0,
};

export function useIncomeLedger(
  params?: IncomeQueryParams,
  initialRecords?: IncomeRecord[]
) {
  const queryClient = useQueryClient();

  const incomeQuery = useQuery({
    queryKey: ["ledger", "income", "list", params],
    queryFn: () => ledgerService.getIncome(params),
    initialData: initialRecords
      ? { items: initialRecords, total: initialRecords.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["ledger", "income", "stats"],
    queryFn: () => ledgerService.getIncomeStats(),
  });

  const records: IncomeRecord[] = incomeQuery.data?.items ?? [];
  const stats: IncomeStats = statsQuery.data ?? defaultStats;
  const total: number = incomeQuery.data?.total ?? records.length;
  const isLoading = incomeQuery.isLoading || statsQuery.isLoading;

  const error = incomeQuery.error
    ? incomeQuery.error instanceof Error
      ? incomeQuery.error.message
      : "Failed to load income ledger"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      incomeQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }, [incomeQuery, statsQuery]);

  const createIncome = async (data: Partial<IncomeRecord>) => {
    try {
      const created = await ledgerService.createIncome(data);
      await queryClient.invalidateQueries({ queryKey: ["ledger", "income"] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
      queryClient.setQueryData(
        ["ledger", "income", "list", params],
        (old: { items: IncomeRecord[]; total: number } | undefined) => {
          if (!old) return { items: [fallback], total: 1 };
          return { ...old, items: [fallback, ...old.items], total: old.total + 1 };
        }
      );
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
