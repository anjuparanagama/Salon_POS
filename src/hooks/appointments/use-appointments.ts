import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", "list", params],
    queryFn: () => appointmentsService.getAppointments(params),
    initialData: initialAppointmentsList
      ? { items: initialAppointmentsList, total: initialAppointmentsList.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["appointments", "stats"],
    queryFn: () => appointmentsService.getSummary(),
  });

  const appointments: Appointment[] = appointmentsQuery.data?.items ?? [];
  const total: number = appointmentsQuery.data?.total ?? appointments.length;
  const stats: AppointmentStats = statsQuery.data ?? defaultStats;
  const isLoading = appointmentsQuery.isLoading || statsQuery.isLoading;
  const error = appointmentsQuery.error
    ? appointmentsQuery.error instanceof Error
      ? appointmentsQuery.error.message
      : "Failed to load appointments"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      appointmentsQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }, [appointmentsQuery, statsQuery]);

  const createAppointment = async (data: AppointmentFormData) => {
    try {
      const created = await appointmentsService.createAppointment(data);
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return created;
    } catch {
      const fallback: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        serviceId: `svc-${Date.now()}`,
        staffId: `st-${Date.now()}`,
        status: "pending",
      };
      // Optimistically insert into current query cache
      queryClient.setQueryData(
        ["appointments", "list", params],
        (old: { items: Appointment[]; total: number } | undefined) => {
          if (!old) return { items: [fallback], total: 1 };
          return { ...old, items: [fallback, ...old.items], total: old.total + 1 };
        }
      );
      return fallback;
    }
  };

  const updateAppointment = async (id: string, data: Partial<AppointmentFormData>) => {
    try {
      const updated = await appointmentsService.updateAppointment(id, data);
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["appointments", "list", params],
        (old: { items: Appointment[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((a) => (a.id === id ? { ...a, ...data } : a)),
          };
        }
      );
    }
  };

  const updateStatus = async (id: string, status: AppointmentStatus, reason?: string) => {
    // 1. Optimistically update row status immediately in cache
    queryClient.setQueryData(
      ["appointments", "list", params],
      (old: { items: Appointment[]; total: number } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((a) => (a.id === id ? { ...a, status } : a)),
        };
      }
    );

    try {
      const updated = await appointmentsService.updateStatus(id, status, reason);
      if (updated) {
        queryClient.setQueryData(
          ["appointments", "list", params],
          (old: { items: Appointment[]; total: number } | undefined) => {
            if (!old) return old;
            return {
              ...old,
              items: old.items.map((a) => {
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
              }),
            };
          }
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      console.error("Failed to update status on server:", err);
      await fetchAll();
    }
  };

  const cancelAppointment = async (id: string, reason?: string) => {
    // Optimistic update
    queryClient.setQueryData(
      ["appointments", "list", params],
      (old: { items: Appointment[]; total: number } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
        };
      }
    );

    try {
      await appointmentsService.cancelAppointment(id, reason);
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      console.error("Failed to cancel appointment on server:", err);
      await fetchAll();
    }
  };

  const addPayment = async (
    invoiceId: string,
    payload: { amount: number; method: string; reference?: string }
  ) => {
    const res = await appointmentsService.addPayment(invoiceId, payload);
    void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    void queryClient.invalidateQueries({ queryKey: ["ledger"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    return res;
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
