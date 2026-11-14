import React from "react";
import { Button } from "../../../../../components/button";
import { Input } from "../../../../../components/input";
import type { CheckoutPaymentPayload } from "../../../../../services/checkout.service";
import { formatPrice } from "../../../../../helpers/price.helper";

interface AppointmentCheckoutPaymentsCardProps {
  payments: CheckoutPaymentPayload[];
  setPayments: React.Dispatch<React.SetStateAction<CheckoutPaymentPayload[]>>;
  onPayFull: (method: "cash" | "card" | "bank") => void;
  totalPaid: number;
  balanceDue: number;
  changeDue: number;
}

export function AppointmentCheckoutPaymentsCard({
  payments,
  setPayments,
  onPayFull,
  totalPaid,
  balanceDue,
  changeDue,
}: AppointmentCheckoutPaymentsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Payments
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            onClick={() => onPayFull("cash")}
            className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer"
          >
            Cash Full
          </Button>
          <Button
            type="button"
            onClick={() => onPayFull("card")}
            className="rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold hover:bg-purple-100 transition cursor-pointer"
          >
            Card Full
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
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-xs font-semibold text-slate-700 outline-none shrink-0"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
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
            className="px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-900 focus:border-primary text-right"
          />
        </div>
      </div>

      {/* Payment balances */}
      <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Total Paid:</span>
          <span className="font-semibold text-slate-900 font-mono">{formatPrice(totalPaid)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Balance Due:</span>
          <span
            className={`font-bold font-mono ${
              balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatPrice(balanceDue)}
          </span>
        </div>
        {changeDue > 0 && (
          <div className="flex justify-between text-amber-700 font-semibold bg-amber-50 p-1.5 rounded-md text-xs">
            <span>Change to Return:</span>
            <span className="font-mono">{formatPrice(changeDue)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
