export interface CartServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
  isAppointmentService?: boolean;
}

export interface CartProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  quantity: number;
}

export type CatalogTab = "services" | "products";

export interface CatalogServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
  categoryId?: string;
}
