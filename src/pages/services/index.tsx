import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Layers } from "lucide-react";
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceFilterState,
  ServiceFormData,
} from "../../interface/service.types";

import ServiceStats from "./components/service-stats";
import ServiceFilters from "./components/service-filters";
import ServiceCard from "./components/service-card";
import ServiceModal from "./components/service-modal";
import Header from "../../components/header";

const initialCategories: ServiceCategoryItem[] = [
  { id: "cat-1", label: "Hair Care", value: "hair" },
  { id: "cat-2", label: "Skin & Facial", value: "skin" },
  { id: "cat-3", label: "Nail Care", value: "nails" },
  { id: "cat-4", label: "Spa & Massage", value: "spa" },
  { id: "cat-5", label: "Makeup & Bridal", value: "makeup" },
];

const initialServices: ServiceItem[] = [
  {
    id: "svc-1",
    name: "Classic Haircut & Blowdry",
    category: "hair",
    durationMinutes: 45,
    price: 45.0,
    description: "Custom precision cut tailored to hair texture and face shape, followed by signature blowdry styling.",
    isActive: true,
    popular: true,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "svc-2",
    name: "Balayage Color & Gloss Toner",
    category: "hair",
    durationMinutes: 90,
    price: 135.0,
    description: "Hand-painted sun-kissed dimension highlights with custom tone blending and moisturizing gloss finish.",
    isActive: true,
    popular: true,
    images: [
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "svc-3",
    name: "Hydra Deep Cleaning Facial",
    category: "skin",
    durationMinutes: 60,
    price: 85.0,
    description: "Multi-step treatment that cleanses, exfoliates, extracts impurities, and infuses restorative antioxidants.",
    isActive: true,
    popular: true,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "svc-4",
    name: "Anti-Aging Collagen Facial",
    category: "skin",
    durationMinutes: 75,
    price: 110.0,
    description: "Revitalizing firming treatment with pure marine collagen, micro-current lifting, and LED therapy.",
    isActive: true,
  },
  {
    id: "svc-5",
    name: "Deluxe Gel Manicure & Pedicure",
    category: "nails",
    durationMinutes: 65,
    price: 70.0,
    description: "Organic citrus scrub, cuticle care, tension-relief massage, and long-lasting high-shine gel polish.",
    isActive: true,
    popular: true,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "svc-6",
    name: "Acrylic Full Set with Nail Art",
    category: "nails",
    durationMinutes: 80,
    price: 90.0,
    description: "Full extension tips with custom acrylic powder sculpting, hand-painted art accents, and top seal.",
    isActive: true,
  },
  {
    id: "svc-7",
    name: "Aromatherapy Full Body Massage",
    category: "spa",
    durationMinutes: 60,
    price: 95.0,
    description: "Swedish massage technique using pure essential oils to ease muscular tension and restore balance.",
    isActive: true,
  },
  {
    id: "svc-8",
    name: "Hot Stone Therapy Ritual",
    category: "spa",
    durationMinutes: 90,
    price: 130.0,
    description: "Warm basalt stones melt deep tension paired with warm organic oils and rhythmic soothing strokes.",
    isActive: true,
  },
  {
    id: "svc-9",
    name: "Bridal Signature Glam & Lashes",
    category: "makeup",
    durationMinutes: 90,
    price: 165.0,
    description: "Long-wear HD airbrush bridal makeup, mink lash extensions, and complimentary touch-up kit.",
    isActive: true,
    popular: true,
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "svc-10",
    name: "Soft Glam Evening Makeup",
    category: "makeup",
    durationMinutes: 50,
    price: 75.0,
    description: "Flawless luminous skin, defined eyes, tailored contouring, and velvet lips for evening events.",
    isActive: true,
  },
];

export function Services() {
  const { t } = useTranslation(["services", "common"]);
  const [categories, setCategories] = useState<ServiceCategoryItem[]>(initialCategories);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setCategories((prev) => {
      if (prev.some((c) => c.value === newCat.value)) return prev;
      return [...prev, newCat];
    });
  };

  const handleToggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleSaveService = (data: ServiceFormData) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === editingService.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      const newService: ServiceItem = {
        id: `svc-${Date.now()}`,
        ...data,
        popular: false,
      };
      setServices((prev) => [newService, ...prev]);
    }
  };

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const categoriesCount = new Set(services.map((s) => s.category)).size;
    const avgPrice = total > 0 ? services.reduce((acc, s) => acc + s.price, 0) / total : 0;
    const top = services.find((s) => s.popular)?.name ?? (services[0]?.name || "N/A");

    return {
      totalServices: total,
      activeServices: active,
      categoriesCount,
      averagePrice: avgPrice,
      topService: top,
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
      {filteredServices.length === 0 ? (
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
    </div>
  );
}

export default Services;
