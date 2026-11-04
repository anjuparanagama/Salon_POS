import { Edit3, Trash2, Phone, Mail, Star, AlertCircle, Percent } from "lucide-react";
import type { StaffMember, StaffRole, StaffStatus } from "../../../../interface/staff.types";

export type StaffListProps = {
  staffList: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  onToggleStatus: (staffId: string) => void;
};

const roleLabels: Record<StaffRole, string> = {
  senior_stylist: "Senior Stylist",
  stylist: "Hair Stylist",
  colorist: "Hair Colorist",
  esthetician: "Esthetician",
  nail_technician: "Nail Technician",
  barber: "Master Barber",
  receptionist: "Front Desk Receptionist",
  salon_manager: "Salon Manager",
};

const statusStyles: Record<StaffStatus, { bg: string; dot: string; label: string }> = {
  active: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Active",
  },
  on_leave: {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "On Leave",
  },
  break: {
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    label: "On Break",
  },
  inactive: {
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    label: "Inactive",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function StaffList({ staffList, onEdit, onDelete, onToggleStatus }: StaffListProps) {
  if (staffList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No staff members found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Adjust search criteria or add new stylists to your salon team.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3.5">Staff Member</th>
              <th scope="col" className="px-5 py-3.5">Role & Specialties</th>
              <th scope="col" className="px-5 py-3.5">Contact Details</th>
              <th scope="col" className="px-5 py-3.5">Working Days</th>
              <th scope="col" className="px-5 py-3.5">Rating & Volume</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map((staff) => {
              const status = statusStyles[staff.status];

              return (
                <tr key={staff.id} className="transition-colors hover:bg-slate-50/70">
                  {/* Name and avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-xs ring-2 ring-primary/10">
                        {getInitials(staff.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{staff.name}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Percent className="size-3 text-slate-400" />
                          <span>{staff.commissionRate}% Commission</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Specialties */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">
                      {roleLabels[staff.role]}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1 max-w-[220px]">
                      {staff.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-col gap-1 text-[11px]">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Phone className="size-3 text-slate-400" />
                        {staff.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="size-3 text-slate-400" />
                        {staff.email}
                      </span>
                    </div>
                  </td>

                  {/* Working Days */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                      {staff.scheduleDays.map((day) => (
                        <span
                          key={day}
                          className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Rating & Volume */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{staff.rating.toFixed(1)}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({staff.reviewsCount})
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {staff.completedAppointments} appts • ${staff.revenueGenerated.toLocaleString()} rev
                    </div>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(staff.id)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium cursor-pointer transition hover:opacity-80 ${status.bg}`}
                      title="Click to toggle active / leave status"
                    >
                      <span className={`size-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(staff)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                        title="Edit Staff Member"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(staff.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="size-4" />
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

export default StaffList;

