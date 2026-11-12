import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IncomeFilterState } from "../../../interface/ledger.types";
import { useIncomeLedger } from "../../../hooks/ledger";
import Header from "../../../components/header";
import IncomeStats from "./components/income-stats";
import IncomeFilters from "./components/income-filters";
import IncomeTable from "./components/income-table";

const initialFilters: IncomeFilterState = {
  search: "",
  searchField: "saleId",
  startDate: "",
  endDate: "",
  incomeType: "all",
  paymentMethod: "all",
};

export function LedgerIncome() {
  const { records, isLoading } = useIncomeLedger();
  const [filters, setFilters] = useState<IncomeFilterState>(initialFilters);

  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    saleId: true,
    customer: true,
    description: true,
    incomeType: true,
    amount: true,
    paymentMethod: true,
    date: true,
  });

  const handleFilterChange = (updated: Partial<IncomeFilterState>) => {
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

  // Summary statistics calculated directly from sales records
  const stats = useMemo(() => {
    const total = records.reduce((acc, r) => acc + r.amount, 0);
    const serviceInc = records
      .filter((r) => r.incomeType === "service")
      .reduce((acc, r) => acc + r.amount, 0);
    const productInc = records
      .filter((r) => r.incomeType === "product")
      .reduce((acc, r) => acc + r.amount, 0);

    return {
      totalIncome: total,
      serviceIncome: serviceInc,
      productIncome: productInc,
    };
  }, [records]);

  // Filtered list based on Search, Date Range, Income Type, Payment Method
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const searchField = filters.searchField || "saleId";

        if (searchField === "saleId") {
          if (!r.saleId.toLowerCase().includes(query)) return false;
        } else if (searchField === "customer") {
          if (!r.customerName.toLowerCase().includes(query)) return false;
        } else if (searchField === "description") {
          if (!(r.description || "").toLowerCase().includes(query)) return false;
        } else {
          const matchesSaleId = r.saleId.toLowerCase().includes(query);
          const matchesCustomer = r.customerName.toLowerCase().includes(query);
          const matchesDesc = (r.description || "").toLowerCase().includes(query);
          if (!matchesSaleId && !matchesCustomer && !matchesDesc) return false;
        }
      }

      // Income Type filter
      if (filters.incomeType !== "all" && r.incomeType !== filters.incomeType) {
        return false;
      }

      // Payment Method filter
      if (filters.paymentMethod && filters.paymentMethod !== "all" && r.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Date Range filter
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

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) return;
    const headers = ["Sale ID", "Customer", "Description", "Income Type", "Amount", "Payment Method", "Date"];
    const rows = filteredRecords.map((r) => [
      `"${r.saleId}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${(r.description || "").replace(/"/g, '""')}"`,
      r.incomeType,
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
      `income_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Page Header */}
      <Header
        title="Income Ledger"
        description="Track incoming salon revenue automatically recorded from service treatments and product sales."
        isLoading={isLoading}
      />

      {/* 3 Summary Cards */}
      <IncomeStats stats={stats} />

      {/* Filters (Date Range, Income Type, Search) */}
      <IncomeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Income Table */}
      <IncomeTable
        records={paginatedRecords}
        isLoading={isLoading}
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
    </div>
  );
}

export default LedgerIncome;
