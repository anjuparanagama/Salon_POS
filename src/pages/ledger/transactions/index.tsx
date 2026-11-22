import { useState, useMemo } from "react";
import type {
  TransactionFilterState,
} from "../../../interface/ledger.types";
import { useTransactionsLedger } from "../../../hooks/ledger";
import Header from "../../../components/header";
import TransactionStats from "./components/transaction-stats";
import TransactionFilters from "./components/transaction-filters";
import TransactionTable from "./components/transaction-table";

const initialFilters: TransactionFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  type: "all",
  paymentMethod: "all",
};

export function LedgerTransactions() {
  const { records: transactions, isLoading } = useTransactionsLedger();
  const [filters, setFilters] = useState<TransactionFilterState>(initialFilters);

  const handleFilterChange = (updated: Partial<TransactionFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Summary statistics for Total Transactions, Total Received, Total Refunded
  const stats = useMemo(() => {
    const totalCount = transactions.length;

    const totalRec = transactions
      .filter((t) => t.type === "payment" && t.status === "successful")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalRef = transactions
      .filter((t) => t.type === "refund" && t.status === "successful")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalTransactions: totalCount,
      totalReceived: totalRec,
      totalRefunded: totalRef,
    };
  }, [transactions]);

  // Filtered transactions based on search, date range, type, and payment method
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search by Transaction ID or Customer name
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTxnId = t.transactionId.toLowerCase().includes(query);
        const matchesCustomer = t.customerName.toLowerCase().includes(query);
        if (!matchesTxnId && !matchesCustomer) return false;
      }

      // Transaction Type filter (payment / refund)
      if (filters.type !== "all" && t.type !== filters.type) {
        return false;
      }

      // Payment Method filter
      if (filters.paymentMethod !== "all" && t.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Date Range filter
      if (filters.startDate && t.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && t.date > filters.endDate) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Page Header */}
      <Header
        title="Transaction Ledger"
        description="View all salon financial transactions, customer settlements, and refund reversals."
        isLoading={isLoading}
      />

      {/* 3 Summary Cards: Total Transactions, Total Received, Total Refunded */}
      <TransactionStats stats={stats} isLoading={isLoading} />

      {/* Filters (Search, Date Range, Type, Payment Method) */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionTable records={filteredTransactions} isLoading={isLoading} />
    </div>
  );
}

export default LedgerTransactions;
