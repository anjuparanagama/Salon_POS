import React from "react";
import { Scissors, Sparkles, Plus, Trash2 } from "lucide-react";
import { Input } from "../../../../../components/input";
import type { Appointment } from "../../../../../interface/appointment.types";
import type { SelectedServiceItem } from "../../../../../interface/appointment-checkout.types";
import type { CatalogServiceItem } from "../../../../../hooks/appointments/use-appointment-checkout";
import { formatPrice } from "../../../../../helpers/price.helper";

interface AppointmentCheckoutServicesCardProps {
  appointment: Appointment | null;
  includeApptServices: boolean;
  setIncludeApptServices: (value: boolean) => void;
  appointmentServices: SelectedServiceItem[];
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  catalogServices: CatalogServiceItem[];
  isLoadingCatalog: boolean;
  additionalServices: SelectedServiceItem[];
  setAdditionalServices: React.Dispatch<React.SetStateAction<SelectedServiceItem[]>>;
  onAddService: () => void;
}

export function AppointmentCheckoutServicesCard({
  appointment,
  includeApptServices,
  setIncludeApptServices,
  appointmentServices,
  selectedServiceId,
  setSelectedServiceId,
  catalogServices,
  isLoadingCatalog,
  additionalServices,
  setAdditionalServices,
  onAddService,
}: AppointmentCheckoutServicesCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Appointment Booked Services */}
      {appointment && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scissors className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Appointment Services
              </span>
            </div>
            <Input
              type="checkbox"
              checked={includeApptServices}
              onChange={(e) => setIncludeApptServices(e.target.checked)}
              label={<span>Include in Bill</span>}
              className="rounded text-primary focus:ring-primary"
              wrapperClassName="text-xs font-medium text-slate-600 cursor-pointer"
            />
          </div>

          {includeApptServices ? (
            <div className="divide-y divide-slate-100 mt-2">
              {appointmentServices.map((svc, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{svc.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {svc.duration} mins • Qty: {svc.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(svc.price * svc.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-3 text-center text-xs text-slate-400 italic">
              Appointment services excluded from invoice.
            </p>
          )}
        </div>
      )}

      {/* Additional Services Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Additional Services
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            disabled={isLoadingCatalog}
            className="flex-1 min-w-0 w-full truncate rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            <option value="">
              {isLoadingCatalog ? "Loading salon services..." : "-- Choose additional salon service --"}
            </option>
            {catalogServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.duration} mins) - {formatPrice(s.price)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddService}
            disabled={!selectedServiceId || isLoadingCatalog}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
          >
            <Plus className="size-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Additional services list */}
        {additionalServices.length > 0 && (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 p-2">
            {additionalServices.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-1 text-xs">
                <div className="flex-1 pr-2 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-500">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalServices((prev) =>
                          prev.map((s, i) =>
                            i === idx ? { ...s, quantity: Math.max(1, s.quantity - 1) } : s
                          )
                        );
                      }}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-semibold text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalServices((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, quantity: s.quantity + 1 } : s))
                        );
                      }}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      +
                    </button>
                  </div>
                  <span className="w-16 text-right font-bold text-slate-900 font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdditionalServices((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                    title="Remove service"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
