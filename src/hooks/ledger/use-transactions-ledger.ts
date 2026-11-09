import { useState, useEffect, useCallback } from "react";
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
  const [records, setRecords] = useState<TransactionRecord[]>(initialRecords ?? []);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalReceived: 0,
    totalRefunded: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [dataRes, statsRes] = await Promise.allSettled([
        ledgerService.getTransactions(params),
        ledgerService.getTransactionStats(),
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
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [dataRes, statsRes] = await Promise.allSettled([
          ledgerService.getTransactions(params),
          ledgerService.getTransactionStats(),
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
          setError(err instanceof Error ? err.message : "Failed to load transactions");
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

  const createTransaction = async (data: Partial<TransactionRecord>) => {
    try {
      const created = await ledgerService.createTransaction(data);
      setRecords((prev) => [created, ...prev]);
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
    createTransaction,
  };
}

export default useTransactionsLedger;

