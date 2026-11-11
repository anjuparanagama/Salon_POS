import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ledgerService,
  type ExpenseQueryParams,
} from "../../services/ledger.service";
import type {
  ExpenseRecord,
  ExpenseStats,
  ExpenseItemCategory,
} from "../../interface/ledger.types";

export function useExpensesLedger(
  params?: ExpenseQueryParams,
  initialRecords?: ExpenseRecord[],
  initialCategories?: Array<{ label: string; value: ExpenseItemCategory }>
) {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ["ledger", "expenses", "list", params],
    queryFn: () => ledgerService.getExpenses(params),
    initialData: initialRecords
      ? { items: initialRecords, total: initialRecords.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["ledger", "expenses", "stats"],
    queryFn: () => ledgerService.getExpenseStats(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["ledger", "expenses", "categories"],
    queryFn: () => ledgerService.getExpenseCategories(),
    initialData: initialCategories,
  });

  const records: ExpenseRecord[] = expensesQuery.data?.items ?? [];
  const stats: ExpenseStats = statsQuery.data ?? {
    totalExpenses: 0,
    thisMonth: 0,
    expenseCategoriesCount: 0,
  };
  const categories: Array<{ label: string; value: ExpenseItemCategory }> =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data
      : initialCategories ?? [];
  const total: number = expensesQuery.data?.total ?? records.length;
  const isLoading =
    expensesQuery.isLoading || statsQuery.isLoading || categoriesQuery.isLoading;

  const error = expensesQuery.error
    ? expensesQuery.error instanceof Error
      ? expensesQuery.error.message
      : "Failed to load expenses"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      expensesQuery.refetch(),
      statsQuery.refetch(),
      categoriesQuery.refetch(),
    ]);
  }, [expensesQuery, statsQuery, categoriesQuery]);

  const createExpense = async (data: Partial<ExpenseRecord>) => {
    try {
      const created = await ledgerService.createExpense(data);
      await queryClient.invalidateQueries({ queryKey: ["ledger", "expenses"] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return created;
    } catch {
      const fallback: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        title: data.title || "Expense",
        category: data.category || "other",
        amount: data.amount || 0,
        paymentMethod: data.paymentMethod || "cash",
        date: data.date || new Date().toISOString().split("T")[0],
        description: data.description,
      };
      queryClient.setQueryData(
        ["ledger", "expenses", "list", params],
        (old: { items: ExpenseRecord[]; total: number } | undefined) => {
          if (!old) return { items: [fallback], total: 1 };
          return { ...old, items: [fallback, ...old.items], total: old.total + 1 };
        }
      );
      return fallback;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseRecord>) => {
    try {
      const updated = await ledgerService.updateExpense(id, data);
      await queryClient.invalidateQueries({ queryKey: ["ledger", "expenses"] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["ledger", "expenses", "list", params],
        (old: { items: ExpenseRecord[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((e) => (e.id === id ? { ...e, ...data } : e)),
          };
        }
      );
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await ledgerService.deleteExpense(id);
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["ledger", "expenses"] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  return {
    records,
    categories,
    stats,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export default useExpensesLedger;
