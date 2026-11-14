import {
  FolderTree,
  Loader2,
  ChevronsUpDown,
  Pencil,
  Trash2,
} from "lucide-react";
import type {
  CategoryKind,
  CategoryTableItem,
  CategoryItem,
  CategorySortField,
  CategoryVisibleColumns,
} from "../../../../../interface/category.types";

interface CategoryTableProps {
  activeTab: CategoryKind;
  isLoading: boolean;
  visibleColumns: CategoryVisibleColumns;
  paginatedCategories: CategoryTableItem[];
  searchQuery: string;
  onSort: (field: CategorySortField) => void;
  onQuickToggle: (item: CategoryItem) => void;
  onOpenEdit: (item: CategoryItem) => void;
  onDelete: (item: CategoryItem) => void;
}

export function CategoryTable({
  activeTab,
  isLoading,
  visibleColumns,
  paginatedCategories,
  searchQuery,
  onSort,
  onQuickToggle,
  onOpenEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-[#f4f7fb] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {visibleColumns.catId && (
                <th
                  onClick={() => onSort("catCode")}
                  className="px-4 py-3 min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center gap-1">
                    <span>CATEGORY ID</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              <th
                onClick={() => onSort("label")}
                className="px-4 py-3 min-w-[200px] cursor-pointer hover:bg-slate-200/60 select-none transition"
              >
                <div className="flex items-center gap-1">
                  <span>CATEGORY NAME</span>
                  <ChevronsUpDown className="size-3 text-slate-400" />
                </div>
              </th>

              {visibleColumns.slug && (
                <th
                  onClick={() => onSort("value")}
                  className="px-4 py-3 min-w-[140px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center gap-1">
                    <span>CODE / SLUG</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              {visibleColumns.description && (
                <th className="px-4 py-3 min-w-[240px]">
                  <span>DESCRIPTION</span>
                </th>
              )}

              {visibleColumns.itemCount && (
                <th
                  onClick={() => onSort("itemCount")}
                  className="px-4 py-3 text-center min-w-[130px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>
                      ASSIGNED{" "}
                      {activeTab === "product"
                        ? "PRODUCTS"
                        : activeTab === "service"
                        ? "SERVICES"
                        : "EXPENSES"}
                    </span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              {visibleColumns.status && (
                <th
                  onClick={() => onSort("active")}
                  className="px-4 py-3 text-center min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>STATUS</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>
              )}

              <th className="px-4 py-3 text-right min-w-[100px]">
                <span>ACTIONS</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" />
                  <span>Loading categories...</span>
                </td>
              </tr>
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <FolderTree className="size-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No categories found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {searchQuery
                      ? "Try clearing your search query"
                      : `Click "+ Add Category" to create your first ${activeTab} category.`}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((item) => {
                const isActive = item.active !== false;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition group"
                  >
                    {/* Category ID */}
                    {visibleColumns.catId && (
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                        {item.catCode}
                      </td>
                    )}

                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full shrink-0 ${
                            activeTab === "product"
                              ? "bg-emerald-500"
                              : activeTab === "service"
                              ? "bg-purple-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="text-xs">{item.label}</span>
                      </div>
                    </td>

                    {/* Code / Slug */}
                    {visibleColumns.slug && (
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                          {item.value}
                        </span>
                      </td>
                    )}

                    {/* Description */}
                    {visibleColumns.description && (
                      <td className="px-4 py-3.5 text-slate-600 max-w-[280px]">
                        {item.description && item.description.trim() ? (
                          <span className="truncate block" title={item.description}>
                            {item.description}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    )}

                    {/* Count of Products / Services */}
                    {visibleColumns.itemCount && (
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {item.itemCount || 0}{" "}
                          {activeTab === "product"
                            ? "products"
                            : activeTab === "service"
                            ? "services"
                            : "expenses"}
                        </span>
                      </td>
                    )}

                    {/* Status Toggle */}
                    {visibleColumns.status && (
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onQuickToggle(item)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>
                    )}

                    {/* Actions: Edit & Delete */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(item)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-primary transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
