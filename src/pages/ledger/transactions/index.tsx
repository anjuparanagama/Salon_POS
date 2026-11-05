import { useState, useMemo } from "react";
import type {
  TransactionRecord,
  TransactionFilterState,
} from "../../../interface/ledger.types";
import Header from "../../../components/header";
import TransactionStats from "./components/transaction-stats";
import TransactionFilters from "./components/transaction-filters";
import TransactionTable from "./components/transaction-table";

const initialTransactions: TransactionRecord[] = [
  {
    id: "tx-1",
    transactionId: "TXN-001",
    customerName: "Kasun Perera",
    type: "payment",
    paymentMethod: "cash",
    amount: 2500,
    date: "2026-11-05",
    status: "successful",
    notes: "Hair Styling & Wash checkout settlement",
  },
  {
    id: "tx-2",
    transactionId: "TXN-002",
    customerName: "Dilani Fernando",
    type: "payment",
    paymentMethod: "card",
    amount: 14500,
    date: "2026-11-05",
    status: "successful",
    notes: "Keratin Treatment terminal payment",
  },
  {
    id: "tx-3",
    transactionId: "TXN-003",
    customerName: "Sachini Jayawardena",
    type: "refund",
    paymentMethod: "card",
    amount: 3500,
    date: "2026-11-04",
    status: "successful",
    notes: "Return of unopened serum product #RT-102",
  },
  {
    id: "tx-4",
    transactionId: "TXN-004",
    customerName: "Nimasha Silva",
    type: "payment",
    paymentMethod: "bank",
    amount: 8500,
    date: "2026-11-03",
    status: "successful",
    notes: "Gold Facial & Cleanup direct bank transfer",
  },
  {
    id: "tx-5",
    transactionId: "TXN-005",
    customerName: "Amara Wickramasinghe",
    type: "payment",
    paymentMethod: "cash",
    amount: 5200,
    date: "2026-11-02",
    status: "successful",
    notes: "Hair treatment package intake",
  },
  {
    id: "tx-6",
    transactionId: "TXN-006",
    customerName: "Ruwanthi De Silva",
    type: "refund",
    paymentMethod: "cash",
    amount: 1500,
    date: "2026-11-01",
    status: "successful",
    notes: "Service cancellation partial advance refund",
  },
  {
    id: "tx-7",
    transactionId: "TXN-007",
    customerName: "Sanduni Gunasekara",
    type: "payment",
    paymentMethod: "card",
    amount: 6000,
    date: "2026-10-31",
    status: "failed",
    notes: "Card declined by issuing bank",
  },
  {
    id: "tx-8",
    transactionId: "TXN-008",
    customerName: "Chathurika Senanayake",
    type: "payment",
    paymentMethod: "card",
    amount: 9500,
    date: "2026-10-30",
    status: "successful",
    notes: "Deluxe Spa & Manicure settlement",
  },
];

const initialFilters: TransactionFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  type: "all",
  paymentMethod: "all",
};

export function LedgerTransactions() {
  const [transactions] = useState<TransactionRecord[]>(initialTransactions);
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
      />

      {/* 3 Summary Cards: Total Transactions, Total Received, Total Refunded */}
      <TransactionStats stats={stats} />

      {/* Filters (Search, Date Range, Type, Payment Method) */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionTable records={filteredTransactions} />
    </div>
  );
}

export default LedgerTransactions;
