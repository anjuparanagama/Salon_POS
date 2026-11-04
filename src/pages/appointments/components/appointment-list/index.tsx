import { Clock, Phone, User, Check, Eye, Pencil, Printer } from "lucide-react";
import type { Appointment, AppointmentStatus } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type AppointmentListProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
  onApprove?: (id: string) => void;
  onView?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onPrintInvoice?: (appointment: Appointment) => void;
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
  onApprove,
  onView,
  onEdit,
  onPrintInvoice,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Clock className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No appointments found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search criteria or status filter.
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
              <th scope="col" className="px-5 py-3.5">Date & Time</th>
              <th scope="col" className="px-5 py-3.5">Client</th>
              <th scope="col" className="px-5 py-3.5">Service</th>
              <th scope="col" className="px-5 py-3.5">Specialist</th>
              <th scope="col" className="px-5 py-3.5">Price</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => {
              const badge = statusBadgeStyles[apt.status];
              return (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Date & Time */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900">{apt.date}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="size-3 text-slate-400" />
                      <span>
                        {apt.time} ({apt.durationMinutes} mins)
                      </span>
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
                          <Phone className="size-3 text-slate-400" />
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

                  {/* Actions Column */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {/* 1. New / Pending Appointments -> Approve button */}
                      {apt.status === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            onApprove ? onApprove(apt.id) : onStatusChange(apt.id, "confirmed")
                          }
                          title="Approve Appointment"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                        >
                          <Check className="size-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {/* 2. Approved Appointments (Confirmed & In Progress) -> View & Edit buttons */}
                      {(apt.status === "confirmed" || apt.status === "in_progress") && (
                        <>
                          <button
                            type="button"
                            onClick={() => onView?.(apt)}
                            title="View Appointment"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                          >
                            <Eye className="size-3.5 text-slate-500" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit?.(apt)}
                            title="Edit Appointment"
                            className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary shadow-xs hover:bg-primary/10 transition cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                            <span>Edit</span>
                          </button>
                        </>
                      )}

                      {/* 3. Completed Appointments -> Print Invoice button */}
                      {apt.status === "completed" && (
                        <button
                          type="button"
                          onClick={() => onPrintInvoice?.(apt)}
                          title="Print Invoice"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                          <span>Print Invoice</span>
                        </button>
                      )}

                      {/* 4. Cancelled Appointments -> View details */}
                      {apt.status === "cancelled" && (
                        <button
                          type="button"
                          onClick={() => onView?.(apt)}
                          title="View Details"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition cursor-pointer"
                        >
                          <Eye className="size-3.5 text-slate-400" />
                          <span>View</span>
                        </button>
                      )}
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
