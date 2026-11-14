import { Plus, RefreshCw } from "lucide-react";
import Pagination from "../../../../components/pagination";
import TableToolbar from "../../../../components/table-toolbar";
import {
  AVAILABLE_CATEGORY_COLUMNS,
  CATEGORY_SEARCH_OPTIONS,
} from "../../../../constants/category-settings.constants";
import { useCategorySettings } from "../../../../hooks/settings";
import type {
  CategoryKind,
  CategorySettingsViewProps,
} from "../../../../interface/category.types";
import {
  CategoryTable,
  CategoryModal,
  CategoryDeleteModal,
} from "./components";

export type { CategoryKind, CategorySettingsViewProps };

export default function CategorySettingsView({
  activeTab = "product",
}: CategorySettingsViewProps = {}) {
  const {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
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
  } = useCategorySettings({ activeTab });

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
        onSearchFieldChange={(val) => setSearchField(val as any)}
        searchFieldOptions={CATEGORY_SEARCH_OPTIONS}
        searchPlaceholder={`Search ${
          activeTab === "product"
            ? "product"
            : activeTab === "service"
            ? "service"
            : "expense"
        } categories...`}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 50, 100]}
        availableColumns={AVAILABLE_CATEGORY_COLUMNS}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCSV}
        extraRight={
          <>
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
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
      <CategoryTable
        activeTab={activeTab}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        paginatedCategories={paginatedCategories}
        searchQuery={searchQuery}
        onSort={handleSort}
        onQuickToggle={handleQuickToggle}
        onOpenEdit={handleOpenEdit}
        onDelete={setDeletingCategory}
      />

      {/* Pagination Component Separated Below Table */}
      {paginatedCategories.length > 0 && (
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        activeTab={activeTab}
        formName={formName}
        onNameChange={handleNameChange}
        formCode={formCode}
        setFormCode={setFormCode}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formActive={formActive}
        setFormActive={setFormActive}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <CategoryDeleteModal
        deletingCategory={deletingCategory}
        activeTab={activeTab}
        isDeleting={isDeleting}
        onClose={() => setDeletingCategory(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
