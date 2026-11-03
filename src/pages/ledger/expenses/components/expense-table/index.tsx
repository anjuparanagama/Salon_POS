import { Building, Zap, Users, ShoppingCart, Wrench, MoreHorizontal, Receipt } from "lucide-react";
import type { ExpenseRecord } from "../../../../../interface/ledger.types";

export type ExpenseTableProps = {
  records: ExpenseRecord[];
};

const categoryBadges: Record<
  ExpenseRecord["category"],
  { label: string; icon: typeof Building; style: string }
> = {
  rent: { label: "Rent", icon: Building, style: "bg-purple-50 text-purple-700 border-purple-200" },
  electricity: { label: "Electricity", icon: Zap, style: "bg-amber-50 text-amber-700 border-amber-200" },
  salaries: { label: "Salaries", icon: Users, style: "bg-blue-50 text-blue-700 border-blue-200" },
  product_purchases: { label: "Stock Purchases", icon: ShoppingCart, style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  maintenance: { label: "Maintenance", icon: Wrench, style: "bg-rose-50 text-rose-700 border-rose-200" },
  other: { label: "General", icon: MoreHorizontal, style: "bg-slate-50 text-slate-700 border-slate-200" },
};

export function ExpenseTable({ records }: ExpenseTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Receipt className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No expenses found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting category tabs or your search terms.
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
              <th scope="col" className="px-5 py-3.5">Receipt & Date</th>
              <th scope="col" className="px-5 py-3.5">Category</th>
              <th scope="col" className="px-5 py-3.5">Expense Title & Notes</th>
              <th scope="col" className="px-5 py-3.5">Payee / Vendor</th>
              <th scope="col" className="px-5 py-3.5">Method</th>
              <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => {
              const badge = categoryBadges[item.category] || categoryBadges.other;
              const Icon = badge.icon;

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Receipt & Date */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900 font-mono">{item.receiptNo}</div>
                    <div className="text-[11px] text-slate-400">{item.date}</div>
                  </td>

                  {/* Category */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.style}`}
                    >
                      <Icon className="size-3" />
                      {badge.label}
                    </span>
                  </td>

                  {/* Title & Notes */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    {item.notes && (
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.notes}</div>
                    )}
                  </td>

                  {/* Vendor / Payee */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                    {item.vendorOrStaff}
                  </td>

                  {/* Payment Method */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 capitalize">
                    {item.paymentMethod.replace("_", " ")}
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-rose-600 text-sm">
                    -${item.amount.toFixed(2)}
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

