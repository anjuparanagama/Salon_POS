import { useState, type FormEvent } from "react";
import Modal from "../../../../../components/modal";
import type { ExpenseFormData } from "../../../../../interface/ledger.types";

export type ExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
};

const initialData: ExpenseFormData = {
  date: new Date().toISOString().split("T")[0],
  category: "electricity",
  title: "",
  vendorOrStaff: "",
  amount: 100,
  paymentMethod: "bank_transfer",
  receiptNo: `EXP-${Date.now().toString().slice(-5)}`,
  notes: "",
};

export function ExpenseModal({ isOpen, onClose, onSubmit }: ExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialData);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.vendorOrStaff.trim()) return;
    onSubmit(formData);
    onClose();
    setFormData({
      ...initialData,
      receiptNo: `EXP-${Date.now().toString().slice(-5)}`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Expense"
      description="Log operational costs such as rent, utility bills, salaries, and stock restocks."
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Expense Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseFormData["category"],
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="rent">Premises Rent</option>
              <option value="electricity">Electricity & Water Utilities</option>
              <option value="salaries">Salaries & Staff Compensation</option>
              <option value="product_purchases">Product & Inventory Purchases</option>
              <option value="maintenance">Salon Repairs & Maintenance</option>
              <option value="other">General Operational Expense</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Expense Title / Reason *</label>
          <input
            type="text"
            required
            placeholder="e.g. Monthly Electricity Bill - October or Wella Color Batch Restock"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Payee / Vendor / Employee *</label>
            <input
              type="text"
              required
              placeholder="e.g. City Power Grid or Amelia Vance"
              value={formData.vendorOrStaff}
              onChange={(e) => setFormData({ ...formData, vendorOrStaff: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Receipt / Voucher Number</label>
            <input
              type="text"
              required
              value={formData.receiptNo}
              onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Amount Paid (Rs.) *</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as ExpenseFormData["paymentMethod"],
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="bank_transfer">Bank Wire / Transfer</option>
              <option value="cash">Cash Voucher</option>
              <option value="card">Business Card</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Notes (Optional)</label>
          <textarea
            rows={2}
            placeholder="Additional billing reference or approval remarks..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            Record Expense
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ExpenseModal;

