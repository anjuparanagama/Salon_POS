import { Clock, Phone, User, Check, Eye, Pencil, Printer, ChevronDown, CreditCard } from "lucide-react";
import { TableSkeleton } from "../../../../components/skeleton";
import type { Appointment, AppointmentStatus } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";
import { Button } from "../../../../components/button";

export type AppointmentListProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
  onApprove?: (id: string) => void;
  onView?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onPrintInvoice?: (appointment: Appointment) => void;
  onCheckout?: (appointment: Appointment) => void;
  isLoading?: boolean;
  visibleColumns?: Record<string, boolean>;
};

const defaultBadge = {
  text: "text-purple-700",
  bg: "bg-purple-50",
  border: "border-purple-200",
  label: "Pending",
};

const statusBadgeStyles: Record<string, { text: string; bg: string; border: string; label: string }> = {
  confirmed: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Confirmed",
  },
  approved: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Confirmed",
  },
  in_progress: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "In Progress",
  },
  completed: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Completed",
  },
  done: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Completed",
  },
  pending: {
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "Pending",
  },
  open: {
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "Pending",
  },
  cancelled: {
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
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
  onCheckout,
  isLoading = false,
  visibleColumns = {},
}: AppointmentListProps) {
  if (isLoading && appointments.length === 0) {
    return <TableSkeleton rows={6} columns={6} />;
  }

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

  const showAptNumber = visibleColumns.aptNumber !== false;
  const showDateTime = visibleColumns.dateTime !== false;
  const showClient = visibleColumns.client !== false;
  const showService = visibleColumns.service !== false;
  const showSpecialist = visibleColumns.specialist !== false;
  const showPrice = visibleColumns.price !== false;
  const showStatus = visibleColumns.status !== false;
  const showActions = visibleColumns.actions !== false;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              {showAptNumber && <th scope="col" className="px-5 py-3.5 min-w-[110px]">Apt #</th>}
              {showDateTime && <th scope="col" className="px-5 py-3.5 min-w-[160px]">Date & Time</th>}
              {showClient && <th scope="col" className="px-5 py-3.5 min-w-[210px]">Client</th>}
              {showService && <th scope="col" className="px-5 py-3.5 min-w-[220px]">Service</th>}
              {showSpecialist && <th scope="col" className="px-5 py-3.5 min-w-[160px]">Specialist</th>}
              {showPrice && <th scope="col" className="px-5 py-3.5 min-w-[110px]">Price</th>}
              {showStatus && <th scope="col" className="px-5 py-3.5 min-w-[130px]">Status</th>}
              {showActions && (
                <th
                  scope="col"
                  className="sticky right-0 z-20 bg-slate-50 px-5 py-3.5 text-right w-[130px] min-w-[130px] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] border-l border-slate-100"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => {
              const badge = (apt.status && statusBadgeStyles[apt.status]) || defaultBadge;
              const clientDisplayName = apt.clientName || "Client";
              const clientDisplayPhone = apt.clientPhone || "N/A";
              const serviceDisplayName = apt.serviceName || "Service";
              const staffDisplayName = apt.staffName || "Specialist";
              return (
                <tr key={apt.id} className="group hover:bg-slate-50/70 transition-colors">
                  {/* Appointment Number */}
                  {showAptNumber && (
                    <td className="whitespace-nowrap px-5 py-4 font-mono font-semibold text-slate-800">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs border border-slate-200/80">
                        {formatAppointmentId(apt)}
                      </span>
                    </td>
                  )}

                  {/* Date & Time */}
                  {showDateTime && (
                    <td className="whitespace-nowrap px-5 py-4 text-xs">
                      <span className="font-semibold text-slate-900">{apt.date || "N/A"}</span>
                      <span className="text-slate-400 font-normal mx-1.5">at</span>
                      <span className="font-medium text-slate-700">{apt.time || "09:00 AM"}</span>
                    </td>
                  )}

                  {/* Client Info */}
                  {showClient && (
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-[11px] font-bold text-primary">
                          {clientDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{clientDisplayName}</div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 whitespace-nowrap">
                            <Phone className="size-3 text-slate-400 shrink-0" />
                            <span className="whitespace-nowrap">{clientDisplayPhone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Service */}
                  {showService && (
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{serviceDisplayName}</div>
                      {apt.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{apt.notes}</div>
                      )}
                    </td>
                  )}

                  {/* Specialist */}
                  {showSpecialist && (
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="size-3.5 text-slate-400" />
                        <span>{staffDisplayName}</span>
                      </div>
                    </td>
                  )}

                  {/* Price */}
                  {showPrice && (
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {formatPrice(apt.price ?? 0)}
                    </td>
                  )}

                  {/* Status Dropdown / Finalized Badge */}
                  {showStatus && (
                    <td className="whitespace-nowrap px-5 py-4">
                      {apt.status === "completed" ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                          title="Appointment Completed & Payment Finalized"
                        >
                          Completed
                        </span>
                      ) : apt.status === "pending" ? (
                        <span className="text-slate-400 font-semibold px-2">-</span>
                      ) : (
                        <div className="relative inline-block">
                          <select
                            value={apt.status}
                            onChange={(e) => {
                              const val = e.target.value as AppointmentStatus;
                              if (val === "completed" && !apt.hasInvoice) {
                                return;
                              }
                              onStatusChange(apt.id, val);
                            }}
                            className={`appearance-none rounded-full border px-3 py-1 pr-6 text-[11px] font-semibold outline-none transition cursor-pointer ${badge.bg} ${badge.text} ${badge.border} hover:opacity-90 focus:ring-2 focus:ring-primary/20`}
                            title="Change Appointment Status"
                          >
                            <option value="pending" className="bg-white text-purple-700 font-semibold py-1">
                              Pending
                            </option>
                            <option value="confirmed" className="bg-white text-emerald-700 font-semibold py-1">
                              Confirmed
                            </option>
                            <option value="in_progress" className="bg-white text-amber-700 font-semibold py-1">
                              In Progress
                            </option>
                            <option
                              value="completed"
                              disabled={!apt.hasInvoice}
                              className="bg-white text-blue-700 font-semibold py-1 disabled:text-slate-400"
                            >
                              Completed {!apt.hasInvoice ? "(Payment Required)" : ""}
                            </option>
                            <option value="cancelled" className="bg-white text-rose-700 font-semibold py-1">
                              Cancelled
                            </option>
                          </select>
                          <ChevronDown
                            className={`pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 ${badge.text} opacity-70`}
                          />
                        </div>
                      )}
                    </td>
                  )}

                  {/* Actions Column - Sticky Right */}
                  {showActions && (
                    <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 whitespace-nowrap px-5 py-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] border-l border-slate-100 transition-colors w-[130px] min-w-[130px]">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {/* 1. Pending Appointments -> Approve Button */}
                      {apt.status === "pending" && (
                        <Button
                          type="button"
                          onClick={() =>
                            onApprove ? onApprove(apt.id) : onStatusChange(apt.id, "confirmed")
                          }
                          title="Approve Appointment"
                          aria-label="Approve Appointment"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                        >
                          <Check className="size-3.5" />
                          <span>Approve</span>
                        </Button>
                      )}

                      {/* 2. Active Unpaid Appointments -> Checkout Button (Only if NOT completed & NO invoice) */}
                      {(apt.status === "confirmed" || apt.status === "in_progress") &&
                        !apt.hasInvoice && (
                          <Button
                            type="button"
                            onClick={() => onCheckout?.(apt)}
                            title="Unified POS Checkout"
                            aria-label="Unified POS Checkout"
                            className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-primary-dark transition cursor-pointer"
                          >
                            <CreditCard className="size-3" />
                            <span>Checkout</span>
                          </Button>
                        )}

                      {/* 3. Completed or Invoiced Appointments -> Show Print / Share Bill */}
                      {(apt.status === "completed" || apt.hasInvoice) && (
                        <Button
                          type="button"
                          onClick={() => onPrintInvoice?.(apt)}
                          title={apt.invoiceNumber ? `Print / Share Bill (${apt.invoiceNumber})` : "Print / Share Bill"}
                          aria-label="Print / Share Bill"
                          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Printer className="size-4" />
                        </Button>
                      )}

                      {/* 4. View Appointment Details */}
                      <Button
                        type="button"
                        onClick={() => onView?.(apt)}
                        title="View Appointment"
                        aria-label="View Appointment"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </Button>

                      {/* 5. Edit (only if not completed and not invoiced) */}
                      {apt.status !== "completed" && !apt.hasInvoice && (
                        <Button
                          type="button"
                          onClick={() => onEdit?.(apt)}
                          title="Edit Appointment"
                          aria-label="Edit Appointment"
                          className="rounded-md p-1.5 text-primary hover:bg-primary-lighter/60 hover:text-primary-dark transition cursor-pointer"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}

                      {/* 3. Cancelled Appointments -> View Details */}
                      {apt.status === "cancelled" && (
                        <Button
                          type="button"
                          onClick={() => onView?.(apt)}
                          title="View Details"
                          aria-label="View Details"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
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
