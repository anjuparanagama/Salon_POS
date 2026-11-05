import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type {
  StaffMember,
  StaffFormData,
  StaffRole,
  StaffStatus,
} from "../../../../interface/staff.types";

export type StaffPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
  editingStaff?: StaffMember | null;
};

const defaultInitialData: StaffFormData = {
  name: "",
  role: "stylist",
  email: "",
  phone: "",
  specialties: ["Haircut & Styling"],
  commissionRate: 20,
  status: "active",
  bio: "",
  canAccessPos: true,
  password: "",
};

const roleOptions: { value: StaffRole; label: string }[] = [
  { value: "senior_stylist", label: "Senior Stylist" },
  { value: "stylist", label: "Hair Stylist" },
  { value: "colorist", label: "Hair Colorist" },
  { value: "esthetician", label: "Esthetician" },
  { value: "nail_technician", label: "Nail Technician" },
  { value: "barber", label: "Master Barber" },
  { value: "receptionist", label: "Front Desk Receptionist" },
  { value: "salon_manager", label: "Salon Manager" },
];

type StaffFormProps = {
  initialValues: StaffFormData;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
};

function StaffForm({ initialValues, isEditing, onSubmit, onClose }: StaffFormProps) {
  const [formData, setFormData] = useState<StaffFormData>(initialValues);
  const [specialtiesInput, setSpecialtiesInput] = useState(
    initialValues.specialties.join(", ")
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const parsedSpecialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      ...formData,
      specialties: parsedSpecialties.length > 0 ? parsedSpecialties : ["General Salon Care"],
    });
    onClose();
  };

  return (
    <form id="staff-form" onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Full Name & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Amelia Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Salon Role *</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as StaffRole,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="e.g. +1 (555) 234-5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. amelia@salonpos.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Status (Active / Inactive) & Commission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Status *</label>
          <select
            value={formData.status === "inactive" ? "inactive" : "active"}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as StaffStatus,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Commission Rate (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={formData.commissionRate}
            onChange={(e) =>
              setFormData({ ...formData, commissionRate: Number(e.target.value) || 0 })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* POS Access & Password Section */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary-lighter text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900">POS System Access</h4>
              <p className="text-[11px] text-slate-500">
                Allow this staff member to log in to the POS terminal.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-0.5">
            <input
              type="checkbox"
              checked={formData.canAccessPos ?? true}
              onChange={(e) => setFormData({ ...formData, canAccessPos: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Password Input */}
        {(formData.canAccessPos ?? true) && (
          <div className="pt-2 border-t border-slate-200/70">
            <label className="block mb-1 font-medium text-slate-700">
              {isEditing ? "POS Login Password (optional)" : "POS Login Password *"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEditing
                    ? "Enter new password to change (leave blank to keep current)"
                    : "Create POS password for this staff member"
                }
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {isEditing
                ? "Leave this blank if you don't want to change their existing POS login password."
                : "This password allows the staff member to log in to the POS system in the future."}
            </p>
          </div>
        )}
      </div>

      {/* Specialties */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">
          Specialties (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. Balayage, Layered Cuts, Keratin Treatment"
          value={specialtiesInput}
          onChange={(e) => setSpecialtiesInput(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Bio / Experience */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Professional Bio & Notes</label>
        <textarea
          rows={3}
          placeholder="e.g. 7+ years of experience in luxury color blending and precision styling."
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>
  );
}

export function StaffPanel({
  isOpen,
  onClose,
  onSubmit,
  editingStaff,
}: StaffPanelProps) {
  const isEditing = Boolean(editingStaff);

  const initialValues: StaffFormData = editingStaff
    ? {
        name: editingStaff.name,
        role: editingStaff.role,
        email: editingStaff.email,
        phone: editingStaff.phone,
        specialties: editingStaff.specialties,
        commissionRate: editingStaff.commissionRate,
        status: editingStaff.status,
        bio: editingStaff.bio || "",
        canAccessPos: editingStaff.canAccessPos ?? true,
        password: "",
      }
    : defaultInitialData;

  const footer = (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="staff-form"
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
      >
        {isEditing ? "Save Changes" : "Add Staff Member"}
      </button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Staff Member" : "Add New Staff Member"}
      description={
        isEditing
          ? "Update staff contact details, salon role, and POS terminal credentials."
          : "Register a team member, set commission, and configure future POS login credentials."
      }
      size="lg"
      side="right"
      footer={footer}
    >
      <StaffForm
        key={editingStaff ? editingStaff.id : "new-staff"}
        initialValues={initialValues}
        isEditing={isEditing}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </SidePanel>
  );
}

export default StaffPanel;
