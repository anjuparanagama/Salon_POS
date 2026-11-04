import { useState, type FormEvent } from "react";
import Modal from "../../../../components/modal";
import type { StaffMember, StaffFormData, StaffRole, StaffStatus } from "../../../../interface/staff.types";

export type StaffModalProps = {
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
  scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  status: "active",
  bio: "",
};

const allWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  onCancel: () => void;
  onSubmit: (data: StaffFormData) => void;
};

function StaffForm({ initialValues, isEditing, onCancel, onSubmit }: StaffFormProps) {
  const [formData, setFormData] = useState<StaffFormData>(initialValues);
  const [specialtiesInput, setSpecialtiesInput] = useState(
    initialValues.specialties.join(", ")
  );

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.scheduleDays.includes(day);
      const nextDays = exists
        ? prev.scheduleDays.filter((d) => d !== day)
        : [...prev.scheduleDays, day];
      return { ...prev, scheduleDays: nextDays };
    });
  };

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
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
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

      {/* Commission Rate & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div>
          <label className="block mb-1 font-medium text-slate-700">Employment Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as StaffStatus,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="break">On Break</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
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

      {/* Schedule Days */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Working Schedule Days</label>
        <div className="flex flex-wrap gap-1.5">
          {allWeekDays.map((day) => {
            const isSelected = formData.scheduleDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
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

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
        >
          {isEditing ? "Save Changes" : "Add Staff Member"}
        </button>
      </div>
    </form>
  );
}

export function StaffModal({
  isOpen,
  onClose,
  onSubmit,
  editingStaff,
}: StaffModalProps) {
  const initialData: StaffFormData = editingStaff
    ? {
        name: editingStaff.name,
        role: editingStaff.role,
        email: editingStaff.email,
        phone: editingStaff.phone,
        specialties: editingStaff.specialties,
        commissionRate: editingStaff.commissionRate,
        scheduleDays: editingStaff.scheduleDays,
        status: editingStaff.status,
        bio: editingStaff.bio || "",
      }
    : defaultInitialData;

  const handleSubmit = (data: StaffFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStaff ? "Edit Staff Profile" : "Add New Staff Member"}
      description={
        editingStaff
          ? "Update team member role, working schedule, and commission rates."
          : "Register a new stylist, therapist, or staff member to the salon team."
      }
      size="md"
    >
      <StaffForm
        key={editingStaff ? editingStaff.id : "new-staff"}
        initialValues={initialData}
        isEditing={!!editingStaff}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export default StaffModal;
