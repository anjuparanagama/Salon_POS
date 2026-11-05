import { Clock, Phone, User, Calendar, Scissors, FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type { Appointment, AppointmentStatus } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type AppointmentViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit?: (appointment: Appointment) => void;
  onPrintInvoice?: (appointment: Appointment) => void;
};

const statusDetails: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  confirmed: {
    label: "Confirmed / Approved",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending Approval",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: XCircle,
  },
};

export function AppointmentViewModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onPrintInvoice,
}: AppointmentViewModalProps) {
  if (!appointment) return null;

  const statusInfo = statusDetails[appointment.status];
  const StatusIcon = statusInfo.icon;

  const raw = appointment.id.replace("apt-", "");
  const aptNumber = /^\d+$/.test(raw)
    ? raw.length > 5
      ? `#APT-${raw.slice(-4)}`
      : `#APT-${raw.padStart(3, "0")}`
    : `#APT-${raw.toUpperCase()}`;

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

          {(appointment.status === "confirmed" || appointment.status === "in_progress") && onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(appointment);
              }}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
            >
              Edit Appointment
            </button>
          )}

          {appointment.status === "completed" && onPrintInvoice && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onPrintInvoice(appointment);
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Print Invoice
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 text-xs">
        {/* Status & Price Hero Banner */}
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 ${statusInfo.bg}`}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={`size-4 ${statusInfo.text}`} />
            <span className={`text-xs font-semibold ${statusInfo.text}`}>{statusInfo.label}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
              Total Price
            </span>
            <span className="font-bold text-slate-900 text-sm">{formatPrice(appointment.price)}</span>
          </div>
        </div>

        {/* Row 1: Client Information & Assigned Specialist in the SAME row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Client Box */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Client Information
            </span>
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-xs font-bold text-primary shadow-2xs">
                {appointment.clientName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 text-xs">{appointment.clientName}</p>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                  <Phone className="size-3 shrink-0 text-slate-400" />
                  <span className="truncate">{appointment.clientPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Specialist Box */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Specialist
            </span>
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-2xs">
                <User className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 text-xs">{appointment.staffName}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 truncate">Salon Specialist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Service Information & Schedule in the SAME row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Service Box */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-100 p-3.5 bg-white">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Scissors className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Service
              </span>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-slate-900 text-xs line-clamp-1">
                {appointment.serviceName}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="size-3 text-slate-400" />
                <span>{appointment.durationMinutes} mins session</span>
              </div>
            </div>
          </div>

          {/* Schedule Box */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-100 p-3.5 bg-white">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Date & Time
              </span>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-slate-900 text-xs">{appointment.date}</p>
              <p className="mt-1 text-[11px] text-slate-500">Time: {appointment.time}</p>
            </div>
          </div>
        </div>

        {/* Special Notes (if available) */}
        {appointment.notes && (
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3.5">
            <div className="flex items-center gap-1.5 text-amber-800">
              <FileText className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Special Notes</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">{appointment.notes}</p>
          </div>
        )}
      </div>
    </SidePanel>
  );
}

export default AppointmentViewModal;
