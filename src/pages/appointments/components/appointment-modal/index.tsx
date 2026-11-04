import { useState, type FormEvent } from "react";
import SidePanel from "../../../../components/side-panel";
import type { Appointment, AppointmentFormData } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  staffList: string[];
  servicesList: { name: string; price: number; duration: number }[];
  initialData?: Appointment | null;
};

type AppointmentFormProps = {
  initialValues: AppointmentFormData;
  isEdit: boolean;
  staffList: string[];
  servicesList: { name: string; price: number; duration: number }[];
  onCancel: () => void;
  onSubmit: (data: AppointmentFormData) => void;
};

function AppointmentForm({
  initialValues,
  isEdit,
  staffList,
  servicesList,
  onCancel,
  onSubmit,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>(initialValues);

  const handleServiceChange = (serviceName: string) => {
    const selected = servicesList.find((s) => s.name === serviceName);
    setFormData((prev) => ({
      ...prev,
      serviceName,
      price: selected ? selected.price : prev.price,
      durationMinutes: selected ? selected.duration : prev.durationMinutes,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientPhone.trim()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form id="appointment-form" onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Client details */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Client Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Emma Watson"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="e.g. +1 555-0199"
            value={formData.clientPhone}
            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Service & Specialist selection */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Select Service</label>
          <select
            value={formData.serviceName}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            {servicesList.map((svc) => (
              <option key={svc.name} value={svc.name}>
                {svc.name} ({formatPrice(svc.price)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Assign Specialist</label>
          <select
            value={formData.staffName}
            onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            {staffList.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date, Time & Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Time</label>
          <input
            type="text"
            placeholder="e.g. 10:30 AM"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-slate-700">Price (Rs.)</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Special Notes (Optional)</label>
        <textarea
          rows={3}
          placeholder="Preferences, allergy cautions, or styling notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Action buttons */}
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
          {isEdit ? "Update Appointment" : "Confirm Appointment"}
        </button>
      </div>
    </form>
  );
}

export function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  staffList,
  servicesList,
  initialData,
}: AppointmentModalProps) {
  const isEdit = Boolean(initialData);

  const initialFormValues: AppointmentFormData = initialData
    ? {
        clientName: initialData.clientName,
        clientPhone: initialData.clientPhone,
        serviceName: initialData.serviceName,
        staffName: initialData.staffName,
        date: initialData.date,
        time: initialData.time,
        durationMinutes: initialData.durationMinutes,
        price: initialData.price,
        notes: initialData.notes || "",
      }
    : {
        clientName: "",
        clientPhone: "",
        serviceName: servicesList[0]?.name ?? "Haircut & Styling",
        staffName: staffList[0] ?? "Amelia Vance",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        durationMinutes: servicesList[0]?.duration ?? 45,
        price: servicesList[0]?.price ?? 45,
        notes: "",
      };

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Appointment" : "Book New Appointment"}
      description={
        isEdit
          ? `Update details for appointment #${initialData?.id}`
          : "Schedule a new client appointment and assign a specialist."
      }
      size="md"
    >
      <AppointmentForm
        key={initialData ? initialData.id : "new-appointment"}
        initialValues={initialFormValues}
        isEdit={isEdit}
        staffList={staffList}
        servicesList={servicesList}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </SidePanel>
  );
}

export default AppointmentModal;
