import { CreditCard, Banknote, Building2, Calendar, Receipt, Tag } from "lucide-react";
import Modal from "../../../../../components/modal";
import type { ExpenseRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";
import { categoryMeta } from "../../../../../helpers/ledger.helper";

export type ExpenseViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  record: ExpenseRecord | null;
  onEdit: (record: ExpenseRecord) => void;
};

export function ExpenseViewModal({ isOpen, onClose, record, onEdit }: ExpenseViewModalProps) {
  if (!record) return null;

  const meta = categoryMeta[record.category] || categoryMeta.other;
  const CategoryIcon = meta.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Expense Details"
      description="Comprehensive summary of recorded operational expense."
      size="md"
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Top Header info */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Expense Title</p>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{record.title}</h3>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.style}`}>
              <CategoryIcon className="size-3.5" />
              {meta.label}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Amount</span>
            <span className="text-lg font-bold text-rose-600">
              {formatPrice(record.amount, { space: true })}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Expense Date</span>
            </div>
            <p className="mt-1 font-semibold text-slate-800 font-mono">{record.date}</p>
          </div>

          <div className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Tag className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Payment Method</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800 capitalize">
              {record.paymentMethod === "cash" && <Banknote className="size-3.5 text-emerald-600" />}
              {record.paymentMethod === "card" && <CreditCard className="size-3.5 text-blue-600" />}
              {record.paymentMethod === "bank" && <Building2 className="size-3.5 text-purple-600" />}
              <span>{record.paymentMethod === "bank" ? "Bank Transfer" : record.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {record.description && (
          <div className="rounded-lg border border-slate-100 p-3">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Description / Notes</span>
            <p className="mt-1 text-slate-700 leading-relaxed">{record.description}</p>
          </div>
        )}

        {/* Receipt Image if available */}
        {record.receiptImage && (
          <div className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <Receipt className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Receipt Slip</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <img
                src={record.receiptImage}
                alt="Receipt Slip"
                className="max-h-56 w-full object-contain bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(record);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            Edit Expense
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ExpenseViewModal;
