import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../../../../../components/modal";
import type {
  ExpenseFormData,
  ExpenseRecord,
  ExpenseItemCategory,
  ExpensePaymentMethod,
} from "../../../../../interface/ledger.types";
import { defaultExpenseCategories } from "../../../../../helpers/ledger.helper";

export type ExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseRecord | null;
};

type ExpenseFormContentProps = {
  initialValues: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => void;
  onClose: () => void;
  isEditing: boolean;
};

function ExpenseFormContent({
  initialValues,
  onSubmit,
  onClose,
  isEditing,
}: ExpenseFormContentProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialValues);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, receiptImage: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Expense Title */}
      <div>
        <label className="block mb-1 font-semibold text-slate-700">Expense Title *</label>
        <input
          type="text"
          required
          placeholder="e.g. Electricity Bill, Shop Rent, Staff Salaries"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Category *</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as ExpenseItemCategory,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {defaultExpenseCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-slate-700">Amount (LKR) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              Rs.
            </span>
            <input
              type="number"
              min="1"
              step="any"
              required
              placeholder="5000"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Payment Method & Expense Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Payment Method *</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentMethod: e.target.value as ExpensePaymentMethod,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-slate-700">Expense Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Description (Optional) */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Description (Optional)</label>
        <textarea
          rows={2}
          placeholder="Add relevant notes, invoice numbers, or vendor info..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Receipt Image (Optional) */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Receipt Image (Optional)</label>
        {formData.receiptImage ? (
          <div className="relative inline-block overflow-hidden rounded-lg border border-slate-200">
            <img
              src={formData.receiptImage}
              alt="Receipt Preview"
              className="h-28 w-auto max-w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900 transition cursor-pointer"
              title="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center cursor-pointer hover:bg-slate-100 transition">
            <Upload className="size-5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">Upload receipt image or slip</span>
            <span className="text-[10px] text-slate-400">PNG, JPG or WEBP up to 5MB</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

export function ExpenseModal({ isOpen, onClose, onSubmit, initialData }: ExpenseModalProps) {
  const initialValues: ExpenseFormData = initialData
    ? {
        title: initialData.title,
        category: initialData.category,
        amount: initialData.amount,
        paymentMethod: initialData.paymentMethod,
        date: initialData.date,
        description: initialData.description || "",
        receiptImage: initialData.receiptImage || "",
      }
    : {
        title: "",
        category: "electricity",
        amount: 0,
        paymentMethod: "cash",
        date: new Date().toISOString().split("T")[0],
        description: "",
        receiptImage: "",
      };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Expense" : "Add New Expense"}
      description="Manage and record salon operational expenditures, utilities, and payroll."
      size="md"
    >
      <ExpenseFormContent
        key={initialData?.id || "new-expense"}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
        isEditing={Boolean(initialData)}
      />
    </Modal>
  );
}

export default ExpenseModal;
