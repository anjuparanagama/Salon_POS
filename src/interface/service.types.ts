export type ServiceCategory = string;

export type ServiceCategoryItem = {
  id: string;
  label: string;
  value: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  isActive: boolean;
  popular?: boolean;
  images?: string[];
};

export type ServiceStats = {
  totalServices: number;
  categoriesCount: number;
  activeServices: number;
  inactiveServices: number;
  averagePrice?: number;
  topService?: string;
};

export type ServiceFilterState = {
  search: string;
  searchField?: "all" | "name" | "category" | "description";
  category: ServiceCategory;
  sortBy: "name" | "price-asc" | "price-desc" | "duration";
  status?: "all" | "active" | "inactive";
};

export type ServiceFormData = {
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  isActive: boolean;
  images?: string[];
};

export type ShareServicesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
};
