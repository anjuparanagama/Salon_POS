import { Search, ArrowUpDown, Scissors, Sparkles, Hand, Heart, Palette, Layers } from "lucide-react";
import type { ServiceCategory, ServiceFilterState } from "../../../../interface/service.types";

export type ServiceFiltersProps = {
  filters: ServiceFilterState;
  onFilterChange: (filters: Partial<ServiceFilterState>) => void;
};

const categoryTabs: { label: string; value: ServiceCategory; icon: typeof Scissors }[] = [
  { label: "All Services", value: "all", icon: Layers },
  { label: "Hair Care", value: "hair", icon: Scissors },
  { label: "Skin & Facial", value: "skin", icon: Sparkles },
  { label: "Nail Care", value: "nails", icon: Hand },
  { label: "Spa & Massage", value: "spa", icon: Heart },
  { label: "Makeup & Bridal", value: "makeup", icon: Palette },
];

export function ServiceFilters({ filters, onFilterChange }: ServiceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
        {categoryTabs.map((tab) => {
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
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search service name, description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <ArrowUpDown className="size-3.5" />
            <span>Sort By:</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as ServiceFilterState["sortBy"] })}
            className="w-full sm:w-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="name">Alphabetical (A - Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration">Duration (Shortest first)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ServiceFilters;

