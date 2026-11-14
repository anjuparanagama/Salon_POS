import { Loader2, CheckCircle2 } from "lucide-react";
import type { InvoiceDetailResponse } from "../../../../../services/checkout.service";
import { formatPrice } from "../../../../../helpers/price.helper";
import { Button } from "../../../../../components/button";

interface AppointmentCheckoutFooterProps {
  completedInvoice: InvoiceDetailResponse | null;
  grandTotal: number;
  balanceDue: number;
  isSubmitting: boolean;
  subtotal: number;
  onClose: () => void;
  onCompleteCheckout: () => void;
}

export function AppointmentCheckoutFooter({
  completedInvoice,
  grandTotal,
  balanceDue,
  isSubmitting,
  subtotal,
  onClose,
  onCompleteCheckout,
}: AppointmentCheckoutFooterProps) {
  if (completedInvoice) {
    return (
      <div className="flex justify-end w-full">
        <Button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Grand Total
          </span>
          <span className="text-base font-extrabold text-primary font-mono">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Balance Due
          </span>
          <span
            className={`text-xs font-bold font-mono ${
              balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatPrice(balanceDue)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onCompleteCheckout}
          disabled={isSubmitting || subtotal <= 0}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              <span>Complete Checkout & Bill</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
