import { useState, useEffect, type FormEvent } from "react";
import SidePanel from "../../../../components/side-panel";
import type { Appointment, AppointmentFormData } from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";

export type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  staffList: string[];
  staffMembers?: Array<{ id: string; name: string }>;
  servicesList: { id?: string; name: string; price: number; duration: number }[];
  initialData?: Appointment | null;
};

type AppointmentFormProps = {
  initialValues: AppointmentFormData;
  staffList: string[];
  staffMembers?: Array<{ id: string; name: string }>;
  servicesList: { id?: string; name: string; price: number; duration: number }[];
  onSubmit: (data: AppointmentFormData) => void;
};

function AppointmentForm({
  initialValues,
  staffList,
  staffMembers,
  servicesList,
  onSubmit,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>(initialValues);

  useEffect(() => {
    if (!formData.serviceName && servicesList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        serviceName: servicesList[0].name,
        serviceId: servicesList[0].id || prev.serviceId,
        price: servicesList[0].price,
        durationMinutes: servicesList[0].duration,
      }));
    }
  }, [formData.serviceName, servicesList]);

  useEffect(() => {
    if (!formData.staffName && staffList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        staffName: staffList[0],
        staffId: staffMembers?.find((s) => s.name === staffList[0])?.id || prev.staffId,
      }));
    }
  }, [formData.staffName, staffList, staffMembers]);

  const handleStaffChange = (staffName: string) => {
    const matched = staffMembers?.find((s) => s.name === staffName);
    setFormData((prev) => ({
      ...prev,
      staffName,
      staffId: matched?.id || prev.staffId,
    }));
  };

  const handleServiceChange = (serviceName: string) => {
    const selected = servicesList.find((s) => s.name === serviceName);
    setFormData((prev) => ({
      ...prev,
      serviceName,
      serviceId: selected?.id || prev.serviceId,
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
      {/* Row 1: Client Name & Phone Number (2 fields in 1 row) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Client Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Emma Watson"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>
      </div>

      {/* Row 2: Service & Specialist selection (2 fields in 1 row) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Select Service</label>
          <select
            value={formData.serviceName}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
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
            onChange={(e) => handleStaffChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
          >
            {staffList.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Date & Time (2 fields in 1 row) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Time</label>
          <input
            type="text"
            placeholder="e.g. 10:30 AM"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>
      </div>

      {/* Row 4: Duration & Price (2 fields in 1 row) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Duration (Mins)</label>
          <input
            type="number"
            min="5"
            step="5"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Price (Rs.)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>
      </div>

      {/* Row 5: Notes */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Special Notes (Optional)</label>
        <textarea
          rows={3}
          placeholder="Preferences, allergy cautions, or styling notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        />
      </div>
    </form>
  );
}

export function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  staffList,
  staffMembers,
  servicesList,
  initialData,
}: AppointmentModalProps) {
  const isEdit = Boolean(initialData);

  const initialFormValues: AppointmentFormData = initialData
    ? {
        clientName: initialData.clientName,
        clientPhone: initialData.clientPhone,
        serviceId: initialData.serviceId,
        serviceName: initialData.serviceName,
        staffId: initialData.staffId,
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
        serviceId: servicesList[0]?.id,
        serviceName: servicesList[0]?.name ?? "",
        staffId: staffMembers?.find((s) => s.name === (staffList[0] ?? ""))?.id,
        staffName: staffList[0] ?? "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        durationMinutes: servicesList[0]?.duration ?? 45,
        price: servicesList[0]?.price ?? 0,
        notes: "",
      };

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
    onClose();
  };

  const aptNumber = initialData ? formatAppointmentId(initialData) : "";

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Appointment" : "Book New Appointment"}
      description={
        isEdit
          ? `Update details for appointment ${aptNumber}`
          : "Schedule a new client appointment and assign a specialist."
      }
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="appointment-form"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            {isEdit ? "Update Appointment" : "Confirm Appointment"}
          </button>
        </div>
      }
    >
      <AppointmentForm
        key={`${initialData ? initialData.id : "new-appointment"}-${staffList.join(",")}-${servicesList.map((s) => s.name).join(",")}`}
        initialValues={initialFormValues}
        staffList={staffList}
        staffMembers={staffMembers}
        servicesList={servicesList}
        onSubmit={handleSubmit}
      />
    </SidePanel>
  );
}

export default AppointmentModal;
