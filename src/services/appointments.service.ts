import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Appointment,
  AppointmentStats,
  AppointmentFormData,
  AppointmentStatus,
  AppointmentServiceItem,
} from "../interface/appointment.types";

export interface AppointmentQueryParams {
  search?: string;
  status?: string;
  staff_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  pageSize?: number;
}

export function normalizeStatus(status?: string): AppointmentStatus {
  if (!status) return "pending";
  const s = status.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (s === "open" || s === "pending") return "pending";
  if (s === "approved" || s === "confirmed") return "confirmed";
  if (s === "in_progress" || s === "inprogress") return "in_progress";
  if (s === "done" || s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "pending";
}

export function toBackendStatus(status: string): string {
  const s = status.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (s === "pending" || s === "open") return "Open";
  if (s === "confirmed" || s === "approved") return "Approved";
  if (s === "in_progress" || s === "inprogress") return "In Progress";
  if (s === "completed" || s === "done") return "Done";
  if (s === "cancelled" || s === "canceled") return "Cancelled";
  return status;
}

// In-memory registries populated purely dynamically at runtime from backend API responses
const staffRegistry = new Map<string, string>();
const serviceRegistry = new Map<string, string>();

export function registerStaff(id: string, name: string) {
  if (id && name) {
    staffRegistry.set(id.toLowerCase(), name);
  }
}

export function registerService(id: string, name: string) {
  if (id && name) {
    serviceRegistry.set(name.toLowerCase().trim(), id);
  }
}

export function to24HourTime(timeStr?: string): string {
  if (!timeStr) return "10:00:00";
  const str = timeStr.trim();
  const ampmMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const seconds = ampmMatch[3] || "00";
    const ampm = ampmMatch[4].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`;
  }
  const h24Match = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (h24Match) {
    const hours = h24Match[1].padStart(2, "0");
    const minutes = h24Match[2];
    const seconds = h24Match[3] || "00";
    return `${hours}:${minutes}:${seconds}`;
  }
  return "10:00:00";
}

export function resolveServiceId(name?: string): string | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase().trim();
  if (serviceRegistry.has(key)) return serviceRegistry.get(key);
  for (const [k, v] of serviceRegistry.entries()) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return undefined;
}

export function resolveStaffId(name?: string): string | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase().trim();
  for (const [id, staffName] of staffRegistry.entries()) {
    if (
      staffName.toLowerCase() === key ||
      staffName.toLowerCase().includes(key) ||
      key.includes(staffName.toLowerCase())
    ) {
      return id;
    }
  }
  return undefined;
}

export function normalizeAppointment(
  item: unknown,
  index = 0,
  fallbackFormData?: Partial<AppointmentFormData>
): Appointment {
  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  const rawServices = Array.isArray(raw.services) ? (raw.services as Record<string, unknown>[]) : [];
  const firstService = rawServices[0] || null;

  const serviceName =
    (raw.serviceName as string) ||
    (raw.service_name as string) ||
    fallbackFormData?.serviceName ||
    (rawServices.length > 0
      ? rawServices.map((s) => (s.name || s.service_name || "") as string).filter(Boolean).join(", ")
      : "");

  const totalDuration = rawServices.length > 0
    ? rawServices.reduce(
        (acc, s) => acc + (Number(s.duration_minutes || s.duration || 0) * Number(s.quantity || 1)),
        0
      )
    : Number(raw.duration_minutes || raw.durationMinutes || fallbackFormData?.durationMinutes || 0);

  const totalPrice = rawServices.length > 0
    ? rawServices.reduce(
        (acc, s) => acc + (Number(s.unit_price || s.price || 0) * Number(s.quantity || 1)),
        0
      )
    : Number(raw.total_amount || raw.price || fallbackFormData?.price || 0);

  const rawDate = (raw.appointment_date || raw.date || fallbackFormData?.date || "") as string;
  let rawTime = (raw.start_time || raw.time || fallbackFormData?.time || "") as string;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(rawTime)) {
    const [hhStr, mmStr] = rawTime.split(":");
    let hh = parseInt(hhStr, 10);
    const mm = mmStr || "00";
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12;
    rawTime = `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
  }

  const staffId = raw.assigned_staff_id
    ? String(raw.assigned_staff_id).toLowerCase()
    : raw.staffId
    ? String(raw.staffId).toLowerCase()
    : "";

  const staffName =
    (raw.staff_name as string) ||
    (raw.staffName as string) ||
    fallbackFormData?.staffName ||
    (staffId ? staffRegistry.get(staffId) : undefined) ||
    "";

  const clientName =
    (raw.customer_name as string) ||
    (raw.customerName as string) ||
    (raw.clientName as string) ||
    fallbackFormData?.clientName ||
    "Walk-in Client";

  const clientPhone =
    (raw.customer_phone as string) ||
    (raw.customerPhone as string) ||
    (raw.clientPhone as string) ||
    fallbackFormData?.clientPhone ||
    "";

  const appointmentNumber =
    (raw.appointment_number as string) ||
    (raw.appointmentNumber as string) ||
    undefined;

  const normalizedServices: AppointmentServiceItem[] =
    rawServices.length > 0
      ? rawServices.map((s) => ({
          id: String(s.service_id || s.id || ""),
          name: String(s.name || s.service_name || ""),
          price: Number(s.unit_price || s.price || 0),
          durationMinutes: Number(s.duration_minutes || s.duration || 0),
        }))
      : fallbackFormData?.services || [
          {
            id: String(raw.serviceId || raw.service_id || firstService?.service_id || firstService?.id || ""),
            name: serviceName,
            price: totalPrice,
            durationMinutes: totalDuration,
          },
        ];

  return {
    id: String(raw.id || `apt-${index + 1}`),
    appointmentNumber,
    clientName,
    clientPhone,
    clientAvatar: typeof raw.clientAvatar === "string" ? raw.clientAvatar : undefined,
    serviceId: String(raw.serviceId || raw.service_id || firstService?.service_id || firstService?.id || ""),
    serviceName,
    services: normalizedServices,
    staffId: staffId || String(raw.staffId || ""),
    staffName,
    staffAvatar: typeof raw.staffAvatar === "string" ? raw.staffAvatar : undefined,
    date: rawDate,
    time: rawTime,
    durationMinutes: totalDuration,
    price: totalPrice,
    status: normalizeStatus(raw.status as string),
    notes: typeof raw.notes === "string" ? raw.notes : fallbackFormData?.notes,
    hasInvoice: Boolean((raw as any).has_invoice || (raw as any).hasInvoice || (raw as any).invoice || (raw as any).invoice_id),
    invoiceId: ((raw as any).invoice_id || (raw as any).invoiceId || (raw as any).invoice?.id) ? String((raw as any).invoice_id || (raw as any).invoiceId || (raw as any).invoice?.id) : undefined,
    invoiceNumber: ((raw as any).invoice_number || (raw as any).invoiceNumber || (raw as any).invoice?.invoice_number) ? String((raw as any).invoice_number || (raw as any).invoiceNumber || (raw as any).invoice?.invoice_number) : undefined,
  };
}

