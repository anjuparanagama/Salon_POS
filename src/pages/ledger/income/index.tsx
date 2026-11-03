import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { IncomeRecord, IncomeFilterState, IncomeFormData } from "../../../interface/ledger.types";

import LedgerNav from "../components/ledger-nav";
import IncomeStats from "./components/income-stats";
import IncomeFilters from "./components/income-filters";
import IncomeTable from "./components/income-table";
import IncomeModal from "./components/income-modal";

const initialIncomeRecords: IncomeRecord[] = [
  {
    id: "inc-1",
    date: new Date().toISOString().split("T")[0],
    category: "service_sale",
    sourceTitle: "Balayage Color & Gloss Toner",
    customerName: "Mia Johnson",
    amount: 135.0,
    paymentMethod: "card",
    invoiceNo: "INV-80211",
  },
  {
    id: "inc-2",
    date: new Date().toISOString().split("T")[0],
    category: "product_sale",
    sourceTitle: "Moroccan Argan Repair Shampoo (500ml)",
    customerName: "Emma Wilson",
    amount: 34.0,
    paymentMethod: "card",
    invoiceNo: "INV-80212",
  },
  {
    id: "inc-3",
    date: new Date().toISOString().split("T")[0],
    category: "service_sale",
    sourceTitle: "Classic Haircut & Blowdry",
    customerName: "Sophia Brown",
    amount: 45.0,
    paymentMethod: "cash",
    invoiceNo: "INV-80213",
  },
  {
    id: "inc-4",
    date: "2026-11-02",
    category: "service_sale",
    sourceTitle: "Hydra Deep Cleaning Facial",
    customerName: "Ava Smith",
    amount: 85.0,
    paymentMethod: "card",
    invoiceNo: "INV-80198",
  },
  {
    id: "inc-5",
    date: "2026-11-02",
    category: "product_sale",
    sourceTitle: "Olaplex No. 3 Hair Perfector",
    customerName: "Charlotte Davis",
    amount: 38.0,
    paymentMethod: "online",
    invoiceNo: "INV-80199",
  },
  {
    id: "inc-6",
    date: "2026-11-01",
    category: "service_sale",
    sourceTitle: "Bridal Full Glam & Lashes",
    customerName: "Harper Lee",
    amount: 165.0,
    paymentMethod: "card",
    invoiceNo: "INV-80170",
  },
];

export function LedgerIncome() {
  const [records, setRecords] = useState<IncomeRecord[]>(initialIncomeRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<IncomeFilterState>({
    search: "",
    category: "all",
    paymentMethod: "all",
  });

  const handleFilterChange = (updated: Partial<IncomeFilterState>) => {
    setFilters((prev: IncomeFilterState) => ({ ...prev, ...updated }));
  };

  const handleAddIncome = (data: IncomeFormData) => {
    const newRecord: IncomeRecord = {
      id: `inc-${Date.now()}`,
      ...data,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const stats = useMemo(() => {
    const total = records.reduce((acc, r) => acc + r.amount, 0);
    const serviceInc = records
      .filter((r) => r.category === "service_sale")
      .reduce((acc, r) => acc + r.amount, 0);
    const productInc = records
      .filter((r) => r.category === "product_sale")
      .reduce((acc, r) => acc + r.amount, 0);
    const todayInc = records
      .filter((r) => r.date === todayStr)
      .reduce((acc, r) => acc + r.amount, 0);

    return {
      totalIncome: total,
      serviceIncome: serviceInc,
      productIncome: productInc,
      todayIncome: todayInc,
    };
  }, [records, todayStr]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesInv = r.invoiceNo.toLowerCase().includes(query);
        const matchesCust = r.customerName.toLowerCase().includes(query);
        const matchesTitle = r.sourceTitle.toLowerCase().includes(query);
        if (!matchesInv && !matchesCust && !matchesTitle) return false;
      }
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }
      if (filters.paymentMethod !== "all" && r.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      return true;
    });
  }, [records, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Shared Ledger Navigation Tabs */}
      <LedgerNav activeTab="income" />

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Sales & Revenue Breakdown</h2>
          <p className="text-xs text-slate-500">Service treatments and retail product sales records.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Record Income</span>
        </button>
      </div>

      {/* KPI Stats */}
      <IncomeStats stats={stats} />

      {/* Filters */}
      <IncomeFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      <IncomeTable records={filteredRecords} />

      {/* Record Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddIncome}
      />
    </div>
  );
}

export default LedgerIncome;
