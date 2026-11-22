import { Eye, Edit3, Trash2, Phone, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { TableSkeleton } from "@/components/skeleton";
import type { StaffMember, StaffRole } from "../../../../interface/staff.types";
import { formatStaffId } from "../../../../helpers/format-id.helper";
import { Button } from "../../../../components/button";

export type StaffListProps = {
  staffList: StaffMember[];
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  onToggleStatus: (staffId: string) => void;
  isLoading?: boolean;
  visibleColumns?: Record<string, boolean>;
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function StaffList({
  staffList,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
  visibleColumns = {},
}: StaffListProps) {
  if (isLoading && staffList.length === 0) {
    return <TableSkeleton rows={5} columns={5} />;
  }

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
          <thead className="border-b border-slate-100 bg-slate-50/80 font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              {visibleColumns.id !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">ID</th>
              )}
              {visibleColumns.name !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">Name</th>
              )}
              {visibleColumns.role !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">Role</th>
              )}
              {visibleColumns.phone !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">Phone Number</th>
              )}
              {visibleColumns.email !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">Email</th>
              )}
              {visibleColumns.status !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px]">Status</th>
              )}
              {visibleColumns.actions !== false && (
                <th scope="col" className="px-4 py-2.5 text-[11px] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map((staff) => {
              const isActive = staff.status === "active";

              return (
                <tr key={staff.id} className="transition-colors hover:bg-slate-50/70">
                  {/* ID */}
                  {visibleColumns.id !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono font-medium text-slate-600">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {formatStaffId(staff.id)}
                      </span>
                    </td>
                  )}

                  {/* Name */}
                  {visibleColumns.name !== false && (
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-[11px] ring-2 ring-primary/10">
                          {getInitials(staff.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 leading-tight">{staff.name}</div>
                          {Boolean(staff.canAccessPos) && (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-0.5 font-medium leading-none">
                              <ShieldCheck className="size-3" />
                              <span>POS Access</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Role */}
                  {visibleColumns.role !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {roleLabels[staff.role] || staff.role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </td>
                  )}

                  {/* Phone Number */}
                  {visibleColumns.phone !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <Phone className="size-3.5 text-slate-400" />
                        {staff.phone}
                      </span>
                    </td>
                  )}

                  {/* Email */}
                  {visibleColumns.email !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Mail className="size-3.5 text-slate-400" />
                        {staff.email}
                      </span>
                    </td>
                  )}

                  {/* Status (Active or Inactive) */}
                  {visibleColumns.status !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <Button
                        type="button"
                        onClick={() => onToggleStatus(staff.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium cursor-pointer transition hover:opacity-85 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </Button>
                    </td>
                  )}

                  {/* Actions: View, Edit, Delete */}
                  {visibleColumns.actions !== false && (
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          onClick={() => onView(staff)}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                          title="View Staff Details"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => onEdit(staff)}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                          title="Edit Staff Member"
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => onDelete(staff.id)}
                          className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="size-4" />
                        </Button>
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

export default StaffList;
