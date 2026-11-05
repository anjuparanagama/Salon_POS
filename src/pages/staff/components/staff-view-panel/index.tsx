import {
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Edit3,
} from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type { StaffMember, StaffRole } from "../../../../interface/staff.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type StaffViewPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onEdit: (staff: StaffMember) => void;
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

export function StaffViewPanel({
  isOpen,
  onClose,
  staff,
  onEdit,
}: StaffViewPanelProps) {
  if (!staff) return null;

  const isActive = staff.status === "active";

  const footer = (
    <div className="flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Close
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onEdit(staff);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
      >
        <Edit3 className="size-3.5" />
        <span>Edit Staff Member</span>
      </button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Profile Details"
      description="View full staff information, performance metrics, and POS terminal access."
      size="lg"
      side="right"
      footer={footer}
    >
      <div className="flex flex-col gap-5 text-xs text-slate-800">
        {/* Profile Card */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-lg ring-4 ring-primary/10">
            {getInitials(staff.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{staff.name}</h3>
              <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                #{staff.id.toUpperCase()}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {roleLabels[staff.role] || staff.role}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* POS Access Card */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${
                  staff.canAccessPos ?? true
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {staff.canAccessPos ?? true ? (
                  <ShieldCheck className="size-4.5" />
                ) : (
                  <ShieldAlert className="size-4.5" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">POS System Terminal Access</h4>
                <p className="text-[11px] text-slate-500">
                  {staff.canAccessPos ?? true
                    ? "Staff member is authorized to access and operate the salon POS system."
                    : "POS login is currently disabled for this staff account."}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                staff.canAccessPos ?? true
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {staff.canAccessPos ?? true ? "Authorized" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="size-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Phone Number</div>
                <div className="font-medium">{staff.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="size-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Email Address</div>
                <div className="font-medium">{staff.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Joined Date</div>
                <div className="font-medium">{staff.joinedDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <DollarSign className="size-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Commission Rate</div>
                <div className="font-medium text-primary">{staff.commissionRate}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
            <div className="flex items-center justify-center gap-1 font-bold text-slate-900 text-sm">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{staff.rating.toFixed(1)}</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">
              {staff.reviewsCount} Reviews
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
            <div className="font-bold text-slate-900 text-sm">
              {staff.completedAppointments}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">Appts Completed</div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
            <div className="font-bold text-primary text-sm">
              {formatPrice(staff.revenueGenerated)}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">Revenue Generated</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <h4 className="font-semibold text-slate-900 mb-2.5">Specialties & Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {staff.specialties.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                <Award className="size-3 text-slate-400" />
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Professional Bio */}
        {staff.bio && (
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
            <h4 className="font-semibold text-slate-900 mb-1.5">Professional Bio & Notes</h4>
            <p className="text-slate-600 leading-relaxed text-xs">{staff.bio}</p>
          </div>
        )}
      </div>
    </SidePanel>
  );
}

export default StaffViewPanel;

