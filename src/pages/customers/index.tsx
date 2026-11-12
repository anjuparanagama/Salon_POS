import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, RefreshCw, AlertCircle } from "lucide-react";
import type {
  Customer,
  CustomerFilterState,
  CustomerFormData,
} from "../../interface/customer.types";

import CustomerStats from "./components/customer-stats";
import CustomerFilters from "./components/customer-filters";
import CustomerList from "./components/customer-list";
import CustomerPanel from "./components/customer-panel";
import CustomerViewPanel from "./components/customer-view-panel";
import Header from "../../components/header";
import { useCustomers } from "../../hooks/customers";

export function Customers() {
  const { t } = useTranslation(["common"]);

  const [filters, setFilters] = useState<CustomerFilterState>({
    search: "",
    searchField: "name",
    gender: "all",
    sortBy: "recent",
  });

  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    contact: true,
    lastVisit: true,
    visitsSpend: true,
    history: true,
    actions: true,
  });

  const {
    customers,
    stats,
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchAll,
  } = useCustomers({
    pageSize: 100,
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleFilterChange = (updated: Partial<CustomerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey] === false ? true : false,
    }));
  };

  const handleOpenAdd = () => {
    setActionError(null);
    setEditingCustomer(null);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setActionError(null);
    setEditingCustomer(customer);
    setIsPanelOpen(true);
  };

  const handleOpenHistory = (customer: Customer) => {
    setHistoryCustomer(customer);
  };

  const handleDelete = async (customerId: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    setActionError(null);
    try {
      await deleteCustomer(customerId);
    } catch (err: any) {
      setActionError(err.message || "Failed to delete customer");
    }
  };

  const handleSaveCustomer = async (data: CustomerFormData) => {
    setActionError(null);
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
      } else {
        await createCustomer(data);
      }
      setIsPanelOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const searchField = filters.searchField || "name";

          if (searchField === "name") {
            if (!c.name.toLowerCase().includes(query)) return false;
          } else if (searchField === "phone") {
            if (!c.phone.toLowerCase().includes(query)) return false;
          } else if (searchField === "email") {
            if (!c.email.toLowerCase().includes(query)) return false;
          } else {
            // "all"
            const matchesName = c.name.toLowerCase().includes(query);
            const matchesPhone = c.phone.toLowerCase().includes(query);
            const matchesEmail = c.email.toLowerCase().includes(query);
            if (!matchesName && !matchesPhone && !matchesEmail) return false;
          }
        }

        if (filters.gender !== "all" && c.gender !== filters.gender) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "visits") return b.totalVisits - a.totalVisits;
        if (filters.sortBy === "spent") return b.totalSpent - a.totalSpent;
        if (filters.sortBy === "name") return a.name.localeCompare(b.name);
        // Default: most recent visit
        const timeA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
        const timeB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
        return timeB - timeA;
      });
  }, [customers, filters]);

  // Paginated customers slice
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Export CSV handler
  const handleExportCsv = () => {
    if (filteredCustomers.length === 0) return;

    const headers = ["Customer Name", "Phone Number", "Email", "Gender", "Total Visits", "Total Spent", "Last Visit"];
    const rows = filteredCustomers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email || ""}"`,
      `"${c.gender}"`,
      c.totalVisits,
      c.totalSpent,
      `"${c.lastVisit || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("customers.title", "Customer Directory")}
        description={t(
          "customers.subtitle",
          "Track salon clients, visits, spends, and complete service histories."
        )}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAll()}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
            >
              <UserPlus className="size-4" />
              <span>{t("customers.addCustomer", "New Customer")}</span>
            </button>
          </div>
        }
      />

      {/* Action / Error Banner */}
      {(error || actionError) && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{actionError || error}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="font-semibold text-rose-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <CustomerStats stats={stats} />

      {/* Filters Bar (Exact Appointment Page Pattern) */}
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Customers List Table */}
      <CustomerList
        customers={paginatedCustomers}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onViewHistory={handleOpenHistory}
      />

      {/* Pagination Footer */}
      {filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-1 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, filteredCustomers.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-800">{filteredCustomers.length}</span> customers
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 text-xs font-medium text-slate-600">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Customer Create/Edit Drawer Side Panel */}
      <CustomerPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleSaveCustomer}
        editingCustomer={editingCustomer}
        isLoading={isSubmitting}
      />

      {/* Service History / Customer View Drawer Side Panel */}
      <CustomerViewPanel
        isOpen={!!historyCustomer}
        onClose={() => setHistoryCustomer(null)}
        customer={historyCustomer}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}

export default Customers;
