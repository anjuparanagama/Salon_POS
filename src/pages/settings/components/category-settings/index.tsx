import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Plus,
  Trash2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  FolderTree,
  ChevronsUpDown,
  Pencil,
} from "lucide-react";
import Pagination from "../../../../components/pagination";
import { Input } from "../../../../components/input";
import TableToolbar, {
  type AvailableColumn,
  type SearchFieldOption,
} from "../../../../components/table-toolbar";
import { productsService } from "../../../../services/products.service";
import { servicesService } from "../../../../services/services.service";
import { ledgerService } from "../../../../services/ledger.service";
import type { CategoryItem, CategoryFormData } from "../../../../interface/category.types";

export type CategoryKind = "product" | "service" | "expense";

const AVAILABLE_CATEGORY_COLUMNS: AvailableColumn[] = [
  { key: "catId", label: "Category ID" },
  { key: "name", label: "Category Name" },
  { key: "slug", label: "Code / Slug" },
  { key: "description", label: "Description" },
  { key: "itemCount", label: "Item Count" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const CATEGORY_SEARCH_OPTIONS: SearchFieldOption[] = [
  { label: "Category Name", value: "name" },
  { label: "Code / Slug", value: "slug" },
  { label: "Category ID", value: "id" },
  { label: "All Fields", value: "all" },
];

export interface CategorySettingsViewProps {
  activeTab?: CategoryKind;
  onTabChange?: (tab: CategoryKind) => void;
}

export default function CategorySettingsView({
  activeTab = "product",
}: CategorySettingsViewProps = {}) {

  // State for Product Categories
  const [productCats, setProductCats] = useState<CategoryItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // State for Service Categories
  const [serviceCats, setServiceCats] = useState<CategoryItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // State for Expense Categories
  const [expenseCats, setExpenseCats] = useState<CategoryItem[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Grid Controls & Table Preferences matching StoreMate styling
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"name" | "slug" | "id" | "all">("name");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<"catCode" | "label" | "value" | "itemCount" | "active">("catCode");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [visibleColumns, setVisibleColumns] = useState({
    catId: true,
    name: true,
    slug: true,
    description: true,
    itemCount: true,
    status: true,
  });

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete Confirm State
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load product categories
  const loadProductCategories = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsService.getCategories();
      setProductCats(data);
    } catch (err) {
      console.error("Failed to load product categories:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load service categories
  const loadServiceCategories = async () => {
    setLoadingServices(true);
    try {
      const data = await servicesService.getCategories();
      setServiceCats(data);
    } catch (err) {
      console.error("Failed to load service categories:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  // Load expense categories
  const loadExpenseCategories = async () => {
    setLoadingExpenses(true);
    try {
      const data = await ledgerService.getExpenseCategories();
      setExpenseCats(data);
    } catch (err) {
      console.error("Failed to load expense categories:", err);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    loadProductCategories();
    loadServiceCategories();
    loadExpenseCategories();
  }, []);

  const activeCategories =
    activeTab === "product"
      ? productCats
      : activeTab === "service"
      ? serviceCats
      : expenseCats;

  const isLoading =
    activeTab === "product"
      ? loadingProducts
      : activeTab === "service"
      ? loadingServices
      : loadingExpenses;

  // Compute categories list with clean Category Code (e.g. CAT-01, CAT-02)
  const computedCategoryList = useMemo(() => {
    return activeCategories
      .filter((c) => c.value !== "all")
      .map((c, idx) => ({
        ...c,
        catCode: `CAT-${String(idx + 1).padStart(2, "0")}`,
      }));
  }, [activeCategories]);

  // Filtered and sorted categories
  const filteredAndSorted = useMemo(() => {
    const list = computedCategoryList.filter((cat) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (searchField === "name") {
          return cat.label.toLowerCase().includes(q);
        } else if (searchField === "slug") {
          return cat.value.toLowerCase().includes(q);
        } else if (searchField === "id") {
          return cat.catCode.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
        } else {
          return (
            cat.label.toLowerCase().includes(q) ||
            cat.value.toLowerCase().includes(q) ||
            cat.catCode.toLowerCase().includes(q) ||
            (cat.description || "").toLowerCase().includes(q)
          );
        }
      }
      return true;
    });

    list.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      if (sortField === "catCode") {
        valA = a.catCode;
        valB = b.catCode;
      } else if (sortField === "label") {
        valA = a.label.toLowerCase();
        valB = b.label.toLowerCase();
      } else if (sortField === "value") {
        valA = a.value.toLowerCase();
        valB = b.value.toLowerCase();
      } else if (sortField === "itemCount") {
        valA = a.itemCount || 0;
        valB = b.itemCount || 0;
      } else if (sortField === "active") {
        valA = a.active !== false ? 1 : 0;
        valB = b.active !== false ? 1 : 0;
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [computedCategoryList, searchQuery, searchField, sortField, sortAsc]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field: "catCode" | "label" | "value" | "itemCount" | "active") => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export for Download button
  const handleExportCSV = () => {
    const headers = ["CATEGORY ID", "CATEGORY NAME", "SLUG / CODE", "DESCRIPTION", "ITEM COUNT", "STATUS"];
    const rows = filteredAndSorted.map((c) => [
      c.catCode,
      `"${c.label.replace(/"/g, '""')}"`,
      c.value,
      `"${(c.description || "").replace(/"/g, '""')}"`,
      c.itemCount || 0,
      c.active !== false ? "Active" : "Inactive",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_categories_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setFormActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.label);
    setFormCode(cat.value);
    setFormDescription(cat.description || "");
    setFormActive(cat.active !== false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generatedCode = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      setFormCode(generatedCode);
    }
  };

  // Submit Add / Edit Form
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }

    const finalCode =
      formCode.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_") ||
      formName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");

    const payload: CategoryFormData = {
      label: formName.trim(),
      value: finalCode,
      description: formDescription.trim() || undefined,
      active: formActive,
    };

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingCategory) {
        if (activeTab === "product") {
          const updated = await productsService.updateCategory(editingCategory.id, payload);
          setProductCats((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? updated : c))
          );
        } else if (activeTab === "service") {
          const updated = await servicesService.updateCategory(editingCategory.id, payload);
          setServiceCats((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? updated : c))
          );
        } else {
          const updated = await ledgerService.updateExpenseCategory(editingCategory.id, payload);
          setExpenseCats((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? updated : c))
          );
        }
      } else {
        if (activeTab === "product") {
          const created = await productsService.createCategory(payload);
          setProductCats((prev) => [...prev, created]);
        } else if (activeTab === "service") {
          const created = await servicesService.createCategory(payload);
          setServiceCats((prev) => [...prev, created]);
        } else {
          const created = await ledgerService.createExpenseCategory(payload);
          setExpenseCats((prev) => [...prev, created]);
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Failed to save category:", err);
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setErrorMessage(detail || "Failed to save category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle active status directly from table
  const handleQuickToggle = async (cat: CategoryItem) => {
    const newActive = cat.active === false ? true : false;
    try {
      if (activeTab === "product") {
        await productsService.updateCategory(cat.id, { active: newActive });
        setProductCats((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: newActive } : c))
        );
      } else if (activeTab === "service") {
        await servicesService.updateCategory(cat.id, { active: newActive });
        setServiceCats((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: newActive } : c))
        );
      } else {
        await ledgerService.updateExpenseCategory(cat.id, { active: newActive });
        setExpenseCats((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: newActive } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle category status:", err);
    }
  };

  // Delete category
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      if (activeTab === "product") {
        await productsService.deleteCategory(deletingCategory.id);
        setProductCats((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      } else if (activeTab === "service") {
        await servicesService.deleteCategory(deletingCategory.id);
        setServiceCats((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      } else {
        await ledgerService.deleteExpenseCategory(deletingCategory.id);
        setExpenseCats((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      }
      setDeletingCategory(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-slate-900 animate-in fade-in duration-150">
      {/* Integrated Reusable TableToolbar */}
      <TableToolbar
        search={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        searchField={searchField}
        onSearchFieldChange={(val) =>
          setSearchField(val as "name" | "slug" | "id" | "all")
        }
        searchFieldOptions={CATEGORY_SEARCH_OPTIONS}
        searchPlaceholder={`Search ${activeTab === "product" ? "product" : activeTab === "service" ? "service" : "expense"} categories...`}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 50, 100]}
        availableColumns={AVAILABLE_CATEGORY_COLUMNS}
        visibleColumns={visibleColumns}
        onToggleColumn={(colKey) =>
          setVisibleColumns((prev) => ({
            ...prev,
            [colKey]: !prev[colKey as keyof typeof prev],
          }))
        }
        onExportCsv={handleExportCSV}
        extraRight={
          <>
            {/* Refresh Button */}
            <button
              type="button"
              onClick={
                activeTab === "product"
                  ? loadProductCategories
                  : activeTab === "service"
                  ? loadServiceCategories
                  : loadExpenseCategories
              }
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
              title="Refresh categories"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* Primary Action Button: + Add Category */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Category</span>
            </button>
          </>
        }
      />

      {/* Clean Data Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#f4f7fb] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {visibleColumns.catId && (
                  <th
                    onClick={() => handleSort("catCode")}
                    className="px-4 py-3 min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                  >
                    <div className="flex items-center gap-1">
                      <span>CATEGORY ID</span>
                      <ChevronsUpDown className="size-3 text-slate-400" />
                    </div>
                  </th>
                )}

                <th
                  onClick={() => handleSort("label")}
                  className="px-4 py-3 min-w-[200px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                >
                  <div className="flex items-center gap-1">
                    <span>CATEGORY NAME</span>
                    <ChevronsUpDown className="size-3 text-slate-400" />
                  </div>
                </th>

                {visibleColumns.slug && (
                  <th
                    onClick={() => handleSort("value")}
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
                    onClick={() => handleSort("itemCount")}
                    className="px-4 py-3 text-center min-w-[130px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>ASSIGNED {activeTab === "product" ? "PRODUCTS" : activeTab === "service" ? "SERVICES" : "EXPENSES"}</span>
                      <ChevronsUpDown className="size-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.status && (
                  <th
                    onClick={() => handleSort("active")}
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
                            onClick={() => handleQuickToggle(item)}
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
                          {/* Pencil Edit Icon */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-primary transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="size-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(item)}
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

      {/* Pagination Component Separated Below Table */}
      {filteredAndSorted.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="entries"
          className="mt-1"
        />
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FolderTree className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingCategory
                      ? "Edit Category"
                      : `Add New ${activeTab === "product" ? "Product" : activeTab === "service" ? "Service" : "Expense"} Category`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeTab === "product"
                      ? "Retail inventory product classification"
                      : activeTab === "service"
                      ? "Salon service menu classification"
                      : "Salon operational expense classification"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 flex flex-col gap-4">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name */}
                <Input
                  type="text"
                  required
                  label={<>Category Name <span className="text-rose-500">*</span></>}
                  labelClassName="block text-xs font-semibold text-slate-700 mb-0"
                  placeholder="e.g. Hair Treatments, Facial & Skin"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                />

                {/* Code / Slug */}
                <Input
                  type="text"
                  label={<>Code / Slug <span className="text-xs text-slate-400 font-normal">(identifier)</span></>}
                  labelClassName="block text-xs font-semibold text-slate-700 mb-0"
                  placeholder="e.g. hair_treatments"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  helperText="Used internally and in URL/API filters. Auto-generated from name."
                  className="border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                />

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description <span className="text-xs text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of what belongs in this category..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                {/* Status Switch */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Category Active Status</div>
                    <div className="text-[10px] text-slate-500">
                      Active categories appear in creation dropdowns and POS menus
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formActive}
                    onClick={() => setFormActive((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      formActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        formActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-xs font-semibold text-white shadow-2xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="size-3.5 animate-spin" />}
                  <span>{editingCategory ? "Update Category" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-100 p-6 flex flex-col items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3.5">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Delete "{deletingCategory.label}"?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>

            {(deletingCategory.itemCount || 0) > 0 && (
              <div className="w-full rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-[11px] text-amber-800 text-left mb-4">
                <strong>Notice:</strong> {deletingCategory.itemCount}{" "}
                {activeTab === "product"
                  ? "product(s)"
                  : activeTab === "service"
                  ? "service(s)"
                  : "expense(s)"}{" "}
                are currently categorized under this item.
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
