import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Layers, Share2, Loader2 } from "lucide-react";
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
    category: "all",
    sortBy: "name",
  });

  const handleFilterChange = (updated: Partial<ServiceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
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
          const matchName = service.name.toLowerCase().includes(q);
          const matchDesc = service.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
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

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("services:title", "Services Catalog")}
        description={t("services:subtitle", "Manage your salon treatments, styling packages, and pricing tiers.")}
        isLoading={isLoading}
        titleSuffix={
          <Tooltip content="Share Service Catalog" placement="right">
            <button
              type="button"
              aria-label="Share Service Catalog"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex size-6 sm:size-7 items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <Share2 aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2} />
            </button>
          </Tooltip>
        }
        actions={
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("services:addService", "Add New Service")}</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <ServiceStats stats={stats} />

      {/* Filter and Search controls */}
      <ServiceFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Service Cards Grid */}
      {isLoading && services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800">Loading services...</h3>
        </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categories={categories}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditClick}
            />
          ))}
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
