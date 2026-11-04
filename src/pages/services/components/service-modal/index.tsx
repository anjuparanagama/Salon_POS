import { useState, type FormEvent } from "react";
import Modal from "../../../../components/modal";
import type { ServiceFormData, ServiceItem } from "../../../../interface/service.types";

export type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  editingService?: ServiceItem | null;
};

const defaultInitialData: ServiceFormData = {
  name: "",
  category: "hair",
  durationMinutes: 45,
  price: 45,
  description: "",
  isActive: true,
};

type ServiceFormProps = {
  initialValues: ServiceFormData;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (data: ServiceFormData) => void;
};

function ServiceForm({ initialValues, isEditing, onCancel, onSubmit }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <div>
        <label className="block mb-1 font-medium text-slate-700">Service Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Keratin Hair Therapy"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as ServiceFormData["category"],
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="hair">Hair Care</option>
            <option value="skin">Skin & Facial</option>
            <option value="nails">Nail Care</option>
            <option value="spa">Spa & Massage</option>
            <option value="makeup">Bridal & Glam</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Duration (mins)</label>
          <input
            type="number"
            min="5"
            step="5"
            required
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Price (Rs.)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-slate-700">Service Description</label>
        <textarea
          rows={3}
          placeholder="Describe the treatment, products included, and client benefits..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="service-active-toggle"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded border-slate-300 text-primary focus:ring-primary size-4"
        />
        <label htmlFor="service-active-toggle" className="font-medium text-slate-700 cursor-pointer">
          Publish as active and available for bookings
        </label>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          {isEditing ? "Save Changes" : "Create Service"}
        </button>
      </div>
    </form>
  );
}

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  editingService,
}: ServiceModalProps) {
  const initialValues: ServiceFormData = editingService
    ? {
        name: editingService.name,
        category: editingService.category,
        durationMinutes: editingService.durationMinutes,
        price: editingService.price,
        description: editingService.description,
        isActive: editingService.isActive,
      }
    : defaultInitialData;

  const handleFormSubmit = (data: ServiceFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingService ? "Edit Service" : "Add New Service"}
      description="Configure salon service details, pricing, duration, and catalog category."
      size="md"
    >
      <ServiceForm
        key={editingService ? editingService.id : "new-service"}
        initialValues={initialValues}
        isEditing={Boolean(editingService)}
        onCancel={onClose}
        onSubmit={handleFormSubmit}
      />
    </Modal>
  );
}

export default ServiceModal;
