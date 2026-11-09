import { useState, useEffect, useCallback } from "react";
import {
  appointmentsService,
  type AppointmentQueryParams,
} from "../../services/appointments.service";
import type {
  Appointment,
  AppointmentStats,
  AppointmentFormData,
  AppointmentStatus,
} from "../../interface/appointment.types";

const defaultStats: AppointmentStats = {
  today: 0,
  total: 0,
  cancelled: 0,
  upcoming: 0,
  confirmed: 0,
  inProgress: 0,
  completed: 0,
};

export function useAppointments(
  params?: AppointmentQueryParams,
  initialAppointmentsList?: Appointment[]
) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointmentsList ?? []
  );
  const [stats, setStats] = useState<AppointmentStats>(defaultStats);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [aptRes, statsRes] = await Promise.allSettled([
        appointmentsService.getAppointments(params),
        appointmentsService.getSummary(),
      ]);

      if (aptRes.status === "fulfilled") {
        setAppointments(aptRes.value.items);
        setTotal(aptRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [aptRes, statsRes] = await Promise.allSettled([
          appointmentsService.getAppointments(params),
          appointmentsService.getSummary(),
        ]);

        if (!ignore) {
          if (aptRes.status === "fulfilled") {
            setAppointments(aptRes.value.items);
            setTotal(aptRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load appointments");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [params]);

  const createAppointment = async (data: AppointmentFormData) => {
    try {
      const created = await appointmentsService.createAppointment(data);
      setAppointments((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        serviceId: `svc-${Date.now()}`,
        staffId: `st-${Date.now()}`,
        status: "pending",
      };
      setAppointments((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateAppointment = async (id: string, data: Partial<AppointmentFormData>) => {
    try {
      const updated = await appointmentsService.updateAppointment(id, data);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      return updated;
    } catch {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    }
  };

  const updateStatus = async (id: string, status: AppointmentStatus, reason?: string) => {
    // 1. Optimistically update row status immediately
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    try {
      const updated = await appointmentsService.updateStatus(id, status, reason);
      if (updated) {
        setAppointments((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a;
            return {
              ...a,
              status: updated.status || status,
              ...(updated.clientName && updated.clientName !== "Walk-in Client"
                ? { clientName: updated.clientName }
                : {}),
              ...(updated.clientPhone && updated.clientPhone !== "+1 (555) 000-0000"
                ? { clientPhone: updated.clientPhone }
                : {}),
              ...(updated.serviceName ? { serviceName: updated.serviceName } : {}),
              ...(updated.staffName ? { staffName: updated.staffName } : {}),
            };
          })
        );
      }
      // 2. Refresh the table and stats from the server
      await fetchAll();
    } catch (err) {
      console.error("Failed to update status on server:", err);
      await fetchAll();
    }
  };

  const cancelAppointment = async (id: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
    try {
      await appointmentsService.cancelAppointment(id, reason);
      await fetchAll();
    } catch (err) {
      console.error("Failed to cancel appointment on server:", err);
      await fetchAll();
    }
  };

  const addPayment = async (
    invoiceId: string,
    payload: { amount: number; method: string; reference?: string }
  ) => {
    return await appointmentsService.addPayment(invoiceId, payload);
  };

  return {
    appointments,
    stats,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createAppointment,
    updateAppointment,
    updateStatus,
    cancelAppointment,
    addPayment,
  };
}

export default useAppointments;

