import { useState, type FormEvent } from "react";
import Modal from "../../../../components/modal";
import type { Customer, CustomerFormData } from "../../../../interface/customer.types";

export type CustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  editingCustomer?: Customer | null;
  staffList?: string[];
};

const defaultInitialData: CustomerFormData = {
  name: "",
  phone: "",
  email: "",
  gender: "female",
  membershipTier: "regular",
  status: "active",
  preferredStaff: "",
  notes: "",
};

type CustomerFormProps = {
  initialValues: CustomerFormData;
  isEditing: boolean;
  staffList: string[];
  onCancel: () => void;
  onSubmit: (data: CustomerFormData) => void;
};

function CustomerForm({
  initialValues,
  isEditing,
  staffList,
  onCancel,
  onSubmit,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(initialValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Full Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Client Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Jessica Miller"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="e.g. +1 (555) 019-2834"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Email & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Email Address</label>
          <input
            type="email"
            placeholder="e.g. jessica.miller@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as CustomerFormData["gender"],
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Membership Tier & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Membership Tier</label>
          <select
            value={formData.membershipTier}
            onChange={(e) =>
              setFormData({
                ...formData,
                membershipTier: e.target.value as CustomerFormData["membershipTier"],
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="regular">Standard / Regular</option>
            <option value="silver">Silver Tier</option>
            <option value="gold">Gold VIP</option>
            <option value="platinum">Platinum VIP</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Customer Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as CustomerFormData["status"],
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Preferred Stylist */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Preferred Stylist</label>
        <select
          value={formData.preferredStaff}
          onChange={(e) => setFormData({ ...formData, preferredStaff: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">No Preference</option>
          {staffList.map((staff) => (
            <option key={staff} value={staff}>
              {staff}
            </option>
          ))}
        </select>
      </div>

      {/* Notes / Special requirements */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">
          Notes & Preferences (Allergies, Cut style, Formula details)
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Sensitive scalp, prefers warm water, loves organic tea."
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Modal Actions */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs transition hover:bg-primary-dark"
        >
          {isEditing ? "Save Changes" : "Create Customer"}
        </button>
      </div>
    </form>
  );
}

export function CustomerModal({
  isOpen,
  onClose,
  onSubmit,
  editingCustomer,
  staffList = [
    "Amelia Vance",
    "Olivia Wilde",
    "Isabella Gomez",
    "Noah Sterling",
    "Sophia Chen",
  ],
}: CustomerModalProps) {
  const initialData: CustomerFormData = editingCustomer
    ? {
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email,
        gender: editingCustomer.gender,
        membershipTier: editingCustomer.membershipTier,
        status: editingCustomer.status,
        preferredStaff: editingCustomer.preferredStaff || "",
        notes: editingCustomer.notes || "",
      }
    : defaultInitialData;

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCustomer ? "Edit Customer Profile" : "Register New Customer"}
      description={
        editingCustomer
          ? "Update contact details, loyalty tier, and salon preferences."
          : "Add a new client profile with contact and preference details."
      }
      size="md"
    >
      <CustomerForm
        key={editingCustomer ? editingCustomer.id : "new-customer"}
        initialValues={initialData}
        isEditing={!!editingCustomer}
        staffList={staffList}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export default CustomerModal;
