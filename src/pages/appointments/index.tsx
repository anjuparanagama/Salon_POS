import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, CalendarDays } from "lucide-react";
import type {
  Appointment,
  AppointmentFilterState,
  AppointmentFormData,
  AppointmentStatus,
} from "../../interface/appointment.types";

import AppointmentStats from "./components/appointment-stats";
import AppointmentFilters from "./components/appointment-filters";
import AppointmentList from "./components/appointment-list";
import AppointmentModal from "./components/appointment-modal";
import Header from "../../components/header";

const initialStaffList = ["Amelia Vance", "Olivia Wilde", "Isabella Gomez", "Noah Sterling", "Sophia Chen"];

const defaultServices = [
  { name: "Haircut & Styling", price: 45, duration: 45 },
  { name: "Balayage Color & Highlights", price: 120, duration: 90 },
  { name: "Deluxe Manicure & Pedicure", price: 65, duration: 60 },
  { name: "Hydra Deep Facial", price: 85, duration: 60 },
  { name: "Bridal Full Glam Makeup", price: 150, duration: 75 },
  { name: "Aromatherapy Full Body Massage", price: 95, duration: 60 },
];

const initialAppointments: Appointment[] = [
  {
    id: "apt-1",
    clientName: "Emma Wilson",
    clientPhone: "+1 (555) 234-5678",
    serviceId: "svc-1",
    serviceName: "Haircut & Styling",
    staffId: "st-1",
    staffName: "Amelia Vance",
    date: new Date().toISOString().split("T")[0],
    time: "09:00 AM",
    durationMinutes: 45,
    price: 45,
    status: "in_progress",
    notes: "Prefers layered cut with curtain bangs",
  },
  {
    id: "apt-2",
    clientName: "Sophia Brown",
    clientPhone: "+1 (555) 345-6789",
    serviceId: "svc-3",
    serviceName: "Deluxe Manicure & Pedicure",
    staffId: "st-2",
    staffName: "Olivia Wilde",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    durationMinutes: 60,
    price: 65,
    status: "confirmed",
    notes: "Gel polish, French tips",
  },
  {
    id: "apt-3",
    clientName: "Mia Johnson",
    clientPhone: "+1 (555) 456-7890",
    serviceId: "svc-2",
    serviceName: "Balayage Color & Highlights",
    staffId: "st-1",
    staffName: "Amelia Vance",
    date: new Date().toISOString().split("T")[0],
    time: "11:45 AM",
    durationMinutes: 90,
    price: 120,
    status: "confirmed",
  },
  {
    id: "apt-4",
    clientName: "Ava Smith",
    clientPhone: "+1 (555) 567-8901",
    serviceId: "svc-4",
    serviceName: "Hydra Deep Facial",
    staffId: "st-3",
    staffName: "Isabella Gomez",
    date: new Date().toISOString().split("T")[0],
    time: "01:30 PM",
    durationMinutes: 60,
    price: 85,
    status: "confirmed",
    notes: "Sensitive skin, use fragrance-free serum",
  },
  {
    id: "apt-5",
    clientName: "Charlotte Davis",
    clientPhone: "+1 (555) 678-9012",
    serviceId: "svc-5",
    serviceName: "Bridal Full Glam Makeup",
    staffId: "st-5",
    staffName: "Sophia Chen",
    date: new Date().toISOString().split("T")[0],
    time: "03:00 PM",
    durationMinutes: 75,
    price: 150,
    status: "pending",
  },
  {
    id: "apt-6",
    clientName: "Harper Lee",
    clientPhone: "+1 (555) 789-0123",
    serviceId: "svc-6",
    serviceName: "Aromatherapy Full Body Massage",
    staffId: "st-4",
    staffName: "Noah Sterling",
    date: new Date().toISOString().split("T")[0],
    time: "04:30 PM",
    durationMinutes: 60,
    price: 95,
    status: "completed",
  },
];

export function Appointments() {
  const { t } = useTranslation(["appointments", "common"]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [filters, setFilters] = useState<AppointmentFilterState>({
    search: "",
    status: "all",
    staff: "all",
    date: todayStr,
  });

  const handleFilterChange = (updated: Partial<AppointmentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleDateChange = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setFilters((prev) => ({ ...prev, date: todayStr }));
      return;
    }
    const current = new Date(filters.date);
    const dayOffset = direction === "next" ? 1 : -1;
    current.setDate(current.getDate() + dayOffset);
    setFilters((prev) => ({ ...prev, date: current.toISOString().split("T")[0] }));
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleAddAppointment = (data: AppointmentFormData) => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      serviceId: `svc-${Date.now()}`,
      serviceName: data.serviceName,
      staffId: `st-${Date.now()}`,
      staffName: data.staffName,
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes,
      price: data.price,
      status: "confirmed",
      notes: data.notes,
    };
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  // Compute dynamic stats
  const stats = useMemo(() => {
    return {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      inProgress: appointments.filter((a) => a.status === "in_progress").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesClient = apt.clientName.toLowerCase().includes(query);
        const matchesPhone = apt.clientPhone.toLowerCase().includes(query);
        const matchesService = apt.serviceName.toLowerCase().includes(query);
        if (!matchesClient && !matchesPhone && !matchesService) return false;
      }
      // Status
      if (filters.status !== "all" && apt.status !== filters.status) {
        return false;
      }
      // Staff
      if (filters.staff !== "all" && apt.staffName !== filters.staff) {
        return false;
      }
      // Date filter (if matching date is selected)
      if (filters.date && apt.date !== filters.date) {
        return false;
      }
      return true;
    });
  }, [appointments, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header Section */}
      <Header
        icon={CalendarDays}
        title={t("appointments:title", "Appointments")}
        description={t("appointments:subtitle", "Manage bookings, schedule clients, and assign salon staff.")}
        actions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("appointments:newAppointment", "New Appointment")}</span>
          </button>
        }
      />

      {/* KPI Stats row */}
      <AppointmentStats stats={stats} />

      {/* Filters & Control bar */}
      <AppointmentFilters
        filters={filters}
        staffList={initialStaffList}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
      />

      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        onStatusChange={handleStatusChange}
      />

      {/* New Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAppointment}
        staffList={initialStaffList}
        servicesList={defaultServices}
      />
    </div>
  );
}

export default Appointments;

