import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import { Input } from "../../../../components/input";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentServiceItem,
} from "../../../../interface/appointment.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";

export type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  staffList: string[];
  staffMembers?: Array<{ id: string; name: string }>;
  servicesList: {
    id?: string;
    name: string;
    price: number;
    duration: number;
    isActive?: boolean;
  }[];
  existingAppointments?: Appointment[];
  initialData?: Appointment | null;
};

type AppointmentFormProps = {
  initialValues: AppointmentFormData;
  staffList: string[];
  staffMembers?: Array<{ id: string; name: string }>;
  servicesList: {
    id?: string;
    name: string;
    price: number;
    duration: number;
    isActive?: boolean;
  }[];
  existingAppointments?: Appointment[];
  currentAppointmentId?: string;
  onConflictChange?: (hasConflict: boolean) => void;
  onSubmit: (data: AppointmentFormData) => void;
};

export function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 600;
  const trimmed = timeStr.trim().toUpperCase();

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const modifier = match12[3]?.toUpperCase();
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return 600;
}

function AppointmentForm({
  initialValues,
  staffList,
  staffMembers,
  servicesList,
  existingAppointments = [],
  currentAppointmentId,
  onConflictChange,
  onSubmit,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>(initialValues);
  const [serviceToAdd, setServiceToAdd] = useState<string>("");
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Initialize selected services (default to empty unless editing or provided)
  const [selectedServices, setSelectedServices] = useState<
    AppointmentServiceItem[]
  >(() => {
    if (initialValues.services && initialValues.services.length > 0) {
      return initialValues.services;
    }
    if (initialValues.serviceName) {
      const found = servicesList.find(
        (s) => s.name === initialValues.serviceName,
      );
      return [
        {
          id: found?.id || initialValues.serviceId,
          name: initialValues.serviceName,
          price: found?.price ?? initialValues.price ?? 45,
          durationMinutes:
            found?.duration ?? initialValues.durationMinutes ?? 45,
        },
      ];
    }
    return [];
  });

  // Keep services, total duration, and total price in sync
  const syncServices = (updatedList: AppointmentServiceItem[]) => {
    setSelectedServices(updatedList);
    if (updatedList.length > 0) {
      setServiceError(null);
    }
    const totalDuration = updatedList.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );
    const totalPrice = updatedList.reduce((sum, s) => sum + s.price, 0);
    const joinedNames = updatedList.map((s) => s.name).join(", ");

    setFormData((prev) => ({
      ...prev,
      services: updatedList,
      serviceName: joinedNames,
      serviceId: updatedList[0]?.id || prev.serviceId,
      durationMinutes: totalDuration,
      price: totalPrice,
    }));
  };

  const handleAddService = (serviceNameToAdd?: string) => {
    const target = serviceNameToAdd || serviceToAdd;
    if (!target) return;
    const found = servicesList.find((s) => s.name === target);
    if (!found) return;

    const newItem: AppointmentServiceItem = {
      id: found.id,
      name: found.name,
      price: found.price,
      durationMinutes: found.duration,
    };

    syncServices([...selectedServices, newItem]);
    setServiceToAdd("");
  };

  const handleRemoveService = (indexToRemove: number) => {
    const updated = selectedServices.filter((_, idx) => idx !== indexToRemove);
    syncServices(updated);
  };

  useEffect(() => {
    if (!formData.staffName && staffList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        staffName: staffList[0],
        staffId:
          staffMembers?.find((s) => s.name === staffList[0])?.id ||
          prev.staffId,
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

  // Conflict detection: Same specialist, same date, overlapping time window
  const conflict = useMemo(() => {
    if (
      !formData.staffName ||
      !formData.date ||
      !formData.time ||
      formData.durationMinutes <= 0 ||
      selectedServices.length === 0
    ) {
      return null;
    }
    const newStart = parseTimeToMinutes(formData.time);
    const newEnd = newStart + formData.durationMinutes;

    return (
      existingAppointments.find((apt) => {
        if (currentAppointmentId && apt.id === currentAppointmentId)
          return false;
        if (apt.status === "cancelled") return false;
        if (apt.date !== formData.date) return false;

        const isSameStaff =
          (formData.staffId &&
            apt.staffId &&
            apt.staffId === formData.staffId) ||
          (apt.staffName &&
            formData.staffName &&
            apt.staffName.toLowerCase().trim() ===
              formData.staffName.toLowerCase().trim());

        if (!isSameStaff) return false;

        const aptStart = parseTimeToMinutes(apt.time);
        const aptDuration = Math.max(5, apt.durationMinutes || 45);
        const aptEnd = aptStart + aptDuration;

        return newStart < aptEnd && newEnd > aptStart;
      }) || null
    );
  }, [
    existingAppointments,
    formData.staffName,
    formData.staffId,
    formData.date,
    formData.time,
    formData.durationMinutes,
    selectedServices.length,
    currentAppointmentId,
  ]);

  useEffect(() => {
    onConflictChange?.(Boolean(conflict));
  }, [conflict, onConflictChange]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientPhone.trim()) {
      return;
    }
    if (selectedServices.length === 0) {
      setServiceError("Please select at least one service.");
      return;
    }
    if (conflict) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form
      id="appointment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 text-xs"
    >
      {/* Conflict Warning Alert */}
      {conflict && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-900 flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-800">
              Specialist Already Booked (Time Conflict)
            </p>
            <p className="mt-1 text-[11px] text-rose-700 leading-relaxed">
              <strong>{formData.staffName}</strong> is already booked on{" "}
              <strong>{formData.date}</strong> at{" "}
              <strong>{conflict.time}</strong> ({conflict.durationMinutes ?? 45}{" "}
              mins). Please pick a different time slot or assign another
              specialist.
            </p>
          </div>
        </div>
      )}

      {/* Row 1: Client Name & Phone Number */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="text"
          required
          label="Client Name *"
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="e.g. Emma Watson"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-white"
        />

        <Input
          type="tel"
          required
          label="Phone Number *"
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="e.g. +1 555-0199"
          value={formData.clientPhone}
          onChange={(e) =>
            setFormData({ ...formData, clientPhone: e.target.value })
          }
          className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-white"
        />
      </div>

      {/* Row 2: Multiple Services Selection */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-slate-800">
            Selected Services ({selectedServices.length})
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            Total Duration:{" "}
            <strong className="text-slate-900">
              {formData.durationMinutes} mins
            </strong>
          </span>
        </div>

        {/* Selected Services Chips / Rows */}
        {selectedServices.length > 0 ? (
          <div className="space-y-1.5 mb-2.5">
            {selectedServices.map((svc, idx) => (
              <div
                key={`${svc.name}-${idx}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-900 truncate">
                    {svc.name}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 shrink-0">
                    {svc.durationMinutes} mins
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-slate-900">
                    {formatPrice(svc.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove service"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white py-3 px-3 text-center mb-2.5">
            <p className="text-slate-400 text-xs">
              No service selected yet. Choose a service below to add.
            </p>
          </div>
        )}

        {serviceError && (
          <p className="mb-2 text-[11px] font-medium text-rose-600">
            {serviceError}
          </p>
        )}

        {/* Add Service Dropdown Row */}
        <div className="flex items-center gap-2 w-full min-w-0">
          <select
            value={serviceToAdd}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                handleAddService(val);
              }
            }}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer truncate"
          >
            <option value="">
              {selectedServices.length === 0
                ? "+ Select a service to add..."
                : "+ Add another service..."}
            </option>
            {servicesList
              .filter(
                (s) =>
                  s.isActive !== false &&
                  !selectedServices.some((sel) => sel.name === s.name),
              )
              .map((svc) => (
                <option key={svc.name} value={svc.name}>
                  {svc.name} ({svc.duration} mins - {formatPrice(svc.price)})
                </option>
              ))}
          </select>
          <button
            type="button"
            disabled={!serviceToAdd}
            onClick={() => handleAddService()}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Row 3: Specialist Selection */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">
          Assign Specialist *
        </label>
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

      {/* Row 4: Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="date"
          required
          label="Date *"
          labelClassName="block mb-0 font-medium text-slate-700"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-white"
        />

        <Input
          type="text"
          required
          label="Time *"
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="e.g. 10:00 AM"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:ring-primary/20 bg-white"
        />
      </div>

      {/* Row 5: Duration & Price (Auto-calculated, strictly read-only) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Total Duration
            <span className="text-[10px] text-slate-400 font-normal ml-1">
              (Auto-calculated)
            </span>
          </label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-100/90 px-3 py-2 text-slate-700 font-medium select-none flex items-center justify-between">
            <span>{formData.durationMinutes} mins</span>
            <span className="text-[10px] text-slate-400">Sum of services</span>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Total Price
            <span className="text-[10px] text-slate-400 font-normal ml-1">
              (Auto-calculated)
            </span>
          </label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-100/90 px-3 py-2 text-slate-900 font-bold select-none flex items-center justify-between">
            <span>{formatPrice(formData.price)}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Approx total
            </span>
          </div>
        </div>
      </div>

      {/* Row 6: Special Notes */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">
          Special Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Preferences, allergy cautions, or styling notes..."
          value={formData.notes || ""}
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
  existingAppointments = [],
  initialData,
}: AppointmentModalProps) {
  const isEdit = Boolean(initialData);
  const [hasConflict, setHasConflict] = useState(false);

  const initialFormValues: AppointmentFormData = initialData
    ? {
        clientName: initialData.clientName,
        clientPhone: initialData.clientPhone,
        serviceId: initialData.serviceId,
        serviceName: initialData.serviceName,
        services: initialData.services,
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
        serviceId: undefined,
        serviceName: "",
        services: [],
        staffId: staffMembers?.find((s) => s.name === (staffList[0] ?? ""))?.id,
        staffName: staffList[0] ?? "",
        date: new Date().toISOString().split("T")[0],
        time: "12:00 AM",
        durationMinutes: 0,
        price: 0,
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
      size="xl"
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
            disabled={hasConflict}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {hasConflict
              ? "Specialist Unavailable"
              : isEdit
                ? "Update Appointment"
                : "Confirm Appointment"}
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
        existingAppointments={existingAppointments}
        currentAppointmentId={initialData?.id}
        onConflictChange={setHasConflict}
        onSubmit={handleSubmit}
      />
    </SidePanel>
  );
}

export default AppointmentModal;
