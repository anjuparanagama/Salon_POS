import { Clock, Phone, User, Check, X, Play, MoreVertical } from "lucide-react";
import type { Appointment, AppointmentStatus } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type AppointmentListProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
  onEdit?: (appointment: Appointment) => void;
};

const statusBadgeStyles: Record<AppointmentStatus, { text: string; bg: string; label: string }> = {
  confirmed: {
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    label: "Confirmed",
  },
  in_progress: {
    text: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    label: "In Progress",
  },
  completed: {
    text: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    label: "Completed",
  },
  pending: {
    text: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    label: "Pending",
  },
  cancelled: {
    text: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
    label: "Cancelled",
  },
};

export function AppointmentList({
  appointments,
  onStatusChange,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Clock className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No appointments found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search criteria or date filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Time</th>
              <th scope="col" className="px-5 py-3.5">Client</th>
              <th scope="col" className="px-5 py-3.5">Service</th>
              <th scope="col" className="px-5 py-3.5">Specialist</th>
              <th scope="col" className="px-5 py-3.5">Price</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => {
              const badge = statusBadgeStyles[apt.status];
              return (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Time & Duration */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900">{apt.time}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="size-3" />
                      <span>{apt.durationMinutes} mins</span>
                    </div>
                  </td>

                  {/* Client Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-[11px] font-bold text-primary">
                        {apt.clientName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{apt.clientName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Phone className="size-3" />
                          <span>{apt.clientPhone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{apt.serviceName}</div>
                    {apt.notes && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{apt.notes}</div>
                    )}
                  </td>

                  {/* Specialist */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <User className="size-3.5 text-slate-400" />
                      <span>{apt.staffName}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                    {formatPrice(apt.price)}
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </td>

                  {/* Quick Actions */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {apt.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(apt.id, "in_progress")}
                          title="Start Service"
                          className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                        >
                          <Play className="size-3 fill-amber-700" />
                          <span>Start</span>
                        </button>
                      )}

                      {apt.status === "in_progress" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(apt.id, "completed")}
                          title="Mark as Completed"
                          className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          <Check className="size-3" />
                          <span>Complete</span>
                        </button>
                      )}

                      {apt.status !== "completed" && apt.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(apt.id, "cancelled")}
                          title="Cancel Booking"
                          className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentList;

