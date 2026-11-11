import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Plus, ShoppingBag } from "lucide-react";
import { ROUTES } from "../../routes/sidebar.routes";
import type {
  Appointment,
  AppointmentFilterState,
  AppointmentFormData,
  AppointmentStatus,
} from "../../interface/appointment.types";
import { useAppointments } from "../../hooks/appointments";
import { servicesService } from "../../services/services.service";
import { staffService } from "../../services/staff.service";
import { registerStaff, registerService } from "../../services/appointments.service";

import AppointmentStats from "./components/appointment-stats";
import AppointmentFilters from "./components/appointment-filters";
import AppointmentList from "./components/appointment-list";
import AppointmentModal from "./components/appointment-modal";
import AppointmentViewModal from "./components/appointment-view-modal";
import AppointmentInvoiceModal from "./components/appointment-invoice-modal";
import AppointmentCheckoutModal from "./components/appointment-checkout-modal";
import Header from "../../components/header";

export function Appointments() {
  const navigate = useNavigate();
  const { t } = useTranslation(["appointments", "common"]);
  const {
    appointments,
    createAppointment,
    updateAppointment,
    updateStatus,
    refetch,
    isLoading,
  } = useAppointments();

  const [backendServices, setBackendServices] = useState<
    Array<{ id: string; name: string; price: number; duration: number; isActive: boolean }>
  >([]);
  const [backendStaff, setBackendStaff] = useState<
    Array<{ id: string; name: string; role?: string; status?: string }>
  >([]);

  useEffect(() => {
    let ignore = false;

    async function loadBackendData() {
      try {
        const [servicesRes, staffRes] = await Promise.allSettled([
          servicesService.getServicesList(),
          staffService.getStaffList(),
        ]);

        if (ignore) return;

        if (servicesRes.status === "fulfilled" && servicesRes.value.length > 0) {
          servicesRes.value.forEach((svc) => registerService(svc.id, svc.name));
          setBackendServices(servicesRes.value);
        }

        if (staffRes.status === "fulfilled" && staffRes.value.length > 0) {
          staffRes.value.forEach((s) => registerStaff(s.id, s.name));
          setBackendStaff(staffRes.value);
        }
      } catch (err) {
        console.error("Failed to load services or staff from backend:", err);
      }
    }

    void loadBackendData();

    return () => {
      ignore = true;
    };
  }, []);

  const staffList = useMemo(() => {
    const list: string[] = [];
    backendStaff.forEach((s) => {
      const name = s.name?.trim();
      if (name && !list.includes(name)) {
        list.push(name);
      }
    });
    appointments.forEach((apt) => {
      const name = apt.staffName?.trim();
      if (name && !list.includes(name)) {
        list.push(name);
      }
    });
    return list;
  }, [backendStaff, appointments]);

  const servicesList = useMemo(() => {
    const map = new Map<
      string,
      { id?: string; name: string; price: number; duration: number; isActive: boolean }
    >();

    backendServices.forEach((svc) => {
      map.set(svc.name, {
        id: svc.id,
        name: svc.name,
        price: svc.price,
        duration: svc.duration,
        isActive: svc.isActive,
      });
    });

    if (backendServices.length === 0) {
      appointments.forEach((apt) => {
        if (apt.serviceName && !map.has(apt.serviceName)) {
          map.set(apt.serviceName, {
            id: apt.serviceId,
            name: apt.serviceName,
            price: apt.price || 0,
            duration: apt.durationMinutes || 45,
            isActive: true,
          });
        }
      });
    }

    return Array.from(map.values());
  }, [backendServices, appointments]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [invoicingAppointment, setInvoicingAppointment] = useState<Appointment | null>(null);
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
        isLoading={isLoading}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.CHECKOUT)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ShoppingBag className="size-3.5 text-primary" />
              <span>Direct POS Sale</span>
            </button>
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
          </div>
        }
      />

      {/* KPI Stats row */}
      <AppointmentStats stats={stats} />

      {/* Filters & Control bar */}
      <AppointmentFilters
        filters={filters}
        staffList={staffList}
        onFilterChange={handleFilterChange}
      />

      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onApprove={handleApproveAppointment}
        onView={handleViewAppointment}
        onEdit={handleEditAppointment}
        onPrintInvoice={handlePrintInvoice}
        onCheckout={(apt) => {
          navigate(`${ROUTES.CHECKOUT}?appointmentId=${apt.id}`, { state: { appointment: apt } });
        }}
      />

      {/* New / Edit Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleSaveAppointment}
        staffList={staffList}
        staffMembers={backendStaff}
        servicesList={servicesList}
        existingAppointments={appointments}
        initialData={editingAppointment}
      />

      {/* View Appointment Details Modal */}
      <AppointmentViewModal
        isOpen={Boolean(viewingAppointment)}
        onClose={() => setViewingAppointment(null)}
        appointment={viewingAppointment}
        onEdit={handleEditAppointment}
        onPrintInvoice={handlePrintInvoice}
        onCheckout={(apt) => {
          setViewingAppointment(null);
          navigate(`${ROUTES.CHECKOUT}?appointmentId=${apt.id}`, { state: { appointment: apt } });
        }}
      />

      {/* Print Invoice Modal */}
      <AppointmentInvoiceModal
        isOpen={Boolean(invoicingAppointment)}
        onClose={() => setInvoicingAppointment(null)}
        appointment={invoicingAppointment}
      />

      {/* Unified POS Checkout Modal */}
      <AppointmentCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutAppointment(null);
        }}
        appointment={checkoutAppointment}
        onCheckoutSuccess={() => {
          refetch();
        }}
        onBookNextAppointment={(prefill) => {
          setEditingAppointment(prefill as any);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}

export default Appointments;