export const appointmentsService = {
  async getAppointments(
    params?: AppointmentQueryParams
  ): Promise<{ items: Appointment[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params });
    const rawItems =
      res.data && Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
        ? res.data
        : [];
    const total = typeof res.data?.total === "number" ? res.data.total : rawItems.length;

    return {
      items: rawItems.map((item: unknown, idx: number) => normalizeAppointment(item, idx)),
      total,
    };
  },

  async getSummary(): Promise<AppointmentStats> {
    try {
      const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.SUMMARY);
      const data = res.data || {};
      return {
        today: data.today ?? 0,
        total: data.total ?? data.total_appointments ?? 0,
        cancelled: data.cancelled ?? 0,
        upcoming: data.upcoming ?? (data.open ?? 0) + (data.approved ?? 0),
        confirmed: data.confirmed ?? data.approved ?? 0,
        inProgress: data.inProgress ?? data.in_progress ?? 0,
        completed: data.completed ?? data.done ?? 0,
      };
    } catch {
      try {
        const { items, total } = await appointmentsService.getAppointments({ pageSize: 100 });
        const todayStr = new Date().toISOString().split("T")[0];
        let todayCount = 0;
        let confirmed = 0;
        let inProgress = 0;
        let completed = 0;
        let cancelled = 0;

        items.forEach((item) => {
          if (item.date === todayStr) todayCount++;
          if (item.status === "confirmed") confirmed++;
          else if (item.status === "in_progress") inProgress++;
          else if (item.status === "completed") completed++;
          else if (item.status === "cancelled") cancelled++;
        });

        return {
          today: todayCount,
          total: total || items.length,
          cancelled,
          upcoming: confirmed,
          confirmed,
          inProgress,
          completed,
        };
      } catch {
        return {
          today: 0,
          total: 0,
          cancelled: 0,
          upcoming: 0,
          confirmed: 0,
          inProgress: 0,
          completed: 0,
        };
      }
    }
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
    return normalizeAppointment(res.data);
  },

  async createAppointment(payload: AppointmentFormData): Promise<Appointment> {
    const serviceId = payload.serviceId || resolveServiceId(payload.serviceName);
    const staffId = payload.staffId || resolveStaffId(payload.staffName);
    const appointmentDate = payload.date || new Date().toISOString().split("T")[0];
    const startTime = to24HourTime(payload.time);

    const servicesToSend =
      payload.services && payload.services.length > 0
        ? payload.services.map((s) => ({
            service_id: s.id || resolveServiceId(s.name) || serviceId,
            name: s.name,
            unit_price: Number(s.price || 0),
            duration_minutes: Math.max(5, Number(s.durationMinutes || 15)),
            quantity: 1,
          }))
        : [
            {
              service_id: serviceId,
              name: payload.serviceName || "",
              unit_price: Number(payload.price || 0),
              duration_minutes: Math.max(5, Number(payload.durationMinutes || 15)),
              quantity: 1,
            },
          ];

    // Send entered client details; backend finds customer by phone or creates a new one
    const requestBody = {
      customer_name: (payload.clientName || "").trim(),
      customer_phone: (payload.clientPhone || "").trim(),
      assigned_staff_id: staffId || null,
      appointment_date: appointmentDate,
      start_time: startTime,
      notes: payload.notes?.trim() || null,
      booking_source: "walk_in",
      services: servicesToSend,
    };

    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.BASE, requestBody);
    return normalizeAppointment(res.data, 0, payload);
  },

  async updateAppointment(id: string, payload: Partial<AppointmentFormData>): Promise<Appointment> {
    const patchBody: Record<string, unknown> = {};

    if (payload.date) {
      patchBody.appointment_date = payload.date;
    }
    if (payload.time) {
      patchBody.start_time = to24HourTime(payload.time);
    }
    if (payload.staffId !== undefined || payload.staffName !== undefined) {
      patchBody.assigned_staff_id = payload.staffId || resolveStaffId(payload.staffName) || null;
    }
    if (payload.services && payload.services.length > 0) {
      patchBody.services = payload.services.map((s) => ({
        service_id: s.id || resolveServiceId(s.name) || payload.serviceId,
        name: s.name,
        unit_price: Number(s.price || 0),
        duration_minutes: Math.max(5, Number(s.durationMinutes || 15)),
        quantity: 1,
      }));
    } else if (payload.serviceName || payload.price !== undefined || payload.durationMinutes !== undefined) {
      patchBody.services = [
        {
          service_id: payload.serviceId || resolveServiceId(payload.serviceName),
          name: payload.serviceName || "",
          unit_price: Number(payload.price ?? 0),
          duration_minutes: Math.max(5, Number(payload.durationMinutes ?? 15)),
          quantity: 1,
        },
      ];
    }
    if (payload.notes !== undefined) {
      patchBody.notes = payload.notes;
    }

    const res = await apiClient.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), patchBody);
    return normalizeAppointment(res.data, 0, payload);
  },

  async updateStatus(id: string, status: string, reason?: string): Promise<Appointment> {
    const backendStatus = toBackendStatus(status);
    const res = await apiClient.patch(
      API_ENDPOINTS.APPOINTMENTS.STATUS(id),
      { status: backendStatus, reason }
    );
    return normalizeAppointment(res.data);
  },

  async cancelAppointment(id: string, reason?: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason });
  },

  async getInvoice(appointmentId: string): Promise<unknown> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.INVOICE(appointmentId));
    return res.data;
  },

  async addPayment(invoiceId: string, payload: { amount: number; method: string; reference?: string }): Promise<unknown> {
    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.PAYMENTS(invoiceId), payload);
    return res.data;
  },
};

export default appointmentsService;
