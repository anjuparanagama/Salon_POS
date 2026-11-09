import {
  Search,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Scissors,
  Sparkles,
  Hand,
  Heart,
  Palette,
  Layers,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type {
  ServiceCategoryItem,
  ServiceFilterState,
} from "../../../../interface/service.types";

export type ServiceFiltersProps = {
  filters: ServiceFilterState;
  categories: ServiceCategoryItem[];
  onFilterChange: (filters: Partial<ServiceFilterState>) => void;
};

const categoryIcons: Record<string, LucideIcon> = {
  all: Layers,
  hair: Scissors,
  skin: Sparkles,
  nails: Hand,
  spa: Heart,
  makeup: Palette,
};

export function ServiceFilters({
  filters,
  categories,
  onFilterChange,
}: ServiceFiltersProps) {
  const tabs = [
    { label: "All Services", value: "all", icon: Layers },
    ...categories.map((cat) => ({
      label: cat.label,
      value: cat.value,
      icon: categoryIcons[cat.value] || Tag,
    })),
  ];

  const isFiltered =
    filters.search !== "" ||
    filters.category !== "all" ||
    (filters.status !== undefined && filters.status !== "all") ||
    filters.sortBy !== "name";

  const handleReset = () => {
    onFilterChange({
      search: "",
      category: "all",
      status: "all",
      sortBy: "name",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Category Quick Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const isSelected = filters.category === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onFilterChange({ category: tab.value })}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar (Appointment Page Style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by service name, description, or category..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <Filter className="size-3.5" />
            <span>Category:</span>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <span>Status:</span>
            <select
              value={filters.status || "all"}
              onChange={(e) =>
                onFilterChange({
                  status: e.target.value as "all" | "active" | "inactive",
                })
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <ArrowUpDown className="size-3.5" />
            <span>Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as ServiceFilterState["sortBy"],
                })
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
            >
              <option value="name">Alphabetical (A - Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Duration (Shortest first)</option>
            </select>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-2xs"
              title="Reset Filters"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceFilters;
