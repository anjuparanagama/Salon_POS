import { useState, useMemo } from "react";
import type { TransactionRecord, TransactionFilterState } from "../../../interface/ledger.types";

import LedgerNav from "../components/ledger-nav";
import TransactionStats from "./components/transaction-stats";
import TransactionFilters from "./components/transaction-filters";
import TransactionTable from "./components/transaction-table";

const initialTransactions: TransactionRecord[] = [
  {
    id: "tx-1",
    txnId: "TXN-90214",
    date: new Date().toISOString().split("T")[0],
    time: "10:45 AM",
    type: "payment",
    amount: 135.0,
    paymentMethod: "credit_card",
    customerName: "Mia Johnson",
    status: "completed",
    reference: "Terminal #01 Auth: 49102",
  },
  {
    id: "tx-2",
    txnId: "TXN-90215",
    date: new Date().toISOString().split("T")[0],
    time: "11:20 AM",
    type: "payment",
    amount: 34.0,
    paymentMethod: "debit_card",
    customerName: "Emma Wilson",
    status: "completed",
    reference: "POS Retail Register",
  },
  {
    id: "tx-3",
    txnId: "TXN-90216",
    date: new Date().toISOString().split("T")[0],
    time: "01:15 PM",
    type: "refund",
    amount: 45.0,
    paymentMethod: "credit_card",
    customerName: "Lucas Vance",
    status: "completed",
    reference: "Returned unopened styling paste #RN-88",
  },
  {
    id: "tx-4",
    txnId: "TXN-90180",
    date: "2026-11-02",
    time: "03:10 PM",
    type: "payment",
    amount: 85.0,
    paymentMethod: "credit_card",
    customerName: "Ava Smith",
    status: "completed",
    reference: "Terminal #02 Auth: 99401",
  },
  {
    id: "tx-5",
    txnId: "TXN-90172",
    date: "2026-11-02",
    time: "04:50 PM",
    type: "payment",
    amount: 150.0,
    paymentMethod: "online",
    customerName: "Harper Lee",
    status: "completed",
    reference: "Stripe Online Deposit",
  },
  {
    id: "tx-6",
    txnId: "TXN-90165",
    date: "2026-11-01",
    time: "02:00 PM",
    type: "refund",
    amount: 25.0,
    paymentMethod: "credit_card",
    customerName: "Chloe Martin",
    status: "completed",
    reference: "Partial service discount adjustment",
  },
];

export function LedgerTransactions() {
  const [transactions] = useState<TransactionRecord[]>(initialTransactions);

  const [filters, setFilters] = useState<TransactionFilterState>({
    search: "",
    type: "all",
    status: "all",
    paymentMethod: "all",
  });

  const handleFilterChange = (updated: Partial<TransactionFilterState>) => {
    setFilters((prev: TransactionFilterState) => ({ ...prev, ...updated }));
  };

  const stats = useMemo(() => {
    const totalVol = transactions.reduce((acc, t) => acc + t.amount, 0);
    const payments = transactions.filter((t) => t.type === "payment");
    const refunds = transactions.filter((t) => t.type === "refund");

    const paymentSum = payments.reduce((acc, t) => acc + t.amount, 0);
    const refundSum = refunds.reduce((acc, t) => acc + t.amount, 0);

    return {
      totalVolume: totalVol,
      paymentsCount: payments.length,
      refundsCount: refunds.length,
      netCollected: paymentSum - refundSum,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTxn = t.txnId.toLowerCase().includes(query);
        const matchesCust = t.customerName.toLowerCase().includes(query);
        const matchesRef = t.reference.toLowerCase().includes(query);
        if (!matchesTxn && !matchesCust && !matchesRef) return false;
      }
      if (filters.type !== "all" && t.type !== filters.type) {
        return false;
      }
      if (filters.status !== "all" && t.status !== filters.status) {
        return false;
      }
      if (filters.paymentMethod !== "all" && t.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Shared Ledger Navigation Tabs */}
      <LedgerNav activeTab="transactions" />

      {/* Action Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-800">Payments & Refund Reversals</h2>
        <p className="text-xs text-slate-500">
          Complete settlement trail of terminal charges, cash intake, and customer refunds.
        </p>
      </div>

      {/* KPI Stats */}
      <TransactionStats stats={stats} />

      {/* Filters */}
      <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      <TransactionTable records={filteredTransactions} />
    </div>
  );
}

export default LedgerTransactions;
