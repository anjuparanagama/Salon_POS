import { Trash2, Loader2 } from "lucide-react";
import type { CategoryItem, CategoryKind } from "../../../../../interface/category.types";

interface CategoryDeleteModalProps {
  deletingCategory: CategoryItem | null;
  activeTab: CategoryKind;
  isDeleting: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function CategoryDeleteModal({
  deletingCategory,
  activeTab,
  isDeleting,
  onClose,
  onConfirmDelete,
}: CategoryDeleteModalProps) {
  if (!deletingCategory) return null;

  return (
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
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
