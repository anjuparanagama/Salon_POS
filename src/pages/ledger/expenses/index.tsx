import { useState, useMemo } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  searchField: "title",
  startDate: "",
  endDate: "",
  category: "all",
  paymentMethod: "all",
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

  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    title: true,
    description: true,
    category: true,
    amount: true,
    paymentMethod: true,
    date: true,
    actions: true,
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);

  const [viewingRecord, setViewingRecord] = useState<ExpenseRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<ExpenseRecord | null>(null);

  const handleFilterChange = (updated: Partial<ExpenseFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey] === false ? true : false,
    }));
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
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const searchField = filters.searchField || "title";

        if (searchField === "title") {
          if (!r.title.toLowerCase().includes(query)) return false;
        } else if (searchField === "description") {
          if (!(r.description || "").toLowerCase().includes(query)) return false;
        } else {
          const matchesTitle = r.title.toLowerCase().includes(query);
          const matchesDesc = (r.description || "").toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
        }
      }

      // Category filter
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== "all" && r.paymentMethod !== filters.paymentMethod) {
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

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) return;
    const headers = ["Title", "Description", "Category", "Amount", "Payment Method", "Date"];
    const rows = filteredRecords.map((r) => [
      `"${r.title.replace(/"/g, '""')}"`,
      `"${(r.description || "").replace(/"/g, '""')}"`,
      `"${r.category}"`,
      r.amount,
      r.paymentMethod,
      r.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `expenses_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Filters (Search, Date Range, Category, Segmented Bar) */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Expenses Table with View / Edit / Delete */}
      <ExpenseTable
        records={paginatedRecords}
        isLoading={isLoading}
        onView={(rec) => setViewingRecord(rec)}
        onEdit={handleStartEdit}
        onDelete={(rec) => setDeletingRecord(rec)}
        visibleColumns={visibleColumns}
      />

      {/* Pagination Footer */}
      {filteredRecords.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-slate-600 border-t border-slate-100">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {Math.min((currentPage - 1) * pageSize + 1, filteredRecords.length)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, filteredRecords.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {filteredRecords.length}
            </span>{" "}
            items
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredRecords.length / pageSize))}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredRecords.length / pageSize) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(filteredRecords.length / pageSize)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

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
