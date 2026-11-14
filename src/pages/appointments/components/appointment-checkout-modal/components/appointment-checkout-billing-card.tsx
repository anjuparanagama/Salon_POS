import { Input } from "../../../../../components/input";
import { formatPrice } from "../../../../../helpers/price.helper";

interface AppointmentCheckoutBillingCardProps {
  subtotal: number;
  discountAmount: number;
  setDiscountAmount: (val: number) => void;
  grandTotal: number;
}

export function AppointmentCheckoutBillingCard({
  subtotal,
  discountAmount,
  setDiscountAmount,
  grandTotal,
}: AppointmentCheckoutBillingCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
        Billing Breakdown
      </span>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal:</span>
          <span className="font-semibold text-slate-900 font-mono">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 gap-2">
          <span>Discount (LKR):</span>
          <Input
            type="number"
            min={0}
            max={subtotal}
            value={discountAmount === 0 ? "" : discountAmount}
            onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
            placeholder="0.00"
            wrapperClassName="w-28"
            className="bg-white px-2.5 py-1 text-right font-mono font-semibold text-xs text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
          <span>Grand Total:</span>
          <span className="text-primary text-base font-extrabold font-mono">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
