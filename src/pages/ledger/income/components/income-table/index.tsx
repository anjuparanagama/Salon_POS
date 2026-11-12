import { Scissors, Package, CreditCard, Banknote, Building2, Receipt, Loader2 } from "lucide-react";
import type { IncomeRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type IncomeTableProps = {
  records: IncomeRecord[];
  isLoading?: boolean;
  visibleColumns?: Record<string, boolean>;
};

export function IncomeTable({ records, isLoading = false, visibleColumns = {} }: IncomeTableProps) {
  if (isLoading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <h3 className="mt-3 text-sm font-semibold text-slate-800">Loading income records...</h3>
      </div>
    );
  }

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
              {visibleColumns.saleId !== false && <th scope="col" className="px-4 py-2.5">Sale ID</th>}
              {visibleColumns.customer !== false && <th scope="col" className="px-4 py-2.5">Customer</th>}
              {visibleColumns.description !== false && <th scope="col" className="px-4 py-2.5">Description</th>}
              {visibleColumns.incomeType !== false && <th scope="col" className="px-4 py-2.5">Income Type</th>}
              {visibleColumns.amount !== false && <th scope="col" className="px-4 py-2.5 text-right">Amount</th>}
              {visibleColumns.paymentMethod !== false && <th scope="col" className="px-4 py-2.5">Payment Method</th>}
              {visibleColumns.date !== false && <th scope="col" className="px-4 py-2.5">Date</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Sale ID */}
                {visibleColumns.saleId !== false && (
                  <td className="whitespace-nowrap px-4 py-2 font-mono font-semibold text-slate-900">
                    {item.saleId}
                  </td>
                )}

                {/* Customer */}
                {visibleColumns.customer !== false && (
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-slate-800">
                    {item.customerName || "Walk-in"}
                  </td>
                )}

                {/* Description (Dedicated Column) */}
                {visibleColumns.description !== false && (
                  <td className="px-4 py-2 text-slate-700">
                    <span className="line-clamp-1 font-medium" title={item.description || ""}>
                      {item.description || "-"}
                    </span>
                  </td>
                )}

                {/* Income Type */}
                {visibleColumns.incomeType !== false && (
                  <td className="whitespace-nowrap px-4 py-2">
                    {item.incomeType === "service" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Scissors className="size-3" />
                        Service
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                        <Package className="size-3" />
                        Product
                      </span>
                    )}
                  </td>
                )}

                {/* Amount */}
                {visibleColumns.amount !== false && (
                  <td className="whitespace-nowrap px-4 py-2 text-right font-bold text-emerald-600 font-mono text-xs">
                    {formatPrice(item.amount, { space: true })}
                  </td>
                )}

                {/* Payment Method */}
                {visibleColumns.paymentMethod !== false && (
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-0.5 text-slate-700 font-medium capitalize border border-slate-200 text-[11px]">
                      {item.paymentMethod === "cash" && <Banknote className="size-3 text-emerald-600" />}
                      {item.paymentMethod === "card" && <CreditCard className="size-3 text-blue-600" />}
                      {item.paymentMethod === "bank" && <Building2 className="size-3 text-purple-600" />}
                      <span>{item.paymentMethod === "bank" ? "Bank" : item.paymentMethod === "card" ? "Card" : "Cash"}</span>
                    </div>
                  </td>
                )}

                {/* Date */}
                {visibleColumns.date !== false && (
                  <td className="whitespace-nowrap px-4 py-2 text-slate-600 font-mono text-[11px]">
                    {item.date}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IncomeTable;
