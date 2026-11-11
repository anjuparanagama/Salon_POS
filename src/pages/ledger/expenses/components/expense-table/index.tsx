import {
  CreditCard,
  Banknote,
  Building2,
  Receipt,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import type { ExpenseRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";
import { getCategoryMeta } from "../../../../../helpers/ledger.helper";

export type ExpenseTableProps = {
  records: ExpenseRecord[];
  onView: (record: ExpenseRecord) => void;
  onEdit: (record: ExpenseRecord) => void;
  onDelete: (record: ExpenseRecord) => void;
  isLoading?: boolean;
};

export function ExpenseTable({
  records,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: ExpenseTableProps) {
  if (isLoading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <h3 className="mt-3 text-sm font-semibold text-slate-800">Loading expenses...</h3>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Receipt className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No expenses recorded</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search criteria, category filter, or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-2.5">Expense Title</th>
              <th scope="col" className="px-4 py-2.5">Description</th>
              <th scope="col" className="px-4 py-2.5">Category</th>
              <th scope="col" className="px-4 py-2.5 text-right">Amount</th>
              <th scope="col" className="px-4 py-2.5">Payment Method</th>
              <th scope="col" className="px-4 py-2.5">Date</th>
              <th scope="col" className="px-4 py-2.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => {
              const meta = getCategoryMeta(item.category);
              const Icon = meta.icon;

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Expense Title */}
                  <td className="whitespace-nowrap px-4 py-2 font-semibold text-slate-900">
                    {item.title}
                  </td>

                  {/* Description (Dedicated Column) */}
                  <td className="px-4 py-2 text-slate-700">
                    <span className="line-clamp-1 font-medium" title={item.description || ""}>
                      {item.description || "-"}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.style}`}
                    >
                      <Icon className="size-3" />
                      {meta.label}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-4 py-2 text-right font-bold text-rose-600 font-mono text-xs">
                    {formatPrice(item.amount, { space: true })}
                  </td>

                  {/* Payment Method */}
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-0.5 text-slate-700 font-medium capitalize border border-slate-200 text-[11px]">
                      {item.paymentMethod === "cash" && <Banknote className="size-3 text-emerald-600" />}
                      {item.paymentMethod === "card" && <CreditCard className="size-3 text-blue-600" />}
                      {item.paymentMethod === "bank" && <Building2 className="size-3 text-purple-600" />}
                      <span>{item.paymentMethod === "bank" ? "Bank" : item.paymentMethod === "card" ? "Card" : "Cash"}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-2 text-slate-600 font-mono text-[11px]">
                    {item.date}
                  </td>

                  {/* Actions (View / Edit / Delete) */}
                  <td className="whitespace-nowrap px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-primary transition cursor-pointer"
                        title="Edit Expense"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;
