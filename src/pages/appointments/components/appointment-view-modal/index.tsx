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

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      description={`Booking reference #${appointment.id}`}
      size="md"
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
      <div className="flex flex-col gap-4 text-xs">
        {/* Status banner */}
        <div
          className={`flex items-center justify-between rounded-xl border p-3.5 ${statusInfo.bg}`}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={`size-4 ${statusInfo.text}`} />
            <span className={`font-semibold ${statusInfo.text}`}>{statusInfo.label}</span>
          </div>
          <span className="font-bold text-slate-900 text-sm">{formatPrice(appointment.price)}</span>
        </div>

        {/* Client Card */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Client Information</div>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-sm font-bold text-primary">
              {appointment.clientName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{appointment.clientName}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="size-3.5 text-slate-400" />
                <span>{appointment.clientPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Specialist Card */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Assigned Specialist</div>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{appointment.staffName}</p>
              <p className="text-xs text-slate-500">Salon Specialist</p>
            </div>
          </div>
        </div>

        {/* Service Details Card */}
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Scissors className="size-3.5" />
            <span className="text-[11px] font-medium">Service Information</span>
          </div>
          <p className="mt-1.5 font-semibold text-slate-900 text-sm">{appointment.serviceName}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="size-3.5 text-slate-400" />
            <span>{appointment.durationMinutes} minutes session</span>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="size-3.5" />
            <span className="text-[11px] font-medium">Date & Time</span>
          </div>
          <p className="mt-1.5 font-semibold text-slate-900 text-sm">{appointment.date}</p>
          <p className="mt-0.5 text-xs text-slate-500">Scheduled Time: {appointment.time}</p>
        </div>

        {/* Special Notes */}
        {appointment.notes && (
          <div className="rounded-xl border border-slate-100 bg-amber-50/40 p-3.5">
            <div className="flex items-center gap-1.5 text-amber-700">
              <FileText className="size-3.5" />
              <span className="text-[11px] font-medium">Special Notes</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">{appointment.notes}</p>
          </div>
        )}
      </div>
    </SidePanel>
  );
}

export default AppointmentViewModal;
