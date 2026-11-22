import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Layers, Share2 } from "lucide-react";
import { CardGridSkeleton } from "../../components/skeleton";
import Pagination from "../../components/pagination";
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceFilterState,
  ServiceFormData,
} from "../../interface/service.types";
import { useServices } from "../../hooks/services";

import ServiceStats from "./components/service-stats";
import ServiceFilters from "./components/service-filters";
import ServiceCard from "./components/service-card";
import ServiceModal from "./components/service-modal";
import ShareServicesModal from "./components/share-services-modal";
import Header from "../../components/header";
import Tooltip from "../../components/tooltip";
import { Button } from "../../components/button";



export function Services() {
  const { t } = useTranslation(["services", "common"]);
  const {
    services,
    categories,
    createService,
    updateService,
    toggleStatus,
    addCategory,
    isLoading,
  } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [filters, setFilters] = useState<ServiceFilterState>({
    search: "",
    searchField: "name",
    category: "all",
    sortBy: "name",
    status: "all",
  });

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    category: true,
    duration: true,
    price: true,
    status: true,
    description: true,
  });

  const handleFilterChange = (updated: Partial<ServiceFilterState>) => {
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

  const handleAddCategory = (newCat: ServiceCategoryItem) => {
    addCategory(newCat.label, newCat.value);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
  };

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleSaveService = async (data: ServiceFormData) => {
    if (editingService) {
      await updateService(editingService.id, data);
    } else {
      await createService(data);
    }
  };

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const inactive = total - active;
    const categoriesCount = new Set(services.map((s) => s.category)).size;

    return {
      totalServices: total,
      categoriesCount,
      activeServices: active,
      inactiveServices: inactive,
    };
  }, [services]);

  // Filtered and sorted services
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        // Search
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const searchField = filters.searchField || "name";

          if (searchField === "name") {
            if (!service.name.toLowerCase().includes(q)) return false;
          } else if (searchField === "category") {
            if (!service.category.toLowerCase().includes(q)) return false;
          } else if (searchField === "description") {
            if (!(service.description || "").toLowerCase().includes(q)) return false;
          } else {
            const matchName = service.name.toLowerCase().includes(q);
            const matchDesc = (service.description || "").toLowerCase().includes(q);
            const matchCat = service.category.toLowerCase().includes(q);
            if (!matchName && !matchDesc && !matchCat) return false;
          }
        }

        // Status filter
        if (filters.status && filters.status !== "all") {
          if (filters.status === "active" && !service.isActive) return false;
          if (filters.status === "inactive" && service.isActive) return false;
        }

        // Category filter
        if (filters.category !== "all" && service.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-asc") return a.price - b.price;
        if (filters.sortBy === "price-desc") return b.price - a.price;
        if (filters.sortBy === "duration") return a.durationMinutes - b.durationMinutes;
        return a.name.localeCompare(b.name);
      });
  }, [services, filters]);

  // Paginated services
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredServices.length === 0) return;
    const headers = ["Service Name", "Category", "Duration (mins)", "Price", "Status", "Description"];
    const rows = filteredServices.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.category.replace(/"/g, '""')}"`,
      s.durationMinutes,
      s.price,
      s.isActive ? "Active" : "Inactive",
      `"${(s.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `services_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("services:title", "Services Catalog")}
        description={t("services:subtitle", "Manage your salon treatments, styling packages, and pricing tiers.")}
        isLoading={isLoading}
        titleSuffix={
          <Tooltip content="Share Service Catalog" placement="right">
            <Button
              type="button"
              aria-label="Share Service Catalog"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex size-6 sm:size-7 items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <Share2 aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2} />
            </Button>
          </Tooltip>
        }
        actions={
          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("services:addService", "Add New Service")}</span>
          </Button>
        }
      />

      {/* KPI Stats */}
      <ServiceStats stats={stats} isLoading={isLoading} />

      {/* Filter and Search controls */}
      <ServiceFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Service Cards Grid */}
      {isLoading && services.length === 0 ? (
        <CardGridSkeleton count={6} />
      ) : filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <Layers className="size-6" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">No services found</h3>
          <p className="mt-1 text-xs text-slate-500">
            Try switching category tabs or clearing your search keywords.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                categories={categories}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditClick}
              />
            ))}
          </div>

          {/* Pagination Footer */}
          {filteredServices.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredServices.length / pageSize))}
              totalItems={filteredServices.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="entries"
              className="mt-1"
            />
          )}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveService}
        editingService={editingService}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Share Services Modal */}
      <ShareServicesModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default Services;
