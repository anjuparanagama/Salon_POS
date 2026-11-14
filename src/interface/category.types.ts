export type CategoryKind = "product" | "service" | "expense";

export interface CategoryItem {
  id: string;
  label: string;
  value: string;
  description?: string | null;
  active?: boolean;
  itemCount?: number;
}

export interface CategoryTableItem extends CategoryItem {
  catCode: string;
}

export interface CategoryFormData {
  label: string;
  value?: string;
  description?: string;
  active?: boolean;
}

export type CategorySortField = "catCode" | "label" | "value" | "itemCount" | "active";
export type CategorySearchField = "name" | "slug" | "id" | "all";

export interface CategoryVisibleColumns {
  [key: string]: boolean;
  catId: boolean;
  name: boolean;
  slug: boolean;
  description: boolean;
  itemCount: boolean;
  status: boolean;
}

export interface CategorySettingsViewProps {
  activeTab?: CategoryKind;
  onTabChange?: (tab: CategoryKind) => void;
}
