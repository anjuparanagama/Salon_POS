import { Scissors, Package, CreditCard, Banknote, Building2, Receipt } from "lucide-react";
import type { IncomeRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type IncomeTableProps = {
  records: IncomeRecord[];
};

export function IncomeTable({ records }: IncomeTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Receipt className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No income records found</h3>
        <p className="mt-1 text-xs text-slate-500">
          No sales matches your current filter criteria or date range.
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
              <th scope="col" className="px-5 py-3.5">Sale ID</th>
              <th scope="col" className="px-5 py-3.5">Customer</th>
              <th scope="col" className="px-5 py-3.5">Income Type</th>
              <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
              <th scope="col" className="px-5 py-3.5">Payment Method</th>
              <th scope="col" className="px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Sale ID */}
                <td className="whitespace-nowrap px-5 py-4 font-mono font-semibold text-slate-900">
                  {item.saleId}
                </td>

                {/* Customer */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="font-medium text-slate-800">{item.customerName}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-400">{item.description}</div>
                  )}
                </td>

                {/* Income Type */}
                <td className="whitespace-nowrap px-5 py-4">
                  {item.incomeType === "service" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary-lighter bg-primary-lighter px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      <Scissors className="size-3" />
                      Service
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                      <Package className="size-3" />
                      Product
                    </span>
                  )}
                </td>

                {/* Amount */}
                <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-emerald-600 text-sm">
                  {formatPrice(item.amount, { space: true })}
                </td>

                {/* Payment Method */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-slate-700 font-medium capitalize border border-slate-200">
                    {item.paymentMethod === "cash" && <Banknote className="size-3.5 text-emerald-600" />}
                    {item.paymentMethod === "card" && <CreditCard className="size-3.5 text-blue-600" />}
                    {item.paymentMethod === "bank" && <Building2 className="size-3.5 text-purple-600" />}
                    <span>{item.paymentMethod === "bank" ? "Bank" : item.paymentMethod === "card" ? "Card" : "Cash"}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-slate-600 font-mono">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IncomeTable;
