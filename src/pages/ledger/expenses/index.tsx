import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { ExpenseRecord, ExpenseFilterState, ExpenseFormData } from "../../../interface/ledger.types";

import LedgerNav from "../components/ledger-nav";
import ExpenseStats from "./components/expense-stats";
import ExpenseFilters from "./components/expense-filters";
import ExpenseTable from "./components/expense-table";
import ExpenseModal from "./components/expense-modal";

const initialExpenses: ExpenseRecord[] = [
  {
    id: "exp-1",
    date: "2026-11-01",
    category: "rent",
    title: "Salon Premises Monthly Lease",
    vendorOrStaff: "Grand Plaza Properties",
    amount: 2200.0,
    paymentMethod: "bank_transfer",
    receiptNo: "RCP-RENT-11",
    notes: "Floor 1 Suite A",
  },
  {
    id: "exp-2",
    date: "2026-11-02",
    category: "electricity",
    title: "Commercial Electric & Power Grid",
    vendorOrStaff: "Metro Energy Power Corp",
    amount: 435.5,
    paymentMethod: "bank_transfer",
    receiptNo: "RCP-UTIL-80",
    notes: "High voltage blowdryers & AC usage",
  },
  {
    id: "exp-3",
    date: "2026-10-31",
    category: "salaries",
    title: "Stylist Bi-weekly Payroll",
    vendorOrStaff: "Amelia Vance & Staff",
    amount: 2850.0,
    paymentMethod: "bank_transfer",
    receiptNo: "PAY-OCT-26",
  },
  {
    id: "exp-4",
    date: "2026-10-28",
    category: "product_purchases",
    title: "Wholesale Hair Color & Bleach Lot",
    vendorOrStaff: "Wella Direct Logistics",
    amount: 780.0,
    paymentMethod: "card",
    receiptNo: "PO-WEL-440",
    notes: "30 color tubes, 4 bleach canisters",
  },
  {
    id: "exp-5",
    date: "2026-10-25",
    category: "maintenance",
    title: "Water Softener & Filter Servicing",
    vendorOrStaff: "AquaPro Care Services",
    amount: 140.0,
    paymentMethod: "cash",
    receiptNo: "RCP-MNT-12",
  },
];

export function LedgerExpenses() {
  const [records, setRecords] = useState<ExpenseRecord[]>(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<ExpenseFilterState>({
    search: "",
    category: "all",
  });

  const handleFilterChange = (updated: Partial<ExpenseFilterState>) => {
    setFilters((prev: ExpenseFilterState) => ({ ...prev, ...updated }));
  };

  const handleAddExpense = (data: ExpenseFormData) => {
    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      ...data,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const stats = useMemo(() => {
    const total = records.reduce((acc, r) => acc + r.amount, 0);
    const salaryTotal = records
      .filter((r) => r.category === "salaries")
      .reduce((acc, r) => acc + r.amount, 0);
    const purchasesTotal = records
      .filter((r) => r.category === "product_purchases")
      .reduce((acc, r) => acc + r.amount, 0);
    const rentUtilTotal = records
      .filter((r) => r.category === "rent" || r.category === "electricity")
      .reduce((acc, r) => acc + r.amount, 0);

    return {
      totalExpenses: total,
      salaries: salaryTotal,
      productPurchases: purchasesTotal,
      utilitiesAndRent: rentUtilTotal,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesVendor = r.vendorOrStaff.toLowerCase().includes(query);
        const matchesRcp = r.receiptNo.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVendor && !matchesRcp) return false;
      }
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }
      return true;
    });
  }, [records, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Shared Ledger Navigation Tabs */}
      <LedgerNav activeTab="expenses" />

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Operational Expenses Log</h2>
          <p className="text-xs text-slate-500">Premises rent, utility bills, salary disbursements & inventory orders.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* KPI Stats */}
      <ExpenseStats stats={stats} />

      {/* Filters */}
      <ExpenseFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      <ExpenseTable records={filteredRecords} />

      {/* Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}

export default LedgerExpenses;
