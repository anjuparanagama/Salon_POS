import { Scissors, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Input } from "../../../components/input";
import type { Appointment } from "../../../interface/appointment.types";
import type { CartServiceItem } from "../../../interface/checkout.types";
import { formatAppointmentId } from "../../../helpers/format-id.helper";
import { formatPrice } from "../../../helpers/price.helper";

export interface CheckoutAppointmentModeCardProps {
  selectedAppointment: Appointment | null;
  recentAppointments: Appointment[];
  bindAppointment: (apt: Appointment) => void;
  handleClearAppointment: () => void;
  includeApptServices: boolean;
  setIncludeApptServices: (include: boolean) => void;
  appointmentServices: CartServiceItem[];
}

export function CheckoutAppointmentModeCard({
  selectedAppointment,
  recentAppointments,
  bindAppointment,
  handleClearAppointment,
  includeApptServices,
  setIncludeApptServices,
  appointmentServices,
}: CheckoutAppointmentModeCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 items-center justify-center rounded-xl text-white ${
              selectedAppointment ? "bg-primary" : "bg-slate-800"
            }`}
          >
            {selectedAppointment ? <Scissors className="size-4.5" /> : <ShoppingBag className="size-4.5" />}
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {selectedAppointment ? "Appointment Checkout Mode" : "Direct Walk-in Sale Mode"}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedAppointment
                ? `${formatAppointmentId(selectedAppointment)} • ${selectedAppointment.clientName} (${selectedAppointment.time || "Scheduled"})`
                : "Selling salon retail products or ad-hoc services without prior booking"}
            </p>
            {selectedAppointment && selectedAppointment.hasInvoice && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800">
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                <span>
                  Previous Invoice: <strong>#{selectedAppointment.invoiceNumber || "INV"}</strong> (Additional billing enabled)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedAppointment ? (
            <button
              type="button"
              onClick={handleClearAppointment}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Switch to Walk-in
            </button>
          ) : (
            <select
              onChange={(e) => {
                const apt = recentAppointments.find((a) => a.id === e.target.value);
                if (apt) bindAppointment(apt);
              }}
              defaultValue=""
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-primary cursor-pointer"
            >
              <option value="" disabled>
                -- Load Appointment --
              </option>
              {recentAppointments
                .filter((a) => a.status !== "cancelled")
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {formatAppointmentId(a)}: {a.clientName} ({a.time || a.date})
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Appointment Booked Services Row */}
      {selectedAppointment && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Booked Appointment Services
            </span>
            <Input
              type="checkbox"
              checked={includeApptServices}
              onChange={(e) => setIncludeApptServices(e.target.checked)}
              label={<span>Include in Invoice</span>}
              className="rounded text-primary focus:ring-primary"
              wrapperClassName="text-xs font-medium text-slate-700 cursor-pointer"
            />
          </div>

          {includeApptServices ? (
            <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 p-3">
              {appointmentServices.map((svc, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{svc.name}</p>
                    <p className="text-[11px] text-slate-400">{svc.duration} mins • Qty: {svc.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatPrice(svc.price * svc.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">
              Appointment services excluded from this bill.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutAppointmentModeCard;
