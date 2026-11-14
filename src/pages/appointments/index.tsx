import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import Pagination from "../../components/pagination";
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
import { Button } from "../../components/button";

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
    searchField: "id",
    status: "all",
    staff: "all",
    date: "",
  });

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    aptNumber: true,
    dateTime: true,
    client: true,
    service: true,
    specialist: true,
    price: true,
    status: true,
    actions: true,
  });

  const handleToggleColumn = (colKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colKey]: prev[colKey] === false ? true : false,
    }));
  };

  const handleFilterChange = (updated: Partial<AppointmentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
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
        const query = filters.search.toLowerCase().trim();
        const searchField = filters.searchField || "id";

        if (searchField === "id") {
          const aptNum = (apt.appointmentNumber || "").toLowerCase();
          const cleanId = (apt.id || "").toLowerCase();
          if (!aptNum.includes(query) && !cleanId.includes(query)) return false;
        } else if (searchField === "client") {
          const name = (apt.clientName || "").toLowerCase();
          if (!name.includes(query)) return false;
        } else if (searchField === "phone") {
          const phone = (apt.clientPhone || "").toLowerCase();
          if (!phone.includes(query)) return false;
        } else if (searchField === "service") {
          const service = (apt.serviceName || "").toLowerCase();
          if (!service.includes(query)) return false;
        } else if (searchField === "staff") {
          const staff = (apt.staffName || "").toLowerCase();
          if (!staff.includes(query)) return false;
        } else {
          // "all"
          const matchesId =
            (apt.appointmentNumber || "").toLowerCase().includes(query) ||
            (apt.id || "").toLowerCase().includes(query);
          const matchesClient = (apt.clientName ?? "").toLowerCase().includes(query);
          const matchesPhone = (apt.clientPhone ?? "").toLowerCase().includes(query);
          const matchesService = (apt.serviceName ?? "").toLowerCase().includes(query);
          const matchesStaff = (apt.staffName ?? "").toLowerCase().includes(query);
          if (!matchesId && !matchesClient && !matchesPhone && !matchesService && !matchesStaff) return false;
        }
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

  // Paginated appointments
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredAppointments.length === 0) return;
    const headers = [
      "Appointment #",
      "Date",
      "Time",
      "Client",
      "Phone",
      "Service",
      "Specialist",
      "Price (LKR)",
      "Status",
    ];
    const rows = filteredAppointments.map((a) => [
      `"${a.appointmentNumber || a.id}"`,
      `"${a.date || ""}"`,
      `"${a.time || ""}"`,
      `"${(a.clientName || "").replace(/"/g, '""')}"`,
      `"${(a.clientPhone || "").replace(/"/g, '""')}"`,
      `"${(a.serviceName || "").replace(/"/g, '""')}"`,
      `"${(a.staffName || "").replace(/"/g, '""')}"`,
      `"${a.price || 0}"`,
      `"${a.status || ""}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `appointments_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header Section */}
      <Header
        title={t("appointments:title", "Appointments")}
        description={t("appointments:subtitle", "Manage bookings, schedule clients, and assign salon staff.")}
        isLoading={isLoading}
        actions={
          <Button
            type="button"
            onClick={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("appointments:newAppointment", "New Appointment")}</span>
          </Button>
        }
      />

      {/* KPI Stats row */}
      <AppointmentStats stats={stats} />

      {/* Filters & Control bar */}
      <AppointmentFilters
        filters={filters}
        staffList={staffList}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Appointments List */}
      <AppointmentList
        appointments={paginatedAppointments}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        onStatusChange={handleStatusChange}
        onApprove={handleApproveAppointment}
        onView={handleViewAppointment}
        onEdit={handleEditAppointment}
        onPrintInvoice={handlePrintInvoice}
        onCheckout={(apt) => {
          if (apt.status === "completed" || apt.hasInvoice) return;
          navigate(`${ROUTES.CHECKOUT}?appointmentId=${apt.id}`, { state: { appointment: apt } });
        }}
      />

      {/* Pagination Footer */}
      {filteredAppointments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredAppointments.length / pageSize))}
          totalItems={filteredAppointments.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="appointments"
          className="mt-1"
        />
      )}

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
          if (apt.status === "completed" || apt.hasInvoice) return;
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
