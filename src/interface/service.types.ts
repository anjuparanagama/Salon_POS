export type ServiceCategory =
  | "all"
  | "hair"
  | "skin"
  | "nails"
  | "spa"
  | "makeup";

export type ServiceItem = {
  id: string;
  name: string;
  category: "hair" | "skin" | "nails" | "spa" | "makeup";
  durationMinutes: number;
  price: number;
  description: string;
  isActive: boolean;
  popular?: boolean;
};

export type ServiceStats = {
  totalServices: number;
  activeServices: number;
  categoriesCount: number;
  averagePrice: number;
  topService: string;
};

export type ServiceFilterState = {
  search: string;
  category: ServiceCategory;
  sortBy: "name" | "price-asc" | "price-desc" | "duration";
};

export type ServiceFormData = {
  name: string;
  category: "hair" | "skin" | "nails" | "spa" | "makeup";
  durationMinutes: number;
  price: number;
  description: string;
  isActive: boolean;
};

