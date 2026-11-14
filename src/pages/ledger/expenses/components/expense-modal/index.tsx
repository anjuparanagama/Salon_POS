import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Upload, X, Tag, CreditCard } from "lucide-react";
import SidePanel from "../../../../../components/side-panel";
import { Button } from "../../../../../components/button";
import { Input } from "../../../../../components/input";
import type {
  ExpenseFormData,
  ExpenseRecord,
  ExpenseItemCategory,
  ExpensePaymentMethod,
} from "../../../../../interface/ledger.types";
import { defaultExpenseCategories } from "../../../../../helpers/ledger.helper";
import { ledgerService } from "../../../../../services/ledger.service";

export type ExpensePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseRecord | null;
  categories?: Array<{ label: string; value: string; active?: boolean }>;
};

export type ExpenseModalProps = ExpensePanelProps;

type ExpenseFormContentProps = {
  initialValues: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => void;
  onClose: () => void;
  categories?: Array<{ label: string; value: string; active?: boolean }>;
};

function ExpenseFormContent({
  initialValues,
  onSubmit,
  onClose,
  categories,
}: ExpenseFormContentProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialValues);

  const categoryOptions =
    categories && categories.length > 0
      ? categories.filter((c) => c.active !== false || c.value === formData.category)
      : defaultExpenseCategories;

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
    <form id="expense-form" onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Expense Title */}
      <Input
        type="text"
        required
        label={<>Expense Title <span className="text-rose-500">*</span></>}
        labelClassName="block mb-0 font-medium text-slate-700"
        placeholder="e.g. Electricity Bill, Shop Rent, Staff Salaries"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20"
      />

      {/* Category & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1.5 font-medium text-slate-700">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseItemCategory,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          type="number"
          min="1"
          step="any"
          required
          label={<>Amount (LKR) <span className="text-rose-500">*</span></>}
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="5000"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
          }
          leftElement={<span className="text-slate-400 font-semibold text-[11px]">Rs.</span>}
          className="border-slate-200 py-2 pl-9 pr-3 text-slate-900 focus:border-primary focus:ring-primary/20 font-medium"
        />
      </div>

      {/* Payment Method & Expense Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1.5 font-medium text-slate-700">
            Payment Method <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as ExpensePaymentMethod,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>

        <Input
          type="date"
          required
          label={<>Expense Date <span className="text-rose-500">*</span></>}
          labelClassName="block mb-0 font-medium text-slate-700"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20"
        />
      </div>

      {/* Description (Optional) */}
      <div>
        <label className="block mb-1.5 font-medium text-slate-700">Description (Optional)</label>
        <textarea
          rows={3}
          placeholder="Add relevant notes, receipt numbers, supplier info, or remarks..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Receipt Image (Optional) */}
      <div>
        <label className="block mb-1.5 font-medium text-slate-700">Receipt Image / Bill Slip (Optional)</label>
        {formData.receiptImage ? (
          <div className="relative inline-block overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
            <img
              src={formData.receiptImage}
              alt="Receipt Preview"
              className="h-32 w-auto max-w-full rounded-lg object-cover"
            />
            <Button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-slate-900 transition cursor-pointer shadow-md"
              title="Remove image"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-center cursor-pointer hover:bg-slate-100/70 hover:border-slate-400 transition">
            <div className="flex size-9 items-center justify-center rounded-full bg-white shadow-xs text-slate-500">
              <Upload className="size-4.5" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Upload receipt image or slip</span>
            <span className="text-[10px] text-slate-400">PNG, JPG or WEBP up to 5MB</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              wrapperClassName="hidden"
            />
          </label>
        )}
      </div>
    </form>
  );
}

export function ExpensePanel({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories: propCategories,
}: ExpensePanelProps) {
  const isEditing = Boolean(initialData);
  const [categories, setCategories] = useState<Array<{ label: string; value: string; active?: boolean }>>(
    propCategories || []
  );

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      return;
    }
    let isMounted = true;
    ledgerService
      .getExpenseCategories()
      .then((cats) => {
        if (isMounted && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch((err) => console.error("Failed to load categories for expense panel", err));
    return () => {
      isMounted = false;
    };
  }, [propCategories]);

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
        category: (categories[0]?.value as any) || "electricity",
        amount: 0,
        paymentMethod: "cash",
        date: new Date().toISOString().split("T")[0],
        description: "",
        receiptImage: "",
      };

  const footer = (
    <div className="flex items-center justify-end gap-2.5">
      <Button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="expense-form"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
      >
        {isEditing ? "Update Expense" : "Save Expense"}
      </Button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Expense" : "Add New Expense"}
      description={
        isEditing
          ? "Update recorded expenditure details, amounts, and receipt documentation."
          : "Record salon operational costs, utility bills, inventory purchases, or staff expenses."
      }
      size="md"
      side="right"
      footer={footer}
    >
      <ExpenseFormContent
        key={initialData?.id || "new-expense"}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
        categories={categories}
      />
    </SidePanel>
  );
}

export const ExpenseModal = ExpensePanel;
export default ExpensePanel;
