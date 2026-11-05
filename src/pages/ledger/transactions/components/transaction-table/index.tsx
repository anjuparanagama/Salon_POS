import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
  Building2,
  Receipt,
} from "lucide-react";
import type { TransactionRecord } from "../../../../../interface/ledger.types";
import { formatPrice } from "../../../../../helpers/price.helper";

export type TransactionTableProps = {
  records: TransactionRecord[];
};

export function TransactionTable({ records }: TransactionTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Receipt className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No transactions found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your transaction type filters, search terms, or date range.
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
              <th scope="col" className="px-5 py-3.5">Transaction ID</th>
              <th scope="col" className="px-5 py-3.5">Customer</th>
              <th scope="col" className="px-5 py-3.5">Type</th>
              <th scope="col" className="px-5 py-3.5">Payment Method</th>
              <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
              <th scope="col" className="px-5 py-3.5">Date</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => {
              const isPayment = item.type === "payment";
              const isSuccess = item.status === "successful";

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Transaction ID */}
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-semibold text-slate-900">
                    {item.transactionId}
                  </td>

                  {/* Customer */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900">{item.customerName}</div>
                    {item.notes && (
                      <div className="text-[11px] text-slate-400">{item.notes}</div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="whitespace-nowrap px-5 py-4">
                    {isPayment ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <ArrowDownLeft className="size-3" />
                        Payment
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                        <ArrowUpRight className="size-3" />
                        Refund
                      </span>
                    )}
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

                  {/* Amount */}
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right font-bold text-sm ${
                      isPayment ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPayment ? "+" : "-"}
                    {formatPrice(item.amount, { space: true })}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 font-mono">
                    {item.date}
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-5 py-4">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="size-3" />
                        Successful
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                        <XCircle className="size-3" />
                        Failed
                      </span>
                    )}
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

export default TransactionTable;
