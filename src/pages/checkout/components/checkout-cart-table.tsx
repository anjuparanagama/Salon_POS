import type { Dispatch, SetStateAction } from "react";
import { Receipt, Scissors, ShoppingBag, Trash2 } from "lucide-react";
import type { Appointment } from "../../../interface/appointment.types";
import type { CartProductItem, CartServiceItem } from "../../../interface/checkout.types";
import { formatPrice } from "../../../helpers/price.helper";
import { Button } from "../../../components/button";

export interface CheckoutCartTableProps {
  additionalServices: CartServiceItem[];
  setAdditionalServices: Dispatch<SetStateAction<CartServiceItem[]>>;
  cartProducts: CartProductItem[];
  setCartProducts: Dispatch<SetStateAction<CartProductItem[]>>;
  includeApptServices: boolean;
  selectedAppointment: Appointment | null;
  appointmentServices: CartServiceItem[];
  setErrorMsg: (msg: string | null) => void;
}

export function CheckoutCartTable({
  additionalServices,
  setAdditionalServices,
  cartProducts,
  setCartProducts,
  includeApptServices,
  selectedAppointment,
  appointmentServices,
  setErrorMsg,
}: CheckoutCartTableProps) {
  const totalItemCount =
    additionalServices.length +
    cartProducts.length +
    (includeApptServices && selectedAppointment ? appointmentServices.length : 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Invoice Items ({totalItemCount})
          </span>
        </div>
        {(additionalServices.length > 0 || cartProducts.length > 0) && (
          <Button
            type="button"
            onClick={() => {
              setAdditionalServices([]);
              setCartProducts([]);
            }}
            className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            Clear Added Items
          </Button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {/* Additional Services Rows */}
        {additionalServices.map((item, idx) => (
          <div key={`svc-${idx}`} className="flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-pink-100 text-primary shrink-0">
                <Scissors className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-400">{formatPrice(item.price)} each</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                <Button
                  type="button"
                  onClick={() =>
                    setAdditionalServices((prev) =>
                      prev.map((s, i) => (i === idx ? { ...s, quantity: Math.max(1, s.quantity - 1) } : s))
                    )
                  }
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  -
                </Button>
                <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                <Button
                  type="button"
                  onClick={() =>
                    setAdditionalServices((prev) =>
                      prev.map((s, i) => (i === idx ? { ...s, quantity: s.quantity + 1 } : s))
                    )
                  }
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  +
                </Button>
              </div>
              <span className="w-20 text-right font-bold text-slate-900 font-mono">
                {formatPrice(item.price * item.quantity)}
              </span>
              <Button
                type="button"
                onClick={() => setAdditionalServices((prev) => prev.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Retail Products Rows */}
        {cartProducts.map((item, idx) => (
          <div key={`prod-${idx}`} className="flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                <ShoppingBag className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-400">
                  SKU: {item.sku} • {formatPrice(item.price)} each
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                <Button
                  type="button"
                  onClick={() =>
                    setCartProducts((prev) =>
                      prev.map((p, i) => (i === idx ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
                    )
                  }
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  -
                </Button>
                <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                <Button
                  type="button"
                  onClick={() => {
                    if (item.quantity >= item.stock) {
                      setErrorMsg(`Maximum available stock for ${item.name} is ${item.stock}.`);
                      return;
                    }
                    setCartProducts((prev) =>
                      prev.map((p, i) => (i === idx ? { ...p, quantity: p.quantity + 1 } : p))
                    );
                  }}
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  +
                </Button>
              </div>
              <span className="w-20 text-right font-bold text-slate-900 font-mono">
                {formatPrice(item.price * item.quantity)}
              </span>
              <Button
                type="button"
                onClick={() => setCartProducts((prev) => prev.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {additionalServices.length === 0 &&
          cartProducts.length === 0 &&
          (!includeApptServices || !selectedAppointment) && (
            <div className="text-center py-8 text-slate-400 text-xs">
              <ShoppingBag className="size-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold">Your invoice cart is empty.</p>
              <p className="text-[11px]">Select items from the catalog above to add to this invoice.</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default CheckoutCartTable;
