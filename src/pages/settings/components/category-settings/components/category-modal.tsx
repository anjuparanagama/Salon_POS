import React from "react";
import { FolderTree, X, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "../../../../../components/input";
import type { CategoryItem, CategoryKind } from "../../../../../interface/category.types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: CategoryItem | null;
  activeTab: CategoryKind;
  formName: string;
  onNameChange: (val: string) => void;
  formCode: string;
  setFormCode: (val: string) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  formActive: boolean;
  setFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  errorMessage: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function CategoryModal({
  isOpen,
  onClose,
  editingCategory,
  activeTab,
  formName,
  onNameChange,
  formCode,
  setFormCode,
  formDescription,
  setFormDescription,
  formActive,
  setFormActive,
  isSaving,
  errorMessage,
  onSubmit,
}: CategoryModalProps) {
  if (!isOpen) return null;

  return (
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
                  : `Add New ${
                      activeTab === "product"
                        ? "Product"
                        : activeTab === "service"
                        ? "Service"
                        : "Expense"
                    } Category`}
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
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
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
              label={
                <>
                  Category Name <span className="text-rose-500">*</span>
                </>
              }
              labelClassName="block text-xs font-semibold text-slate-700 mb-0"
              placeholder="e.g. Hair Treatments, Facial & Skin"
              value={formName}
              onChange={(e) => onNameChange(e.target.value)}
              className="border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {/* Code / Slug */}
            <Input
              type="text"
              label={
                <>
                  Code / Slug <span className="text-xs text-slate-400 font-normal">(identifier)</span>
                </>
              }
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
              onClick={onClose}
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
  );
}
