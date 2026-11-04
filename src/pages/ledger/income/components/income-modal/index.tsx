import { useState, type FormEvent } from "react";
import Modal from "../../../../../components/modal";
import type { IncomeFormData } from "../../../../../interface/ledger.types";

export type IncomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IncomeFormData) => void;
};

const initialData: IncomeFormData = {
  date: new Date().toISOString().split("T")[0],
  category: "service_sale",
  sourceTitle: "",
  customerName: "",
  amount: 50,
  paymentMethod: "card",
  invoiceNo: `INV-${Date.now().toString().slice(-5)}`,
};

export function IncomeModal({ isOpen, onClose, onSubmit }: IncomeModalProps) {
  const [formData, setFormData] = useState<IncomeFormData>(initialData);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.sourceTitle.trim() || !formData.customerName.trim()) return;
    onSubmit(formData);
    onClose();
    setFormData({
      ...initialData,
      invoiceNo: `INV-${Date.now().toString().slice(-5)}`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Income"
      description="Manually record a salon service intake or retail product sale."
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Income Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as IncomeFormData["category"] })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="service_sale">Service Sale (Treatment, Cut, Spa)</option>
              <option value="product_sale">Product Sale (Retail Inventory)</option>
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
          <label className="block mb-1 font-medium text-slate-700">Service / Product Description *</label>
          <input
            type="text"
            required
            placeholder="e.g. Balayage Color & Toner or Moroccan Shampoo 500ml"
            value={formData.sourceTitle}
            onChange={(e) => setFormData({ ...formData, sourceTitle: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica Miller"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Invoice Number</label>
            <input
              type="text"
              required
              value={formData.invoiceNo}
              onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Amount Received (Rs.) *</label>
            <input
              type="number"
              min="0.5"
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
                  paymentMethod: e.target.value as IncomeFormData["paymentMethod"],
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="card">Card / Terminal</option>
              <option value="cash">Cash</option>
              <option value="online">Online / Direct Transfer</option>
            </select>
          </div>
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
            Record Income
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default IncomeModal;

