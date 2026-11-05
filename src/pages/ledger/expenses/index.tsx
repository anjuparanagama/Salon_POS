import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  ExpenseRecord,
  ExpenseFilterState,
  ExpenseFormData,
} from "../../../interface/ledger.types";
import Header from "../../../components/header";
import ExpenseStats from "./components/expense-stats";
import ExpenseFilters from "./components/expense-filters";
import ExpenseTable from "./components/expense-table";
import ExpenseModal from "./components/expense-modal";
import ExpenseViewModal from "./components/expense-view-modal";
import ExpenseDeleteModal from "./components/expense-delete-modal";

const initialExpenses: ExpenseRecord[] = [
  {
    id: "exp-1",
    title: "Electricity Bill",
    category: "electricity",
    amount: 5000,
    paymentMethod: "cash",
    date: "2026-11-04",
    description: "CEB Commercial Electricity power bill for hair dryers and AC units",
  },
  {
    id: "exp-2",
    title: "Salon Premises Monthly Rent",
    category: "rent",
    amount: 75000,
    paymentMethod: "bank",
    date: "2026-11-01",
    description: "Suite lease payment for November 2026",
  },
  {
    id: "exp-3",
    title: "Stylist Bi-weekly Salaries",
    category: "salaries",
    amount: 65000,
    paymentMethod: "bank",
    date: "2026-11-02",
    description: "Wages disbursed to salon senior stylists and assistants",
  },
  {
    id: "exp-4",
    title: "Municipal Water Board Bill",
    category: "water",
    amount: 3200,
    paymentMethod: "cash",
    date: "2026-11-03",
    description: "Hair wash sinks and salon sanitation water tariff",
  },
  {
    id: "exp-5",
    title: "Hair Care Products Batch Restock",
    category: "product_purchases",
    amount: 18500,
    paymentMethod: "card",
    date: "2026-10-29",
    description: "Wholesale shipment of shampoos, color developer, and condition creams",
  },
  {
    id: "exp-6",
    title: "Hair Steamer & Blowdryer Servicing",
    category: "equipment_maintenance",
    amount: 8500,
    paymentMethod: "cash",
    date: "2026-10-25",
    description: "Quarterly technical check & coil replacement",
  },
  {
    id: "exp-7",
    title: "SLT Fiber Internet & Hotline",
    category: "internet_telephone",
    amount: 4800,
    paymentMethod: "card",
    date: "2026-11-02",
    description: "High speed WiFi for reception desk POS & appointment booking",
  },
  {
    id: "exp-8",
    title: "Towel Laundry & Cleaning Supplies",
    category: "other",
    amount: 2600,
    paymentMethod: "cash",
    date: "2026-10-30",
    description: "Weekly commercial wash service for salon linen and towels",
  },
];

const initialFilters: ExpenseFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  category: "all",
};

export function LedgerExpenses() {
  const [records, setRecords] = useState<ExpenseRecord[]>(initialExpenses);
  const [filters, setFilters] = useState<ExpenseFilterState>(initialFilters);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);

  const [viewingRecord, setViewingRecord] = useState<ExpenseRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<ExpenseRecord | null>(null);

  const handleFilterChange = (updated: Partial<ExpenseFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Add / Edit submit
  const handleSaveExpense = (data: ExpenseFormData) => {
    if (editingRecord) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...r, ...data } : r))
      );
      setEditingRecord(null);
    } else {
      const newRecord: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        ...data,
      };
      setRecords((prev) => [newRecord, ...prev]);
    }
  };

  // Delete confirm
  const handleConfirmDelete = () => {
    if (!deletingRecord) return;
    setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
    setDeletingRecord(null);
  };

  // Open Edit
  const handleStartEdit = (record: ExpenseRecord) => {
    setEditingRecord(record);
    setIsFormModalOpen(true);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = records.reduce((acc, r) => acc + r.amount, 0);

    // Current month prefix e.g. "2026-11"
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    const thisMonthTotal = records
      .filter((r) => r.date.startsWith(currentMonthPrefix))
      .reduce((acc, r) => acc + r.amount, 0);

    const activeCategories = new Set(records.map((r) => r.category)).size;

    return {
      totalExpenses: total,
      thisMonth: thisMonthTotal,
      expenseCategoriesCount: activeCategories,
    };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search by title or description
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = (r.description || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Category filter
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.startDate && r.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && r.date > filters.endDate) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Page Header with Action */}
      <Header
        title="Expense Ledger"
        description="Manage salon operational expenses, bills, staff salaries, and supply costs."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingRecord(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* 3 Summary Cards */}
      <ExpenseStats stats={stats} />

      {/* Filters (Search, Date Range, Category) */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Expenses Table with View / Edit / Delete */}
      <ExpenseTable
        records={filteredRecords}
        onView={(rec) => setViewingRecord(rec)}
        onEdit={handleStartEdit}
        onDelete={(rec) => setDeletingRecord(rec)}
      />

      {/* Add / Edit Expense Form Modal */}
      <ExpenseModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={editingRecord}
      />

      {/* View Expense Modal */}
      <ExpenseViewModal
        isOpen={Boolean(viewingRecord)}
        onClose={() => setViewingRecord(null)}
        record={viewingRecord}
        onEdit={handleStartEdit}
      />

      {/* Delete Confirmation Modal */}
      <ExpenseDeleteModal
        isOpen={Boolean(deletingRecord)}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
        record={deletingRecord}
      />
    </div>
  );
}

export default LedgerExpenses;
