import SidePanel from "../../../../components/side-panel";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentServiceItem,
} from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";

export type AppointmentViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit?: (appointment: Appointment) => void;
  onPrintInvoice?: (appointment: Appointment) => void;
  onCheckout?: (appointment: Appointment) => void;
};

const statusDetails: Record<
  AppointmentStatus,
  { label: string; badge: string }
> = {
  confirmed: {
    label: "Confirmed",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  in_progress: {
    label: "In Progress",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
  },
  completed: {
    label: "Completed",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
  },
  pending: {
    label: "Pending",
    badge: "bg-purple-50 border-purple-200 text-purple-700",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-rose-50 border-rose-200 text-rose-700",
  },
};

export function AppointmentViewModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onPrintInvoice,
  onCheckout,
}: AppointmentViewModalProps) {
  if (!appointment) return null;

  const defaultStatusInfo = {
    label: "Pending",
    badge: "bg-purple-50 border-purple-200 text-purple-700",
  };

  const statusInfo =
    (appointment.status && statusDetails[appointment.status]) ||
    defaultStatusInfo;
  const aptNumber = formatAppointmentId(appointment);

  const clientDisplayName = appointment.clientName || "Client";
  const clientDisplayPhone = appointment.clientPhone || "N/A";
  const staffDisplayName = appointment.staffName || "Specialist";
  const serviceDisplayName = appointment.serviceName || "Service";

  const servicesList: AppointmentServiceItem[] = (() => {
    if (appointment.services && appointment.services.length > 0) {
      if (
        appointment.services.length === 1 &&
        appointment.services[0].name.includes(",")
      ) {
        return appointment.services[0].name
          .split(",")
          .map((s) => ({
            name: s.trim(),
            price: 0,
            durationMinutes: 0,
          }))
          .filter((s) => s.name.length > 0);
      }
      return appointment.services;
    }
    if (appointment.serviceName && appointment.serviceName.includes(",")) {
      return appointment.serviceName
        .split(",")
        .map((s) => ({
          name: s.trim(),
          price: 0,
          durationMinutes: 0,
        }))
        .filter((s) => s.name.length > 0);
    }
    return [
      {
        name: appointment.serviceName || "Service",
        durationMinutes: appointment.durationMinutes,
        price: appointment.price,
      },
    ];
  })();

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      description={`Booking reference ${aptNumber}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>

          {/* If already invoiced/billed -> Show Print Invoice */}
          {appointment.hasInvoice && onPrintInvoice && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onPrintInvoice(appointment);
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Print Invoice {appointment.invoiceNumber ? `(#${appointment.invoiceNumber})` : ""}
            </button>
          )}

          {/* Checkout & Bill */}
          {(appointment.status === "confirmed" ||
            appointment.status === "in_progress" ||
            appointment.status === "completed") && (
            <>
              {onCheckout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCheckout(appointment);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
                >
                  Checkout & Bill
                </button>
              )}
              {appointment.status !== "completed" && onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(appointment);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Edit Appointment
                </button>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="py-2 text-xs">
        <ul className="divide-y divide-slate-100">
          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Status:
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${statusInfo.badge}`}
            >
              {statusInfo.label}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Total Price:
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {formatPrice(appointment.price ?? 0)}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Client Name:
            </span>
            <span className="font-medium text-slate-900">
              {clientDisplayName}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Phone Number:
            </span>
            <span className="font-medium text-slate-800">
              {clientDisplayPhone}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Assigned Specialist:
            </span>
            <span className="font-medium text-slate-900">
              {staffDisplayName}
            </span>
          </li>

          {servicesList.length > 1 ? (
            <li className="flex items-start gap-3 py-2.5">
              <span className="size-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
              <span className="w-36 shrink-0 text-slate-500 font-medium pt-1">
                Services ({servicesList.length}):
              </span>
              <div className="flex-1">
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 divide-y divide-slate-100 overflow-hidden">
                  {servicesList.map((svc, idx) => {
                    const hasDuration = Boolean(svc.durationMinutes && svc.durationMinutes > 0);
                    const hasPrice = Boolean(svc.price && svc.price > 0);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span
                            className="font-medium text-slate-900 truncate"
                            title={svc.name}
                          >
                            {svc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          {hasDuration && (
                            <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/80 shadow-2xs">
                              {svc.durationMinutes} mins
                            </span>
                          )}
                          {hasPrice && (
                            <span className="font-semibold text-slate-900 tabular-nums min-w-[75px] text-right text-xs">
                              {formatPrice(svc.price || 0)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          ) : (
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="w-36 shrink-0 text-slate-500 font-medium">
                Service:
              </span>
              <span className="font-medium text-slate-900">
                {servicesList[0]?.name || serviceDisplayName}
              </span>
            </li>
          )}

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              {servicesList.length > 1 ? "Total Duration:" : "Duration:"}
            </span>
            <span className="font-medium text-slate-800">
              {appointment.durationMinutes ?? 45} mins
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Date:
            </span>
            <span className="font-medium text-slate-900">
              {appointment.date || "N/A"}
            </span>
          </li>

          <li className="flex items-center gap-3 py-2.5">
            <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="w-36 shrink-0 text-slate-500 font-medium">
              Time:
            </span>
            <span className="font-medium text-slate-900">
              {appointment.time || "09:00 AM"}
            </span>
          </li>

          {appointment.notes && (
            <li className="flex items-start gap-3 py-2.5">
              <span className="size-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
              <span className="w-36 shrink-0 text-slate-500 font-medium">
                Special Notes:
              </span>
              <span className="text-slate-800 font-medium whitespace-pre-wrap break-words flex-1">
                {appointment.notes}
              </span>
            </li>
          )}
        </ul>
      </div>
    </SidePanel>
  );
}

export default AppointmentViewModal;
