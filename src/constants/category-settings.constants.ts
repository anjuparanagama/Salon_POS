import type { AvailableColumn, SearchFieldOption } from "../components/table-toolbar";
import type { CategoryVisibleColumns } from "../interface/category.types";

export const AVAILABLE_CATEGORY_COLUMNS: AvailableColumn[] = [
  { key: "catId", label: "Category ID" },
  { key: "name", label: "Category Name" },
  { key: "slug", label: "Code / Slug" },
  { key: "description", label: "Description" },
  { key: "itemCount", label: "Item Count" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const CATEGORY_SEARCH_OPTIONS: SearchFieldOption[] = [
  { label: "Category Name", value: "name" },
  { label: "Code / Slug", value: "slug" },
  { label: "Category ID", value: "id" },
  { label: "All Fields", value: "all" },
];

export const DEFAULT_CATEGORY_VISIBLE_COLUMNS: CategoryVisibleColumns = {
  catId: true,
  name: true,
  slug: true,
  description: true,
  itemCount: true,
  status: true,
};
