import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { formatPrice } from "../../../helpers/price.helper";

export interface CheckoutBillingCardProps {
  subtotal: number;
  discountAmount: number;
  setDiscountAmount: (discount: number) => void;
  grandTotal: number;
}

export function CheckoutBillingCard({
  subtotal,
  discountAmount,
  setDiscountAmount,
  grandTotal,
}: CheckoutBillingCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
        Billing Breakdown
      </span>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal:</span>
          <span className="font-semibold text-slate-900 font-mono">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 gap-2">
          <span className="font-medium">Discount (LKR):</span>
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

        {/* Quick discount pills */}
        {subtotal > 0 && (
          <div className="flex items-center justify-end gap-1.5 pt-0.5">
            <Button
              type="button"
              onClick={() => setDiscountAmount(Math.round(subtotal * 0.05))}
              className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer transition"
            >
              5%
            </Button>
            <Button
              type="button"
              onClick={() => setDiscountAmount(Math.round(subtotal * 0.1))}
              className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer transition"
            >
              10%
            </Button>
            <Button
              type="button"
              onClick={() => setDiscountAmount(Math.round(subtotal * 0.15))}
              className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer transition"
            >
              15%
            </Button>
            <Button
              type="button"
              onClick={() => setDiscountAmount(0)}
              className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold cursor-pointer transition"
            >
              Reset
            </Button>
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900">Grand Total:</span>
          <span className="text-2xl font-black text-primary font-mono">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutBillingCard;
