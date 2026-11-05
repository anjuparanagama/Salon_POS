import { AlertTriangle } from "lucide-react";
import Modal from "../../../../../components/modal";
import type { ExpenseRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type ExpenseDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: ExpenseRecord | null;
};

export function ExpenseDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  record,
}: ExpenseDeleteModalProps) {
  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Expense Record"
      description="Are you sure you want to delete this recorded expense?"
      size="sm"
    >
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{record.title}</h4>
            <p className="mt-0.5 text-slate-500">
              Amount: <span className="font-bold text-rose-600">{formatPrice(record.amount, { space: true })}</span> • Date: {record.date}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              This action cannot be undone and will permanently remove this expense from reports.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ExpenseDeleteModal;

