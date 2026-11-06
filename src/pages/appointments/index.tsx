import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import type {
  Appointment,
  AppointmentFilterState,
  AppointmentFormData,
  AppointmentStatus,
} from "../../interface/appointment.types";
import { useAppointments } from "../../hooks/appointments";

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

export function Appointments() {
  const { t } = useTranslation(["appointments", "common"]);
  const {
    appointments,
    createAppointment,
    updateAppointment,
    updateStatus,
  } = useAppointments();

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
    updateStatus(id, newStatus);
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

  const handleSaveAppointment = async (data: AppointmentFormData) => {
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, data);
      setEditingAppointment(null);
    } else {
      await createAppointment(data);
    }
  };

  // Compute dynamic stats
  const stats = useMemo(() => {
    return {
      today: appointments.filter((a) => (a.date ?? "") === todayStr).length,
      total: appointments.length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      upcoming: appointments.filter((a) => (a.date ?? "") > todayStr && a.status !== "cancelled").length,
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
        const matchesClient = (apt.clientName ?? "").toLowerCase().includes(query);
        const matchesPhone = (apt.clientPhone ?? "").toLowerCase().includes(query);
        const matchesService = (apt.serviceName ?? "").toLowerCase().includes(query);
        const matchesStaff = (apt.staffName ?? "").toLowerCase().includes(query);
        if (!matchesClient && !matchesPhone && !matchesService && !matchesStaff) return false;
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
