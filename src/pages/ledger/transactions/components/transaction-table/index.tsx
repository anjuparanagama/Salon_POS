import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle, CreditCard, Banknote, Smartphone, Receipt } from "lucide-react";
import type { TransactionRecord } from "../../../../../interface/ledger.types";

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
          Try adjusting transaction type tabs or searching another ID.
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
              <th scope="col" className="px-5 py-3.5">Transaction ID & Time</th>
              <th scope="col" className="px-5 py-3.5">Flow Type</th>
              <th scope="col" className="px-5 py-3.5">Customer / Reference</th>
              <th scope="col" className="px-5 py-3.5">Method</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => {
              const isRefund = item.type === "refund";

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Txn ID & Time */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900 font-mono">{item.txnId}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.date} • {item.time}
                    </div>
                  </td>

                  {/* Flow Type Badge */}
                  <td className="whitespace-nowrap px-5 py-4">
                    {isRefund ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                        <ArrowUpRight className="size-3" />
                        Refund Reversal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <ArrowDownLeft className="size-3" />
                        Customer Payment
                      </span>
                    )}
                  </td>

                  {/* Customer / Reference */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400">{item.reference}</div>
                  </td>

                  {/* Payment Method */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 capitalize">
                      {item.paymentMethod.includes("card") ? (
                        <CreditCard className="size-3.5 text-blue-600" />
                      ) : item.paymentMethod === "cash" ? (
                        <Banknote className="size-3.5 text-emerald-600" />
                      ) : (
                        <Smartphone className="size-3.5 text-purple-600" />
                      )}
                      <span>{item.paymentMethod.replace("_", " ")}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-5 py-4">
                    {item.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <CheckCircle2 className="size-3" />
                        Settled
                      </span>
                    ) : item.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                        <Clock className="size-3" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                        <XCircle className="size-3" />
                        Failed
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right font-bold text-sm ${
                      isRefund ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {isRefund ? `-$${item.amount.toFixed(2)}` : `+$${item.amount.toFixed(2)}`}
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

