import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Boxes,
  Scissors,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  FolderTree,
} from "lucide-react";
import { productsService } from "../../../../services/products.service";
import { servicesService } from "../../../../services/services.service";
import type { CategoryItem, CategoryFormData } from "../../../../interface/category.types";

type CategoryKind = "product" | "service";

export default function CategorySettingsView() {
  const [activeTab, setActiveTab] = useState<CategoryKind>("product");

  // State for Product Categories
  const [productCats, setProductCats] = useState<CategoryItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // State for Service Categories
  const [serviceCats, setServiceCats] = useState<CategoryItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

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

  useEffect(() => {
    loadProductCategories();
    loadServiceCategories();
  }, []);

  const activeCategories = activeTab === "product" ? productCats : serviceCats;
  const isLoading = activeTab === "product" ? loadingProducts : loadingServices;

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return activeCategories.filter((cat) => {
      // Exclude special synthetic pseudo-categories like "all"
      if (cat.value === "all") return false;

      // Status filter
      const isActive = cat.active !== false;
      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "inactive" && isActive) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cat.label.toLowerCase().includes(q);
        const matchCode = cat.value.toLowerCase().includes(q);
        const matchDesc = (cat.description || "").toLowerCase().includes(q);
        return matchName || matchCode || matchDesc;
      }
      return true;
    });
  }, [activeCategories, statusFilter, searchQuery]);

  // Statistics
  const totalCount = activeCategories.filter((c) => c.value !== "all").length;
  const activeCount = activeCategories.filter((c) => c.value !== "all" && c.active !== false).length;
  const totalItemsCount = activeCategories
    .filter((c) => c.value !== "all")
    .reduce((sum, c) => sum + (c.itemCount || 0), 0);

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

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      setFormCode(generated);
    }
  };

  // Save (Create or Update)
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    if (!trimmedName) {
      setErrorMessage("Please enter a category name");
      return;
    }

    const trimmedCode =
      formCode.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_") ||
      trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    setIsSaving(true);
    setErrorMessage(null);

    const payload: CategoryFormData = {
      label: trimmedName,
      value: trimmedCode,
      description: formDescription.trim() || undefined,
      active: formActive,
    };

    try {
      if (activeTab === "product") {
        if (editingCategory) {
          const updated = await productsService.updateCategory(editingCategory.id, payload);
          setProductCats((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c))
          );
        } else {
          const created = await productsService.createCategory(payload);
          setProductCats((prev) => [...prev, created]);
        }
      } else {
        if (editingCategory) {
          const updated = await servicesService.updateCategory(editingCategory.id, payload);
          setServiceCats((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c))
          );
        } else {
          const created = await servicesService.createCategory(payload);
          setServiceCats((prev) => [...prev, created]);
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
      } else {
        await servicesService.updateCategory(cat.id, { active: newActive });
        setServiceCats((prev) =>
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
      } else {
        await servicesService.deleteCategory(deletingCategory.id);
        setServiceCats((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      }
      setDeletingCategory(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Type Switcher (Tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="inline-flex rounded-xl bg-slate-100 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("product")}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "product"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Boxes className="size-4 text-emerald-600" />
            <span>Product Categories</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "product"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {productCats.filter((c) => c.value !== "all").length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("service")}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "service"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Scissors className="size-4 text-primary" />
            <span>Service Categories</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "service"
                  ? "bg-rose-100 text-primary"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {serviceCats.filter((c) => c.value !== "all").length}
            </span>
          </button>
        </div>

        {/* Action Button: Add New Category */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={activeTab === "product" ? loadProductCategories : loadServiceCategories}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            title="Refresh categories"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/95 transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>
              Add {activeTab === "product" ? "Product" : "Service"} Category
            </span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FolderTree className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Total Categories</div>
            <div className="text-lg font-bold text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Active Categories</div>
            <div className="text-lg font-bold text-emerald-700">{activeCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {activeTab === "product" ? <Boxes className="size-5" /> : <Scissors className="size-5" />}
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Assigned {activeTab === "product" ? "Products" : "Services"}
            </div>
            <div className="text-lg font-bold text-slate-900">{totalItemsCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === "product" ? "product" : "service"} categories...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 min-w-[200px]">Category Name</th>
                <th className="px-4 py-3 min-w-[130px]">Code / Slug</th>
                <th className="px-4 py-3 min-w-[220px]">Description</th>
                <th className="px-4 py-3 text-center min-w-[130px]">
                  {activeTab === "product" ? "Products" : "Services"} Count
                </th>
                <th className="px-4 py-3 text-center min-w-[110px]">Status</th>
                <th className="px-4 py-3 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" />
                    <span>Loading categories...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FolderTree className="size-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No categories found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {searchQuery
                        ? "Try clearing your search query"
                        : `Click "Add ${activeTab === "product" ? "Product" : "Service"} Category" to create your first category.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((item) => {
                  const isActive = item.active !== false;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* Name */}
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      </td>

                      {/* Code / Slug */}
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                          {item.value}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-slate-600 max-w-[280px]">
                        {item.description && item.description.trim() ? (
                          <span className="truncate block" title={item.description}>
                            {item.description}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>

                      {/* Count of Products / Services */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                          {item.itemCount || 0} {activeTab === "product" ? "products" : "services"}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3 text-center">
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

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="size-3.5" />
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
                    {editingCategory ? "Edit Category" : `Add New ${activeTab === "product" ? "Product" : "Service"} Category`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeTab === "product" ? "Retail inventory product classification" : "Salon service menu classification"}
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hair Treatments, Facial & Skin"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Code / Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Code / Slug <span className="text-xs text-slate-400 font-normal">(identifier)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. hair_treatments"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">
                    Used internally and in URL/API filters. Auto-generated from name.
                  </p>
                </div>

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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-primary/95 transition disabled:opacity-50 cursor-pointer"
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
                {activeTab === "product" ? "product(s)" : "service(s)"} are currently categorized under this item.
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

