import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Appointment,
  AppointmentStats,
  AppointmentFormData,
  AppointmentStatus,
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

const KNOWN_CUSTOMERS: Record<string, { name: string; phone: string }> = {
  "c1000000-0000-0000-0000-000000000001": { name: "Emma Wilson", phone: "+1 (555) 234-5678" },
  "c1000000-0000-0000-0000-000000000002": { name: "Sophia Brown", phone: "+1 (555) 345-6789" },
  "c1000000-0000-0000-0000-000000000003": { name: "Mia Johnson", phone: "+1 (555) 456-7890" },
  "c1000000-0000-0000-0000-000000000004": { name: "Ava Smith", phone: "+1 (555) 567-8901" },
  "c1000000-0000-0000-0000-000000000005": { name: "Charlotte Davis", phone: "+1 (555) 678-9012" },
  "c1000000-0000-0000-0000-000000000006": { name: "Harper Lee", phone: "+1 (555) 789-0123" },
  "c1000000-0000-0000-0000-000000000007": { name: "Chloe Martin", phone: "+1 (555) 890-1234" },
  "c1000000-0000-0000-0000-000000000008": { name: "Grace Taylor", phone: "+1 (555) 901-2345" },
  "10000000-0000-0000-0000-000000000001": { name: "Nimal Perera", phone: "+94 77 100 0001" },
  "10000000-0000-0000-0000-000000000002": { name: "Kumari Silva", phone: "+94 77 100 0002" },
  "10000000-0000-0000-0000-000000000003": { name: "Amal Fernando", phone: "+94 77 100 0003" },
  "10000000-0000-0000-0000-000000000004": { name: "Samanthi Jayasuriya", phone: "+94 77 100 0004" },
  "10000000-0000-0000-0000-000000000005": { name: "Ruwan Dias", phone: "+94 77 100 0005" },
};

const KNOWN_STAFF: Record<string, string> = {
  "f1000000-0000-0000-0000-000000000001": "Amelia Vance",
  "f1000000-0000-0000-0000-000000000002": "Olivia Wilde",
  "f1000000-0000-0000-0000-000000000003": "Isabella Gomez",
  "f1000000-0000-0000-0000-000000000004": "Noah Sterling",
  "f1000000-0000-0000-0000-000000000005": "Sophia Chen",
  "f1000000-0000-0000-0000-000000000006": "Chathuri",
  "f1000000-0000-0000-0000-000000000007": "Dilshan",
  "f1000000-0000-0000-0000-000000000008": "Ishara",
  "f1000000-0000-0000-0000-000000000009": "Malith",
  "f1000000-0000-0000-0000-000000000010": "Tharushi",
  "20000000-0000-0000-0000-000000000001": "Chathuri",
  "20000000-0000-0000-0000-000000000002": "Dilshan",
  "20000000-0000-0000-0000-000000000003": "Ishara",
  "20000000-0000-0000-0000-000000000004": "Malith",
  "20000000-0000-0000-0000-000000000005": "Tharushi",
};

const KNOWN_SERVICES: Record<string, string> = {
  "haircut & styling": "e1000000-0000-0000-0000-000000000001",
  "balayage color & highlights": "e1000000-0000-0000-0000-000000000002",
  "deluxe manicure & pedicure": "e1000000-0000-0000-0000-000000000003",
  "hydra deep facial": "e1000000-0000-0000-0000-000000000004",
  "bridal full glam makeup": "e1000000-0000-0000-0000-000000000005",
  "aromatherapy full body massage": "e1000000-0000-0000-0000-000000000006",
  "keratin smoothing complex": "e1000000-0000-0000-0000-000000000007",
  "gel nail extension set": "e1000000-0000-0000-0000-000000000008",
};

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

