import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import type { CheckoutPaymentPayload } from "../../../services/checkout.service";
import { formatPrice } from "../../../helpers/price.helper";

export interface CheckoutPaymentsCardProps {
  payments: CheckoutPaymentPayload[];
  setPayments: Dispatch<SetStateAction<CheckoutPaymentPayload[]>>;
  handlePayFull: (method?: "cash" | "card" | "bank") => void;
  totalPaid: number;
  balanceDue: number;
  changeDue: number;
  grandTotal: number;
  subtotal: number;
  isSubmitting: boolean;
  handleCompleteCheckout: () => void;
}

export function CheckoutPaymentsCard({
  payments,
  setPayments,
  handlePayFull,
  totalPaid,
  balanceDue,
  changeDue,
  grandTotal,
  subtotal,
  isSubmitting,
  handleCompleteCheckout,
}: CheckoutPaymentsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Payments
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            onClick={() => handlePayFull("cash")}
            className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
          >
            💵 Cash Full
          </Button>
          <Button
            type="button"
            onClick={() => handlePayFull("card")}
            className="rounded-lg bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 text-xs font-bold hover:bg-purple-100 transition cursor-pointer"
          >
            💳 Card Full
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={payments[0]?.method || "cash"}
            onChange={(e) => {
              const val = e.target.value as any;
              setPayments((prev) => [
                { ...(prev[0] || { amount: 0, reference: "" }), method: val },
              ]);
            }}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 outline-none shrink-0 cursor-pointer"
          >
            <option value="cash">Cash</option>
            <option value="card">Credit / Debit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="digital">Digital / QR</option>
          </select>

          <Input
            type="number"
            min={0}
            value={payments[0]?.amount === 0 ? "" : payments[0]?.amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPayments((prev) => [
                { ...(prev[0] || { method: "cash", reference: "" }), amount: val },
              ]);
            }}
            placeholder="Amount"
            wrapperClassName="flex-1 min-w-0"
            className="rounded-xl border-slate-200 px-3 py-2 text-xs font-mono font-semibold text-slate-900 focus:border-primary text-right"
          />
        </div>
      </div>

      {/* Balances Summary */}
      <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Total Paid:</span>
          <span className="font-semibold text-slate-900 font-mono">{formatPrice(totalPaid)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>Balance Due:</span>
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded ${
              balanceDue > 0
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {formatPrice(balanceDue)}
          </span>
        </div>
        {changeDue > 0 && (
          <div className="flex justify-between items-center text-amber-800 font-bold bg-amber-50 p-2 rounded-lg text-xs">
            <span>Change to Return:</span>
            <span className="font-mono text-sm">{formatPrice(changeDue)}</span>
          </div>
        )}
      </div>

      {/* Complete Checkout Action Button */}
      <Button
        type="button"
        onClick={handleCompleteCheckout}
        disabled={isSubmitting || subtotal <= 0}
        className="w-full mt-2 flex items-center justify-center gap-2.5 rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Processing Checkout...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-5" />
            <span>Complete Checkout & Generate Invoice ({formatPrice(grandTotal)})</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default CheckoutPaymentsCard;
