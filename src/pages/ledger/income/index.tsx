import { useState, useMemo } from "react";
import type { IncomeFilterState } from "../../../interface/ledger.types";
import { useIncomeLedger } from "../../../hooks/ledger";
import Header from "../../../components/header";
import IncomeStats from "./components/income-stats";
import IncomeFilters from "./components/income-filters";
import IncomeTable from "./components/income-table";

const initialFilters: IncomeFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  incomeType: "all",
};

export function LedgerIncome() {
  const { records } = useIncomeLedger();
  const [filters, setFilters] = useState<IncomeFilterState>(initialFilters);

  const handleFilterChange = (updated: Partial<IncomeFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
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

  // Filtered list based on Search, Date Range, and Income Type
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search by Sale ID or Customer name
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesSaleId = r.saleId.toLowerCase().includes(query);
        const matchesCustomer = r.customerName.toLowerCase().includes(query);
        if (!matchesSaleId && !matchesCustomer) return false;
      }

      // Income Type filter
      if (filters.incomeType !== "all" && r.incomeType !== filters.incomeType) {
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

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Page Header */}
      <Header
        title="Income Ledger"
        description="Track incoming salon revenue automatically recorded from service treatments and product sales."
      />

      {/* 3 Summary Cards */}
      <IncomeStats stats={stats} />

      {/* Filters (Date Range, Income Type, Search) */}
      <IncomeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Income Table */}
      <IncomeTable records={filteredRecords} />
    </div>
  );
}

export default LedgerIncome;