export function resolveServiceId(name?: string): string {
  if (!name) return "e1000000-0000-0000-0000-000000000001";
  const key = name.toLowerCase().trim();
  if (KNOWN_SERVICES[key]) return KNOWN_SERVICES[key];
  for (const [k, v] of Object.entries(KNOWN_SERVICES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "e1000000-0000-0000-0000-000000000001";
}

export function resolveStaffId(name?: string): string | undefined {
  if (!name) return "f1000000-0000-0000-0000-000000000001";
  const key = name.toLowerCase().trim();
  for (const [id, staffName] of Object.entries(KNOWN_STAFF)) {
    if (
      staffName.toLowerCase() === key ||
      staffName.toLowerCase().includes(key) ||
      key.includes(staffName.toLowerCase())
    ) {
      return id;
    }
  }
  return "f1000000-0000-0000-0000-000000000001";
}

export function resolveCustomerId(clientName?: string, clientPhone?: string): string {
  const normPhone = (clientPhone || "").replace(/\D/g, "");
  const normName = (clientName || "").toLowerCase().trim();

  for (const [id, cust] of Object.entries(KNOWN_CUSTOMERS)) {
    const custPhone = cust.phone.replace(/\D/g, "");
    if (normPhone && custPhone && (custPhone.endsWith(normPhone) || normPhone.endsWith(custPhone))) {
      return id;
    }
    if (normName && cust.name.toLowerCase() === normName) {
      return id;
    }
  }

  return "c1000000-0000-0000-0000-000000000001";
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
    fallbackFormData?.serviceName ||
    (rawServices.length > 0
      ? rawServices.map((s) => (s.name || s.service_name || "Service") as string).join(", ")
      : "Haircut & Styling");

  const totalDuration = rawServices.length > 0
    ? rawServices.reduce((acc, s) => acc + (Number(s.duration_minutes || s.duration || 0) * Number(s.quantity || 1)), 0)
    : Number(raw.durationMinutes || fallbackFormData?.durationMinutes || 45);

  const totalPrice = rawServices.length > 0
    ? rawServices.reduce((acc, s) => acc + (Number(s.unit_price || s.price || 0) * Number(s.quantity || 1)), 0)
    : Number(raw.price || fallbackFormData?.price || 45);

  const rawDate = (raw.date || raw.appointment_date || fallbackFormData?.date || new Date().toISOString().split("T")[0]) as string;
  let rawTime = (raw.time || raw.start_time || fallbackFormData?.time || "09:00 AM") as string;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(rawTime)) {
    const [hhStr, mmStr] = rawTime.split(":");
    let hh = parseInt(hhStr, 10);
    const mm = mmStr || "00";
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12;
    rawTime = `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
  }

  const customerId = raw.customer_id ? String(raw.customer_id).toLowerCase() : "";
  const knownCustomer = customerId ? KNOWN_CUSTOMERS[customerId] : undefined;

  const clientName =
    (raw.clientName as string) ||
    (raw.customer_name as string) ||
    (raw.customerName as string) ||
    fallbackFormData?.clientName ||
    knownCustomer?.name ||
    (customerId ? `Client #${customerId.slice(-4)}` : "Walk-in Client");

  const clientPhone =
    (raw.clientPhone as string) ||
    (raw.customer_phone as string) ||
    (raw.customerPhone as string) ||
    fallbackFormData?.clientPhone ||
    knownCustomer?.phone ||
    "+1 (555) 000-0000";

  const staffId = raw.assigned_staff_id ? String(raw.assigned_staff_id).toLowerCase() : "";
  const knownStaffName = staffId ? KNOWN_STAFF[staffId] : undefined;

  const staffName =
    (raw.staffName as string) ||
    (raw.staff_name as string) ||
    fallbackFormData?.staffName ||
    knownStaffName ||
    "Amelia Vance";

  const appointmentNumber =
    (raw.appointment_number as string) ||
    (raw.appointmentNumber as string) ||
    undefined;

  return {
    id: String(raw.id || `apt-${index + 1}`),
    appointmentNumber,
    clientName,
    clientPhone,
    clientAvatar: typeof raw.clientAvatar === "string" ? raw.clientAvatar : undefined,
    serviceId: String(raw.serviceId || firstService?.service_id || firstService?.id || "svc-1"),
    serviceName,
    staffId: String(raw.staffId || raw.assigned_staff_id || "st-1"),
    staffName,
    staffAvatar: typeof raw.staffAvatar === "string" ? raw.staffAvatar : undefined,
    date: rawDate,
    time: rawTime,
    durationMinutes: totalDuration || 45,
    price: totalPrice,
    status: normalizeStatus(raw.status as string),
    notes: typeof raw.notes === "string" ? raw.notes : fallbackFormData?.notes,
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
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
    return normalizeAppointment(res.data);
  },

  async createAppointment(payload: AppointmentFormData): Promise<Appointment> {
    const customerId = resolveCustomerId(payload.clientName, payload.clientPhone);
    const serviceId = resolveServiceId(payload.serviceName);
    const staffId = resolveStaffId(payload.staffName);
    const appointmentDate = payload.date || new Date().toISOString().split("T")[0];
    const startTime = to24HourTime(payload.time);

    // Cache the entered customer name and phone mapped to this customer ID
    if (payload.clientName && customerId) {
      KNOWN_CUSTOMERS[customerId] = {
        name: payload.clientName,
        phone: payload.clientPhone || KNOWN_CUSTOMERS[customerId]?.phone || "",
      };
    }

    const clientNote = `Client: ${payload.clientName} (${payload.clientPhone})`;
    const fullNotes = payload.notes
      ? `${clientNote} - ${payload.notes}`
      : clientNote;

    const requestBody = {
      customer_id: customerId,
      assigned_staff_id: staffId || null,
      appointment_date: appointmentDate,
      start_time: startTime,
      notes: fullNotes,
      booking_source: "walk_in",
      services: [
        {
          service_id: serviceId,
          name: payload.serviceName || "Haircut & Styling",
          unit_price: Number(payload.price || 45),
          duration_minutes: Math.max(5, Number(payload.durationMinutes || 15)),
          quantity: 1,
        },
      ],
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
    if (payload.staffName) {
      patchBody.assigned_staff_id = resolveStaffId(payload.staffName) || null;
    }
    if (payload.serviceName || payload.price !== undefined || payload.durationMinutes !== undefined) {
      patchBody.services = [
        {
          service_id: resolveServiceId(payload.serviceName),
          name: payload.serviceName || "Haircut & Styling",
          unit_price: Number(payload.price ?? 45),
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
    const res = await apiClient.patch(
      API_ENDPOINTS.APPOINTMENTS.STATUS(id),
      { status, reason }
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

