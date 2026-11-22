import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  ExpenseRecord,
  ExpenseFilterState,
  ExpenseFormData,
} from "../../../interface/ledger.types";
import { useExpensesLedger } from "../../../hooks/ledger";
import Header from "../../../components/header";
import Pagination from "../../../components/pagination";
import ExpenseStats from "./components/expense-stats";
import ExpenseFilters from "./components/expense-filters";
import ExpenseTable from "./components/expense-table";
import ExpensePanel from "./components/expense-modal";
import ExpenseViewModal from "./components/expense-view-modal";
import ExpenseDeleteModal from "./components/expense-delete-modal";
import { Button } from "../../../components/button";

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

  const [pageSize, setPageSize] = useState<number>(10);
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
          <Button
            type="button"
            onClick={() => {
              setEditingRecord(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Expense</span>
          </Button>
        }
      />

      {/* 3 Summary Cards */}
      <ExpenseStats stats={stats} isLoading={isLoading} />

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
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredRecords.length / pageSize))}
          totalItems={filteredRecords.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="records"
          className="mt-1"
        />
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
