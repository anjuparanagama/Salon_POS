import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  ExpenseRecord,
  ExpenseFilterState,
  ExpenseFormData,
} from "../../../interface/ledger.types";
import { useExpensesLedger } from "../../../hooks/ledger";
import Header from "../../../components/header";
import ExpenseStats from "./components/expense-stats";
import ExpenseFilters from "./components/expense-filters";
import ExpenseTable from "./components/expense-table";
import ExpensePanel from "./components/expense-modal";
import ExpenseViewModal from "./components/expense-view-modal";
import ExpenseDeleteModal from "./components/expense-delete-modal";

const initialFilters: ExpenseFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  category: "all",
};

export function LedgerExpenses() {
  const {
    records,
    createExpense,
    updateExpense,
    deleteExpense,
    isLoading,
  } = useExpensesLedger();

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
  const handleSaveExpense = async (data: ExpenseFormData) => {
    if (editingRecord) {
      await updateExpense(editingRecord.id, data);
      setEditingRecord(null);
    } else {
      await createExpense(data);
    }
    setIsFormModalOpen(false);
  };

  // Delete confirm
  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;
    await deleteExpense(deletingRecord.id);
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
        isLoading={isLoading}
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
        isLoading={isLoading}
        onView={(rec) => setViewingRecord(rec)}
        onEdit={handleStartEdit}
        onDelete={(rec) => setDeletingRecord(rec)}
      />

      {/* Add / Edit Expense Form Side Panel */}
      <ExpensePanel
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
