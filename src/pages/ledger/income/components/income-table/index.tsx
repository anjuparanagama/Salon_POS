import { Scissors, Package, CreditCard, Banknote, Smartphone, Receipt } from "lucide-react";
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
              <th scope="col" className="px-5 py-3.5">Invoice & Date</th>
              <th scope="col" className="px-5 py-3.5">Income Stream</th>
              <th scope="col" className="px-5 py-3.5">Item / Service Details</th>
              <th scope="col" className="px-5 py-3.5">Customer</th>
              <th scope="col" className="px-5 py-3.5">Payment Method</th>
              <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Invoice & Date */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="font-semibold text-slate-900 font-mono">{item.invoiceNo}</div>
                  <div className="text-[11px] text-slate-400">{item.date}</div>
                </td>

                {/* Category Badge */}
                <td className="whitespace-nowrap px-5 py-4">
                  {item.category === "service_sale" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary-lighter bg-primary-lighter px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      <Scissors className="size-3" />
                      Service Sale
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                      <Package className="size-3" />
                      Product Sale
                    </span>
                  )}
                </td>

                {/* Source Title */}
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">{item.sourceTitle}</div>
                </td>

                {/* Customer */}
                <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                  {item.customerName}
                </td>

                {/* Payment Method */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-1.5 text-slate-600 capitalize">
                    {item.paymentMethod === "cash" ? (
                      <Banknote className="size-3.5 text-emerald-600" />
                    ) : item.paymentMethod === "card" ? (
                      <CreditCard className="size-3.5 text-blue-600" />
                    ) : (
                      <Smartphone className="size-3.5 text-purple-600" />
                    )}
                    <span>{item.paymentMethod}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-emerald-600 text-sm">
                  +{formatPrice(item.amount)}
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

