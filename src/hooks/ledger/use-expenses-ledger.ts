import { useState, useEffect, useCallback } from "react";
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
  const [records, setRecords] = useState<ExpenseRecord[]>(initialRecords ?? []);
  const [categories, setCategories] = useState<
    Array<{ label: string; value: ExpenseItemCategory }>
  >(initialCategories ?? []);
  const [stats, setStats] = useState<ExpenseStats>({
    totalExpenses: 0,
    thisMonth: 0,
    expenseCategoriesCount: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [dataRes, statsRes, catRes] = await Promise.allSettled([
        ledgerService.getExpenses(params),
        ledgerService.getExpenseStats(),
        ledgerService.getExpenseCategories(),
      ]);

      if (dataRes.status === "fulfilled") {
        setRecords(dataRes.value.items);
        setTotal(dataRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (catRes.status === "fulfilled" && catRes.value.length > 0) {
        setCategories(catRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [dataRes, statsRes, catRes] = await Promise.allSettled([
          ledgerService.getExpenses(params),
          ledgerService.getExpenseStats(),
          ledgerService.getExpenseCategories(),
        ]);

        if (!ignore) {
          if (dataRes.status === "fulfilled") {
            setRecords(dataRes.value.items);
            setTotal(dataRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          if (catRes.status === "fulfilled" && catRes.value.length > 0) {
            setCategories(catRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load expenses");
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

  const createExpense = async (data: Partial<ExpenseRecord>) => {
    try {
      const created = await ledgerService.createExpense(data);
      setRecords((prev) => [created, ...prev]);
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
      setRecords((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseRecord>) => {
    try {
      const updated = await ledgerService.updateExpense(id, data);
      setRecords((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
      return updated;
    } catch {
      setRecords((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await ledgerService.deleteExpense(id);
    } finally {
      setRecords((prev) => prev.filter((e) => e.id !== id));
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

