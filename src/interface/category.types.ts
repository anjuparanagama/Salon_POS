export interface CategoryItem {
  id: string;
  label: string;
  value: string;
  description?: string | null;
  active?: boolean;
  itemCount?: number;
}

export interface CategoryFormData {
  label: string;
  value?: string;
  description?: string;
  active?: boolean;
}

