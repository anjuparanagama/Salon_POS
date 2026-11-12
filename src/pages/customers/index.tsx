import { useState } from "react";
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
    gender: "all",
    sortBy: "recent",
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
    search: filters.search,
    gender: filters.gender,
    sort_by: filters.sortBy,
    pageSize: 100,
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleFilterChange = (updated: Partial<CustomerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
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

      {/* Filters & Search */}
      <CustomerFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Customers List Table */}
      <CustomerList
        customers={customers}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onViewHistory={handleOpenHistory}
      />

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
