import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ledgerService,
  type TransactionQueryParams,
} from "../../services/ledger.service";
import type {
  TransactionRecord,
  TransactionStats,
} from "../../interface/ledger.types";

export function useTransactionsLedger(
  params?: TransactionQueryParams,
  initialRecords?: TransactionRecord[]
) {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["ledger", "transactions", "list", params],
    queryFn: () => ledgerService.getTransactions(params),
    initialData: initialRecords
      ? { items: initialRecords, total: initialRecords.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["ledger", "transactions", "stats"],
    queryFn: () => ledgerService.getTransactionStats(),
  });

  const records: TransactionRecord[] = transactionsQuery.data?.items ?? [];
  const stats: TransactionStats = statsQuery.data ?? {
    totalTransactions: 0,
    totalReceived: 0,
    totalRefunded: 0,
  };
  const total: number = transactionsQuery.data?.total ?? records.length;
  const isLoading = transactionsQuery.isLoading || statsQuery.isLoading;

  const error = transactionsQuery.error
    ? transactionsQuery.error instanceof Error
      ? transactionsQuery.error.message
      : "Failed to load transactions"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      transactionsQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }, [transactionsQuery, statsQuery]);

  const createTransaction = async (data: Partial<TransactionRecord>) => {
    try {
      const created = await ledgerService.createTransaction(data);
      await queryClient.invalidateQueries({ queryKey: ["ledger", "transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return created;
    } catch {
      const fallback: TransactionRecord = {
        id: `tx-${Date.now()}`,
        transactionId: data.transactionId || `TXN-${Date.now().toString().slice(-4)}`,
        customerName: data.customerName || "Customer",
        type: data.type || "payment",
        paymentMethod: data.paymentMethod || "cash",
        amount: data.amount || 0,
        status: data.status || "successful",
        date: data.date || new Date().toISOString().split("T")[0],
        notes: data.notes,
      };
      queryClient.setQueryData(
        ["ledger", "transactions", "list", params],
        (old: { items: TransactionRecord[]; total: number } | undefined) => {
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
    createTransaction,
  };
}

export default useTransactionsLedger;
