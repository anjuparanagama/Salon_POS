import { useState, useMemo } from "react";
import type { IncomeRecord, IncomeFilterState } from "../../../interface/ledger.types";
import Header from "../../../components/header";
import IncomeStats from "./components/income-stats";
import IncomeFilters from "./components/income-filters";
import IncomeTable from "./components/income-table";

// Initial mock sales data representing automated sales receipts from POS checkout
const initialSalesIncomeRecords: IncomeRecord[] = [
  {
    id: "inc-1",
    saleId: "SAL-1001",
    customerName: "Kasun Perera",
    incomeType: "service",
    amount: 14500,
    paymentMethod: "card",
    date: "2026-11-05",
    description: "Keratin Hair Treatment & Styling",
  },
  {
    id: "inc-2",
    saleId: "SAL-1002",
    customerName: "Dilani Fernando",
    incomeType: "product",
    amount: 6800,
    paymentMethod: "cash",
    date: "2026-11-05",
    description: "L'Oreal Professional Hair Serum (100ml)",
  },
  {
    id: "inc-3",
    saleId: "SAL-1003",
    customerName: "Sachini Jayawardena",
    incomeType: "service",
    amount: 4500,
    paymentMethod: "cash",
    date: "2026-11-04",
    description: "Layered Haircut & Blowdry",
  },
  {
    id: "inc-4",
    saleId: "SAL-1004",
    customerName: "Nimasha Silva",
    incomeType: "service",
    amount: 8500,
    paymentMethod: "bank",
    date: "2026-11-03",
    description: "Gold Facial & Cleanup",
  },
  {
    id: "inc-5",
    saleId: "SAL-1005",
    customerName: "Amara Wickramasinghe",
    incomeType: "product",
    amount: 5200,
    paymentMethod: "card",
    date: "2026-11-02",
    description: "Moroccan Argan Shampoo & Conditioner",
  },
  {
    id: "inc-6",
    saleId: "SAL-1006",
    customerName: "Ruwanthi De Silva",
    incomeType: "service",
    amount: 25000,
    paymentMethod: "bank",
    date: "2026-11-01",
    description: "Bridal Full Dressing & Makeup",
  },
  {
    id: "inc-7",
    saleId: "SAL-1007",
    customerName: "Sanduni Gunasekara",
    incomeType: "product",
    amount: 3200,
    paymentMethod: "cash",
    date: "2026-10-30",
    description: "Matte Finish Hair Clay Wax",
  },
  {
    id: "inc-8",
    saleId: "SAL-1008",
    customerName: "Chathurika Senanayake",
    incomeType: "service",
    amount: 6000,
    paymentMethod: "card",
    date: "2026-10-28",
    description: "Pedicure & Manicure Deluxe",
  },
];

const initialFilters: IncomeFilterState = {
  search: "",
  startDate: "",
  endDate: "",
  incomeType: "all",
};

export function LedgerIncome() {
  const [records] = useState<IncomeRecord[]>(initialSalesIncomeRecords);
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
