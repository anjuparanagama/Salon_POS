import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
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
import AppointmentViewModal from "./components/appointment-view-modal";
import AppointmentInvoiceModal from "./components/appointment-invoice-modal";
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

const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

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
    status: "pending",
    notes: "Requested senior colorist",
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
    status: "cancelled",
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
  {
    id: "apt-7",
    clientName: "Chloe Martin",
    clientPhone: "+1 (555) 890-1234",
    serviceId: "svc-1",
    serviceName: "Haircut & Styling",
    staffId: "st-2",
    staffName: "Olivia Wilde",
    date: getRelativeDate(1),
    time: "10:00 AM",
    durationMinutes: 45,
    price: 45,
    status: "pending",
    notes: "First time client booking online",
  },
  {
    id: "apt-8",
    clientName: "Grace Taylor",
    clientPhone: "+1 (555) 901-2345",
    serviceId: "svc-4",
    serviceName: "Hydra Deep Facial",
    staffId: "st-3",
    staffName: "Isabella Gomez",
    date: getRelativeDate(2),
    time: "02:00 PM",
    durationMinutes: 60,
    price: 85,
    status: "confirmed",
  },
];

export function Appointments() {
  const { t } = useTranslation(["appointments", "common"]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [invoicingAppointment, setInvoicingAppointment] = useState<Appointment | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [filters, setFilters] = useState<AppointmentFilterState>({
    search: "",
    status: "all",
    staff: "all",
    date: "",
  });

  const handleFilterChange = (updated: Partial<AppointmentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleApproveAppointment = (id: string) => {
    handleStatusChange(id, "confirmed");
  };

  const handleViewAppointment = (apt: Appointment) => {
    setViewingAppointment(apt);
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setIsModalOpen(true);
  };

  const handlePrintInvoice = (apt: Appointment) => {
    setInvoicingAppointment(apt);
  };

  const handleSaveAppointment = (data: AppointmentFormData) => {
    if (editingAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                serviceName: data.serviceName,
                staffName: data.staffName,
                date: data.date,
                time: data.time,
                durationMinutes: data.durationMinutes,
                price: data.price,
                notes: data.notes,
              }
            : apt
        )
      );
      setEditingAppointment(null);
    } else {
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
        status: "pending",
        notes: data.notes,
      };
      setAppointments((prev) => [newAppointment, ...prev]);
    }
  };

  // Compute dynamic stats
  const stats = useMemo(() => {
    return {
      today: appointments.filter((a) => a.date === todayStr).length,
      total: appointments.length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      upcoming: appointments.filter((a) => a.date > todayStr && a.status !== "cancelled").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      inProgress: appointments.filter((a) => a.status === "in_progress").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };
  }, [appointments, todayStr]);

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
        title={t("appointments:title", "Appointments")}
        description={t("appointments:subtitle", "Manage bookings, schedule clients, and assign salon staff.")}
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
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
      />

      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        onStatusChange={handleStatusChange}
        onApprove={handleApproveAppointment}
        onView={handleViewAppointment}
        onEdit={handleEditAppointment}
        onPrintInvoice={handlePrintInvoice}
      />

      {/* New / Edit Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleSaveAppointment}
        staffList={initialStaffList}
        servicesList={defaultServices}
        initialData={editingAppointment}
      />

      {/* View Appointment Details Modal */}
      <AppointmentViewModal
        isOpen={Boolean(viewingAppointment)}
        onClose={() => setViewingAppointment(null)}
        appointment={viewingAppointment}
        onEdit={handleEditAppointment}
        onPrintInvoice={handlePrintInvoice}
      />

      {/* Print Invoice Modal */}
      <AppointmentInvoiceModal
        isOpen={Boolean(invoicingAppointment)}
        onClose={() => setInvoicingAppointment(null)}
        appointment={invoicingAppointment}
      />
    </div>
  );
}

export default Appointments;
