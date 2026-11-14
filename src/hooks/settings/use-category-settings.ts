import { useState, useEffect, useMemo, type FormEvent } from "react";
import { productsService } from "../../services/products.service";
import { servicesService } from "../../services/services.service";
import { ledgerService } from "../../services/ledger.service";
import type {
  CategoryItem,
  CategoryKind,
  CategoryTableItem,
  CategorySortField,
  CategorySearchField,
  CategoryVisibleColumns,
  CategoryFormData,
} from "../../interface/category.types";
import { DEFAULT_CATEGORY_VISIBLE_COLUMNS } from "../../constants/category-settings.constants";

export interface UseCategorySettingsProps {
  activeTab?: CategoryKind;
}

export function useCategorySettings({ activeTab = "product" }: UseCategorySettingsProps = {}) {
  // State for Product Categories
  const [productCats, setProductCats] = useState<CategoryItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // State for Service Categories
  const [serviceCats, setServiceCats] = useState<CategoryItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // State for Expense Categories
  const [expenseCats, setExpenseCats] = useState<CategoryItem[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Grid Controls & Table Preferences
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<CategorySearchField>("name");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<CategorySortField>("catCode");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [visibleColumns, setVisibleColumns] = useState<CategoryVisibleColumns>(
    DEFAULT_CATEGORY_VISIBLE_COLUMNS
  );

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
  const computedCategoryList = useMemo<CategoryTableItem[]>(() => {
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

  const handleSort = (field: CategorySortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleToggleColumn = (colKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colKey]: !prev[colKey as keyof typeof prev],
    }));
  };

  // CSV Export
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

  const handleRefresh = () => {
    if (activeTab === "product") {
      loadProductCategories();
    } else if (activeTab === "service") {
      loadServiceCategories();
    } else {
      loadExpenseCategories();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    sortField,
    sortAsc,
    handleSort,
    visibleColumns,
    handleToggleColumn,
    isLoading,
    paginatedCategories,
    totalItems,
    totalPages,
    handleExportCSV,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleQuickToggle,
    // Modal states
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    formName,
    handleNameChange,
    formCode,
    setFormCode,
    formDescription,
    setFormDescription,
    formActive,
    setFormActive,
    isSaving,
    errorMessage,
    handleFormSubmit,
    // Delete states
    deletingCategory,
    setDeletingCategory,
    isDeleting,
    handleConfirmDelete,
  };
}

export type UseCategorySettingsReturn = ReturnType<typeof useCategorySettings>;
