import { useState, useEffect, type FormEvent } from "react";
import SidePanel from "../../../../components/side-panel";
import type { Customer, CustomerFormData, CustomerGender } from "../../../../interface/customer.types";

export type CustomerPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  editingCustomer?: Customer | null;
  isLoading?: boolean;
};

const defaultInitialData: CustomerFormData = {
  name: "",
  phone: "",
  email: "",
  gender: "prefer_not_to_say",
};

export function CustomerPanel({
  isOpen,
  onClose,
  onSubmit,
  editingCustomer,
  isLoading = false,
}: CustomerPanelProps) {
  const [formData, setFormData] = useState<CustomerFormData>(defaultInitialData);

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email || "",
        gender: editingCustomer.gender || "prefer_not_to_say",
      });
    } else {
      setFormData(defaultInitialData);
    }
  }, [editingCustomer, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    onSubmit(formData);
  };

  const footer = (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || !formData.name.trim() || !formData.phone.trim()}
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer disabled:opacity-50"
      >
        {isLoading
          ? "Saving..."
          : editingCustomer
          ? "Save Changes"
          : "Create Customer"}
      </button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={editingCustomer ? "Edit Customer Profile" : "Register New Customer"}
      description={
        editingCustomer
          ? "Update client name, contact number, email, and gender."
          : "Add a new customer to track visits, spends, and service history."
      }
      size="md"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Jessica Miller"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Number (Phone) <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 0771234567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email */}
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

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as CustomerGender,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
      </form>
    </SidePanel>
  );
}

export default CustomerPanel;
